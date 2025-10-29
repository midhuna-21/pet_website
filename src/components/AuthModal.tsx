
import { useState } from 'react'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = { open: boolean, onClose: ()=>void }

export default function AuthModal({ open, onClose }: Props){

  
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (!open) return null

  // async function submit(e:any){
  //   e.preventDefault()
  //   setErr(''); setBusy(true)
  //   try{
  //     if (mode==='signup'){
  //       const cred = await createUserWithEmailAndPassword(auth, email, password)
  //       if (name) await updateProfile(cred.user, { displayName: name })
  //     } else {
  //       await signInWithEmailAndPassword(auth, email, password)
  //     }
  //     onClose()
  //   }catch(e:any){
  //     setErr(e?.message || 'Authentication failed')
  //   }finally{
  //     setBusy(false)
  //   }
  // }

  async function submit(e: any) {
  e.preventDefault();
  setErr('');
  setBusy(true);

  try {
    if (mode === 'signup') {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });

      const saved = await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: name,
        email: email,
        password: password,  
        createdAt: serverTimestamp(),
      });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

    onClose();
  } catch (e: any) {
    setErr(e?.message || 'Authentication failed');
  } finally {
    setBusy(false);
  }
}


  return (
  <div 
  style={{
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '480px', 
  }}
  onClick={onClose}
>
  <div 
    className="card" 
    style={{
      width: '100%',
      color: 'white',
      padding: '50px 36px',
        background: 'rgba(0,0,0,0.85)', 
      // borderRadius: 12,
      // boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'slideInRight 0.4s ease-out'
    }}
    onClick={e => e.stopPropagation()}
  >

        <h2 style={{
          marginTop: 0,
          marginBottom: 8,
          fontSize: 24,
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {mode==='signup'? 'Create your account' : 'Welcome back'}
        </h2>
        
        <p style={{
          marginTop: 0,
          marginBottom: 32,
          fontSize: 14,
          color: '#64748b',
          textAlign: 'center'
        }}>
          {mode==='signup'? 'Sign up to get started' : 'Sign in to continue'}
        </p>

        <form onSubmit={submit}>
          {mode==='signup' && (
            <div style={{marginBottom: 16}}>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 500,
                color: '#334155'
              }}>
                Full Name
              </label>
              <input 
                placeholder="John Doe" 
                value={name} 
                onChange={e=>setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}
          
          <div style={{marginBottom: 16}}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 500,
              color: '#334155'
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 14,
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <div style={{marginBottom: 16}}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 500,
              color: '#334155'
            }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 14,
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {err && (
            <div style={{
              padding: '10px 12px',
              marginBottom: 16,
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: 14,
              borderRadius: 6,
              border: '1px solid #fee2e2'
            }}>
              {err}
            </div>
          )}

          <button 
            className="cta primary" 
            type="submit" 
            disabled={busy}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 12
            }}
          >
            {busy? 'Please wait…' : (mode==='signup'?'Create account':'Sign in')}
          </button>
          
          <button 
            className="cta ghost" 
            type="button" 
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 15,
              fontWeight: 500
            }}
          >
            Cancel
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: 14,
          color: '#64748b'
        }}>
          {mode==='signup'? 'Already have an account?' : "Don't have an account?"}{' '}
          <a 
            className="link" 
            onClick={()=>setMode(mode==='signup'?'signin':'signup')} 
            style={{
              cursor:'pointer',
              color: '#3b82f6',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            {mode==='signup'?'Sign in':'Sign up'}
          </a>
        </div>
      </div>
    </div>
  )
}
