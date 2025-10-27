
import { useEffect, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import AuthModal from './AuthModal'
import { LogIn } from 'lucide-react';
import Link from 'next/link'
import { db } from '../lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'


export default function LoginWidget(){
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)

  useEffect(()=> onAuthStateChanged(auth, u=> setUser(u)), [])

  // async function google(){

  //   try{ await signInWithPopup(auth, googleProvider) }catch(e:any){
  //     alert(e?.message || 'Google sign‑in failed') }
  // }
  async function google() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user info in Firestore "users" collection
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
      { merge: true } // prevents overwriting existing data
    );

    console.log('✅ User saved to Firestore:', user.email);
  } catch (e: any) {
    console.error('❌ Google sign-in failed:', e);
    alert(e?.message || 'Google sign-in failed');
  }
}

  function initial(){
    const n = user?.displayName || user?.email || ''
    return n ? n[0].toUpperCase() : '🙂'
  }

  return (
    <div style={{position:'relative'}}>
      {!user ? (
         <button style={{
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
            }} className="cta" onClick={()=>setOpen(!open)}>  <LogIn size={16} />Sign in</button>
      ) : (
        <button className="cta" onClick={()=>setOpen(!open)} title={user?.email||''} style={{padding:'8px 10px'}}>
          <span style={{display:'inline-flex',width:24,height:24,borderRadius:999,background:'#1e293b',alignItems:'center',justifyContent:'center',marginRight:6}}>{initial()}</span>
          {user.displayName || user.email}
        </button>
      )}

      {open && (
        <div style={{position:'absolute', right:0, top:'100%', marginTop:6, zIndex:40, background:'#0f1720', border:'1px solid #1e293b', borderRadius:12, padding:10, minWidth:240}} onMouseLeave={()=>setOpen(false)}>
          {!user ? (
            <div style={{display:'grid', gap:8}}>
              <button className="cta primary" onClick={google}>Continue with Google</button>
              <button className="cta" onClick={()=> setEmailOpen(true)}>Sign in with Email</button>
              <div style={{fontSize:12, color:'#9fb3c8'}}>By continuing, you agree to our community guidelines.</div>
            </div>
          ) : (
            <div style={{display:'grid', gap:8}}>
              <Link className="cta" href="/me">My Profile</Link>
              <button className="cta ghost" onClick={()=> signOut(auth)}>Sign out</button>
            </div>
          )}
        </div>
      )}

      <AuthModal open={emailOpen} onClose={()=> setEmailOpen(false)} />
    </div>
  )
}
