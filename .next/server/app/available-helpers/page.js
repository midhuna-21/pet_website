(()=>{var e={};e.id=991,e.ids=[991],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},2361:e=>{"use strict";e.exports=require("events")},7147:e=>{"use strict";e.exports=require("fs")},3685:e=>{"use strict";e.exports=require("http")},5158:e=>{"use strict";e.exports=require("http2")},1808:e=>{"use strict";e.exports=require("net")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")},7282:e=>{"use strict";e.exports=require("process")},2781:e=>{"use strict";e.exports=require("stream")},4404:e=>{"use strict";e.exports=require("tls")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},9449:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>c,pages:()=>p,routeModule:()=>m,tree:()=>d}),r(281),r(3147),r(5866);var a=r(3191),i=r(8716),o=r(7922),n=r.n(o),s=r(5231),l={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>s[e]);r.d(t,l);let d=["",{children:["available-helpers",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,281)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\available-helpers\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,3147)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],p=["C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\available-helpers\\page.tsx"],c="/available-helpers/page",x={require:r,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/available-helpers/page",pathname:"/available-helpers",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},3301:(e,t,r)=>{Promise.resolve().then(r.bind(r,1904))},9436:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});let a=(0,r(2881).Z)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]])},1705:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});let a=(0,r(2881).Z)("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]])},4019:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});let a=(0,r(2881).Z)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},1904:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>k});var a=r(326),i=r(7577),o=r(8998),n=r(7636),s=r(9436),l=r(5047);function d({availableHelpers:e=[],setSelectedHelper:t}){return(0,l.useRouter)(),(0,a.jsxs)(a.Fragment,{children:[a.jsx("style",{children:`
    /*  MOBILE (max-width: 640px)  */
    @media (max-width: 640px) {

      .container {
        padding: 20px !important;
      }

      .helpers-title {
        font-size: 26px !important;
      }

      .helpers-subtext {
        font-size: 13px !important;
        margin-bottom: 20px !important;
        margin-top: 4px !important;
      }

      .helper-card {
        padding: 14px !important;
        border-radius: 14px !important;
      }

      .helper-name {
        font-size: 15px !important;
      }

      .send-btn {
        padding: 6px 8px !important;
        font-size: 12px !important;
        border-radius: 8px !important;
      }

      .available-text {
        font-size: 11px !important;
      }

      .available-clock {
        width: 10px !important;
        height: 10px !important;
      }

      .grid-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
        gap: 16px !important;
      }
    }
  `}),a.jsx("div",{className:"container",style:{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},children:(0,a.jsxs)("div",{style:{maxWidth:1100,margin:"0 auto",marginTop:"80px",marginBottom:"50px"},children:[a.jsx("h1",{className:"helpers-title",style:{fontSize:40,fontWeight:700,fontFamily:"Playfair Display",marginBottom:6},children:"Available Helpers"}),a.jsx("p",{className:"helpers-subtext",style:{color:"rgba(255,255,255,0.55)",marginBottom:30},children:"These kind folks near you are currently active and ready to help ❤️"}),(!Array.isArray(e)||0===e.length)&&a.jsx("p",{style:{marginTop:20,color:"rgba(255,255,255,0.45)"},children:"No helpers available at the moment."}),a.jsx("div",{className:"grid-wrapper",style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:28},children:e.map(e=>(0,a.jsxs)("div",{className:"helper-card",style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:22,boxShadow:"0 12px 30px rgba(0,0,0,0.55)",transition:"0.3s"},onMouseEnter:e=>e.currentTarget.style.transform="translateY(-5px)",onMouseLeave:e=>e.currentTarget.style.transform="translateY(0)",children:[(0,a.jsxs)("div",{style:{display:"flex",gap:14},children:[a.jsx("div",{style:{width:52,height:52,borderRadius:"50%",background:"var(--gold-light)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:20,color:"#000"},children:e.avatar||e.name?.charAt(0)?.toUpperCase()||"?"}),(0,a.jsxs)("div",{style:{flex:1},children:[a.jsx("div",{className:"helper-name",style:{fontSize:20,fontWeight:700,marginBottom:2},children:e.name||"Unknown User"}),(0,a.jsxs)("div",{className:"available-text",style:{display:"flex",gap:6,alignItems:"center",color:"rgba(255,255,255,0.55)",fontSize:14},children:[a.jsx(o.Z,{className:"available-clock",size:14}),"Available now"]})]})]}),(0,a.jsxs)("div",{style:{display:"flex",gap:6,alignItems:"center",marginTop:14,color:"rgba(255,255,255,0.6)",fontSize:14},children:[a.jsx(n.Z,{size:15}),e.location||"Not provided"]}),(0,a.jsxs)("button",{className:"send-btn",onClick:()=>{t(e)},style:{marginTop:20,width:"100%",padding:"12px 0",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#fff",borderRadius:12,fontSize:15,fontWeight:600,display:"flex",justifyContent:"center",alignItems:"center",gap:8,cursor:"pointer",transition:"0.25s"},onMouseEnter:e=>e.currentTarget.style.background="rgba(255,255,255,0.12)",onMouseLeave:e=>e.currentTarget.style.background="rgba(255,255,255,0.06)",children:[a.jsx(s.Z,{size:16})," Send Request"]})]},e.id))})]})})]})}var p=r(5535),c=r(445),x=r(4019),m=r(1705);function u({helper:e,onClose:t}){let[r,o]=(0,i.useState)({strayName:"",location:""}),[n,s]=(0,i.useState)(null),[l,d]=(0,i.useState)(null),[u,j]=(0,i.useState)(!1),k=async()=>{if(!r.strayName||!r.location){alert("Please fill all fields");return}j(!0);let a=null;n&&(a=await (0,p.Ix)(n,"requests")),await (0,p.WG)({senderId:c.I8.currentUser?.uid,receiverId:e.id,strayName:r.strayName,location:r.location,photo:a,status:"pending"}),j(!1),t()};return(0,a.jsxs)("div",{style:{position:"fixed",inset:0,backdropFilter:"blur(10px)",backgroundColor:"rgba(0,0,0,0.55)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:3e3,animation:"fadeIn 0.3s ease",padding:"10px"},children:[a.jsx("style",{children:`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* ---------- TABLET (max-width: 1024px) ---------- */
          @media (max-width: 1024px) {
            .modal-container {
              padding: 24px !important;
            }

            .modal-title {
              font-size: 24px !important;
            }

            .modal-subtext {
              font-size: 13px !important;
            }

            .modal-input {
              padding: 10px 14px !important;
              font-size: 14px !important;
            }

            .upload-box {
              padding: 20px !important;
            }

            .submit-btn,
            .cancel-btn {
              padding: 12px !important;
              font-size: 15px !important;
            }
          }

          /* ---------- MOBILE (max-width: 640px) ---------- */
          @media (max-width: 640px) {
            .modal-container {
              padding: 16px !important;
            }

            .modal-title {
              font-size: 20px !important;
            }

            .modal-subtext {
              font-size: 12px !important;
            }

            .modal-input {
              padding: 8px 12px !important;
              font-size: 13px !important;
            }

            .upload-box {
              padding: 16px !important;
            }

            .submit-btn,
            .cancel-btn {
              padding: 10px !important;
              font-size: 13px !important;
            }

            img.preview-img {
              width: 180px !important;
              height: 130px !important;
            }
          }
        `}),(0,a.jsxs)("div",{className:"modal-container",style:{width:"100%",maxWidth:520,backgroundColor:"rgba(20,20,20,0.65)",borderRadius:18,padding:32,border:"1px solid rgba(255,255,255,0.12)",boxShadow:"0 25px 70px rgba(0,0,0,0.65)"},children:[(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},children:[(0,a.jsxs)("h2",{className:"modal-title",style:{margin:0,color:"#fff",fontSize:"28px",fontFamily:"Playfair Display",fontWeight:700},children:["Request Help from ",e.name]}),a.jsx("button",{onClick:t,style:{backgroundColor:"rgba(255,255,255,0.12)",border:"none",borderRadius:"50%",padding:6,cursor:"pointer"},children:a.jsx(x.Z,{size:18,color:"#fff"})})]}),a.jsx("p",{className:"modal-subtext",style:{color:"rgba(255,255,255,0.55)",marginBottom:20},children:"Provide details about the stray needing help ❤️"}),a.jsx("label",{style:g,children:"Stray Name"}),a.jsx("input",{className:"modal-input",value:r.strayName,onChange:e=>o({...r,strayName:e.target.value}),placeholder:"Enter stray name",style:b}),a.jsx("label",{style:{...g,marginTop:16},children:"Location"}),a.jsx("input",{className:"modal-input",value:r.location,onChange:e=>o({...r,location:e.target.value}),placeholder:"Enter location",style:b}),a.jsx("label",{style:{...g,marginTop:16},children:"Photo"}),l?(0,a.jsxs)("div",{style:{position:"relative",marginTop:10},children:[a.jsx("img",{className:"preview-img",src:l,style:{width:220,height:160,objectFit:"cover",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)"}}),a.jsx("button",{onClick:()=>{s(null),d(null)},style:h,children:a.jsx(x.Z,{size:14})})]}):(0,a.jsxs)("label",{className:"upload-box",style:f,children:[a.jsx(m.Z,{size:30,color:"#d8c48d"}),a.jsx("p",{style:{marginTop:8,color:"#d8c48d",fontSize:14},children:"Upload Photo"}),a.jsx("input",{type:"file",accept:"image/*",onChange:e=>{let t=e.target.files?.[0];t&&(s(t),d(URL.createObjectURL(t)))},style:{display:"none"}})]}),a.jsx("button",{className:"submit-btn",onClick:k,disabled:u,style:y,children:u?"Sending...":"Send Request"}),a.jsx("button",{className:"cancel-btn",onClick:t,style:v,children:"Cancel"})]})]})}let g={color:"rgba(255,255,255,0.65)",fontSize:14,fontWeight:500},b={width:"100%",padding:"14px 20px",borderRadius:14,backgroundColor:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",fontSize:15,outline:"none",marginTop:6,boxSizing:"border-box"},f={border:"1px dashed rgba(255,255,255,0.2)",backgroundColor:"rgba(255,255,255,0.05)",padding:"14px 20px",borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",marginTop:6,width:"100%",boxSizing:"border-box"},h={position:"absolute",top:8,right:8,backgroundColor:"rgba(0,0,0,0.5)",color:"#fff",border:"none",padding:6,borderRadius:"50%",cursor:"pointer"},y={width:"100%",padding:"14px 20px",borderRadius:14,marginTop:24,background:"linear-gradient(90deg,#b89c58,#d8c48d)",border:"none",cursor:"pointer",color:"#000",fontWeight:700,fontSize:16,boxSizing:"border-box"},v={width:"100%",padding:"14px 20px",borderRadius:14,backgroundColor:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",marginTop:10,color:"#fff",cursor:"pointer",fontWeight:600,boxSizing:"border-box"};var j=r(6881);function k(){let[e,t]=(0,i.useState)([]),[r,o]=(0,i.useState)(!0),[n,s]=(0,i.useState)(null);return r?a.jsx(j.Z,{}):(0,a.jsxs)(a.Fragment,{children:[a.jsx(d,{availableHelpers:e,setSelectedHelper:s}),n&&a.jsx(u,{helper:n,onClose:()=>s(null)})]})}},6881:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var a=r(326),i=r(7626),o=r.n(i);function n(){return(0,a.jsxs)("div",{role:"status","aria-live":"polite",className:"jsx-7224b0ff6b6ccd5d overlay",children:[a.jsx("div",{className:"jsx-7224b0ff6b6ccd5d",children:a.jsx("div",{className:"jsx-7224b0ff6b6ccd5d ring"})}),a.jsx(o(),{id:"7224b0ff6b6ccd5d",children:".overlay.jsx-7224b0ff6b6ccd5d{position:fixed;inset:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;background:#000;z-index:9999}.ring.jsx-7224b0ff6b6ccd5d{width:40px;height:40px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;border:4px solid transparent;border-top-color:#fff;border-left-color:rgba(255,255,255,.12);-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;animation:spin 1s linear infinite;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}@-webkit-keyframes spin{from{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes spin{from{-moz-transform:rotate(0deg);transform:rotate(0deg)}to{-moz-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes spin{from{-o-transform:rotate(0deg);transform:rotate(0deg)}to{-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.ring.jsx-7224b0ff6b6ccd5d{-webkit-animation:none;-moz-animation:none;-o-animation:none;animation:none}}"})]})}r(7577)},5535:(e,t,r)=>{"use strict";r.d(t,{Ix:()=>d,WG:()=>p,cr:()=>n,m5:()=>l,p0:()=>s});var a=r(445),i=r(76),o=r(1552);let n=async e=>{let t=a.I8.currentUser?.uid;if(!t)throw Error("User not logged in");return await (0,i.pl)((0,i.JU)(a.db,"availability",t),{...e,id:t,updatedAt:(0,i.Bt)()},{merge:!0})},s=async()=>{let e=a.I8.currentUser?.uid,t=(0,i.IO)((0,i.hJ)(a.db,"requests"),(0,i.ar)("receiverId","==",e));return(await (0,i.PL)(t)).docs.map(e=>({id:e.id,...e.data()}))},l=async(e,t)=>await (0,i.r7)((0,i.JU)(a.db,"requests",e),{status:t,updatedAt:(0,i.Bt)()}),d=async(e,t)=>{let r=(0,o.iH)(a.tO,`${t}/${Date.now()}_${e.name}`);return await (0,o.KV)(r,e),await (0,o.Jt)(r)},p=async e=>await (0,i.ET)((0,i.hJ)(a.db,"requests"),{...e,status:"pending",createdAt:(0,i.Bt)()})},281:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>o,default:()=>s});var a=r(8570);let i=(0,a.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\available-helpers\page.tsx`),{__esModule:o,$$typeof:n}=i;i.default;let s=(0,a.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\available-helpers\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[405,588,414],()=>r(9449));module.exports=a})();