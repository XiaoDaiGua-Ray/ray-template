import{D as e,Dt as t,O as n,St as r,T as i,Tt as a,b as o,et as s,ft as c,g as l,it as u,s as d,st as f,v as p,wt as m,xt as h}from"./Card-DWNnI9T1.js";import{Sr as g,_r as _,br as v,gr as y,vr as b,xr as x,yr as S}from"./directives-ul2jWhl4.js";import{D as C,L as w,d as T,f as E,h as D,p as O,y as k}from"./runtime-core.esm-bundler-CcpTTixp.js";import{T as A}from"./isObject-dxr8ANCS.js";var j=r(`alert`,`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[m(`border`,`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),a(`closable`,[r(`alert-body`,[m(`title`,`
 padding-right: 24px;
 `)])]),m(`icon`,{color:`var(--n-icon-color)`}),r(`alert-body`,{padding:`var(--n-padding)`},[m(`title`,{color:`var(--n-title-text-color)`}),m(`content`,{color:`var(--n-content-text-color)`})]),y({originalTransition:`transform .3s var(--n-bezier)`,enterToProps:{transform:`scale(1)`},leaveToProps:{transform:`scale(0.9)`}}),m(`icon`,`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),m(`close`,`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),a(`show-icon`,[r(`alert-body`,{paddingLeft:`calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))`})]),a(`right-adjust`,[r(`alert-body`,{paddingRight:`calc(var(--n-close-size) + var(--n-padding) + 2px)`})]),r(`alert-body`,`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[m(`title`,`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[h(`& +`,[m(`content`,{marginTop:`9px`})])]),m(`content`,{transition:`color .3s var(--n-bezier)`,fontSize:`var(--n-font-size)`})]),m(`icon`,{transition:`color .3s var(--n-bezier)`})]),M={...e.props,title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:`default`},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function},N=k({name:`Alert`,inheritAttrs:!1,props:M,slots:Object,setup(r){let{mergedClsPrefixRef:i,mergedBorderedRef:a,inlineThemeDisabled:o,mergedRtlRef:u}=c(r),d=e(`Alert`,`-alert`,j,_,r,i),f=l(`Alert`,u,i),p=T(()=>{let{common:{cubicBezierEaseInOut:e},self:n}=d.value,{fontSize:i,borderRadius:a,titleFontWeight:o,lineHeight:c,iconSize:l,iconMargin:u,iconMarginRtl:f,closeIconSize:p,closeBorderRadius:m,closeSize:h,closeMargin:g,closeMarginRtl:_,padding:v}=n,{type:y}=r,{left:b,right:x}=s(u);return{"--n-bezier":e,"--n-color":n[t(`color`,y)],"--n-close-icon-size":p,"--n-close-border-radius":m,"--n-close-color-hover":n[t(`closeColorHover`,y)],"--n-close-color-pressed":n[t(`closeColorPressed`,y)],"--n-close-icon-color":n[t(`closeIconColor`,y)],"--n-close-icon-color-hover":n[t(`closeIconColorHover`,y)],"--n-close-icon-color-pressed":n[t(`closeIconColorPressed`,y)],"--n-icon-color":n[t(`iconColor`,y)],"--n-border":n[t(`border`,y)],"--n-title-text-color":n[t(`titleTextColor`,y)],"--n-content-text-color":n[t(`contentTextColor`,y)],"--n-line-height":c,"--n-border-radius":a,"--n-font-size":i,"--n-title-font-weight":o,"--n-icon-size":l,"--n-icon-margin":u,"--n-icon-margin-rtl":f,"--n-close-size":h,"--n-close-margin":g,"--n-close-margin-rtl":_,"--n-padding":v,"--n-icon-margin-left":b,"--n-icon-margin-right":x}}),m=o?n(`alert`,T(()=>r.type[0]),p,r):void 0,h=A(!0),g=()=>{let{onAfterLeave:e,onAfterHide:t}=r;e&&e(),t&&t()};return{rtlEnabled:f,mergedClsPrefix:i,mergedBordered:a,visible:h,handleCloseClick:()=>{Promise.resolve(r.onClose?.()).then(e=>{e!==!1&&(h.value=!1)})},handleAfterLeave:()=>{g()},mergedTheme:d,cssVars:o?void 0:p,themeClass:m?.themeClass,onRender:m?.onRender}},render(){return this.onRender?.(),w(),O(b,{onAfterLeave:this.handleAfterLeave},{default:()=>{let{mergedClsPrefix:e,$slots:t}=this,n={class:[`${e}-alert`,this.themeClass,this.closable&&`${e}-alert--closable`,this.showIcon&&`${e}-alert--show-icon`,!this.title&&this.closable&&`${e}-alert--right-adjust`,this.rtlEnabled&&`${e}-alert--rtl`],style:this.cssVars,role:`alert`};return this.visible?(w(),D(`div`,C({key:1},C(this.$attrs,n)),[f(()=>this.closable&&(w(),O(d,{clsPrefix:e,class:u(`${e}-alert__close`),onClick:this.handleCloseClick},null,8,[`clsPrefix`,`class`,`onClick`]))),f(()=>this.bordered&&(w(),D(`div`,{class:u(`${e}-alert__border`)},null,2))),f(()=>this.showIcon&&(w(),D(`div`,{class:u(`${e}-alert__icon`),"aria-hidden":`true`},[f(()=>p(t.icon,()=>[(w(),O(i,{clsPrefix:e},{default:()=>{switch(this.type){case`success`:return w(),O(v,{key:3});case`info`:return w(),O(x,{key:4});case`warning`:return w(),O(S,{key:5});case`error`:return w(),O(g,{key:6});default:return null}}},1032,[`clsPrefix`]))]))],2))),E(`div`,{class:u([`${e}-alert-body`,this.mergedBordered&&`${e}-alert-body--bordered`])},[f(()=>o(t.header,t=>{let n=t||this.title;return n?(w(),D(`div`,{key:2,class:u(`${e}-alert-body__title`)},[f(()=>n)],2)):null})),f(()=>t.default&&(w(),D(`div`,{class:u(`${e}-alert-body__content`)},[f(()=>t.default())],2)))],2)],16)):null}},1032,[`onAfterLeave`])}});export{N as t};