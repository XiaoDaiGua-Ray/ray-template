import{d as S}from"./destr@2.0.3-CVtkxrq9.js";import{d as $,a as h}from"./deep-pick-omit@1.2.0-DyxInw53.js";function p(s,{storage:c,serializer:e,key:i,debug:t,pick:o,omit:d,beforeHydrate:a,afterHydrate:r},n,f=!0){try{f&&(a==null||a(n));const l=c.getItem(i);if(l){const u=e.deserialize(l),g=o?$(u,o):u,z=d?h(g,d):g;s.$patch(z)}f&&(r==null||r(n))}catch(l){t&&console.error("[pinia-plugin-persistedstate]",l)}}function m(s,{storage:c,serializer:e,key:i,debug:t,pick:o,omit:d}){try{const a=o?$(s,o):s,r=d?h(a,d):a,n=e.serialize(r);c.setItem(i,n)}catch(a){t&&console.error("[pinia-plugin-persistedstate]",a)}}function y(s,c,e=i=>i()){const{pinia:i,store:t,options:{persist:o}}=s;if(!o)return;if(!(t.$id in i.state.value)){const r=i._s.get(t.$id.replace("__hot:",""));r&&Promise.resolve().then(()=>r.$persist());return}const a=(Array.isArray(o)?o:o===!0?[{}]:[o]).map(c);t.$hydrate=({runHooks:r=!0}={})=>{a.forEach(n=>{e(()=>p(t,n,s,r))})},t.$persist=()=>{a.forEach(r=>{e(()=>m(t.$state,r))})},a.forEach(r=>{e(()=>p(t,r,s)),t.$subscribe((n,f)=>e(()=>m(f,r)),{detached:!0})})}function k(s={}){return function(c){y(c,e=>({key:(s.key?s.key:i=>i)(e.key??c.store.$id),debug:e.debug??s.debug??!1,serializer:e.serializer??s.serializer??{serialize:i=>JSON.stringify(i),deserialize:i=>S(i)},storage:e.storage??s.storage??window.localStorage,beforeHydrate:e.beforeHydrate,afterHydrate:e.afterHydrate,pick:e.pick,omit:e.omit}))}}var P=k();export{P as s};
