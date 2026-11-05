import{$ as e,C as t,En as n,Fn as r,S as i,St as a,Y as o,_t as s,b as c,bt as l,fn as u,gn as d,gt as f,h as p,mn as m,nt as h,p as g,pn as _,st as v,t as y,u as b,yn as x,yt as S}from"./Close-D8ap5Wyu.js";import{Bn as C,Ln as w,Rn as T,Vn as E,zn as D}from"./directives-jkwfeMNs.js";import{A as O,j as k}from"./InputNumber-Bc7oBMaF.js";import{z as A}from"./toString-BWDzaUQG.js";var j=s(`alert`,`
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
 `),l(`closable`,[s(`alert-body`,[S(`title`,`
 padding-right: 24px;
 `)])]),S(`icon`,{color:`var(--n-icon-color)`}),s(`alert-body`,{padding:`var(--n-padding)`},[S(`title`,{color:`var(--n-title-text-color)`}),S(`content`,{color:`var(--n-content-text-color)`})]),O({originalTransition:`transform .3s var(--n-bezier)`,enterToProps:{transform:`scale(1)`},leaveToProps:{transform:`scale(0.9)`}}),S(`icon`,`
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
 `),l(`show-icon`,[s(`alert-body`,{paddingLeft:`calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))`})]),l(`right-adjust`,[s(`alert-body`,{paddingRight:`calc(var(--n-close-size) + var(--n-padding) + 2px)`})]),s(`alert-body`,`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[S(`title`,`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[f(`& +`,[S(`content`,{marginTop:`9px`})])]),S(`content`,{transition:`color .3s var(--n-bezier)`,fontSize:`var(--n-font-size)`})]),S(`icon`,{transition:`color .3s var(--n-bezier)`})]),M={...i.props,title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:`default`},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function},N=x({name:`Alert`,inheritAttrs:!1,props:M,slots:Object,setup(e){let{mergedClsPrefixRef:n,mergedBorderedRef:r,inlineThemeDisabled:s,mergedRtlRef:c}=v(e),l=i(`Alert`,`-alert`,j,w,e,n),d=b(`Alert`,c,n),f=u(()=>{let{common:{cubicBezierEaseInOut:t},self:n}=l.value,{fontSize:r,borderRadius:i,titleFontWeight:s,lineHeight:c,iconSize:u,iconMargin:d,iconMarginRtl:f,closeIconSize:p,closeBorderRadius:m,closeSize:h,closeMargin:g,closeMarginRtl:_,padding:v}=n,{type:y}=e,{left:b,right:x}=o(d);return{"--n-bezier":t,"--n-color":n[a(`color`,y)],"--n-close-icon-size":p,"--n-close-border-radius":m,"--n-close-color-hover":n[a(`closeColorHover`,y)],"--n-close-color-pressed":n[a(`closeColorPressed`,y)],"--n-close-icon-color":n[a(`closeIconColor`,y)],"--n-close-icon-color-hover":n[a(`closeIconColorHover`,y)],"--n-close-icon-color-pressed":n[a(`closeIconColorPressed`,y)],"--n-icon-color":n[a(`iconColor`,y)],"--n-border":n[a(`border`,y)],"--n-title-text-color":n[a(`titleTextColor`,y)],"--n-content-text-color":n[a(`contentTextColor`,y)],"--n-line-height":c,"--n-border-radius":i,"--n-font-size":r,"--n-title-font-weight":s,"--n-icon-size":u,"--n-icon-margin":d,"--n-icon-margin-rtl":f,"--n-close-size":h,"--n-close-margin":g,"--n-close-margin-rtl":_,"--n-padding":v,"--n-icon-margin-left":b,"--n-icon-margin-right":x}}),p=s?t(`alert`,u(()=>e.type[0]),f,e):void 0,m=A(!0),h=()=>{let{onAfterLeave:t,onAfterHide:n}=e;t&&t(),n&&n()};return{rtlEnabled:d,mergedClsPrefix:n,mergedBordered:r,visible:m,handleCloseClick:()=>{Promise.resolve(e.onClose?.()).then(e=>{e!==!1&&(m.value=!1)})},handleAfterLeave:()=>{h()},mergedTheme:l,cssVars:s?void 0:f,themeClass:p?.themeClass,onRender:p?.onRender}},render(){return this.onRender?.(),r(),m(k,{onAfterLeave:this.handleAfterLeave},{default:()=>{let{mergedClsPrefix:t,$slots:i}=this,a={class:[`${t}-alert`,this.themeClass,this.closable&&`${t}-alert--closable`,this.showIcon&&`${t}-alert--show-icon`,!this.title&&this.closable&&`${t}-alert--right-adjust`,this.rtlEnabled&&`${t}-alert--rtl`],style:this.cssVars,role:`alert`};return this.visible?(r(),d(`div`,n({key:1},n(this.$attrs,a)),[h(()=>this.closable&&(r(),m(y,{clsPrefix:t,class:e(`${t}-alert__close`),onClick:this.handleCloseClick},null,8,[`clsPrefix`,`class`,`onClick`]))),h(()=>this.bordered&&(r(),d(`div`,{class:e(`${t}-alert__border`)},null,2))),h(()=>this.showIcon&&(r(),d(`div`,{class:e(`${t}-alert__icon`),"aria-hidden":`true`},[h(()=>g(i.icon,()=>[(r(),m(c,{clsPrefix:t},{default:()=>{switch(this.type){case`success`:return r(),m(D,{key:3});case`info`:return r(),m(C,{key:4});case`warning`:return r(),m(T,{key:5});case`error`:return r(),m(E,{key:6});default:return null}}},1032,[`clsPrefix`]))]))],2))),_(`div`,{class:e([`${t}-alert-body`,this.mergedBordered&&`${t}-alert-body--bordered`])},[h(()=>p(i.header,n=>{let i=n||this.title;return i?(r(),d(`div`,{key:2,class:e(`${t}-alert-body__title`)},[h(()=>i)],2)):null})),h(()=>i.default&&(r(),d(`div`,{class:e(`${t}-alert-body__content`)},[h(()=>i.default())],2)))],2)],16)):null}},1032,[`onAfterLeave`])}});export{N as t};