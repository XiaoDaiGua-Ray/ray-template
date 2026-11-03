import{At as e,J as t,R as n,z as r}from"./toString-BWDzaUQG.js";import{$t as i,An as a,Bn as o,Mn as s,Nn as c,On as l,Q as u,_n as d,_t as f,dn as p,et as m,fn as h,gn as g,ht as _,it as v,lt as y,mn as b,mt as x,nt as S,tt as C,un as w,xn as T}from"./replaceable-DW6s2lkT.js";function E(e){let t=w(e),n=r(t.value);return o(t,e=>{n.value=e}),typeof e==`function`?n:{__v_isRef:!0,get value(){return n.value},set value(t){e.set(t)}}}function D(){let e=r(!1);return a(()=>{e.value=!0}),n(e)}var O=y(`n-form-item`);function k(e,{defaultSize:t=`medium`,mergedSize:n,mergedDisabled:r}={}){let i=T(O,null);c(O,null);let a=w(n?()=>n(i):()=>{let{size:n}=e;if(n)return n;if(i){let{mergedSize:e}=i;if(e.value!==void 0)return e.value}return t}),o=w(r?()=>r(i):()=>{let{disabled:t}=e;return t===void 0?i?i.disabled.value:!1:t}),s=w(()=>{let{status:t}=e;return t||i?.mergedValidationStatus.value});return l(()=>{i&&i.restoreValidation()}),{mergedSizeRef:a,mergedDisabledRef:o,mergedStatusRef:s,nTriggerFormBlur(){i&&i.handleContentBlur()},nTriggerFormChange(){i&&i.handleContentChange()},nTriggerFormFocus(){i&&i.handleContentFocus()},nTriggerFormInput(){i&&i.handleContentInput()}}}var A=d({name:`BaseIconSwitchTransition`,setup(e,{slots:t}){let n=D();return()=>(s(),h(i,{name:`icon-switch-transition`,appear:n.value},m(t),1032,[`appear`]))}}),{cubicBezierEaseInOut:j}=v;function M({originalTransform:e=``,left:t=0,top:n=0,transition:r=`all .3s ${j} !important`}={}){return[x(`&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to`,{transform:`${e} scale(0.75)`,left:t,top:n,opacity:0}),x(`&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from`,{transform:`scale(1) ${e}`,left:t,top:n,opacity:1}),x(`&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active`,{transformOrigin:`center`,position:`absolute`,left:t,top:n,transition:r})]}var N=x([x(`@keyframes rotator`,`
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`),_(`base-loading`,`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[f(`transition-wrapper`,`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[M()]),f(`placeholder`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[M({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),f(`container`,`
 animation: rotator 3s linear infinite both;
 `,[f(`icon`,`
 height: 1em;
 width: 1em;
 `)])])]),P=[`viewBox`],F=[`values`,`dur`],I=[`stroke-width`,`cx`,`cy`,`r`,`stroke-dasharray`,`stroke-dashoffset`],L=[`values`,`dur`],R=[`values`,`dur`],z=`1.6s`,B={strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0},scale:{type:Number,default:1},radius:{type:Number,default:100}},V=d({name:`BaseLoading`,props:{clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0},...B},setup(e){S(`-base-loading`,N,t(e,`clsPrefix`))},render(){let{clsPrefix:t,radius:n,strokeWidth:r,stroke:i,scale:a}=this,o=n/a;return s(),b(`div`,{class:u(`${t}-base-loading`),role:`img`,"aria-label":`loading`},[g(A,null,{default:()=>this.show?(s(),b(`div`,{key:`icon`,class:u(`${t}-base-loading__transition-wrapper`)},[p(`div`,{class:u(`${t}-base-loading__container`)},[(s(),b(`svg`,{class:u(`${t}-base-loading__icon`),viewBox:`0 0 ${2*o} ${2*o}`,xmlns:`http://www.w3.org/2000/svg`,style:e({color:i})},[p(`g`,null,[p(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${o} ${o};270 ${o} ${o}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,F),p(`circle`,{class:u(`${t}-base-loading__icon`),fill:`none`,stroke:`currentColor`,"stroke-width":r,"stroke-linecap":`round`,cx:o,cy:o,r:n-r/2,"stroke-dasharray":5.67*n,"stroke-dashoffset":18.48*n},[p(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${o} ${o};135 ${o} ${o};450 ${o} ${o}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,L),p(`animate`,{attributeName:`stroke-dashoffset`,values:`${5.67*n};${1.42*n};${5.67*n}`,begin:`0s`,dur:z,fill:`freeze`,repeatCount:`indefinite`},null,8,R)],10,I)])],14,P))],2)],2)):(s(),b(`div`,{key:`placeholder`,class:u(`${t}-base-loading__placeholder`)},[C(()=>this.$slots.default?.())],2))},1024)],2)}}),H=typeof document<`u`&&typeof window<`u`,U=H&&`chrome`in window;H&&navigator.userAgent.includes(`Firefox`);var W=H&&navigator.userAgent.includes(`Safari`)&&!U;export{M as a,k as c,B as i,D as l,H as n,A as o,V as r,O as s,W as t,E as u};