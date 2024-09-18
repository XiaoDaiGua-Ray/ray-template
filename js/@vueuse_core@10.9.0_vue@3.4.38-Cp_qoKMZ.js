import{n as D,t as E,i as H,a as N,w as k,b as z,c as B,d as F,e as Q}from"./@vueuse_shared@10.9.0_vue@3.4.38-BTLxKjPf.js";function b(e){var r;const n=E(e);return(r=n==null?void 0:n.$el)!=null?r:n}const g=B?window:void 0;function V(...e){let r,n,i,a;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,i,a]=e,r=g):[r,n,i,a]=e,!r)return D;Array.isArray(n)||(n=[n]),Array.isArray(i)||(i=[i]);const s=[],l=()=>{s.forEach(m=>m()),s.length=0},f=(m,u,t,o)=>(m.addEventListener(u,t,o),()=>m.removeEventListener(u,t,o)),p=VueDemi.watch(()=>[b(r),E(a)],([m,u])=>{if(l(),!m)return;const t=H(u)?{...u}:u;s.push(...n.flatMap(o=>i.map(c=>f(m,o,c,t))))},{immediate:!0,flush:"post"}),v=()=>{p(),l()};return N(v),v}let T=!1;function ne(e,r,n={}){const{window:i=g,ignore:a=[],capture:s=!0,detectIframe:l=!1}=n;if(!i)return D;Q&&!T&&(T=!0,Array.from(i.document.body.children).forEach(t=>t.addEventListener("click",D)),i.document.documentElement.addEventListener("click",D));let f=!0;const p=t=>a.some(o=>{if(typeof o=="string")return Array.from(i.document.querySelectorAll(o)).some(c=>c===t.target||t.composedPath().includes(c));{const c=b(o);return c&&(t.target===c||t.composedPath().includes(c))}}),m=[V(i,"click",t=>{const o=b(e);if(!(!o||o===t.target||t.composedPath().includes(o))){if(t.detail===0&&(f=!p(t)),!f){f=!0;return}r(t)}},{passive:!0,capture:s}),V(i,"pointerdown",t=>{const o=b(e);f=!p(t)&&!!(o&&!t.composedPath().includes(o))},{passive:!0}),l&&V(i,"blur",t=>{setTimeout(()=>{var o;const c=b(e);((o=i.document.activeElement)==null?void 0:o.tagName)==="IFRAME"&&!(c!=null&&c.contains(i.document.activeElement))&&r(t)},0)})].filter(Boolean);return()=>m.forEach(t=>t())}function Y(){const e=VueDemi.ref(!1),r=VueDemi.getCurrentInstance();return r&&VueDemi.onMounted(()=>{e.value=!0},VueDemi.isVue2?null:r),e}function W(e){const r=Y();return VueDemi.computed(()=>(r.value,!!e()))}function q(e,r={}){const{window:n=g}=r,i=W(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function");let a;const s=VueDemi.ref(!1),l=v=>{s.value=v.matches},f=()=>{a&&("removeEventListener"in a?a.removeEventListener("change",l):a.removeListener(l))},p=VueDemi.watchEffect(()=>{i.value&&(f(),a=n.matchMedia(E(e)),"addEventListener"in a?a.addEventListener("change",l):a.addListener(l),s.value=a.matches)});return N(()=>{p(),f(),a=void 0}),s}const M=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},_="__vueuse_ssr_handlers__",K=$();function $(){return _ in M||(M[_]=M[_]||{}),M[_]}function G(e,r){return K[e]||r}function U(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const X={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},C="vueuse-storage";function re(e,r,n,i={}){var a;const{flush:s="pre",deep:l=!0,listenToStorageChanges:f=!0,writeDefaults:p=!0,mergeDefaults:v=!1,shallow:m,window:u=g,eventFilter:t,onError:o=d=>{console.error(d)},initOnMounted:c}=i,y=(m?VueDemi.shallowRef:VueDemi.ref)(r);if(!n)try{n=G("getDefaultStorage",()=>{var d;return(d=g)==null?void 0:d.localStorage})()}catch(d){o(d)}if(!n)return y;const h=E(r),O=U(h),A=(a=i.serializer)!=null?a:X[O],{pause:P,resume:L}=k(y,()=>J(y.value),{flush:s,deep:l,eventFilter:t});u&&f&&z(()=>{V(u,"storage",I),V(u,C,x),c&&I()}),c||I();function R(d,w){u&&u.dispatchEvent(new CustomEvent(C,{detail:{key:e,oldValue:d,newValue:w,storageArea:n}}))}function J(d){try{const w=n.getItem(e);if(d==null)R(w,null),n.removeItem(e);else{const S=A.write(d);w!==S&&(n.setItem(e,S),R(w,S))}}catch(w){o(w)}}function j(d){const w=d?d.newValue:n.getItem(e);if(w==null)return p&&h!=null&&n.setItem(e,A.write(h)),h;if(!d&&v){const S=A.read(w);return typeof v=="function"?v(S,h):O==="object"&&!Array.isArray(S)?{...h,...S}:S}else return typeof w!="string"?w:A.read(w)}function I(d){if(!(d&&d.storageArea!==n)){if(d&&d.key==null){y.value=h;return}if(!(d&&d.key!==e)){P();try{(d==null?void 0:d.newValue)!==A.write(y.value)&&(y.value=j(d))}catch(w){o(w)}finally{d?VueDemi.nextTick(L):L()}}}}function x(d){I(d.detail)}return y}function Z(e,r,n={}){const{window:i=g,...a}=n;let s;const l=W(()=>i&&"MutationObserver"in i),f=()=>{s&&(s.disconnect(),s=void 0)},p=VueDemi.computed(()=>{const t=E(e),o=(Array.isArray(t)?t:[t]).map(b).filter(F);return new Set(o)}),v=VueDemi.watch(()=>p.value,t=>{f(),l.value&&i&&t.size&&(s=new MutationObserver(r),t.forEach(o=>s.observe(o,a)))},{immediate:!0,flush:"post"}),m=()=>s==null?void 0:s.takeRecords(),u=()=>{f(),v()};return N(u),{isSupported:l,stop:u,takeRecords:m}}function ee(e,r,n={}){const{window:i=g,...a}=n;let s;const l=W(()=>i&&"ResizeObserver"in i),f=()=>{s&&(s.disconnect(),s=void 0)},p=VueDemi.computed(()=>Array.isArray(e)?e.map(u=>b(u)):[b(e)]),v=VueDemi.watch(p,u=>{if(f(),l.value&&i){s=new ResizeObserver(r);for(const t of u)t&&s.observe(t,a)}},{immediate:!0,flush:"post"}),m=()=>{f(),v()};return N(m),{isSupported:l,stop:m}}function ie(e,r={}){const{reset:n=!0,windowResize:i=!0,windowScroll:a=!0,immediate:s=!0}=r,l=VueDemi.ref(0),f=VueDemi.ref(0),p=VueDemi.ref(0),v=VueDemi.ref(0),m=VueDemi.ref(0),u=VueDemi.ref(0),t=VueDemi.ref(0),o=VueDemi.ref(0);function c(){const y=b(e);if(!y){n&&(l.value=0,f.value=0,p.value=0,v.value=0,m.value=0,u.value=0,t.value=0,o.value=0);return}const h=y.getBoundingClientRect();l.value=h.height,f.value=h.bottom,p.value=h.left,v.value=h.right,m.value=h.top,u.value=h.width,t.value=h.x,o.value=h.y}return ee(e,c),VueDemi.watch(()=>b(e),y=>!y&&c()),Z(e,c,{attributeFilter:["style","class"]}),a&&V("scroll",c,{capture:!0,passive:!0}),i&&V("resize",c,{passive:!0}),z(()=>{s&&c()}),{height:l,bottom:f,left:p,right:v,top:m,width:u,x:t,y:o,update:c}}function oe(e,r,n={}){const{root:i,rootMargin:a="0px",threshold:s=.1,window:l=g,immediate:f=!0}=n,p=W(()=>l&&"IntersectionObserver"in l),v=VueDemi.computed(()=>{const c=E(e);return(Array.isArray(c)?c:[c]).map(b).filter(F)});let m=D;const u=VueDemi.ref(f),t=p.value?VueDemi.watch(()=>[v.value,b(i),u.value],([c,y])=>{if(m(),!u.value||!c.length)return;const h=new IntersectionObserver(r,{root:b(y),rootMargin:a,threshold:s});c.forEach(O=>O&&h.observe(O)),m=()=>{h.disconnect(),m=D}},{immediate:f,flush:"post"}):D,o=()=>{m(),t(),u.value=!1};return N(o),{isSupported:p,isActive:u,pause(){m(),u.value=!1},resume(){u.value=!0},stop:o}}function se(e={}){const{window:r=g,initialWidth:n=Number.POSITIVE_INFINITY,initialHeight:i=Number.POSITIVE_INFINITY,listenOrientation:a=!0,includeScrollbar:s=!0}=e,l=VueDemi.ref(n),f=VueDemi.ref(i),p=()=>{r&&(s?(l.value=r.innerWidth,f.value=r.innerHeight):(l.value=r.document.documentElement.clientWidth,f.value=r.document.documentElement.clientHeight))};if(p(),z(p),V("resize",p,{passive:!0}),a){const v=q("(orientation: portrait)");VueDemi.watch(v,()=>p())}return{width:l,height:f}}export{oe as a,ee as b,ie as c,re as d,se as e,ne as o,V as u};