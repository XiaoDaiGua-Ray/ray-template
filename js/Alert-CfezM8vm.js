import{Bn as e,D as t,Dt as n,M as r,N as i,O as a,St as o,T as s,Tt as c,_n as l,b as u,et as d,ft as f,g as p,it as m,j as h,jn as g,s as _,st as v,v as y,vn as b,wn as x,wt as S,xn as C,xt as w,yn as T}from"./Card-B_oozRxS.js";import{A as E,F as D,M as O,N as k,P as A,j}from"./Switch-B4B45bkJ.js";import{l as M}from"./directives-BpDumRCc.js";import{z as N}from"./toString-BWDzaUQG.js";function P(e){let{lineHeight:t,borderRadius:n,fontWeightStrong:a,baseColor:o,dividerColor:s,actionColor:c,textColor1:l,textColor2:u,closeColorHover:d,closeColorPressed:f,closeIconColor:p,closeIconColorHover:m,closeIconColorPressed:h,infoColor:g,successColor:_,warningColor:v,errorColor:y,fontSize:b}=e;return{...M,fontSize:b,lineHeight:t,titleFontWeight:a,borderRadius:n,border:`1px solid ${s}`,color:c,titleTextColor:l,iconColor:u,contentTextColor:u,closeBorderRadius:n,closeColorHover:d,closeColorPressed:f,closeIconColor:p,closeIconColorHover:m,closeIconColorPressed:h,borderInfo:`1px solid ${i(o,r(g,{alpha:.25}))}`,colorInfo:i(o,r(g,{alpha:.08})),titleTextColorInfo:l,iconColorInfo:g,contentTextColorInfo:u,closeColorHoverInfo:d,closeColorPressedInfo:f,closeIconColorInfo:p,closeIconColorHoverInfo:m,closeIconColorPressedInfo:h,borderSuccess:`1px solid ${i(o,r(_,{alpha:.25}))}`,colorSuccess:i(o,r(_,{alpha:.08})),titleTextColorSuccess:l,iconColorSuccess:_,contentTextColorSuccess:u,closeColorHoverSuccess:d,closeColorPressedSuccess:f,closeIconColorSuccess:p,closeIconColorHoverSuccess:m,closeIconColorPressedSuccess:h,borderWarning:`1px solid ${i(o,r(v,{alpha:.33}))}`,colorWarning:i(o,r(v,{alpha:.08})),titleTextColorWarning:l,iconColorWarning:v,contentTextColorWarning:u,closeColorHoverWarning:d,closeColorPressedWarning:f,closeIconColorWarning:p,closeIconColorHoverWarning:m,closeIconColorPressedWarning:h,borderError:`1px solid ${i(o,r(y,{alpha:.25}))}`,colorError:i(o,r(y,{alpha:.08})),titleTextColorError:l,iconColorError:y,contentTextColorError:u,closeColorHoverError:d,closeColorPressedError:f,closeIconColorError:p,closeIconColorHoverError:m,closeIconColorPressedError:h}}var F={name:`Alert`,common:h,self:P},I=o(`alert`,`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[S(`border`,`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),c(`closable`,[o(`alert-body`,[S(`title`,`
 padding-right: 24px;
 `)])]),S(`icon`,{color:`var(--n-icon-color)`}),o(`alert-body`,{padding:`var(--n-padding)`},[S(`title`,{color:`var(--n-title-text-color)`}),S(`content`,{color:`var(--n-content-text-color)`})]),E({originalTransition:`transform .3s var(--n-bezier)`,enterToProps:{transform:`scale(1)`},leaveToProps:{transform:`scale(0.9)`}}),S(`icon`,`
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
 `),S(`close`,`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),c(`show-icon`,[o(`alert-body`,{paddingLeft:`calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))`})]),c(`right-adjust`,[o(`alert-body`,{paddingRight:`calc(var(--n-close-size) + var(--n-padding) + 2px)`})]),o(`alert-body`,`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[S(`title`,`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[w(`& +`,[S(`content`,{marginTop:`9px`})])]),S(`content`,{transition:`color .3s var(--n-bezier)`,fontSize:`var(--n-font-size)`})]),S(`icon`,{transition:`color .3s var(--n-bezier)`})]),L={...t.props,title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:`default`},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function},R=x({name:`Alert`,inheritAttrs:!1,props:L,slots:Object,setup(e){let{mergedClsPrefixRef:r,mergedBorderedRef:i,inlineThemeDisabled:o,mergedRtlRef:s}=f(e),c=t(`Alert`,`-alert`,I,F,e,r),u=p(`Alert`,s,r),m=l(()=>{let{common:{cubicBezierEaseInOut:t},self:r}=c.value,{fontSize:i,borderRadius:a,titleFontWeight:o,lineHeight:s,iconSize:l,iconMargin:u,iconMarginRtl:f,closeIconSize:p,closeBorderRadius:m,closeSize:h,closeMargin:g,closeMarginRtl:_,padding:v}=r,{type:y}=e,{left:b,right:x}=d(u);return{"--n-bezier":t,"--n-color":r[n(`color`,y)],"--n-close-icon-size":p,"--n-close-border-radius":m,"--n-close-color-hover":r[n(`closeColorHover`,y)],"--n-close-color-pressed":r[n(`closeColorPressed`,y)],"--n-close-icon-color":r[n(`closeIconColor`,y)],"--n-close-icon-color-hover":r[n(`closeIconColorHover`,y)],"--n-close-icon-color-pressed":r[n(`closeIconColorPressed`,y)],"--n-icon-color":r[n(`iconColor`,y)],"--n-border":r[n(`border`,y)],"--n-title-text-color":r[n(`titleTextColor`,y)],"--n-content-text-color":r[n(`contentTextColor`,y)],"--n-line-height":s,"--n-border-radius":a,"--n-font-size":i,"--n-title-font-weight":o,"--n-icon-size":l,"--n-icon-margin":u,"--n-icon-margin-rtl":f,"--n-close-size":h,"--n-close-margin":g,"--n-close-margin-rtl":_,"--n-padding":v,"--n-icon-margin-left":b,"--n-icon-margin-right":x}}),h=o?a(`alert`,l(()=>e.type[0]),m,e):void 0,g=N(!0),_=()=>{let{onAfterLeave:t,onAfterHide:n}=e;t&&t(),n&&n()};return{rtlEnabled:u,mergedClsPrefix:r,mergedBordered:i,visible:g,handleCloseClick:()=>{Promise.resolve(e.onClose?.()).then(e=>{e!==!1&&(g.value=!1)})},handleAfterLeave:()=>{_()},mergedTheme:c,cssVars:o?void 0:m,themeClass:h?.themeClass,onRender:h?.onRender}},render(){return this.onRender?.(),e(),T(j,{onAfterLeave:this.handleAfterLeave},{default:()=>{let{mergedClsPrefix:t,$slots:n}=this,r={class:[`${t}-alert`,this.themeClass,this.closable&&`${t}-alert--closable`,this.showIcon&&`${t}-alert--show-icon`,!this.title&&this.closable&&`${t}-alert--right-adjust`,this.rtlEnabled&&`${t}-alert--rtl`],style:this.cssVars,role:`alert`};return this.visible?(e(),C(`div`,g({key:1},g(this.$attrs,r)),[v(()=>this.closable&&(e(),T(_,{clsPrefix:t,class:m(`${t}-alert__close`),onClick:this.handleCloseClick},null,8,[`clsPrefix`,`class`,`onClick`]))),v(()=>this.bordered&&(e(),C(`div`,{class:m(`${t}-alert__border`)},null,2))),v(()=>this.showIcon&&(e(),C(`div`,{class:m(`${t}-alert__icon`),"aria-hidden":`true`},[v(()=>y(n.icon,()=>[(e(),T(s,{clsPrefix:t},{default:()=>{switch(this.type){case`success`:return e(),T(k,{key:3});case`info`:return e(),T(A,{key:4});case`warning`:return e(),T(O,{key:5});case`error`:return e(),T(D,{key:6});default:return null}}},1032,[`clsPrefix`]))]))],2))),b(`div`,{class:m([`${t}-alert-body`,this.mergedBordered&&`${t}-alert-body--bordered`])},[v(()=>u(n.header,n=>{let r=n||this.title;return r?(e(),C(`div`,{key:2,class:m(`${t}-alert-body__title`)},[v(()=>r)],2)):null})),v(()=>n.default&&(e(),C(`div`,{class:m(`${t}-alert-body__content`)},[v(()=>n.default())],2)))],2)],16)):null}},1032,[`onAfterLeave`])}});export{R as t};