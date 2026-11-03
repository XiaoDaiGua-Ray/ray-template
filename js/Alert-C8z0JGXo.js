import{D as e,E as t,J as n,Mn as r,Q as i,S as a,T as o,_n as s,_t as c,bt as l,dn as u,f as d,fn as f,ht as p,l as m,m as h,mn as g,mt as _,ot as v,tt as y,un as b,vt as x,wn as S,x as C,y as w}from"./replaceable-B-PFC1y9.js";import{d as T,f as E,l as D,p as O,u as k}from"./Switch-DQsfv1yf.js";import{s as A}from"./Card-BB74FRP1.js";import{a as j}from"./Button-BgNmP7qu.js";import{a as M}from"./index-DEOhsyt2.js";import{z as N}from"./toString-BWDzaUQG.js";function P(n){let{lineHeight:r,borderRadius:i,fontWeightStrong:a,baseColor:o,dividerColor:s,actionColor:c,textColor1:l,textColor2:u,closeColorHover:d,closeColorPressed:f,closeIconColor:p,closeIconColorHover:m,closeIconColorPressed:h,infoColor:g,successColor:_,warningColor:v,errorColor:y,fontSize:b}=n;return{...M,fontSize:b,lineHeight:r,titleFontWeight:a,borderRadius:i,border:`1px solid ${s}`,color:c,titleTextColor:l,iconColor:u,contentTextColor:u,closeBorderRadius:i,closeColorHover:d,closeColorPressed:f,closeIconColor:p,closeIconColorHover:m,closeIconColorPressed:h,borderInfo:`1px solid ${e(o,t(g,{alpha:.25}))}`,colorInfo:e(o,t(g,{alpha:.08})),titleTextColorInfo:l,iconColorInfo:g,contentTextColorInfo:u,closeColorHoverInfo:d,closeColorPressedInfo:f,closeIconColorInfo:p,closeIconColorHoverInfo:m,closeIconColorPressedInfo:h,borderSuccess:`1px solid ${e(o,t(_,{alpha:.25}))}`,colorSuccess:e(o,t(_,{alpha:.08})),titleTextColorSuccess:l,iconColorSuccess:_,contentTextColorSuccess:u,closeColorHoverSuccess:d,closeColorPressedSuccess:f,closeIconColorSuccess:p,closeIconColorHoverSuccess:m,closeIconColorPressedSuccess:h,borderWarning:`1px solid ${e(o,t(v,{alpha:.33}))}`,colorWarning:e(o,t(v,{alpha:.08})),titleTextColorWarning:l,iconColorWarning:v,contentTextColorWarning:u,closeColorHoverWarning:d,closeColorPressedWarning:f,closeIconColorWarning:p,closeIconColorHoverWarning:m,closeIconColorPressedWarning:h,borderError:`1px solid ${e(o,t(y,{alpha:.25}))}`,colorError:e(o,t(y,{alpha:.08})),titleTextColorError:l,iconColorError:y,contentTextColorError:u,closeColorHoverError:d,closeColorPressedError:f,closeIconColorError:p,closeIconColorHoverError:m,closeIconColorPressedError:h}}var F={name:`Alert`,common:o,self:P},I=p(`alert`,`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[c(`border`,`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),x(`closable`,[p(`alert-body`,[c(`title`,`
 padding-right: 24px;
 `)])]),c(`icon`,{color:`var(--n-icon-color)`}),p(`alert-body`,{padding:`var(--n-padding)`},[c(`title`,{color:`var(--n-title-text-color)`}),c(`content`,{color:`var(--n-content-text-color)`})]),D({originalTransition:`transform .3s var(--n-bezier)`,enterToProps:{transform:`scale(1)`},leaveToProps:{transform:`scale(0.9)`}}),c(`icon`,`
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
 `),c(`close`,`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),x(`show-icon`,[p(`alert-body`,{paddingLeft:`calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))`})]),x(`right-adjust`,[p(`alert-body`,{paddingRight:`calc(var(--n-close-size) + var(--n-padding) + 2px)`})]),p(`alert-body`,`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[c(`title`,`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[_(`& +`,[c(`content`,{marginTop:`9px`})])]),c(`content`,{transition:`color .3s var(--n-bezier)`,fontSize:`var(--n-font-size)`})]),c(`icon`,{transition:`color .3s var(--n-bezier)`})]),L={...C.props,title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:`default`},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function},R=s({name:`Alert`,inheritAttrs:!1,props:L,slots:Object,setup(e){let{mergedClsPrefixRef:t,mergedBorderedRef:r,inlineThemeDisabled:i,mergedRtlRef:o}=v(e),s=C(`Alert`,`-alert`,I,F,e,t),c=m(`Alert`,o,t),u=b(()=>{let{common:{cubicBezierEaseInOut:t},self:r}=s.value,{fontSize:i,borderRadius:a,titleFontWeight:o,lineHeight:c,iconSize:u,iconMargin:d,iconMarginRtl:f,closeIconSize:p,closeBorderRadius:m,closeSize:h,closeMargin:g,closeMarginRtl:_,padding:v}=r,{type:y}=e,{left:b,right:x}=n(d);return{"--n-bezier":t,"--n-color":r[l(`color`,y)],"--n-close-icon-size":p,"--n-close-border-radius":m,"--n-close-color-hover":r[l(`closeColorHover`,y)],"--n-close-color-pressed":r[l(`closeColorPressed`,y)],"--n-close-icon-color":r[l(`closeIconColor`,y)],"--n-close-icon-color-hover":r[l(`closeIconColorHover`,y)],"--n-close-icon-color-pressed":r[l(`closeIconColorPressed`,y)],"--n-icon-color":r[l(`iconColor`,y)],"--n-border":r[l(`border`,y)],"--n-title-text-color":r[l(`titleTextColor`,y)],"--n-content-text-color":r[l(`contentTextColor`,y)],"--n-line-height":c,"--n-border-radius":a,"--n-font-size":i,"--n-title-font-weight":o,"--n-icon-size":u,"--n-icon-margin":d,"--n-icon-margin-rtl":f,"--n-close-size":h,"--n-close-margin":g,"--n-close-margin-rtl":_,"--n-padding":v,"--n-icon-margin-left":b,"--n-icon-margin-right":x}}),d=i?a(`alert`,b(()=>e.type[0]),u,e):void 0,f=N(!0),p=()=>{let{onAfterLeave:t,onAfterHide:n}=e;t&&t(),n&&n()};return{rtlEnabled:c,mergedClsPrefix:t,mergedBordered:r,visible:f,handleCloseClick:()=>{Promise.resolve(e.onClose?.()).then(e=>{e!==!1&&(f.value=!1)})},handleAfterLeave:()=>{p()},mergedTheme:s,cssVars:i?void 0:u,themeClass:d?.themeClass,onRender:d?.onRender}},render(){return this.onRender?.(),r(),f(j,{onAfterLeave:this.handleAfterLeave},{default:()=>{let{mergedClsPrefix:e,$slots:t}=this,n={class:[`${e}-alert`,this.themeClass,this.closable&&`${e}-alert--closable`,this.showIcon&&`${e}-alert--show-icon`,!this.title&&this.closable&&`${e}-alert--right-adjust`,this.rtlEnabled&&`${e}-alert--rtl`],style:this.cssVars,role:`alert`};return this.visible?(r(),g(`div`,S({key:1},S(this.$attrs,n)),[y(()=>this.closable&&(r(),f(A,{clsPrefix:e,class:i(`${e}-alert__close`),onClick:this.handleCloseClick},null,8,[`clsPrefix`,`class`,`onClick`]))),y(()=>this.bordered&&(r(),g(`div`,{class:i(`${e}-alert__border`)},null,2))),y(()=>this.showIcon&&(r(),g(`div`,{class:i(`${e}-alert__icon`),"aria-hidden":`true`},[y(()=>d(t.icon,()=>[(r(),f(w,{clsPrefix:e},{default:()=>{switch(this.type){case`success`:return r(),f(T,{key:3});case`info`:return r(),f(E,{key:4});case`warning`:return r(),f(k,{key:5});case`error`:return r(),f(O,{key:6});default:return null}}},1032,[`clsPrefix`]))]))],2))),u(`div`,{class:i([`${e}-alert-body`,this.mergedBordered&&`${e}-alert-body--bordered`])},[y(()=>h(t.header,t=>{let n=t||this.title;return n?(r(),g(`div`,{key:2,class:i(`${e}-alert-body__title`)},[y(()=>n)],2)):null})),y(()=>t.default&&(r(),g(`div`,{class:i(`${e}-alert-body__content`)},[y(()=>t.default())],2)))],2)],16)):null}},1032,[`onAfterLeave`])}});export{R as t};