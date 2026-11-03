import{C as e,D as t,Mn as n,Nn as r,Q as i,S as a,T as o,_n as s,b as c,c as l,et as u,fn as d,ht as f,lt as p,mn as m,n as h,ot as g,tt as _,un as v,vt as y,wn as b,x}from"./replaceable-B-PFC1y9.js";import{At as S,z as C}from"./toString-BWDzaUQG.js";function w(e){let{baseColor:n,textColor2:r,bodyColor:i,cardColor:a,dividerColor:o,actionColor:s,scrollbarColor:c,scrollbarColorHover:l,invertedColor:u}=e;return{textColor:r,textColorInverted:`#FFF`,color:i,colorEmbedded:s,headerColor:a,headerColorInverted:u,footerColor:s,footerColorInverted:u,headerBorderColor:o,headerBorderColorInverted:u,footerBorderColor:o,footerBorderColorInverted:u,siderBorderColor:o,siderBorderColorInverted:u,siderColor:a,siderColorInverted:u,siderToggleButtonBorder:`1px solid ${o}`,siderToggleButtonColor:n,siderToggleButtonIconColor:r,siderToggleButtonIconColorInverted:r,siderToggleBarColor:t(i,c),siderToggleBarColorHover:t(i,l),__invertScrollbar:`true`}}var T=c({name:`Layout`,common:o,peers:{Scrollbar:e},self:w}),E=p(`n-layout-sider`),D={type:String,default:`static`},O=f(`layout`,`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[f(`layout-scroll-container`,`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),y(`absolute-positioned`,`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),k={embedded:Boolean,position:D,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:``},hasSider:Boolean,siderPlacement:{type:String,default:`left`}},A=p(`n-layout`);function j(e){return s({name:e?`LayoutContent`:`Layout`,props:{...x.props,...k},setup(e){let t=C(null),n=C(null),{mergedClsPrefixRef:i,inlineThemeDisabled:o}=g(e),s=x(`Layout`,`-layout`,O,T,e,i);function c(r,i){if(e.nativeScrollbar){let{value:e}=t;e&&(i===void 0?e.scrollTo(r):e.scrollTo(r,i))}else{let{value:e}=n;e&&e.scrollTo(r,i)}}r(A,e);let u=0,d=0,f=t=>{let n=t.target;u=n.scrollLeft,d=n.scrollTop,e.onScroll?.(t)};l(()=>{if(e.nativeScrollbar){let e=t.value;e&&(e.scrollTop=d,e.scrollLeft=u)}});let p={display:`flex`,flexWrap:`nowrap`,width:`100%`,flexDirection:`row`},m={scrollTo:c},h=v(()=>{let{common:{cubicBezierEaseInOut:t},self:n}=s.value;return{"--n-bezier":t,"--n-color":e.embedded?n.colorEmbedded:n.color,"--n-text-color":n.textColor}}),_=o?a(`layout`,v(()=>e.embedded?`e`:``),h,e):void 0;return{mergedClsPrefix:i,scrollableElRef:t,scrollbarInstRef:n,hasSiderStyle:p,mergedTheme:s,handleNativeElScroll:f,cssVars:o?void 0:h,themeClass:_?.themeClass,onRender:_?.onRender,...m}},render(){let{mergedClsPrefix:t,hasSider:r}=this;this.onRender?.();let a=r?this.hasSiderStyle:void 0,o=[this.themeClass,e&&`${t}-layout-content`,`${t}-layout`,`${t}-layout--${this.position}-positioned`];return n(),m(`div`,{class:i(o),style:S(this.cssVars)},[this.nativeScrollbar?(n(),m(`div`,{key:0,ref:`scrollableElRef`,class:i([`${t}-layout-scroll-container`,this.contentClass]),style:S([this.contentStyle,a]),onScroll:this.handleNativeElScroll},[_(()=>this.$slots.default?.())],46,[`onScroll`])):(n(),d(h,b({key:1},this.scrollbarProps,{onScroll:this.onScroll,ref:`scrollbarInstRef`,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,a]}),u(this.$slots),1040,[`onScroll`,`theme`,`themeOverrides`,`contentClass`,`contentStyle`]))],6)}})}var M=j(!1);export{D as a,E as i,j as n,T as o,A as r,M as t};