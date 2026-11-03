import{J as e,Mn as t,Q as n,S as r,St as i,T as a,Vn as o,Z as s,_n as c,_t as l,bt as u,dn as d,fn as f,g as p,ht as m,l as h,m as g,mn as _,mt as v,n as y,nt as b,ot as x,pt as S,t as C,tt as w,u as T,un as E,vt as D,x as O,xt as k,y as A,yt as j}from"./replaceable-B-PFC1y9.js";import{At as M,J as N}from"./toString-BWDzaUQG.js";function P(e){return Object.keys(e)}var F=C(`close`,()=>(()=>{let e=s(`6b30a2290cd08d4`);return e[0]||=d(`svg`,{viewBox:`0 0 12 12`,version:`1.1`,xmlns:`http://www.w3.org/2000/svg`,"aria-hidden":!0},[d(`g`,{stroke:`none`,"stroke-width":`1`,fill:`none`,"fill-rule":`evenodd`},[d(`g`,{fill:`currentColor`,"fill-rule":`nonzero`},[d(`path`,{d:`M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z`})])])],-1)})()),I=m(`base-close`,`
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`,[D(`absolute`,`
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `),v(`&::before`,`
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `),j(`disabled`,[v(`&:hover`,`
 color: var(--n-close-icon-color-hover);
 `),v(`&:hover::before`,`
 background-color: var(--n-close-color-hover);
 `),v(`&:focus::before`,`
 background-color: var(--n-close-color-hover);
 `),v(`&:active`,`
 color: var(--n-close-icon-color-pressed);
 `),v(`&:active::before`,`
 background-color: var(--n-close-color-pressed);
 `)]),D(`disabled`,`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),D(`round`,[v(`&::before`,`
 border-radius: 50%;
 `)])]),L=c({name:`BaseClose`,props:{isButtonTag:{type:Boolean,default:!0},clsPrefix:{type:String,required:!0},disabled:{type:Boolean,default:void 0},focusable:{type:Boolean,default:!0},round:Boolean,onClick:Function,absolute:Boolean},setup(e){return b(`-base-close`,I,N(e,`clsPrefix`)),()=>{let{clsPrefix:r,disabled:i,absolute:a,round:c,isButtonTag:l}=e,u=l?`button`:`div`;return(()=>{let d=s(`b5bdc9fe09f5ae00`);return t(),f(u,{type:l?`button`:void 0,tabindex:i||!e.focusable?-1:0,"aria-disabled":i,"aria-label":`close`,role:l?void 0:`button`,disabled:i,class:n([`${r}-base-close`,a&&`${r}-base-close--absolute`,i&&`${r}-base-close--disabled`,c&&`${r}-base-close--round`]),onMousedown:d[0]||=t=>{e.focusable||t.preventDefault()},onClick:e.onClick},{default:o(()=>[(t(),f(A,{clsPrefix:r},{default:()=>(t(),f(F))},1032,[`clsPrefix`]))]),_:2},1032,[`type`,`tabindex`,`aria-disabled`,`role`,`disabled`,`class`,`onClick`])})()}}}),R={paddingSmall:`12px 16px 12px`,paddingMedium:`19px 24px 20px`,paddingLarge:`23px 32px 24px`,paddingHuge:`27px 40px 28px`,titleFontSizeSmall:`16px`,titleFontSizeMedium:`18px`,titleFontSizeLarge:`18px`,titleFontSizeHuge:`18px`,closeIconSize:`18px`,closeSize:`22px`};function z(e){let{primaryColor:t,borderRadius:n,lineHeight:r,fontSize:i,cardColor:a,textColor2:o,textColor1:s,dividerColor:c,fontWeightStrong:l,closeIconColor:u,closeIconColorHover:d,closeIconColorPressed:f,closeColorHover:p,closeColorPressed:m,modalColor:h,boxShadow1:g,popoverColor:_,actionColor:v}=e;return{...R,lineHeight:r,color:a,colorModal:h,colorPopover:_,colorTarget:t,colorEmbedded:v,colorEmbeddedModal:v,colorEmbeddedPopover:v,textColor:o,titleTextColor:s,borderColor:c,actionColor:v,titleFontWeight:l,closeColorHover:p,closeColorPressed:m,closeBorderRadius:n,closeIconColor:u,closeIconColorHover:d,closeIconColorPressed:f,fontSizeSmall:i,fontSizeMedium:i,fontSizeLarge:i,fontSizeHuge:i,boxShadow:g,borderRadius:n}}var B={name:`Card`,common:a,self:z},V=m(`card-content`,`
 flex: 1;
 min-width: 0;
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
`),H=v([m(`card`,`
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[S({background:`var(--n-color-modal)`}),D(`hoverable`,[v(`&:hover`,`box-shadow: var(--n-box-shadow);`)]),D(`content-segmented`,[v(`>`,[m(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `),l(`content-scrollbar`,[v(`>`,[m(`scrollbar-container`,[v(`>`,[m(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `)])])])])])]),D(`content-soft-segmented`,[v(`>`,[m(`card-content`,`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `),l(`content-scrollbar`,[v(`>`,[m(`scrollbar-container`,[v(`>`,[m(`card-content`,`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])])])])])]),D(`footer-segmented`,[v(`>`,[l(`footer`,`
 padding-top: var(--n-padding-bottom);
 `)])]),D(`footer-soft-segmented`,[v(`>`,[l(`footer`,`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),v(`>`,[m(`card-header`,`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[l(`main`,`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),l(`extra`,`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),l(`close`,`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),l(`action`,`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),V,m(`card-content`,[v(`&:first-child`,`
 padding-top: var(--n-padding-bottom);
 `)]),l(`content-scrollbar`,`
 display: flex;
 flex-direction: column;
 `,[v(`>`,[m(`scrollbar-container`,[v(`>`,[V])])]),v(`&:first-child >`,[m(`scrollbar-container`,[v(`>`,[m(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `)])])])]),l(`footer`,`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[v(`&:first-child`,`
 padding-top: var(--n-padding-bottom);
 `)]),l(`action`,`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),m(`card-cover`,`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[v(`img`,`
 display: block;
 width: 100%;
 `)]),D(`bordered`,`
 border: 1px solid var(--n-border-color);
 `,[v(`&:target`,`border-color: var(--n-color-target);`)]),D(`action-segmented`,[v(`>`,[l(`action`,[v(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),D(`content-segmented, content-soft-segmented`,[v(`>`,[m(`card-content`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[v(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)]),l(`content-scrollbar`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[v(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),D(`footer-segmented, footer-soft-segmented`,[v(`>`,[l(`footer`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[v(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),D(`embedded`,`
 background-color: var(--n-color-embedded);
 `)]),k(m(`card`,`
 background: var(--n-color-modal);
 `,[D(`embedded`,`
 background-color: var(--n-color-embedded-modal);
 `)])),i(m(`card`,`
 background: var(--n-color-popover);
 `,[D(`embedded`,`
 background-color: var(--n-color-embedded-popover);
 `)]))]),U={title:[String,Function],contentClass:String,contentStyle:[Object,String],contentScrollable:Boolean,headerClass:String,headerStyle:[Object,String],headerExtraClass:String,headerExtraStyle:[Object,String],footerClass:String,footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:String,bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:`div`},cover:Function,content:[String,Function],footer:Function,action:Function,headerExtra:Function,closeFocusable:Boolean},W=P(U),G={...O.props,...U},K=c({name:`Card`,props:G,slots:Object,setup(t){let n=()=>{let{onClose:e}=t;e&&p(e)},{inlineThemeDisabled:i,mergedClsPrefixRef:a,mergedRtlRef:o,mergedComponentPropsRef:s}=x(t),c=O(`Card`,`-card`,H,B,t,a),l=h(`Card`,o,a),d=E(()=>t.size||s?.value?.Card?.size||`medium`),f=E(()=>{let t=d.value,{self:{color:n,colorModal:r,colorTarget:i,textColor:a,titleTextColor:o,titleFontWeight:s,borderColor:l,actionColor:f,borderRadius:p,lineHeight:m,closeIconColor:h,closeIconColorHover:g,closeIconColorPressed:_,closeColorHover:v,closeColorPressed:y,closeBorderRadius:b,closeIconSize:x,closeSize:S,boxShadow:C,colorPopover:w,colorEmbedded:T,colorEmbeddedModal:E,colorEmbeddedPopover:D,[u(`padding`,t)]:O,[u(`fontSize`,t)]:k,[u(`titleFontSize`,t)]:A},common:{cubicBezierEaseInOut:j}}=c.value,{top:M,left:N,bottom:P}=e(O);return{"--n-bezier":j,"--n-border-radius":p,"--n-color":n,"--n-color-modal":r,"--n-color-popover":w,"--n-color-embedded":T,"--n-color-embedded-modal":E,"--n-color-embedded-popover":D,"--n-color-target":i,"--n-text-color":a,"--n-line-height":m,"--n-action-color":f,"--n-title-text-color":o,"--n-title-font-weight":s,"--n-close-icon-color":h,"--n-close-icon-color-hover":g,"--n-close-icon-color-pressed":_,"--n-close-color-hover":v,"--n-close-color-pressed":y,"--n-border-color":l,"--n-box-shadow":C,"--n-padding-top":M,"--n-padding-bottom":P,"--n-padding-left":N,"--n-font-size":k,"--n-title-font-size":A,"--n-close-size":S,"--n-close-icon-size":x,"--n-close-border-radius":b}}),m=i?r(`card`,E(()=>d.value[0]),f,t):void 0;return{rtlEnabled:l,mergedClsPrefix:a,mergedTheme:c,handleCloseClick:n,cssVars:i?void 0:f,themeClass:m?.themeClass,onRender:m?.onRender}},render(){let{segmented:e,bordered:r,hoverable:i,mergedClsPrefix:a,rtlEnabled:s,onRender:c,embedded:l,tag:u,$slots:p}=this;return c?.(),t(),f(u,{class:n([`${a}-card`,this.themeClass,l&&`${a}-card--embedded`,{[`${a}-card--rtl`]:s,[`${a}-card--content-scrollable`]:this.contentScrollable,[`${a}-card--content${typeof e!=`boolean`&&e.content===`soft`?`-soft`:``}-segmented`]:e===!0||e!==!1&&e.content,[`${a}-card--footer${typeof e!=`boolean`&&e.footer===`soft`?`-soft`:``}-segmented`]:e===!0||e!==!1&&e.footer,[`${a}-card--action-segmented`]:e===!0||e!==!1&&e.action,[`${a}-card--bordered`]:r,[`${a}-card--hoverable`]:i}]),style:M(this.cssVars),role:this.role},{default:o(()=>[w(()=>g(p.cover,e=>{let r=this.cover?T([this.cover()]):e;return r&&(t(),_(`div`,{class:n(`${a}-card-cover`),role:`none`},[w(()=>r)],2))})),w(()=>g(p.header,e=>{let{title:r}=this,i=r?T(typeof r==`function`?[r()]:[r]):e;return i||this.closable?(t(),_(`div`,{key:1,class:n([`${a}-card-header`,this.headerClass]),style:M(this.headerStyle),role:`heading`},[d(`div`,{class:n(`${a}-card-header__main`),role:`heading`},[w(()=>i)],2),w(()=>g(p[`header-extra`],e=>{let r=this.headerExtra?T([this.headerExtra()]):e;return r&&(t(),_(`div`,{class:n([`${a}-card-header__extra`,this.headerExtraClass]),style:M(this.headerExtraStyle)},[w(()=>r)],6))})),w(()=>this.closable&&(t(),f(L,{clsPrefix:a,class:n(`${a}-card-header__close`),onClick:this.handleCloseClick,focusable:this.closeFocusable,absolute:!0},null,8,[`clsPrefix`,`class`,`onClick`,`focusable`])))],6)):null})),w(()=>g(p.default,e=>{let{content:r}=this,i=r?T(typeof r==`function`?[r()]:[r]):e;return i?this.contentScrollable?(t(),f(y,{key:2,class:n(`${a}-card__content-scrollbar`),contentClass:[`${a}-card-content`,this.contentClass],contentStyle:this.contentStyle},{default:()=>i},1032,[`class`,`contentClass`,`contentStyle`])):(t(),_(`div`,{key:3,class:n([`${a}-card-content`,this.contentClass]),style:M(this.contentStyle),role:`none`},[w(()=>i)],6)):null})),w(()=>g(p.footer,e=>{let r=this.footer?T([this.footer()]):e;return r&&(t(),_(`div`,{class:n([`${a}-card__footer`,this.footerClass]),style:M(this.footerStyle),role:`none`},[w(()=>r)],6))})),w(()=>g(p.action,e=>{let r=this.action?T([this.action()]):e;return r&&(t(),_(`div`,{class:n(`${a}-card__action`),role:`none`},[w(()=>r)],2))}))]),_:2},1032,[`class`,`style`,`role`])}});export{B as a,P as c,G as i,W as n,z as o,U as r,L as s,K as t};