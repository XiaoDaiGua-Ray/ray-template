import{A as S,u as A,a as x,b as $}from"./hooks-tayE4ZeM.js";import{c as l}from"./currency.js@2.0.4-9OAR_aOO.js";import"./dayjs@1.11.10-BYZwCyGy.js";import"./awesome-qr@2.1.5-rc.0-Ds7AaOTE.js";import"./vue-hooks-plus@1.8.8_vue@3.4.21-C_BRgauB.js";import"./lodash@4.17.21-CM7ROh5r.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DuGDi0R7.js";import"./print-js@1.6.0-C3lAJnMa.js";import{c as _}from"./lodash-es@4.17.21-C8H4BJij.js";var w=(e=>(e.Windows="Windows",e.MacOS="MacOS",e.Linux="Linux",e.Android="Android",e.IOS="IOS",e.Unknown="Unknown",e))(w||{}),v={VITE_APP_URL:"/",VITE_APP_OFFICE_PROXY_URL:"https://office.yka.one/",VITE_APP_OFFICE_SCRIPT_URL:"https://office.yka.one/web-apps/apps/api/documents/api.js",BASE_URL:"/ray-template/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const M=()=>v,C=(e,r)=>{const t=document.createElement("a");t.href=e,t.download=r,t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},y=(e,r)=>Object.prototype.toString.call(e).includes(r),X=(e=16,r=62)=>{const t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),n=[],o=window.crypto||window.msCrypto;let i=0;for(i=0;i<e;i++){const s=new Uint32Array(1);o.getRandomValues(s);const a=s[0]%r;n.push(t[a])}return n.join("")},J=(e,r)=>new Promise((t,n)=>{let o;try{if(typeof e=="string")return C(e,r),t();if(e instanceof ArrayBuffer)o=new Blob([new Uint8Array(e)],{type:"application/octet-stream"});else if(e instanceof File||e instanceof Blob)o=e;else return n(new Error("downloadAnyFile: Unsupported data type."));const i=URL.createObjectURL(o),s=document.createElement("a");s.href=i,s.download=r,s.style.display="none";const a=()=>{URL.revokeObjectURL(i),document.body.removeChild(s)};s.addEventListener("load",()=>(a(),t())),s.addEventListener("error",c=>(a(),n(c))),document.body.appendChild(s),s.click()}catch(i){return n(i)}});function k(e,r,...t){if(!e)return{};let n=Array.isArray(r)?r:[r];return n=[...n,...t],n.length&&n.forEach(o=>{delete e[o]}),e}function Y(e,r,...t){if(!e)return{};const n=Array.isArray(r)?r:[r];return n.length?[...n,...t].reduce((i,s)=>(Reflect.has(e,s)&&(i[s]=e[s]),i),{}):e}const G=()=>{const e=navigator.userAgent;return/windows/i.test(e)?w.Windows:/macintosh|mac os x/i.test(e)?w.MacOS:/linux/i.test(e)?w.Linux:/android/i.test(e)?w.Android:/iphone|ipad|ipod/i.test(e)?w.IOS:w.Unknown},H=(e,r)=>{const t=e.split("?").filter(Boolean)[0],n=r.split("?").filter(Boolean)[0],o=/\/$/;return t.replace(o,"")===n.replace(o,"")};function O(e,r="sessionStorage",t){const{prefix:n,prefixKey:o}=t??{},i=n?o||S:"",s=r==="localStorage"?window.localStorage:window.sessionStorage;return!!Object.keys(s).find(a=>a===i+e)}function Q(e,r,t="sessionStorage",n){if(!e){console.error(`[setStorage]: Failed to set stored data: key ${e} is empty`);return}const{prefix:o,prefixKey:i}=n??{},s=o?i||S:"";try{const a=JSON.stringify(r);t==="localStorage"?window.localStorage.setItem(s+e,a):window.sessionStorage.setItem(s+e,a)}catch(a){console.error(`[setStorage]: Failed to set stored data for key '${e}'`,a)}}function Z(e,r="sessionStorage",t){const{prefix:n,prefixKey:o,defaultValue:i}=t??{},s=n?o||S:"";try{const a=r==="localStorage"?window.localStorage.getItem(s+e):window.sessionStorage.getItem(s+e);return a===null?i??null:JSON.parse(a)}catch(a){return console.error(`[getStorage]: Failed to get stored data for key '${e}'`,a),i??null}}const z=(e,r,t)=>{if(!e){console.error(`[removeStorage]: Failed to remove stored data: key ${e} is empty or undefined`);return}const{prefix:n,prefixKey:o}=t??{},i=n?o||S:"",s=Object.keys(window.localStorage),a=Object.keys(window.sessionStorage),c=(f,m)=>{(f?[...a,...s]:m==="localStorage"?s:a).forEach(p=>{e==="__all__"?(window.sessionStorage.removeItem(i+p),window.localStorage.removeItem(i+p)):m==="localStorage"?window.localStorage.removeItem(i+p):window.sessionStorage.removeItem(i+p)})};switch(e){case"__all__":c(!0);break;case"__all_sessionStorage__":c(!1,"sessionStorage");break;case"__all_localStorage__":c(!1,"localStorage");break;default:r==="localStorage"?window.localStorage.removeItem(i+e):window.sessionStorage.removeItem(i+e);break}},N=(e,r)=>{var i;const{domToImageOptions:t,printOptions:n}=r??{},{create:o}=A(e,{...t,beforeCreate:s=>{var a,c;(a=t==null?void 0:t.beforeCreate)==null||a.call(t,s),(c=window.$loadingBar)==null||c.start()},created(s,a){var c,f;(c=t==null?void 0:t.created)==null||c.call(t,s,a),(f=window.$loadingBar)==null||f.finish()},createdError(s){var a,c;(a=t==null?void 0:t.createdError)==null||a.call(t,s),(c=window.$loadingBar)==null||c.error()}});(i=o("jpeg"))==null||i.then(s=>{const{print:a}=x(s,{type:"image",base64:!0,targetStyles:["*"],...k(n,["type","base64"])});a()})},T=(e,r)=>{const t=()=>{const o=d(e);o&&(typeof r=="string"?r.trim().split(" "):r).forEach(s=>{s&&o.classList.add(s)})},n=Vue.watch(()=>d(e),t,{immediate:!0});h(n)},ee=(e,r)=>{const t=()=>{const o=d(e);if(o)if(r==="removeAllClass"){const i=o.classList;i.forEach(s=>i.remove(s))}else(typeof r=="string"?r.trim().split(" "):r).forEach(s=>{s&&o.classList.remove(s)})},n=Vue.watch(()=>d(e),t,{immediate:!0});h(n)},te=(e,r)=>{const t=Vue.ref(!1),n=()=>{const i=d(e);if(!i)t.value=!1;else{const s=i.className,a=typeof r=="string"?r.trim().split(" ").filter(c=>c!==""):r;t.value=a.some(c=>s.includes(c))}},o=Vue.watch(()=>d(e),n,{immediate:!0});return h(o),t},P=e=>{const r=["webkit","moz","ms","o"],t={};return r.forEach(n=>{t[`${n}${e.charAt(0).toUpperCase()}${e.slice(1)}`]=e}),t[e]=e,t},re=(e,r)=>{const t=(i,s)=>{i.split(";").forEach(a=>{const[c,f]=a.split(":");if(c&&f){const m=c.trim(),b=f.trim();if(c.startsWith("--"))s.style.setProperty(m,b);else if(c.startsWith("-"))s.style[c]=f;else{const p=P(m);Object.keys(p).forEach(E=>{s.style[E]=p[E]}),s.style[m]=b}}})},n=()=>{const i=d(e);i&&(y(r,"String")?t(r,i):y(r,"Array")?r.forEach(s=>{t(s,i)}):Object.keys(r).forEach(a=>{t(`${a}: ${r[a]}`,i)}))},o=Vue.watch(()=>d(e),n,{immediate:!0});h(o)},ne=(e,r=1)=>{if(e.includes("rgba"))return e;if(e.includes("rgb"))return e.replace("rgb","rgba").replace(")",`, ${r})`);if(e.includes("#")){const t=e.replace("#","");switch(t.length){case 3:return`rgba(${parseInt(t[0]+t[0],16)}, ${parseInt(t[1]+t[1],16)}, ${parseInt(t[2]+t[2],16)}, ${r})`;case 6:return`rgba(${parseInt(t.slice(0,2),16)}, ${parseInt(t.slice(2,4),16)}, ${parseInt(t.slice(4,6),16)}, ${r})`;case 8:return`rgba(${parseInt(t.slice(0,2),16)}, ${parseInt(t.slice(2,4),16)}, ${parseInt(t.slice(4,6),16)}, ${(parseInt(t.slice(6,8),16)/255).toFixed(2)})`;default:return e}}return e},se=(e,r)=>{const{defaultElement:t}=r||{};if(!e)return t?[t]:null;const n=e.startsWith("attr:")?`[${e.replace("attr:","")}]`:e;try{const o=Array.from(document.querySelectorAll(n));return!o.length&&t?[t]:o}catch(o){return console.error(`[queryElements]: Failed to get elements for selector '${e}'`,o),t?[t]:null}},oe=(e,r="px")=>typeof e=="number"?e.toString()+r:y(e,"String")&&$.cssUnit.test(e)?e:e+r,u={precision:8,decimal:"."},g=(e,r,t)=>e!=null&&e.length?e.length===1?l(e[0],u):e.reduce((o,i,s,a)=>(o=t==null?void 0:t(o,i,s,a),o),r):0,I=(e,r)=>{const t=Object.assign({},u,r),n=l(e,t),{type:o="number"}=t;return o==="number"?n.value:n.toString()},ie=(...e)=>e.length===1?l(e[0],u).add(0):g(e,0,(r,t)=>l(r,u).add(t)),ae=(...e)=>{if(e.length===1)return l(e[0],u).subtract(0);if(e.length===2){const[n,o]=e;return l(n,u).subtract(o)}const r=_(e),t=r.shift();return r.length?g(r,t,(n,o)=>l(n,u).subtract(o)):t},ce=(...e)=>e.length===1?l(e[0],u).multiply(1):g(e,1,(r,t)=>l(r,u).multiply(t)),le=(...e)=>{if(e.length===1)return l(e[0],u).divide(1);if(e.length===2){const[n,o]=e;return l(n,u).divide(o)}const r=_(e),t=r.shift();return g(r,t,(n,o)=>l(n,u).divide(o))},ue=(e,r,t)=>{if(r<=1)return[e||0];if(!e)return new Array(r).fill(0);const n=Object.assign({},u,t);return l(e,n).distribute(r).map(i=>I(i,n))};function R(e,...r){if(Array.isArray(e))e.forEach(t=>R(t,...r));else return e(...r)}function d(e,r){var n;if(!e)return r;let t;return typeof e=="function"?t=e():Vue.isRef(e)?t=((n=e.value)==null?void 0:n.$el)??e.value:t=e,t}function fe(e,r){if(!e){const{defaultElement:t=null}=r??{};return typeof t=="function"?t:()=>t}if(typeof e=="string"||y(e,"Object"))return()=>e;if(typeof e=="function")return e}function h(e){return Vue.getCurrentScope()?(Vue.onScopeDispose(e),!0):!1}function de(e,r){const t=Vue.watchEffect(e,r);h(t)}export{I as A,ue as B,ie as C,ae as D,ce as E,le as F,oe as a,R as b,ne as c,C as d,J as e,Y as f,Z as g,H as h,y as i,z as j,M as k,ee as l,T as m,G as n,te as o,N as p,se as q,fe as r,Q as s,h as t,X as u,d as v,de as w,k as x,re as y,O as z};
