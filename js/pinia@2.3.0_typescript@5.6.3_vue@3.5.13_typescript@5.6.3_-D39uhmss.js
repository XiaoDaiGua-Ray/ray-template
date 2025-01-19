import{k as M,m as V,z,e as G,a as E,A as B,d as $,u as T,v as tt,x as et}from"./@vue_reactivity@3.5.13-CVvlldVq.js";import{i as st,w as nt,k as ot,n as ct,f as rt}from"./@vue_runtime-core@3.5.13-pPpmd6wL.js";/*!
 * pinia v2.3.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */let D;const k=t=>D=t,J=Symbol();function L(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var p;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(p||(p={}));function St(){const t=z(!0),c=t.run(()=>M({}));let s=[],e=[];const r=V({install(u){k(r),r._a=u,u.provide(J,r),u.config.globalProperties.$pinia=r,e.forEach(f=>s.push(f)),e=[]},use(u){return this._a?s.push(u):e.push(u),this},_p:s,_a:null,_e:t,_s:new Map,state:c});return r}const K=()=>{};function F(t,c,s,e=K){t.push(c);const r=()=>{const u=t.indexOf(c);u>-1&&(t.splice(u,1),e())};return!s&&T()&&tt(r),r}function P(t,...c){t.slice().forEach(s=>{s(...c)})}const ut=t=>t(),H=Symbol(),I=Symbol();function O(t,c){t instanceof Map&&c instanceof Map?c.forEach((s,e)=>t.set(e,s)):t instanceof Set&&c instanceof Set&&c.forEach(t.add,t);for(const s in c){if(!c.hasOwnProperty(s))continue;const e=c[s],r=t[s];L(r)&&L(e)&&t.hasOwnProperty(s)&&!E(e)&&!B(e)?t[s]=O(r,e):t[s]=e}return t}const at=Symbol();function ft(t){return!L(t)||!t.hasOwnProperty(at)}const{assign:y}=Object;function it(t){return!!(E(t)&&t.effect)}function lt(t,c,s,e){const{state:r,actions:u,getters:f}=c,a=s.state.value[t];let C;function b(){a||(s.state.value[t]=r?r():{});const S=et(s.state.value[t]);return y(S,u,Object.keys(f||{}).reduce((v,m)=>(v[m]=V(rt(()=>{k(s);const _=s._s.get(t);return f[m].call(_,_)})),v),{}))}return C=q(t,b,c,s,e,!0),C}function q(t,c,s={},e,r,u){let f;const a=y({actions:{}},s),C={deep:!0};let b,S,v=[],m=[],_;const d=e.state.value[t];!u&&!d&&(e.state.value[t]={}),M({});let W;function N(o){let n;b=S=!1,typeof o=="function"?(o(e.state.value[t]),n={type:p.patchFunction,storeId:t,events:_}):(O(e.state.value[t],o),n={type:p.patchObject,payload:o,storeId:t,events:_});const i=W=Symbol();ct().then(()=>{W===i&&(b=!0)}),S=!0,P(v,n,e.state.value[t])}const Q=u?function(){const{state:n}=s,i=n?n():{};this.$patch(j=>{y(j,i)})}:K;function U(){f.stop(),v=[],m=[],e._s.delete(t)}const A=(o,n="")=>{if(H in o)return o[I]=n,o;const i=function(){k(e);const j=Array.from(arguments),w=[],R=[];function Y(l){w.push(l)}function Z(l){R.push(l)}P(m,{args:j,name:i[I],store:h,after:Y,onError:Z});let x;try{x=o.apply(this&&this.$id===t?this:h,j)}catch(l){throw P(R,l),l}return x instanceof Promise?x.then(l=>(P(w,l),l)).catch(l=>(P(R,l),Promise.reject(l))):(P(w,x),x)};return i[H]=!0,i[I]=n,i},X={_p:e,$id:t,$onAction:F.bind(null,m),$patch:N,$reset:Q,$subscribe(o,n={}){const i=F(v,o,n.detached,()=>j()),j=f.run(()=>nt(()=>e.state.value[t],w=>{(n.flush==="sync"?S:b)&&o({storeId:t,type:p.direct,events:_},w)},y({},C,n)));return i},$dispose:U},h=G(X);e._s.set(t,h);const g=(e._a&&e._a.runWithContext||ut)(()=>e._e.run(()=>(f=z()).run(()=>c({action:A}))));for(const o in g){const n=g[o];if(E(n)&&!it(n)||B(n))u||(d&&ft(n)&&(E(n)?n.value=d[o]:O(n,d[o])),e.state.value[t][o]=n);else if(typeof n=="function"){const i=A(n,o);g[o]=i,a.actions[o]=n}}return y(h,g),y($(h),g),Object.defineProperty(h,"$state",{get:()=>e.state.value[t],set:o=>{N(n=>{y(n,o)})}}),e._p.forEach(o=>{y(h,f.run(()=>o({store:h,app:e._a,pinia:e,options:a})))}),d&&u&&s.hydrate&&s.hydrate(h.$state,d),b=!0,S=!0,h}/*! #__NO_SIDE_EFFECTS__ */function vt(t,c,s){let e,r;const u=typeof c=="function";typeof t=="string"?(e=t,r=u?s:c):(r=t,e=t.id);function f(a,C){const b=ot();return a=a||(b?st(J,null):null),a&&k(a),a=D,a._s.has(e)||(u?q(e,c,r,a):lt(e,r,a)),a._s.get(e)}return f.$id=e,f}export{St as c,vt as d};