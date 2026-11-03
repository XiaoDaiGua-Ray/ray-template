import{E as e,J as t,Mn as n,Nn as r,Q as i,S as a,T as o,_n as s,_t as c,bt as l,dn as u,fn as d,g as f,ht as p,l as m,lt as h,m as g,mn as _,mt as v,ot as y,tt as b,un as x,vt as S,x as C,yt as w}from"./replaceable-DW6s2lkT.js";import{t as T}from"./color-to-class-G4jmrDIg.js";import{s as E}from"./Card-D38P0NK6.js";import{At as D,J as O,z as k}from"./toString-BWDzaUQG.js";var A={closeIconSizeTiny:`12px`,closeIconSizeSmall:`12px`,closeIconSizeMedium:`14px`,closeIconSizeLarge:`14px`,closeSizeTiny:`16px`,closeSizeSmall:`16px`,closeSizeMedium:`18px`,closeSizeLarge:`18px`,padding:`0 7px`,closeMargin:`0 0 0 4px`};function j(t){let{textColor2:n,primaryColorHover:r,primaryColorPressed:i,primaryColor:a,infoColor:o,successColor:s,warningColor:c,errorColor:l,baseColor:u,borderColor:d,opacityDisabled:f,tagColor:p,closeIconColor:m,closeIconColorHover:h,closeIconColorPressed:g,borderRadiusSmall:_,fontSizeMini:v,fontSizeTiny:y,fontSizeSmall:b,fontSizeMedium:x,heightMini:S,heightTiny:C,heightSmall:w,heightMedium:T,closeColorHover:E,closeColorPressed:D,buttonColor2Hover:O,buttonColor2Pressed:k,fontWeightStrong:j}=t;return{...A,closeBorderRadius:_,heightTiny:S,heightSmall:C,heightMedium:w,heightLarge:T,borderRadius:_,opacityDisabled:f,fontSizeTiny:v,fontSizeSmall:y,fontSizeMedium:b,fontSizeLarge:x,fontWeightStrong:j,textColorCheckable:n,textColorHoverCheckable:n,textColorPressedCheckable:n,textColorChecked:u,colorCheckable:`#0000`,colorHoverCheckable:O,colorPressedCheckable:k,colorChecked:a,colorCheckedHover:r,colorCheckedPressed:i,border:`1px solid ${d}`,textColor:n,color:p,colorBordered:`rgb(250, 250, 252)`,closeIconColor:m,closeIconColorHover:h,closeIconColorPressed:g,closeColorHover:E,closeColorPressed:D,borderPrimary:`1px solid ${e(a,{alpha:.3})}`,textColorPrimary:a,colorPrimary:e(a,{alpha:.12}),colorBorderedPrimary:e(a,{alpha:.1}),closeIconColorPrimary:a,closeIconColorHoverPrimary:a,closeIconColorPressedPrimary:a,closeColorHoverPrimary:e(a,{alpha:.12}),closeColorPressedPrimary:e(a,{alpha:.18}),borderInfo:`1px solid ${e(o,{alpha:.3})}`,textColorInfo:o,colorInfo:e(o,{alpha:.12}),colorBorderedInfo:e(o,{alpha:.1}),closeIconColorInfo:o,closeIconColorHoverInfo:o,closeIconColorPressedInfo:o,closeColorHoverInfo:e(o,{alpha:.12}),closeColorPressedInfo:e(o,{alpha:.18}),borderSuccess:`1px solid ${e(s,{alpha:.3})}`,textColorSuccess:s,colorSuccess:e(s,{alpha:.12}),colorBorderedSuccess:e(s,{alpha:.1}),closeIconColorSuccess:s,closeIconColorHoverSuccess:s,closeIconColorPressedSuccess:s,closeColorHoverSuccess:e(s,{alpha:.12}),closeColorPressedSuccess:e(s,{alpha:.18}),borderWarning:`1px solid ${e(c,{alpha:.35})}`,textColorWarning:c,colorWarning:e(c,{alpha:.15}),colorBorderedWarning:e(c,{alpha:.12}),closeIconColorWarning:c,closeIconColorHoverWarning:c,closeIconColorPressedWarning:c,closeColorHoverWarning:e(c,{alpha:.12}),closeColorPressedWarning:e(c,{alpha:.18}),borderError:`1px solid ${e(l,{alpha:.23})}`,textColorError:l,colorError:e(l,{alpha:.1}),colorBorderedError:e(l,{alpha:.08}),closeIconColorError:l,closeIconColorHoverError:l,closeIconColorPressedError:l,closeColorHoverError:e(l,{alpha:.12}),closeColorPressedError:e(l,{alpha:.18})}}var M={name:`Tag`,common:o,self:j},N={color:Object,type:{type:String,default:`default`},round:Boolean,size:String,closable:Boolean,disabled:{type:Boolean,default:void 0}},P=p(`tag`,`
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-right) var(--n-close-margin-bottom) var(--n-close-margin-left);
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`,[S(`strong`,`
 font-weight: var(--n-font-weight-strong);
 `),c(`border`,`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `),c(`icon`,`
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `),c(`avatar`,`
 display: flex;
 margin: 0 6px 0 0;
 `),c(`close`,`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),S(`round`,`
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `,[c(`icon`,`
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `),c(`avatar`,`
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `),S(`closable`,`
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]),S(`icon, avatar`,[S(`round`,`
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]),S(`disabled`,`
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `),S(`checkable`,`
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `,[w(`disabled`,[v(`&:hover`,`background-color: var(--n-color-hover-checkable);`,[w(`checked`,`color: var(--n-text-color-hover-checkable);`)]),v(`&:active`,`background-color: var(--n-color-pressed-checkable);`,[w(`checked`,`color: var(--n-text-color-pressed-checkable);`)])]),S(`checked`,`
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `,[w(`disabled`,[v(`&:hover`,`background-color: var(--n-color-checked-hover);`),v(`&:active`,`background-color: var(--n-color-checked-pressed);`)])])])]),F=[`onClick`,`onMouseenter`,`onMouseleave`],I={...C.props,...N,bordered:{type:Boolean,default:void 0},checked:Boolean,checkable:Boolean,strong:Boolean,triggerClickOnClose:Boolean,onClose:[Array,Function],onMouseenter:Function,onMouseleave:Function,"onUpdate:checked":Function,onUpdateChecked:Function,internalCloseFocusable:{type:Boolean,default:!0},internalCloseIsButtonTag:{type:Boolean,default:!0},onCheckedChange:Function},L=h(`n-tag`),R=s({name:`Tag`,props:I,slots:Object,setup(e){let n=k(null),{mergedBorderedRef:i,mergedClsPrefixRef:o,inlineThemeDisabled:s,mergedRtlRef:c,mergedComponentPropsRef:u}=y(e),d=x(()=>e.size||u?.value?.Tag?.size||`medium`),p=C(`Tag`,`-tag`,P,M,e,o);r(L,{roundRef:O(e,`round`)});function h(){if(!e.disabled&&e.checkable){let{checked:t,onCheckedChange:n,onUpdateChecked:r,"onUpdate:checked":i}=e;r&&r(!t),i&&i(!t),n&&n(!t)}}function g(t){if(e.triggerClickOnClose||t.stopPropagation(),!e.disabled){let{onClose:n}=e;n&&f(n,t)}}let _={setTextContent(e){let{value:t}=n;t&&(t.textContent=e)}},v=m(`Tag`,c,o),b=x(()=>{let{type:n,color:{color:r,textColor:a}={}}=e,o=d.value,{common:{cubicBezierEaseInOut:s},self:{padding:c,closeMargin:u,borderRadius:f,opacityDisabled:m,textColorCheckable:h,textColorHoverCheckable:g,textColorPressedCheckable:_,textColorChecked:v,colorCheckable:y,colorHoverCheckable:b,colorPressedCheckable:x,colorChecked:S,colorCheckedHover:C,colorCheckedPressed:w,closeBorderRadius:T,fontWeightStrong:E,[l(`colorBordered`,n)]:D,[l(`closeSize`,o)]:O,[l(`closeIconSize`,o)]:k,[l(`fontSize`,o)]:A,[l(`height`,o)]:j,[l(`color`,n)]:M,[l(`textColor`,n)]:N,[l(`border`,n)]:P,[l(`closeIconColor`,n)]:F,[l(`closeIconColorHover`,n)]:I,[l(`closeIconColorPressed`,n)]:L,[l(`closeColorHover`,n)]:R,[l(`closeColorPressed`,n)]:z}}=p.value,B=t(u);return{"--n-font-weight-strong":E,"--n-avatar-size-override":`calc(${j} - 8px)`,"--n-bezier":s,"--n-border-radius":f,"--n-border":P,"--n-close-icon-size":k,"--n-close-color-pressed":z,"--n-close-color-hover":R,"--n-close-border-radius":T,"--n-close-icon-color":F,"--n-close-icon-color-hover":I,"--n-close-icon-color-pressed":L,"--n-close-icon-color-disabled":F,"--n-close-margin-top":B.top,"--n-close-margin-right":B.right,"--n-close-margin-bottom":B.bottom,"--n-close-margin-left":B.left,"--n-close-size":O,"--n-color":r||(i.value?D:M),"--n-color-checkable":y,"--n-color-checked":S,"--n-color-checked-hover":C,"--n-color-checked-pressed":w,"--n-color-hover-checkable":b,"--n-color-pressed-checkable":x,"--n-font-size":A,"--n-height":j,"--n-opacity-disabled":m,"--n-padding":c,"--n-text-color":a||N,"--n-text-color-checkable":h,"--n-text-color-checked":v,"--n-text-color-hover-checkable":g,"--n-text-color-pressed-checkable":_}}),S=s?a(`tag`,x(()=>{let t=``,{type:n,color:{color:r,textColor:a}={}}=e;return t+=n[0],t+=d.value[0],r&&(t+=`a${T(r)}`),a&&(t+=`b${T(a)}`),i.value&&(t+=`c`),t}),b,e):void 0;return{..._,rtlEnabled:v,mergedClsPrefix:o,contentRef:n,mergedBordered:i,handleClick:h,handleCloseClick:g,cssVars:s?void 0:b,themeClass:S?.themeClass,onRender:S?.onRender}},render(){let{mergedClsPrefix:e,rtlEnabled:t,closable:r,color:{borderColor:a}={},round:o,onRender:s,$slots:c}=this;s?.();let l=g(c.avatar,t=>t&&(n(),_(`div`,{class:i(`${e}-tag__avatar`)},[b(()=>t)],2))),f=g(c.icon,t=>t&&(n(),_(`div`,{class:i(`${e}-tag__icon`)},[b(()=>t)],2)));return n(),_(`div`,{class:i([`${e}-tag`,this.themeClass,{[`${e}-tag--rtl`]:t,[`${e}-tag--strong`]:this.strong,[`${e}-tag--disabled`]:this.disabled,[`${e}-tag--checkable`]:this.checkable,[`${e}-tag--checked`]:this.checkable&&this.checked,[`${e}-tag--round`]:o,[`${e}-tag--avatar`]:l,[`${e}-tag--icon`]:f,[`${e}-tag--closable`]:r}]),style:D(this.cssVars),onClick:this.handleClick,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},[b(()=>f||l),u(`span`,{class:i(`${e}-tag__content`),ref:`contentRef`},[b(()=>this.$slots.default?.())],2),!this.checkable&&r?(n(),d(E,{key:0,clsPrefix:e,class:i(`${e}-tag__close`),disabled:this.disabled,onClick:this.handleCloseClick,focusable:this.internalCloseFocusable,round:o,isButtonTag:this.internalCloseIsButtonTag,absolute:!0},null,8,[`clsPrefix`,`class`,`disabled`,`onClick`,`focusable`,`round`,`isButtonTag`])):b(()=>null),!this.checkable&&this.mergedBordered?(n(),_(`div`,{key:2,class:i(`${e}-tag__border`),style:D({borderColor:a})},null,6)):b(()=>null)],46,F)}});export{A as a,M as i,L as n,N as r,R as t};