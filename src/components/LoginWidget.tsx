
import { useEffect, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import AuthModal from './AuthModal'
import { LogIn } from 'lucide-react';
import Link from 'next/link'
import { db } from '../lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'


export default function LoginWidget() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)

  useEffect(() => onAuthStateChanged(auth, u => setUser(u)), [])

  const handleSelect = (place: { address: string; lat?: number; lng?: number }) => {
    console.log("Selected place:", place);
  };
  // async function google(){
  //   try{ await signInWithPopup(auth, googleProvider) }catch(e:any){
  //     alert(e?.message || 'Google sign‑in failed') }
  // }
  async function google() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('✅ User saved to Firestore:', user.email);
    } catch (e: any) {
      console.error('❌ Google sign-in failed:', e);
      alert(e?.message || 'Google sign-in failed');
    }
  }

  function initial() {
    const n = user?.displayName || user?.email || ''
    return n ? n[0].toUpperCase() : '🙂'
  }

  return (
    <div style={{ position: 'relative' }}>

      {!user ? (
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#cbd5e1',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          className="cta"
          onClick={() => setOpen(true)}
        >
          <LogIn size={16} /> Sign in
        </button>
      ) : (
        <Link href="/profile">
          <div
            onClick={() => setEmailOpen(true)}
            title={user?.email || ''}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              // backgroundColor: '#0f172a',
              border: '1.5px solid #b8935f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#b8935f',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(184, 147, 95, 0.08)';
              e.currentTarget.style.borderColor = '#c9a sixteen';
            }}

          >
            {initial()}
          </div>
        </Link>
      )}
      {open && (
        <div>
          <AuthModal open={open} onClose={() => setOpen(false)} onSelect={handleSelect} />
        </div>
      )}

    </div>
  )
}
