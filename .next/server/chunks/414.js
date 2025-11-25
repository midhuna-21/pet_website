exports.id=414,exports.ids=[414],exports.modules={1241:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},4186:(e,t,r)=>{Promise.resolve().then(r.bind(r,4001)),Promise.resolve().then(r.bind(r,909))},1511:(e,t,r)=>{"use strict";r.d(t,{Z:()=>d});var n=r(326),o=r(7577),a=r(2534),i=r(6791),s=r(76),l=r(445);function d({open:e,onClose:t,onSelect:r}){let[d,c]=(0,o.useState)("signin"),[p,u]=(0,o.useState)(""),[h,g]=(0,o.useState)(""),[x,f]=(0,o.useState)(""),[m,b]=(0,o.useState)(""),[y,j]=(0,o.useState)(!1),[v,S]=(0,o.useState)(!1),[w,k]=(0,o.useState)(""),[C,A]=(0,o.useState)(null),P=(0,o.useRef)(null),z=async e=>{if(e.preventDefault(),b(""),"signup"===d){if(!x.trim()||!p.trim()||!h.trim()||!w.trim()){b("Please fill all required fields.");return}if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-]).{6,}$/.test(h)){b("Enter a stronger password (min 6 chars, include letters & numbers).");return}}else if(!p.trim()||!h.trim()){b("Invalid email or password.");return}j(!0);try{if("signup"===d){let e=(await (0,i.Xb)(l.I8,p,h)).user;await (0,i.ck)(e,{displayName:x}),await (0,s.pl)((0,s.JU)(l.db,"users",e.uid),{name:x,email:p,location:C?.address||w||"",lat:C?.lat??null,lng:C?.lng??null,createdAt:new Date().toISOString()}),t()}else await (0,i.e5)(l.I8,p,h),t()}catch(t){let e=t?.code||"";"signup"===d&&"auth/email-already-in-use"===e?b("User already exists."):"signin"===d&&("auth/user-not-found"===e||"auth/wrong-password"===e)?b("Invalid email or password."):b("Something went wrong, please try again.")}finally{j(!1)}};async function I(){b("");try{let e=(await (0,i.rh)(l.I8,l.Vv)).user;await (0,s.pl)((0,s.JU)(l.db,"users",e.uid),{uid:e.uid,name:e.displayName||"",email:e.email||"",photoURL:e.photoURL||"",createdAt:(0,s.Bt)(),lastLogin:(0,s.Bt)()},{merge:!0}),t()}catch(t){console.error("Google sign-in failed:",t);let e=t.code||"";"auth/popup-closed-by-user"===e?b("Google sign-in was cancelled."):"auth/network-request-failed"===e?b("Network issue — please check your connection and try again."):"auth/internal-error"===e?b("Server issue — please try again in a moment."):b("Unable to sign in with Google. Please try again.")}}if(!e)return null;let E={width:"100%",padding:"14px 20px",borderRadius:12,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"};return(0,n.jsxs)("div",{onClick:t,style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(10px)",display:"flex",justifyContent:"flex-end",zIndex:2e3},children:[n.jsx("style",{children:`
/* GOOGLE AUTOCOMPLETE DROPDOWN */
.pac-container {
  background: rgba(10,10,10,0.92) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(6px) !important;
  z-index: 999999 !important;
}

/* EACH ITEM */
.pac-item {
  padding: 12px 16px !important;
  color: rgba(255,255,255,0.85) !important;
  font-size: 14px !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  background: transparent !important;
}

/* LAST ITEM SHOULD NOT HAVE BORDER */
.pac-item:last-child {
  border-bottom: none !important;
}

/* MAIN TEXT */
.pac-item .pac-item-query {
  color: #d8c48d !important; /* gold highlight */
  font-weight: 600 !important;
}

/* SMALLER DESC TEXT */
.pac-item span {
  color: rgba(255,255,255,0.55) !important;
}

/* LOCATION ICON */
.pac-icon {
  filter: brightness(0) invert(1) sepia(80%) saturate(300%) hue-rotate(20deg);
  opacity: 0.8 !important;
}

/* ACTIVE / HOVER STATE */
.pac-item:hover,
.pac-item-selected {
  background: rgba(255,255,255,0.08) !important;
}
`}),n.jsx("style",{children:`
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.05) inset !important;
  box-shadow: 0 0 0px 1000px rgba(255,255,255,0.05) inset !important;
  -webkit-text-fill-color: #fff !important;
  caret-color: #fff !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  transition: background-color 9999s ease-in-out 0s;
}
`}),(0,n.jsxs)("div",{onClick:e=>e.stopPropagation(),style:{width:"420px",height:"100vh",background:"rgba(10,10,10,0.92)",borderLeft:"1px solid rgba(255,255,255,0.08)",boxShadow:"-20px 0 60px rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",animation:"slideIn 0.35s ease-out",overflow:"auto",padding:"34px 28px"},children:[n.jsx("button",{onClick:t,style:{position:"absolute",top:26,right:26,color:"#fff",background:"rgba(255,255,255,0.1)",borderRadius:"50%",width:32,height:32,border:"none",cursor:"pointer",fontSize:18},children:"\xd7"}),(0,n.jsxs)("div",{style:{width:"100%",maxWidth:360,margin:"0 auto"},children:[n.jsx("h2",{style:{margin:0,fontSize:34,fontFamily:"Playfair Display",color:"#d8c48d",fontWeight:700,textAlign:"left"},children:"signup"===d?"Join Us":"Welcome Back"}),n.jsx("p",{style:{marginTop:6,color:"rgba(255,255,255,0.55)",fontSize:15,marginBottom:20,textAlign:"left"},children:"signup"===d?"Create your account":"Sign in to continue"}),(0,n.jsxs)("form",{onSubmit:z,children:["signup"===d&&n.jsx("div",{style:{marginBottom:16},children:n.jsx("input",{style:E,type:"text",placeholder:"Name",value:x,onChange:e=>f(e.target.value),autoComplete:"off",name:"name-field"})}),n.jsx("div",{style:{marginBottom:16},children:n.jsx("input",{style:E,type:"email",placeholder:"Email",value:p,onChange:e=>u(e.target.value)})}),(0,n.jsxs)("div",{style:{marginBottom:16,position:"relative"},children:[n.jsx("input",{style:{...E,paddingRight:46},type:v?"text":"password",placeholder:"Password",value:h,onChange:e=>g(e.target.value),autoComplete:"new-password",name:"password-field"}),n.jsx("button",{type:"button",onClick:()=>S(e=>!e),style:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",color:"#d8c48d"},children:v?n.jsx(a.rzC,{size:16}):n.jsx(a.rDJ,{size:16})})]}),"signup"===d&&(0,n.jsxs)("div",{style:{marginBottom:18,position:"relative"},children:[n.jsx(a.i63,{size:16,color:"#d8c48d",style:{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)"}}),n.jsx("input",{ref:P,type:"text",placeholder:"Search Location",value:w,onChange:e=>k(e.target.value),style:{...E,paddingLeft:44}})]}),m&&n.jsx("div",{style:{padding:"12px 14px",background:"rgba(255,0,0,0.1)",border:"1px solid rgba(255,0,0,0.25)",borderRadius:10,color:"#f87171",fontSize:13,marginBottom:14},children:m}),n.jsx("button",{type:"submit",disabled:y,style:{width:"100%",padding:"14px 20px",background:"linear-gradient(135deg,#b89c58,#d8c48d)",borderRadius:12,color:"#000",fontWeight:700,border:"none",cursor:y?"not-allowed":"pointer",fontSize:15,boxSizing:"border-box"},children:y?"Please wait…":"signup"===d?"Create Account":"Sign In"}),(0,n.jsxs)("div",{style:{textAlign:"center",marginTop:14,color:"rgba(255,255,255,0.55)",fontSize:14},children:["signup"===d?"Already have an account?":"Don't have an account?"," ",n.jsx("span",{onClick:()=>{c("signup"===d?"signin":"signup"),b("")},style:{color:"#d8c48d",fontWeight:700,cursor:"pointer"},children:"signup"===d?"Sign In":"Sign Up"})]})]}),(0,n.jsxs)("div",{style:{display:"flex",alignItems:"center",margin:"18px 0"},children:[n.jsx("div",{style:{flex:1,height:1,background:"rgba(255,255,255,0.15)"}}),n.jsx("span",{style:{margin:"0 10px",color:"rgba(255,255,255,0.45)",fontSize:13},children:"or"}),n.jsx("div",{style:{flex:1,height:1,background:"rgba(255,255,255,0.15)"}})]}),(0,n.jsxs)("button",{type:"button",onClick:I,style:{width:"100%",padding:"12px",background:"#fff",borderRadius:12,border:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer",fontWeight:600,fontSize:15,color:"#000"},children:[n.jsx("img",{src:"https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",alt:"Google",style:{width:20,height:20}}),"Continue with Google"]})]})]}),n.jsx("style",{children:`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1); }
          }
        `})]})}},4001:(e,t,r)=>{"use strict";r.d(t,{AuthProvider:()=>i,a:()=>s});var n=r(326),o=r(7577);r(445),r(6791);let a=(0,o.createContext)(null);function i({children:e}){let[t,r]=(0,o.useState)(null),[i,s]=(0,o.useState)(!0);return n.jsx(a.Provider,{value:{user:t,loading:i},children:e})}function s(){return(0,o.useContext)(a)}},909:(e,t,r)=>{"use strict";r.d(t,{default:()=>m});var n=r(326),o=r(4001),a=r(5047),i=r(7577);function s({children:e}){let{user:t,loading:r}=(0,o.a)();(0,a.useRouter)();let n=(0,a.usePathname)();return r?null:!t&&["/"].includes(n)||t?e:null}var l=r(748);r(445),r(6791);var d=r(1511),c=r(2691),p=r(434);function u(){let[e,t]=(0,i.useState)(null),[r,o]=(0,i.useState)(!1);return(0,n.jsxs)("div",{style:{position:"relative"},children:[n.jsx("style",{children:`
        .cta {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.25s ease;
        }

        .cta:hover {
          color: #ffffff;
        }

        .log-icon {
          transform: translateY(-1px);
        }

        /* 📱 MOBILE (smaller text/sign icon) */
        @media (max-width: 768px) {
          .cta {
            font-size: 0.78rem;
            gap: 0.3rem;
          }
          .log-icon {
            transform: scale(0.9);
          }
        }
      `}),e?n.jsx(p.default,{href:"/profile",children:n.jsx("div",{title:e?.email||"",style:{width:34,height:34,borderRadius:"50%",border:"1.5px solid #b8935f",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:"0.9rem",color:"#b8935f",cursor:"pointer",transition:"all 0.25s ease"},onMouseEnter:e=>{e.currentTarget.style.backgroundColor="rgba(184,147,95,0.12)"},onMouseLeave:e=>{e.currentTarget.style.backgroundColor="transparent"},children:function(){let t=e?.displayName||e?.email||"";return t?t[0].toUpperCase():"\uD83D\uDE42"}()})}):(0,n.jsxs)("button",{className:"cta",onClick:()=>o(!0),children:[n.jsx(c.Z,{className:"log-icon",size:15}),n.jsx("span",{children:"Sign in"})]}),r&&n.jsx(d.Z,{open:r,onClose:()=>o(!1),onSelect:e=>{console.log("Selected:",e)}})]})}function h(){let[e,t]=(0,i.useState)(!1),{showAuthModal:r,setShowAuthModal:o,user:s}=function(){(0,a.usePathname)();let[e,t]=(0,i.useState)(!1),[r,n]=(0,i.useState)(null);return{showAuthModal:e,setShowAuthModal:t,user:r}}(),c=(0,a.usePathname)();return(0,n.jsxs)("header",{style:{width:"100%",position:"fixed",top:0,zIndex:50,backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.45)"},children:[n.jsx("style",{children:`
  /* Hide mobile sidebar ALWAYS on desktop */
  @media (min-width: 769px) {
    .mobile-sidebar {
      display: none !important;
    }
  }
`}),r&&n.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3},onClick:()=>o(!1),children:n.jsx("div",{onClick:e=>e.stopPropagation(),children:n.jsx(d.Z,{open:r,onClose:()=>o(!1),onSelect:()=>{console.log("selected")}})})}),(0,n.jsxs)("div",{style:{maxWidth:"1100px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"17px 15px"},children:[n.jsx("a",{href:"/",className:"logo-text",style:{fontFamily:"Playfair Display",fontSize:"20px",fontWeight:700,background:"linear-gradient(180deg, var(--gold-light), var(--gold-dark))",WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",letterSpacing:"0.2px",textDecoration:"none"},children:"StrayPals"}),(0,n.jsxs)("nav",{className:"desktop-nav",style:{display:"none",alignItems:"center",gap:"28px"},children:[n.jsx(g,{href:"/",pathname:c,user:s,setShowAuthModal:o,children:"Home"}),n.jsx(g,{href:"/report",pathname:c,user:s,setShowAuthModal:o,children:"Report"}),n.jsx(g,{href:"/strays",pathname:c,user:s,setShowAuthModal:o,children:"Strays"}),n.jsx(g,{href:"/stations",pathname:c,user:s,setShowAuthModal:o,children:"Stations"}),n.jsx(g,{href:"/community",pathname:c,user:s,setShowAuthModal:o,children:"Community"}),n.jsx(g,{href:"/tasks",pathname:c,user:s,setShowAuthModal:o,children:"Tasks"}),n.jsx(g,{href:"/pass-the-bowl",pathname:c,user:s,setShowAuthModal:o,children:"Pass the Bowl"}),n.jsx(u,{})]}),n.jsx("div",{onClick:()=>t(!e),style:{cursor:"pointer",display:"flex",alignItems:"center"},className:"mobile-only",children:e?n.jsx("button",{onClick:()=>t(!1),style:{position:"absolute",top:"10px",right:"10px",background:"none",border:"none",color:"white",fontSize:"20px",cursor:"pointer"},children:"✕"}):n.jsx(l.Z,{size:26,color:"var(--gold-light)"})})]}),e&&n.jsx("div",{className:"mobile-menu-wrapper",style:{top:0,left:0,width:"100%",height:"100vh",background:"rgba(0, 0, 0, 0)",zIndex:999,pointerEvents:"none"},children:(0,n.jsxs)("div",{className:`mobile-sidebar ${e?"open":""}`,children:[n.jsx("button",{onClick:()=>t(!1),style:{position:"absolute",top:"10px",right:"10px",background:"none",border:"none",color:"white",fontSize:"20px",cursor:"pointer"},children:"✕"}),n.jsx(x,{href:"/",pathname:c,children:"Home"}),n.jsx(x,{href:"/report",pathname:c,children:"Report"}),n.jsx(x,{href:"/strays",pathname:c,children:"Strays"}),n.jsx(x,{href:"/stations",pathname:c,children:"Stations"}),n.jsx(x,{href:"/community",pathname:c,children:"Community"}),n.jsx(x,{href:"/tasks",pathname:c,children:"Tasks"}),n.jsx(x,{href:"/pass-the-bowl",pathname:c,children:"Pass the Bowl"}),n.jsx(u,{})]})})]})}function g({href:e,children:t,pathname:r,user:o,setShowAuthModal:a}){let i=r===e;return n.jsx("a",{href:e,onClick:t=>{o||"/"===e||(t.preventDefault(),a(!0))},style:{fontSize:"13px",textDecoration:"none",transition:"0.3s",color:i?"var(--gold-light)":"rgba(255,255,255,0.85)",fontWeight:i?"700":"400"},children:t})}function x({href:e,children:t,pathname:r}){let o=r===e;return n.jsx("a",{href:e,style:{padding:"9px 0",fontSize:"12px",textDecoration:"none",transition:"0.3s",color:o?"var(--gold-light)":"#ffffff",fontWeight:o?"700":"400"},children:t})}function f(){return(0,n.jsxs)("footer",{style:{background:"#000",color:"#ccc",padding:"18px 10px",borderTop:"1px solid #222",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"14px"},children:"StrayPals — Helping hands for every stray in need."}),(0,n.jsxs)("span",{style:{fontSize:"14px"},children:["\xa9 ",new Date().getFullYear()," StrayPals. All rights reserved."]})]})}function m({children:e}){return(0,n.jsxs)(s,{children:[n.jsx(h,{}),e,n.jsx(f,{})]})}},445:(e,t,r)=>{"use strict";r.d(t,{I8:()=>d,Vv:()=>u,db:()=>c,tO:()=>p});var n=r(2585),o=r(6791),a=r(76),i=r(1552),s=r(6779);let l=(0,n.ZF)({apiKey:"AIzaSyDM9KxlPRI3ZTJ70lmVxQfETYPTdea3oxQ",authDomain:"straypals-80411.firebaseapp.com",projectId:"straypals-80411",storageBucket:"straypals-80411.firebasestorage.app",messagingSenderId:"491601505855",appId:"1:491601505855:web:a048b0dc0dcf474e3dd28a"}),d=(0,o.v0)(l),c=(0,a.ad)(l),p=(0,i.cF)(l),u=new o.hJ;(0,s.Gb)().then(e=>e?(0,s.KL)(l):null)},3147:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>h});var n=r(9510);r(4315);var o=r(8570);let a=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\contexts\AuthContext.tsx`),{__esModule:i,$$typeof:s}=a;a.default;let l=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\contexts\AuthContext.tsx#AuthProvider`);(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\contexts\AuthContext.tsx#useAuth`);let d=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\hooks\AppClient.tsx`),{__esModule:c,$$typeof:p}=d;d.default;let u=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\hooks\AppClient.tsx#default`);function h({children:e}){return n.jsx("html",{lang:"en",children:n.jsx("body",{children:n.jsx(l,{children:n.jsx(u,{children:e})})})})}},4315:()=>{}};