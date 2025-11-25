(()=>{var e={};e.id=420,e.ids=[420],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},2361:e=>{"use strict";e.exports=require("events")},7147:e=>{"use strict";e.exports=require("fs")},3685:e=>{"use strict";e.exports=require("http")},5158:e=>{"use strict";e.exports=require("http2")},1808:e=>{"use strict";e.exports=require("net")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")},7282:e=>{"use strict";e.exports=require("process")},2781:e=>{"use strict";e.exports=require("stream")},4404:e=>{"use strict";e.exports=require("tls")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},7730:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>s.a,__next_app__:()=>u,originalPathname:()=>c,pages:()=>d,routeModule:()=>x,tree:()=>l}),r(522),r(3147),r(5866);var o=r(3191),a=r(8716),i=r(7922),s=r.n(i),n=r(5231),p={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(p[e]=()=>n[e]);r.d(t,p);let l=["",{children:["report",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,522)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\report\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,3147)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\report\\page.tsx"],c="/report/page",u={require:r,loadChunk:()=>Promise.resolve()},x=new o.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/report/page",pathname:"/report",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},1706:(e,t,r)=>{Promise.resolve().then(r.bind(r,6949))},1705:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});let o=(0,r(2881).Z)("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]])},4019:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});let o=(0,r(2881).Z)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},6949:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var o=r(326),a=r(1705),i=r(4019),s=r(7577);function n({onSelect:e,error:t}){let[r,a]=(0,s.useState)(!1),i=(0,s.useRef)(null);return o.jsx("input",{ref:i,type:"text",placeholder:"Search for a location...",className:"location-input",style:{width:"100%",flex:1,padding:"14px 18px",background:"rgba(15, 23, 42, 0.6)",borderRadius:"12px",fontSize:"16px",color:"#ffffff",outline:"none",transition:"all 0.3s ease",boxSizing:"border-box"},onFocus:()=>a(!0),onBlur:()=>a(!1)})}var p=r(445),l=r(76),d=r(1552);r(6791);var c=r(5047);function u(){let[e,t]=(0,s.useState)(null),[r,u]=(0,s.useState)(!1),[x,m]=(0,s.useState)(!1),[h,g]=(0,s.useState)(null),[f,y]=(0,s.useState)(""),[b,v]=(0,s.useState)(null),[j,S]=(0,s.useState)(null),[w,_]=(0,s.useState)({}),[k,q]=(0,s.useState)(!1),[P,z]=(0,s.useState)(!1),[M,E]=(0,s.useState)(!1),R=(0,c.useRouter)(),A=()=>{let e={};return f.trim()||(e.petName="Please enter a name."),b||(e.photo="Please upload a photo."),j||(e.location="Please select a location."),_(e),0===Object.keys(e).length},N=async t=>{if(t.preventDefault(),!e){m(!0);return}if(A())try{q(!0);let t=(0,d.iH)(p.tO,`pets/${Date.now()}_${b?.name}`);await (0,d.KV)(t,b);let r=await (0,d.Jt)(t);await (0,l.ET)((0,l.hJ)(p.db,"pets"),{name:f,photoURL:r,location:j?.address,coordinates:{lat:j?.lat,lng:j?.lng},createdAt:(0,l.Bt)(),userId:e.uid}),setTimeout(()=>{R.push("/strays")},2e3)}catch(e){console.error("Error saving pet data:",e),alert("Error saving data: "+e.message)}finally{}};return(0,o.jsxs)("div",{children:[o.jsx("style",{children:`
        /* ====== RESPONSIVE STYLES ====== */

        @media (max-width: 1024px) {
        
 .no-focus-input:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /* hide placeholder after typing */
  .no-focus-input:not(:placeholder-shown)::placeholder {
    opacity: 0;
  }
          .two-col {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .left-text h1 {
            font-size: 36px !important;
            margin-bottom: 12px !important;
          }
          .left-text p {
            font-size: 16px !important;
            line-height: 1.5 !important;
            max-width: 100% !important;
          }
          .form-wrapper {
            max-width: 100% !important;
            margin: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 40px 22px !important;
          }
          .left-text h1 {
            font-size: 30px !important;
          }
         
        }

        @media (max-width: 480px) {
          .left-text h1 {
            font-size: 22px !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
          }
       
          input, textarea, select {
            font-size: 13px !important;
          }
          input::placeholder {
            font-size: 12px !important;
            opacity: 0.7 !important;
          }
          .form-wrapper label {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }
          .form-wrapper button {
            font-size: 14px !important;
            padding: 10px 0 !important;
          }
          .page-container {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .two-col {
            gap: 20px !important;
          }
                 .left-text .hero-title {
    font-size: 22px !important;
    line-height: 1.1 !important;
  }
       .left-text p {
    font-size:9px !important;
    line-height: 1.2 !important;
    margin-top: 5px !important;
    
  }
       
        }
       
        }
      `}),(0,o.jsxs)("div",{style:{minHeight:"100vh",padding:"40px 0",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',position:"relative",background:"#000"},children:[o.jsx("div",{style:{position:"fixed",inset:0,opacity:.03,backgroundImage:"radial-gradient(circle at 2px 2px, white 1px, transparent 0)",backgroundSize:"40px 40px",pointerEvents:"none"}}),o.jsx("div",{className:"page-container",style:{maxWidth:"1200px",padding:"70px 55px",margin:"0 auto",boxSizing:"border-box",width:"100%",paddingTop:"100px",paddingBottom:"100px"},children:(0,o.jsxs)("div",{className:"two-col",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"start"},children:[(0,o.jsxs)("div",{className:"left-text",children:[(0,o.jsxs)("span",{className:"hero-title",style:{fontSize:"52px",color:"#fff",fontFamily:"Playfair Display",fontWeight:700,marginBottom:"20px",lineHeight:"1.0",letterSpacing:"-1px"},children:["Report a stray,",o.jsx("span",{style:{color:"var(--gold-light)",display:"block"},children:"show some kindness."})]}),o.jsx("p",{style:{fontSize:"16px",lineHeight:"1.3",color:"rgba(255,255,255,0.65)",maxWidth:"500px"},children:"You know, just letting someone know about a stray actually helps them get a bit of food, care, and some kind of attention. They don’t have anyone to speak for them, so even your tiny nudge makes things easier for the people who look out for them. It’s such a small thing from your side, but it ends up giving that little one a better moment in their day. "})]}),(0,o.jsxs)("form",{className:"form-wrapper",onSubmit:N,style:{width:"100%",maxWidth:"420px"},children:[(0,o.jsxs)("div",{style:{marginBottom:"24px"},children:[o.jsx("label",{style:{color:"rgba(255,255,255,0.85)",fontSize:15},children:"Who’s this lovely soul?"}),o.jsx("input",{type:"text",value:f,placeholder:"Shadow, Luna, Ranger…",onChange:e=>y(e.target.value),style:{width:"100%",padding:"10px 0",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.18)",color:"#fff",fontSize:"15px",outline:"none",boxShadow:"none"},className:"no-focus-input"}),w.petName&&o.jsx("p",{style:{color:"#e04f5f"},children:w.petName})]}),(0,o.jsxs)("div",{style:{marginBottom:"24px"},children:[o.jsx("label",{style:{color:"rgba(255,255,255,0.85)",fontSize:15,marginBottom:"6px",display:"flex"},children:"Share a photo"}),h?(0,o.jsxs)("div",{style:{position:"relative"},children:[o.jsx("img",{src:h,style:{width:"100%",height:"260px",objectFit:"cover",borderRadius:8}}),o.jsx("button",{type:"button",onClick:()=>{g(null),v(null)},style:{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.8)",borderRadius:"50%",padding:3,border:"none",cursor:"pointer"},children:o.jsx(i.Z,{size:16,color:"#000"})})]}):(0,o.jsxs)("label",{style:{display:"block",width:"100%",padding:"32px 0",textAlign:"center",border:"1px dashed rgba(255,255,255,0.18)",borderRadius:"8px",cursor:"pointer"},children:[o.jsx("input",{type:"file",onChange:e=>{let t=e.target.files?.[0];if(t){v(t);let e=new FileReader;e.onloadend=()=>g(e.result),e.readAsDataURL(t),_(e=>({...e,photo:""}))}},style:{display:"none"}}),o.jsx(a.Z,{size:28,color:"rgba(255,255,255,0.4)"})]}),w.photo&&o.jsx("p",{style:{color:"#e04f5f"},children:w.photo})]}),(0,o.jsxs)("div",{style:{marginBottom:"28px"},children:[o.jsx("label",{style:{color:"rgba(255,255,255,0.85)",fontSize:15,marginBottom:"6px",display:"flex"},children:"Where did you meet them?"}),o.jsx(n,{onSelect:e=>{e?.geometry&&e.geometry.location?S({address:e.formatted_address,lat:e.geometry.location.lat(),lng:e.geometry.location.lng()}):S({address:e.formatted_address}),_(e=>({...e,location:""}))},error:w.location}),w.location&&o.jsx("p",{style:{color:"#e04f5f"},children:w.location})]}),o.jsx("button",{type:"submit",disabled:k,style:{width:"100%",fontSize:15,padding:"12px 18px",background:k?"rgba(255,255,255,0.3)":"linear-gradient(90deg,#b89c58,#d8c48d)",color:k?"#333":"#000",borderRadius:12,fontWeight:700,border:"none",cursor:k?"not-allowed":"pointer",transition:"0.25s"},children:k?"Saving...":"Submit Report"})]})]})})]})]})}},522:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>s,__esModule:()=>i,default:()=>n});var o=r(8570);let a=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\report\page.tsx`),{__esModule:i,$$typeof:s}=a;a.default;let n=(0,o.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\report\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[405,414],()=>r(7730));module.exports=o})();