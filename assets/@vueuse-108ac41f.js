import{g as P,o as C,n as Q,u as A,a as S,b as T,r as O,w as W}from"./@vue-ca1d80d4.js";var v;const m=typeof window<"u",N=e=>typeof e=="string",x=()=>{};m&&((v=window==null?void 0:window.navigator)!=null&&v.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function E(e){return typeof e=="function"?e():A(e)}function H(e){return e}function L(e){return S()?(T(e),!0):!1}function B(e,n=!0){P()?C(e):n?e():Q(e)}function M(e){var n;const t=E(e);return(n=t==null?void 0:t.$el)!=null?n:t}const b=m?window:void 0;function y(...e){let n,t,r,o;if(N(e[0])||Array.isArray(e[0])?([t,r,o]=e,n=b):[n,t,r,o]=e,!n)return x;Array.isArray(t)||(t=[t]),Array.isArray(r)||(r=[r]);const u=[],a=()=>{u.forEach(i=>i()),u.length=0},l=(i,c,f,d)=>(i.addEventListener(c,f,d),()=>i.removeEventListener(c,f,d)),s=W(()=>[M(n),E(o)],([i,c])=>{a(),i&&u.push(...t.flatMap(f=>r.map(d=>l(i,f,d,c))))},{immediate:!0,flush:"post"}),p=()=>{s(),a()};return L(p),p}const g=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},w="__vueuse_ssr_handlers__";g[w]=g[w]||{};var I;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(I||(I={}));var U=Object.defineProperty,h=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable,_=(e,n,t)=>n in e?U(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,z=(e,n)=>{for(var t in n||(n={}))j.call(n,t)&&_(e,t,n[t]);if(h)for(var t of h(n))k.call(n,t)&&_(e,t,n[t]);return e};const F={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};z({linear:H},F);function R(e={}){const{window:n=b,initialWidth:t=1/0,initialHeight:r=1/0,listenOrientation:o=!0,includeScrollbar:u=!0}=e,a=O(t),l=O(r),s=()=>{n&&(u?(a.value=n.innerWidth,l.value=n.innerHeight):(a.value=n.document.documentElement.clientWidth,l.value=n.document.documentElement.clientHeight))};return s(),B(s),y("resize",s,{passive:!0}),o&&y("orientationchange",s,{passive:!0}),{width:a,height:l}}export{R as u};