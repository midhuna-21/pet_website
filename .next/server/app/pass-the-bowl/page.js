(()=>{var e={};e.id=141,e.ids=[141],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},2361:e=>{"use strict";e.exports=require("events")},7147:e=>{"use strict";e.exports=require("fs")},3685:e=>{"use strict";e.exports=require("http")},5158:e=>{"use strict";e.exports=require("http2")},1808:e=>{"use strict";e.exports=require("net")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")},7282:e=>{"use strict";e.exports=require("process")},2781:e=>{"use strict";e.exports=require("stream")},4404:e=>{"use strict";e.exports=require("tls")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},9233:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>o.a,__next_app__:()=>u,originalPathname:()=>c,pages:()=>p,routeModule:()=>x,tree:()=>d}),r(6090),r(3147),r(5866);var a=r(3191),i=r(8716),s=r(7922),o=r.n(s),n=r(5231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let d=["",{children:["pass-the-bowl",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,6090)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\pass-the-bowl\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,3147)),"C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],p=["C:\\Midhuna\\stray_pals_project01\\StrayPals-MEGA-v15.4\\next-app\\src\\app\\pass-the-bowl\\page.tsx"],c="/pass-the-bowl/page",u={require:r,loadChunk:()=>Promise.resolve()},x=new a.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/pass-the-bowl/page",pathname:"/pass-the-bowl",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},5368:(e,t,r)=>{Promise.resolve().then(r.bind(r,2334))},9436:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});let a=(0,r(2881).Z)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]])},2334:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>b});var a=r(326),i=r(7577),s=r(5047),o=r(5535);function n({setCurrentPage:e,userAvailability:t,setUserAvailability:r,requests:n}){let l=(0,s.useRouter)(),[d,p]=(0,i.useState)({location:"",radius:""}),[c,u]=(0,i.useState)(!1),[x,g]=(0,i.useState)(!1),b=async()=>{if(!d.location||!d.radius){alert("Please enter location and radius");return}g(!0),await (0,o.cr)({isAvailable:!0,location:d.location,radius:d.radius}),r({isAvailable:!0,location:d.location,radius:d.radius}),g(!1),u(!1)},h=async()=>{g(!0),await (0,o.cr)({isAvailable:!1,location:t.location,radius:t.radius}),r({...t,isAvailable:!1}),g(!1)},m=n?.filter(e=>"pending"===e.status)?.length||0;return(0,a.jsxs)(a.Fragment,{children:[a.jsx("style",{children:`
    /* ---------- TABLET (max-width: 1024px) ---------- */
    @media (max-width: 1024px) {

      .avail-title {
        font-size: 32px !important;
        margin-bottom: 20px !important; /* reduce space after title */
      }

      .avail-sub {
        font-size: 14px !important;
        margin-top: 6px !important; /* reduce space after description */
      }

      .status-text {
        font-size: 16px !important;
      }

      .status-sub {
        font-size: 12px !important;
      }

      .go-btn {
        padding: 8px 16px !important;
        font-size: 13px !important;
        margin-top: 10px !important;
      }

      .action-grid {
        grid-template-columns: 1fr !important;
      }

      .action-btn {
        padding: 12px !important;
        font-size: 14px !important;
      }
    }

    /* ---------- MOBILE (max-width: 640px) ---------- */
    @media (max-width: 640px) {

      .status-row {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 14px !important;
      }

      .go-btn {
        width: fit-content !important;
        padding: 8px 14px !important;
        font-size: 12px !important;
      }

      .avail-title {
        font-size: 26px !important;
        margin-bottom: 16px !important; /* smaller space on mobile */
      }

      .avail-sub {
        font-size: 13px !important;
        margin-top: 4px !important; /* smaller space on mobile */
      }

      .action-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }

      .action-btn {
        font-size: 13px !important;
        padding: 12px !important;
        border-radius: 10px !important;
      }

      .availability-page {
        margin-top:50px !important;
        margin-bottom: 50px !important;
        padding: 20px 16px !important; /* reduce page padding for mobile */
      }
        .card-online{
        padding: 18px !important;
        }
    }
  `}),a.jsx("div",{className:"availability-page",style:{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},children:(0,a.jsxs)("div",{style:{maxWidth:1100,margin:"0 auto"},children:[(0,a.jsxs)("div",{style:{marginBottom:20},children:[a.jsx("h1",{className:"avail-title",style:{fontFamily:"Playfair Display",fontSize:42,fontWeight:700,margin:0},children:"Availability"}),a.jsx("p",{className:"avail-sub",style:{color:"rgba(255,255,255,0.55)",marginTop:10,maxWidth:600,lineHeight:1.6},children:"Set your availability so nearby people can request your help for stray animals."})]}),(0,a.jsxs)("div",{className:"card-online",style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:24,boxShadow:"0 12px 40px rgba(0,0,0,0.6)"},children:[(0,a.jsxs)("div",{className:"status-row",style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[a.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:t.isAvailable?"#d8c48d":"#64748b"}}),(0,a.jsxs)("div",{children:[a.jsx("div",{className:"status-text",style:{fontSize:18,fontWeight:700,color:t.isAvailable?"#d8c48d":"rgba(255,255,255,0.6)"},children:t.isAvailable?"You Are Online":"You Are Offline"}),a.jsx("div",{className:"status-sub",style:{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4},children:t.isAvailable?`${t.location} • ${t.radius}`:"Go online to appear for helpers near you"})]})]}),t.isAvailable?a.jsx("button",{className:"go-btn",onClick:h,disabled:x,style:{padding:"10px 18px",background:"#0f172a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",cursor:"pointer"},children:x?"Saving...":"Go Offline"}):a.jsx("button",{className:"go-btn",onClick:()=>u(!0),style:{padding:"10px 18px",background:"linear-gradient(135deg,#b89c58,#d8c48d)",color:"#000",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer"},children:"Go Online"})]}),c&&!t.isAvailable&&(0,a.jsxs)("div",{style:{marginBottom:20,marginTop:10},children:[a.jsx("label",{style:{fontSize:14},children:"Location"}),a.jsx("div",{style:{display:"flex",gap:8,alignItems:"center",marginTop:6},children:a.jsx("input",{type:"text",placeholder:"Enter your location",value:d.location,onChange:e=>p({...d,location:e.target.value}),style:{width:"100%",padding:"12px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff"}})}),a.jsx("label",{style:{marginTop:16,display:"block",fontSize:14},children:"Radius"}),(0,a.jsxs)("select",{value:d.radius,onChange:e=>p({...d,radius:e.target.value}),style:{width:"100%",padding:"12px",borderRadius:10,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",marginTop:6,appearance:"none",cursor:"pointer"},children:[a.jsx("option",{value:"2km",style:{background:"#000"},children:"2 km"}),a.jsx("option",{value:"5km",style:{background:"#000"},children:"5 km"}),a.jsx("option",{value:"10km",style:{background:"#000"},children:"10 km"}),a.jsx("option",{value:"15km",style:{background:"#000"},children:"15 km"})]}),(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:20},children:[a.jsx("button",{onClick:()=>u(!1),style:{padding:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#fff",borderRadius:10,fontWeight:600,cursor:"pointer"},children:"Cancel"}),a.jsx("button",{onClick:b,disabled:x,style:{padding:14,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",borderRadius:10,fontWeight:600,cursor:"pointer"},children:x?"Saving...":"Confirm"})]})]})]}),(0,a.jsxs)("div",{className:"action-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12},children:[a.jsx("button",{className:"action-btn",onClick:()=>l.push("/available-helpers"),style:{padding:14,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"#fff",borderRadius:12,cursor:"pointer",fontWeight:600},children:"Find Helpers"}),(0,a.jsxs)("button",{className:"action-btn",onClick:()=>l.push("/requests"),style:{padding:14,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"#fff",borderRadius:12,fontWeight:600,cursor:"pointer",position:"relative"},children:["My Requests",m>0&&a.jsx("span",{style:{position:"absolute",top:-8,right:-8,background:"#ef4444",width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,border:"2px solid #000"},children:m})]})]})]})})]})}let l=(0,r(2881).Z)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);var d=r(9669),p=r(7636),c=r(9436);function u({setCurrentPage:e,selectedHelper:t,helpRequest:r,setHelpRequest:i}){return(0,a.jsxs)("div",{style:{maxWidth:700,margin:"0 auto"},children:[(0,a.jsxs)("button",{onClick:()=>e("available-helpers"),style:{display:"flex",gap:8,background:"none",color:"#10b981"},children:[a.jsx(l,{size:20})," Back"]}),(0,a.jsxs)("div",{style:{backgroundColor:"#1e293b",padding:24,borderRadius:12},children:[a.jsx("h2",{children:"Send Request"}),(0,a.jsxs)("p",{children:["Requesting help from ",a.jsx("b",{style:{color:"#10b981"},children:t?.name})]}),a.jsx("label",{children:"Stray Name *"}),a.jsx("input",{type:"text",value:r.strayName,onChange:e=>i({...r,strayName:e.target.value}),style:{width:"100%",padding:12,background:"#0f172a",borderRadius:8,border:"1px solid #334155",color:"white"}}),a.jsx("label",{style:{marginTop:12},children:"Task Type *"}),(0,a.jsxs)("select",{value:r.taskType,onChange:e=>i({...r,taskType:e.target.value}),style:{width:"100%",padding:12,background:"#0f172a",borderRadius:8,border:"1px solid #334155",color:"white"},children:[a.jsx("option",{value:"",children:"Select task type"}),a.jsx("option",{value:"Feeding",children:"Feeding"}),a.jsx("option",{value:"Medical Help",children:"Medical Help"}),a.jsx("option",{value:"Rescue",children:"Rescue"})]}),a.jsx("label",{style:{marginTop:12},children:"Location *"}),a.jsx("input",{type:"text",value:r.location,onChange:e=>i({...r,location:e.target.value}),style:{width:"100%",padding:12,background:"#0f172a",borderRadius:8,border:"1px solid #334155",color:"white"}}),a.jsx("label",{style:{marginTop:12},children:"Description *"}),a.jsx("textarea",{rows:4,value:r.description,onChange:e=>i({...r,description:e.target.value}),style:{width:"100%",padding:12,background:"#0f172a",borderRadius:8,border:"1px solid #334155",color:"white"}}),a.jsx("label",{style:{marginTop:12},children:"Photo"}),r.photoPreview?(0,a.jsxs)("div",{style:{position:"relative"},children:[a.jsx("img",{src:r.photoPreview,style:{width:"100%",borderRadius:8}}),a.jsx("button",{onClick:()=>i({...r,photo:null,photoPreview:null}),style:{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.7)",borderRadius:"50%",padding:6},children:a.jsx(d.Z,{color:"white"})})]}):(0,a.jsxs)("label",{style:{background:"#0f172a",display:"flex",flexDirection:"column",alignItems:"center",padding:16,border:"2px dashed #334155",borderRadius:8,cursor:"pointer"},children:[a.jsx(p.Z,{size:24,color:"#94a3b8"}),"Upload image",a.jsx("input",{hidden:!0,type:"file",accept:"image/*",onChange:e=>{let t=e.target.files[0];t&&i({...r,photo:t,photoPreview:URL.createObjectURL(t)})}})]}),(0,a.jsxs)("button",{onClick:()=>e("available-helpers"),style:{width:"100%",padding:14,marginTop:16,background:"#10b981",borderRadius:10,border:"none",color:"white",fontSize:16,fontWeight:600,display:"flex",justifyContent:"center",gap:8},children:[a.jsx(c.Z,{})," Send Request"]})]})]})}var x=r(926),g=r(6881);function b(){(0,s.useRouter)();let[e,t]=(0,i.useState)("availability"),[r,o]=(0,i.useState)(null),[l,d]=(0,i.useState)(!0),[p,c]=(0,i.useState)({isAvailable:!1,location:"",radius:""}),[b,h]=(0,i.useState)({strayName:"",taskType:"",location:"",urgency:"normal",description:"",photo:null,photoPreview:null}),[m,y]=(0,i.useState)([]);return l?a.jsx(g.Z,{}):(0,a.jsxs)("div",{style:{marginTop:"100px",marginBottom:"50px",minHeight:"100vh",position:"relative",overflow:"hidden"},children:["availability"===e&&a.jsx(n,{setCurrentPage:t,userAvailability:p,setUserAvailability:c,requests:m}),"send-request"===e&&a.jsx(u,{setCurrentPage:t,selectedHelper:r,helpRequest:b,setHelpRequest:h}),"requests"===e&&a.jsx(x.Z,{requests:m,handleRequestAction:(e,t)=>{y(r=>r.map(r=>r.id===e?{...r,status:t}:r))}})]})}},6090:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>o,__esModule:()=>s,default:()=>n});var a=r(8570);let i=(0,a.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\pass-the-bowl\page.tsx`),{__esModule:s,$$typeof:o}=i;i.default;let n=(0,a.createProxy)(String.raw`C:\Midhuna\stray_pals_project01\StrayPals-MEGA-v15.4\next-app\src\app\pass-the-bowl\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[405,198,414,557],()=>r(9233));module.exports=a})();