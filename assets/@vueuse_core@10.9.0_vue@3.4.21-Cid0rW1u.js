import{n as M,t as E,i as H,a as I,w as k,b as _,c as x,d as B,e as Q}from"./@vueuse_shared@10.9.0_vue@3.4.21-JDL3uqC1.js";function g(e){var n;const r=E(e);return(n=r==null?void 0:r.$el)!=null?n:r}const V=x?window:void 0;function S(...e){let n,r,i,a;if(typeof e[0]=="string"||Array.isArray(e[0])?([r,i,a]=e,n=V):[n,r,i,a]=e,!n)return M;Array.isArray(r)||(r=[r]),Array.isArray(i)||(i=[i]);const s=[],c=()=>{s.forEach(p=>p()),s.length=0},l=(p,f,t,o)=>(p.addEventListener(f,t,o),()=>p.removeEventListener(f,t,o)),m=VueDemi.watch(()=>[g(n),E(a)],([p,f])=>{if(c(),!p)return;const t=H(f)?{...f}:f;s.push(...r.flatMap(o=>i.map(d=>l(p,o,d,t))))},{immediate:!0,flush:"post"}),h=()=>{m(),c()};return I(h),h}let T=!1;function ne(e,n,r={}){const{window:i=V,ignore:a=[],capture:s=!0,detectIframe:c=!1}=r;if(!i)return M;Q&&!T&&(T=!0,Array.from(i.document.body.children).forEach(t=>t.addEventListener("click",M)),i.document.documentElement.addEventListener("click",M));let l=!0;const m=t=>a.some(o=>{if(typeof o=="string")return Array.from(i.document.querySelectorAll(o)).some(d=>d===t.target||t.composedPath().includes(d));{const d=g(o);return d&&(t.target===d||t.composedPath().includes(d))}}),p=[S(i,"click",t=>{const o=g(e);if(!(!o||o===t.target||t.composedPath().includes(o))){if(t.detail===0&&(l=!m(t)),!l){l=!0;return}n(t)}},{passive:!0,capture:s}),S(i,"pointerdown",t=>{const o=g(e);l=!m(t)&&!!(o&&!t.composedPath().includes(o))},{passive:!0}),c&&S(i,"blur",t=>{setTimeout(()=>{var o;const d=g(e);((o=i.document.activeElement)==null?void 0:o.tagName)==="IFRAME"&&!(d!=null&&d.contains(i.document.activeElement))&&n(t)},0)})].filter(Boolean);return()=>p.forEach(t=>t())}function Y(){const e=VueDemi.ref(!1),n=VueDemi.getCurrentInstance();return n&&VueDemi.onMounted(()=>{e.value=!0},VueDemi.isVue2?null:n),e}function z(e){const n=Y();return VueDemi.computed(()=>(n.value,!!e()))}function q(e,n={}){const{window:r=V}=n,i=z(()=>r&&"matchMedia"in r&&typeof r.matchMedia=="function");let a;const s=VueDemi.ref(!1),c=h=>{s.value=h.matches},l=()=>{a&&("removeEventListener"in a?a.removeEventListener("change",c):a.removeListener(c))},m=VueDemi.watchEffect(()=>{i.value&&(l(),a=r.matchMedia(E(e)),"addEventListener"in a?a.addEventListener("change",c):a.addListener(c),s.value=a.matches)});return I(()=>{m(),l(),a=void 0}),s}const A=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},N="__vueuse_ssr_handlers__",K=$();function $(){return N in A||(A[N]=A[N]||{}),A[N]}function G(e,n){return K[e]||n}function U(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const X={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},C="vueuse-storage";function re(e,n,r,i={}){var a;const{flush:s="pre",deep:c=!0,listenToStorageChanges:l=!0,writeDefaults:m=!0,mergeDefaults:h=!1,shallow:p,window:f=V,eventFilter:t,onError:o=u=>{console.error(u)},initOnMounted:d}=i,y=(p?VueDemi.shallowRef:VueDemi.ref)(typeof n=="function"?n():n);if(!r)try{r=G("getDefaultStorage",()=>{var u;return(u=V)==null?void 0:u.localStorage})()}catch(u){o(u)}if(!r)return y;const v=E(n),W=U(v),D=(a=i.serializer)!=null?a:X[W],{pause:F,resume:L}=k(y,()=>P(y.value),{flush:s,deep:c,eventFilter:t});f&&l&&_(()=>{S(f,"storage",O),S(f,C,j),d&&O()}),d||O();function R(u,w){f&&f.dispatchEvent(new CustomEvent(C,{detail:{key:e,oldValue:u,newValue:w,storageArea:r}}))}function P(u){try{const w=r.getItem(e);if(u==null)R(w,null),r.removeItem(e);else{const b=D.write(u);w!==b&&(r.setItem(e,b),R(w,b))}}catch(w){o(w)}}function J(u){const w=u?u.newValue:r.getItem(e);if(w==null)return m&&v!=null&&r.setItem(e,D.write(v)),v;if(!u&&h){const b=D.read(w);return typeof h=="function"?h(b,v):W==="object"&&!Array.isArray(b)?{...v,...b}:b}else return typeof w!="string"?w:D.read(w)}function O(u){if(!(u&&u.storageArea!==r)){if(u&&u.key==null){y.value=v;return}if(!(u&&u.key!==e)){F();try{(u==null?void 0:u.newValue)!==D.write(y.value)&&(y.value=J(u))}catch(w){o(w)}finally{u?VueDemi.nextTick(L):L()}}}}function j(u){O(u.detail)}return y}function Z(e,n,r={}){const{window:i=V,...a}=r;let s;const c=z(()=>i&&"MutationObserver"in i),l=()=>{s&&(s.disconnect(),s=void 0)},m=VueDemi.computed(()=>{const t=E(e),o=(Array.isArray(t)?t:[t]).map(g).filter(B);return new Set(o)}),h=VueDemi.watch(()=>m.value,t=>{l(),c.value&&i&&t.size&&(s=new MutationObserver(n),t.forEach(o=>s.observe(o,a)))},{immediate:!0,flush:"post"}),p=()=>s==null?void 0:s.takeRecords(),f=()=>{l(),h()};return I(f),{isSupported:c,stop:f,takeRecords:p}}function ee(e,n,r={}){const{window:i=V,...a}=r;let s;const c=z(()=>i&&"ResizeObserver"in i),l=()=>{s&&(s.disconnect(),s=void 0)},m=VueDemi.computed(()=>Array.isArray(e)?e.map(f=>g(f)):[g(e)]),h=VueDemi.watch(m,f=>{if(l(),c.value&&i){s=new ResizeObserver(n);for(const t of f)t&&s.observe(t,a)}},{immediate:!0,flush:"post"}),p=()=>{l(),h()};return I(p),{isSupported:c,stop:p}}function ie(e,n={}){const{reset:r=!0,windowResize:i=!0,windowScroll:a=!0,immediate:s=!0}=n,c=VueDemi.ref(0),l=VueDemi.ref(0),m=VueDemi.ref(0),h=VueDemi.ref(0),p=VueDemi.ref(0),f=VueDemi.ref(0),t=VueDemi.ref(0),o=VueDemi.ref(0);function d(){const y=g(e);if(!y){r&&(c.value=0,l.value=0,m.value=0,h.value=0,p.value=0,f.value=0,t.value=0,o.value=0);return}const v=y.getBoundingClientRect();c.value=v.height,l.value=v.bottom,m.value=v.left,h.value=v.right,p.value=v.top,f.value=v.width,t.value=v.x,o.value=v.y}return ee(e,d),VueDemi.watch(()=>g(e),y=>!y&&d()),Z(e,d,{attributeFilter:["style","class"]}),a&&S("scroll",d,{capture:!0,passive:!0}),i&&S("resize",d,{passive:!0}),_(()=>{s&&d()}),{height:c,bottom:l,left:m,right:h,top:p,width:f,x:t,y:o,update:d}}function oe(e={}){const{window:n=V,initialWidth:r=Number.POSITIVE_INFINITY,initialHeight:i=Number.POSITIVE_INFINITY,listenOrientation:a=!0,includeScrollbar:s=!0}=e,c=VueDemi.ref(r),l=VueDemi.ref(i),m=()=>{n&&(s?(c.value=n.innerWidth,l.value=n.innerHeight):(c.value=n.document.documentElement.clientWidth,l.value=n.document.documentElement.clientHeight))};if(m(),_(m),S("resize",m,{passive:!0}),a){const h=q("(orientation: portrait)");VueDemi.watch(h,()=>m())}return{width:c,height:l}}export{ee as a,oe as b,ie as c,re as d,ne as o,S as u};
