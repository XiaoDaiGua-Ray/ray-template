import{i as A,a as N}from"./@vue_reactivity@3.4.38-CmXFqMGn.js";import{a as g,b as m,c as S,g as z,E as j,n as T,d as k,e as h,f as y,h as B}from"./@vue_shared@3.4.38-D8qfpBTH.js";/**
* @vue/runtime-core v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let r=null,M=null;function E(t,s){t.shapeFlag&6&&t.component?E(t.component.subTree,s):t.shapeFlag&128?(t.ssContent.transition=s.clone(t.ssContent),t.ssFallback.transition=s.clone(t.ssFallback)):t.transition=s}const P=Symbol.for("v-ndc"),U={},V=t=>Object.getPrototypeOf(t)===U,G=t=>t.__isTeleport,L=t=>t.__isSuspense,I=Symbol.for("v-fgt"),Y=Symbol.for("v-txt"),D=Symbol.for("v-cmt"),H=Symbol.for("v-stc"),f=[];let u=null;function v(t=!1){f.push(u=t?null:[])}function K(){f.pop(),u=f[f.length-1]||null}function q(t){return t.dynamicChildren=u||j,K(),u&&u.push(t),t}function tt(t,s,l,c,n,e){return q(x(t,s,l,c,n,e,!0))}function w(t){return t?t.__v_isVNode===!0:!1}const O=({key:t})=>t??null,_=({ref:t,ref_key:s,ref_for:l})=>(typeof t=="number"&&(t=""+t),t!=null?g(t)||A(t)||S(t)?{i:r,r:t,k:s,f:!!l}:t:null);function x(t,s=null,l=null,c=0,n=null,e=t===I?0:1,i=!1,o=!1){const a={__v_isVNode:!0,__v_skip:!0,type:t,props:s,key:s&&O(s),ref:s&&_(s),scopeId:M,slotScopeIds:null,children:l,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:e,patchFlag:c,dynamicProps:n,dynamicChildren:null,appContext:null,ctx:r};return o?(p(a,l),e&128&&t.normalize(a)):l&&(a.shapeFlag|=g(l)?8:16),!i&&u&&(a.patchFlag>0||e&6)&&a.patchFlag!==32&&u.push(a),a}const R=J;function J(t,s=null,l=null,c=0,n=null,e=!1){if((!t||t===P)&&(t=D),w(t)){const o=F(t,s,!0);return l&&p(o,l),!e&&u&&(o.shapeFlag&6?u[u.indexOf(t)]=o:u.push(o)),o.patchFlag=-2,o}if(Z(t)&&(t=t.__vccOpts),s){s=Q(s);let{class:o,style:a}=s;o&&!g(o)&&(s.class=T(o)),k(a)&&(N(a)&&!m(a)&&(a=h({},a)),s.style=y(a))}const i=g(t)?1:L(t)?128:G(t)?64:k(t)?4:S(t)?2:0;return x(t,s,l,c,n,i,e,!0)}function Q(t){return t?N(t)||V(t)?h({},t):t:null}function F(t,s,l=!1,c=!1){const{props:n,ref:e,patchFlag:i,children:o,transition:a}=t,C=s?X(n||{},s):n,b={__v_isVNode:!0,__v_skip:!0,type:t.type,props:C,key:C&&O(C),ref:s&&s.ref?l&&e?m(e)?e.concat(_(s)):[e,_(s)]:_(s):e,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:o,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:s&&t.type!==I?i===-1?16:i|16:i,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:a,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&F(t.ssContent),ssFallback:t.ssFallback&&F(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return a&&c&&E(b,a.clone(b)),b}function W(t=" ",s=0){return R(Y,null,t,s)}function st(t,s){const l=R(H,null,t);return l.staticCount=s,l}function p(t,s){let l=0;const{shapeFlag:c}=t;if(s==null)s=null;else if(m(s))l=16;else if(typeof s=="object")if(c&65){const n=s.default;n&&(n._c&&(n._d=!1),p(t,n()),n._c&&(n._d=!0));return}else{l=32;const n=s._;!n&&!V(s)?s._ctx=r:n===3&&r&&(r.slots._===1?s._=1:(s._=2,t.patchFlag|=1024))}else S(s)?(s={default:s,_ctx:r},l=32):(s=String(s),c&64?(l=16,s=[W(s)]):l=8);t.children=s,t.shapeFlag|=l}function X(...t){const s={};for(let l=0;l<t.length;l++){const c=t[l];for(const n in c)if(n==="class")s.class!==c.class&&(s.class=T([s.class,c.class]));else if(n==="style")s.style=y([s.style,c.style]);else if(B(n)){const e=s[n],i=c[n];i&&e!==i&&!(m(e)&&e.includes(i))&&(s[n]=e?[].concat(e,i):i)}else n!==""&&(s[n]=c[n])}return s}{const t=z(),s=(l,c)=>{let n;return(n=t[l])||(n=t[l]=[]),n.push(c),e=>{n.length>1?n.forEach(i=>i(e)):n[0](e)}};s("__VUE_INSTANCE_SETTERS__",l=>l),s("__VUE_SSR_SETTERS__",l=>l)}function Z(t){return S(t)&&"__vccOpts"in t}export{st as a,tt as c,v as o};