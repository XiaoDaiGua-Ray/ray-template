import{At as e,J as t,R as n,z as r}from"./toString-BWDzaUQG.js";import{$t as i,An as a,Mn as o,Nn as s,On as c,Q as l,_n as u,_t as d,dn as f,et as p,fn as m,gn as h,ht as g,it as _,lt as v,mn as y,mt as b,nt as x,tt as S,un as C,xn as w,zn as T}from"./replaceable-B-PFC1y9.js";function E(e){let t=C(e),n=r(t.value);return T(t,e=>{n.value=e}),typeof e==`function`?n:{__v_isRef:!0,get value(){return n.value},set value(t){e.set(t)}}}function D(){let e=r(!1);return a(()=>{e.value=!0}),n(e)}var O=v(`n-form-item`);function k(e,{defaultSize:t=`medium`,mergedSize:n,mergedDisabled:r}={}){let i=w(O,null);s(O,null);let a=C(n?()=>n(i):()=>{let{size:n}=e;if(n)return n;if(i){let{mergedSize:e}=i;if(e.value!==void 0)return e.value}return t}),o=C(r?()=>r(i):()=>{let{disabled:t}=e;return t===void 0?i?i.disabled.value:!1:t}),l=C(()=>{let{status:t}=e;return t||i?.mergedValidationStatus.value});return c(()=>{i&&i.restoreValidation()}),{mergedSizeRef:a,mergedDisabledRef:o,mergedStatusRef:l,nTriggerFormBlur(){i&&i.handleContentBlur()},nTriggerFormChange(){i&&i.handleContentChange()},nTriggerFormFocus(){i&&i.handleContentFocus()},nTriggerFormInput(){i&&i.handleContentInput()}}}var A=u({name:`BaseIconSwitchTransition`,setup(e,{slots:t}){let n=D();return()=>(o(),m(i,{name:`icon-switch-transition`,appear:n.value},p(t),1032,[`appear`]))}}),{cubicBezierEaseInOut:j}=_;function M({originalTransform:e=``,left:t=0,top:n=0,transition:r=`all .3s ${j} !important`}={}){return[b(`&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to`,{transform:`${e} scale(0.75)`,left:t,top:n,opacity:0}),b(`&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from`,{transform:`scale(1) ${e}`,left:t,top:n,opacity:1}),b(`&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active`,{transformOrigin:`center`,position:`absolute`,left:t,top:n,transition:r})]}var N=b([b(`@keyframes rotator`,`
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`),g(`base-loading`,`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[d(`transition-wrapper`,`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[M()]),d(`placeholder`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[M({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),d(`container`,`
 animation: rotator 3s linear infinite both;
 `,[d(`icon`,`
 height: 1em;
 width: 1em;
 `)])])]),P=[`viewBox`],F=[`values`,`dur`],I=[`stroke-width`,`cx`,`cy`,`r`,`stroke-dasharray`,`stroke-dashoffset`],L=[`values`,`dur`],R=[`values`,`dur`],z=`1.6s`,B={strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0},scale:{type:Number,default:1},radius:{type:Number,default:100}},V=u({name:`BaseLoading`,props:{clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0},...B},setup(e){x(`-base-loading`,N,t(e,`clsPrefix`))},render(){let{clsPrefix:t,radius:n,strokeWidth:r,stroke:i,scale:a}=this,s=n/a;return o(),y(`div`,{class:l(`${t}-base-loading`),role:`img`,"aria-label":`loading`},[h(A,null,{default:()=>this.show?(o(),y(`div`,{key:`icon`,class:l(`${t}-base-loading__transition-wrapper`)},[f(`div`,{class:l(`${t}-base-loading__container`)},[(o(),y(`svg`,{class:l(`${t}-base-loading__icon`),viewBox:`0 0 ${2*s} ${2*s}`,xmlns:`http://www.w3.org/2000/svg`,style:e({color:i})},[f(`g`,null,[f(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${s} ${s};270 ${s} ${s}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,F),f(`circle`,{class:l(`${t}-base-loading__icon`),fill:`none`,stroke:`currentColor`,"stroke-width":r,"stroke-linecap":`round`,cx:s,cy:s,r:n-r/2,"stroke-dasharray":5.67*n,"stroke-dashoffset":18.48*n},[f(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${s} ${s};135 ${s} ${s};450 ${s} ${s}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,L),f(`animate`,{attributeName:`stroke-dashoffset`,values:`${5.67*n};${1.42*n};${5.67*n}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,R)],10,I)])],14,P))],2)],2)):(o(),y(`div`,{key:`placeholder`,class:l(`${t}-base-loading__placeholder`)},[S(()=>this.$slots.default?.())],2))},1024)],2)}}),H=typeof document<`u`&&typeof window<`u`,U=H&&`chrome`in window;H&&navigator.userAgent.includes(`Firefox`);var W=H&&navigator.userAgent.includes(`Safari`)&&!U;export{M as a,k as c,B as i,D as l,H as n,A as o,V as r,O as s,W as t,E as u};