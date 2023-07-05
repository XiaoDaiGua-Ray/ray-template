import{t as re,j as Tt}from"./utils-vendor-532067a6.js";import{i as _t,u as Lt,c as Bt,a as ye,b as Wt,d as G,e as r,f as Ae,g as jt,h as te,j as _,k as Fe,l as kt,t as Et,N as At,r as Ft,m as Ot,o as Nt,n as i,p as S,q as T,s as It,v as Ht,w as we,x as oe,y as Vt,z as Dt,A as K,B as Se,V as Ce,C as J,D as Oe,E as Gt,F as Mt,G as Re,H as ze,I as qt,J as Ut,K as Pe,L as $e,M as Te,R as Xt,O as Qt,P as Yt,Q as ee,S as M,T as Kt,U as Jt,W as Zt,X as ea,Y as ta,Z as _e}from"./index-1016cc88.js";import{d as k,r as P,h as u,l as A,f as Ne,G as aa,F as Ie,w as ie,n as se,q as na,x as N,B as ra,t as oa,E as ia,I as sa,H as la,P as s,i as He,p as Ve,R as De,e as Z}from"./vue-vendor-dfef56cd.js";import{Q as da}from"./components-vendor-de3509bb.js";import{R as ca}from"./index-a156ee80.js";import{A as ba}from"./Add-274eaaf6.js";import{N as ua,a as Le}from"./Grid-b5fe1ca4.js";let Be=!1;function pa(){if(_t&&window.CSS&&!Be&&(Be=!0,"registerProperty"in(window==null?void 0:window.CSS)))try{CSS.registerProperty({name:"--n-color-start",syntax:"<color>",inherits:!1,initialValue:"#0000"}),CSS.registerProperty({name:"--n-color-end",syntax:"<color>",inherits:!1,initialValue:"#0000"})}catch{}}const fa=ye(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[ye("&::-webkit-scrollbar",{width:0,height:0})]),ga=k({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=P(null);function a(c){!(c.currentTarget.offsetWidth<c.currentTarget.scrollWidth)||c.deltaY===0||(c.currentTarget.scrollLeft+=c.deltaY+c.deltaX,c.preventDefault())}const d=Lt();return fa.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:Bt,ssr:d}),Object.assign({selfRef:e,handleWheel:a},{scrollTo(...c){var g;(g=e.value)===null||g===void 0||g.scrollTo(...c)}})},render(){return u("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}}),va=e=>{const{primaryColor:a,successColor:d,warningColor:f,errorColor:c,infoColor:g,fontWeightStrong:p}=e;return{fontWeight:p,rotate:"252deg",colorStartPrimary:G(a,{alpha:.6}),colorEndPrimary:a,colorStartInfo:G(g,{alpha:.6}),colorEndInfo:g,colorStartWarning:G(f,{alpha:.6}),colorEndWarning:f,colorStartError:G(c,{alpha:.6}),colorEndError:c,colorStartSuccess:G(d,{alpha:.6}),colorEndSuccess:d}},ha={name:"GradientText",common:Wt,self:va},ma=ha,xa=r("gradient-text",`
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`),ya=Object.assign(Object.assign({},te.props),{size:[String,Number],fontSize:[String,Number],type:{type:String,default:"primary"},color:[Object,String],gradient:[Object,String]}),We=k({name:"GradientText",props:ya,setup(e){pa();const{mergedClsPrefixRef:a,inlineThemeDisabled:d}=Ae(e),f=A(()=>{const{type:b}=e;return b==="danger"?"error":b}),c=A(()=>{let b=e.size||e.fontSize;return b&&(b=jt(b)),b||void 0}),g=A(()=>{const b=e.color||e.gradient;if(typeof b=="string")return b;if(b){const v=b.deg||0,w=b.from,h=b.to;return`linear-gradient(${v}deg, ${w} 0%, ${h} 100%)`}}),p=te("GradientText","-gradient-text",xa,ma,e,a),x=A(()=>{const{value:b}=f,{common:{cubicBezierEaseInOut:v},self:{rotate:w,[_("colorStart",b)]:h,[_("colorEnd",b)]:C,fontWeight:R}}=p.value;return{"--n-bezier":v,"--n-rotate":w,"--n-color-start":h,"--n-color-end":C,"--n-font-weight":R}}),y=d?Fe("gradient-text",A(()=>f.value[0]),x,e):void 0;return{mergedClsPrefix:a,compatibleType:f,styleFontSize:c,styleBgImage:g,cssVars:d?void 0:x,themeClass:y==null?void 0:y.themeClass,onRender:y==null?void 0:y.onRender}},render(){const{mergedClsPrefix:e,onRender:a}=this;return a==null||a(),u("span",{class:[`${e}-gradient-text`,`${e}-gradient-text--${this.compatibleType}-type`,this.themeClass],style:[{fontSize:this.styleFontSize,backgroundImage:this.styleBgImage},this.cssVars]},this.$slots)}}),be=kt("n-tabs"),Ge={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},le=k({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Ge,setup(e){const a=Ne(be,null);return a||Et("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:a.paneStyleRef,class:a.paneClassRef,mergedClsPrefix:a.mergedClsPrefixRef}},render(){return u("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),wa=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Nt(Ge,["displayDirective"])),ce=k({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:wa,setup(e){const{mergedClsPrefixRef:a,valueRef:d,typeRef:f,closableRef:c,tabStyleRef:g,tabChangeIdRef:p,onBeforeLeaveRef:x,triggerRef:y,handleAdd:b,activateTab:v,handleClose:w}=Ne(be);return{trigger:y,mergedClosable:A(()=>{if(e.internalAddable)return!1;const{closable:h}=e;return h===void 0?c.value:h}),style:g,clsPrefix:a,value:d,type:f,handleClose(h){h.stopPropagation(),!e.disabled&&w(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){b();return}const{name:h}=e,C=++p.id;if(h!==d.value){const{value:R}=x;R?Promise.resolve(R(e.name,d.value)).then(W=>{W&&p.id===C&&v(h)}):v(h)}}}},render(){const{internalAddable:e,clsPrefix:a,name:d,disabled:f,label:c,tab:g,value:p,mergedClosable:x,style:y,trigger:b,$slots:{default:v}}=this,w=c??g;return u("div",{class:`${a}-tabs-tab-wrapper`},this.internalLeftPadded?u("div",{class:`${a}-tabs-tab-pad`}):null,u("div",Object.assign({key:d,"data-name":d,"data-disabled":f?!0:void 0},aa({class:[`${a}-tabs-tab`,p===d&&`${a}-tabs-tab--active`,f&&`${a}-tabs-tab--disabled`,x&&`${a}-tabs-tab--closable`,e&&`${a}-tabs-tab--addable`],onClick:b==="click"?this.activateTab:void 0,onMouseenter:b==="hover"?this.activateTab:void 0,style:e?void 0:y},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),u("span",{class:`${a}-tabs-tab__label`},e?u(Ie,null,u("div",{class:`${a}-tabs-tab__height-placeholder`}," "),u(At,{clsPrefix:a},{default:()=>u(ba,null)})):v?v():typeof w=="object"?w:Ft(w??d)),x&&this.type==="card"?u(Ot,{clsPrefix:a,class:`${a}-tabs-tab__close`,onClick:this.handleClose,disabled:f}):null))}}),Sa=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[i("segment-type",[r("tabs-rail",[S("&.transition-disabled","color: red;",[r("tabs-tab",`
 transition: none;
 `)])])]),i("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),i("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),i("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),i("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),i("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[i("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 `),S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),i("flex",[r("tabs-nav",{width:"100%"},[r("tabs-wrapper",{width:"100%"},[r("tabs-tab",{marginRight:0})])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[T("prefix, suffix",`
 display: flex;
 align-items: center;
 `),T("prefix","padding-right: 16px;"),T("suffix","padding-left: 16px;")]),i("top, bottom",[r("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),S("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),i("shadow-start",[S("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[S("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),i("left, right",[r("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),S("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),i("shadow-start",[S("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[S("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[S("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),S("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[i("disabled",{cursor:"not-allowed"}),T("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),T("label",`
 display: flex;
 align-items: center;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[S("&.transition-disabled",`
 transition: none;
 `),i("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[S("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),S("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),S("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),S("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),S("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),i("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[S("&:hover",{color:"var(--n-tab-text-color-hover)"}),i("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),i("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[i("line-type",[i("top",[T("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),i("left",[T("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),i("right",[T("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),i("bottom",[T("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),T("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),i("card-type",[T("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[i("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[T("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),It("disabled",[S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),i("closable","padding-right: 8px;"),i("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),i("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),i("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),i("top",[i("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),i("left",[i("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),i("right",[i("card-type",[r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),i("bottom",[i("card-type",[r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),Ca=Object.assign(Object.assign({},te.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Ra=k({name:"Tabs",props:Ca,setup(e,{slots:a}){var d,f,c,g;const{mergedClsPrefixRef:p,inlineThemeDisabled:x}=Ae(e),y=te("Tabs","-tabs",Sa,Ht,e,p),b=P(null),v=P(null),w=P(null),h=P(null),C=P(null),R=P(!0),W=P(!0),j=we(e,["labelSize","size"]),I=we(e,["activeName","value"]),L=P((f=(d=I.value)!==null&&d!==void 0?d:e.defaultValue)!==null&&f!==void 0?f:a.default?(g=(c=oe(a.default())[0])===null||c===void 0?void 0:c.props)===null||g===void 0?void 0:g.name:null),E=Vt(I,L),F={id:0},m=A(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});ie(E,()=>{F.id=0,q(),pe()});function z(){var t;const{value:n}=E;return n===null?null:(t=b.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${n}"]`)}function D(t){if(e.type==="card")return;const{value:n}=v;if(n&&t){const o=`${p.value}-tabs-bar--disabled`,{barWidth:l,placement:$}=e;if(t.dataset.disabled==="true"?n.classList.add(o):n.classList.remove(o),["top","bottom"].includes($)){if(ue(["top","maxHeight","height"]),typeof l=="number"&&t.offsetWidth>=l){const B=Math.floor((t.offsetWidth-l)/2)+t.offsetLeft;n.style.left=`${B}px`,n.style.maxWidth=`${l}px`}else n.style.left=`${t.offsetLeft}px`,n.style.maxWidth=`${t.offsetWidth}px`;n.style.width="8192px",n.offsetWidth}else{if(ue(["left","maxWidth","width"]),typeof l=="number"&&t.offsetHeight>=l){const B=Math.floor((t.offsetHeight-l)/2)+t.offsetTop;n.style.top=`${B}px`,n.style.maxHeight=`${l}px`}else n.style.top=`${t.offsetTop}px`,n.style.maxHeight=`${t.offsetHeight}px`;n.style.height="8192px",n.offsetHeight}}}function ue(t){const{value:n}=v;if(n)for(const o of t)n.style[o]=""}function q(){if(e.type==="card")return;const t=z();t&&D(t)}function pe(t){var n;const o=(n=C.value)===null||n===void 0?void 0:n.$el;if(!o)return;const l=z();if(!l)return;const{scrollLeft:$,offsetWidth:B}=o,{offsetLeft:V,offsetWidth:Q}=l;$>V?o.scrollTo({top:0,left:V,behavior:"smooth"}):V+Q>$+B&&o.scrollTo({top:0,left:V+Q-B,behavior:"smooth"})}const U=P(null);let ae=0,O=null;function Me(t){const n=U.value;if(n){ae=t.getBoundingClientRect().height;const o=`${ae}px`,l=()=>{n.style.height=o,n.style.maxHeight=o};O?(l(),O(),O=null):O=l}}function qe(t){const n=U.value;if(n){const o=t.getBoundingClientRect().height,l=()=>{document.body.offsetHeight,n.style.maxHeight=`${o}px`,n.style.height=`${Math.max(ae,o)}px`};O?(O(),O=null,l()):O=l}}function Ue(){const t=U.value;t&&(t.style.maxHeight="",t.style.height="")}const fe={value:[]},ge=P("next");function Xe(t){const n=E.value;let o="next";for(const l of fe.value){if(l===n)break;if(l===t){o="prev";break}}ge.value=o,Qe(t)}function Qe(t){const{onActiveNameChange:n,onUpdateValue:o,"onUpdate:value":l}=e;n&&J(n,t),o&&J(o,t),l&&J(l,t),L.value=t}function Ye(t){const{onClose:n}=e;n&&J(n,t)}function ve(){const{value:t}=v;if(!t)return;const n="transition-disabled";t.classList.add(n),q(),t.classList.remove(n)}let he=0;function Ke(t){var n;if(t.contentRect.width===0&&t.contentRect.height===0||he===t.contentRect.width)return;he=t.contentRect.width;const{type:o}=e;(o==="line"||o==="bar")&&ve(),o!=="segment"&&ne((n=C.value)===null||n===void 0?void 0:n.$el)}const Je=re(Ke,64);ie([()=>e.justifyContent,()=>e.size],()=>{se(()=>{const{type:t}=e;(t==="line"||t==="bar")&&ve()})});const X=P(!1);function Ze(t){var n;const{target:o,contentRect:{width:l}}=t,$=o.parentElement.offsetWidth;if(!X.value)$<l&&(X.value=!0);else{const{value:B}=h;if(!B)return;$-l>B.$el.offsetWidth&&(X.value=!1)}ne((n=C.value)===null||n===void 0?void 0:n.$el)}const et=re(Ze,64);function tt(){const{onAdd:t}=e;t&&t(),se(()=>{const n=z(),{value:o}=C;!n||!o||o.scrollTo({left:n.offsetLeft,top:0,behavior:"smooth"})})}function ne(t){if(!t)return;const{placement:n}=e;if(n==="top"||n==="bottom"){const{scrollLeft:o,scrollWidth:l,offsetWidth:$}=t;R.value=o<=0,W.value=o+$>=l}else{const{scrollTop:o,scrollHeight:l,offsetHeight:$}=t;R.value=o<=0,W.value=o+$>=l}}const at=re(t=>{ne(t.target)},64);na(be,{triggerRef:N(e,"trigger"),tabStyleRef:N(e,"tabStyle"),paneClassRef:N(e,"paneClass"),paneStyleRef:N(e,"paneStyle"),mergedClsPrefixRef:p,typeRef:N(e,"type"),closableRef:N(e,"closable"),valueRef:E,tabChangeIdRef:F,onBeforeLeaveRef:N(e,"onBeforeLeave"),activateTab:Xe,handleClose:Ye,handleAdd:tt}),Dt(()=>{q(),pe()}),ra(()=>{const{value:t}=w;if(!t)return;const{value:n}=p,o=`${n}-tabs-nav-scroll-wrapper--shadow-start`,l=`${n}-tabs-nav-scroll-wrapper--shadow-end`;R.value?t.classList.remove(o):t.classList.add(o),W.value?t.classList.remove(l):t.classList.add(l)});const me=P(null);ie(E,()=>{if(e.type==="segment"){const t=me.value;t&&se(()=>{t.classList.add("transition-disabled"),t.offsetWidth,t.classList.remove("transition-disabled")})}});const nt={syncBarPosition:()=>{q()}},xe=A(()=>{const{value:t}=j,{type:n}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[n],l=`${t}${o}`,{self:{barColor:$,closeIconColor:B,closeIconColorHover:V,closeIconColorPressed:Q,tabColor:rt,tabBorderColor:ot,paneTextColor:it,tabFontWeight:st,tabBorderRadius:lt,tabFontWeightActive:dt,colorSegment:ct,fontWeightStrong:bt,tabColorSegment:ut,closeSize:pt,closeIconSize:ft,closeColorHover:gt,closeColorPressed:vt,closeBorderRadius:ht,[_("panePadding",t)]:Y,[_("tabPadding",l)]:mt,[_("tabPaddingVertical",l)]:xt,[_("tabGap",l)]:yt,[_("tabGap",`${l}Vertical`)]:wt,[_("tabTextColor",n)]:St,[_("tabTextColorActive",n)]:Ct,[_("tabTextColorHover",n)]:Rt,[_("tabTextColorDisabled",n)]:zt,[_("tabFontSize",t)]:Pt},common:{cubicBezierEaseInOut:$t}}=y.value;return{"--n-bezier":$t,"--n-color-segment":ct,"--n-bar-color":$,"--n-tab-font-size":Pt,"--n-tab-text-color":St,"--n-tab-text-color-active":Ct,"--n-tab-text-color-disabled":zt,"--n-tab-text-color-hover":Rt,"--n-pane-text-color":it,"--n-tab-border-color":ot,"--n-tab-border-radius":lt,"--n-close-size":pt,"--n-close-icon-size":ft,"--n-close-color-hover":gt,"--n-close-color-pressed":vt,"--n-close-border-radius":ht,"--n-close-icon-color":B,"--n-close-icon-color-hover":V,"--n-close-icon-color-pressed":Q,"--n-tab-color":rt,"--n-tab-font-weight":st,"--n-tab-font-weight-active":dt,"--n-tab-padding":mt,"--n-tab-padding-vertical":xt,"--n-tab-gap":yt,"--n-tab-gap-vertical":wt,"--n-pane-padding-left":K(Y,"left"),"--n-pane-padding-right":K(Y,"right"),"--n-pane-padding-top":K(Y,"top"),"--n-pane-padding-bottom":K(Y,"bottom"),"--n-font-weight-strong":bt,"--n-tab-color-segment":ut}}),H=x?Fe("tabs",A(()=>`${j.value[0]}${e.type[0]}`),xe,e):void 0;return Object.assign({mergedClsPrefix:p,mergedValue:E,renderedNames:new Set,tabsRailElRef:me,tabsPaneWrapperRef:U,tabsElRef:b,barElRef:v,addTabInstRef:h,xScrollInstRef:C,scrollWrapperElRef:w,addTabFixed:X,tabWrapperStyle:m,handleNavResize:Je,mergedSize:j,handleScroll:at,handleTabsResize:et,cssVars:x?void 0:xe,themeClass:H==null?void 0:H.themeClass,animationDirection:ge,renderNameListRef:fe,onAnimationBeforeLeave:Me,onAnimationEnter:qe,onAnimationAfterEnter:Ue,onRender:H==null?void 0:H.onRender},nt)},render(){const{mergedClsPrefix:e,type:a,placement:d,addTabFixed:f,addable:c,mergedSize:g,renderNameListRef:p,onRender:x,paneWrapperClass:y,paneWrapperStyle:b,$slots:{default:v,prefix:w,suffix:h}}=this;x==null||x();const C=v?oe(v()).filter(m=>m.type.__TAB_PANE__===!0):[],R=v?oe(v()).filter(m=>m.type.__TAB__===!0):[],W=!R.length,j=a==="card",I=a==="segment",L=!j&&!I&&this.justifyContent;p.value=[];const E=()=>{const m=u("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},L?null:u("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),W?C.map((z,D)=>(p.value.push(z.props.name),de(u(ce,Object.assign({},z.props,{internalCreatedByPane:!0,internalLeftPadded:D!==0&&(!L||L==="center"||L==="start"||L==="end")}),z.children?{default:z.children.tab}:void 0)))):R.map((z,D)=>(p.value.push(z.props.name),de(D!==0&&!L?Ee(z):z))),!f&&c&&j?ke(c,(W?C.length:R.length)!==0):null,L?null:u("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return u("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},j&&c?u(Ce,{onResize:this.handleTabsResize},{default:()=>m}):m,j?u("div",{class:`${e}-tabs-pad`}):null,j?null:u("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},F=I?"top":d;return u("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${a}-type`,`${e}-tabs--${g}-size`,L&&`${e}-tabs--flex`,`${e}-tabs--${F}`],style:this.cssVars},u("div",{class:[`${e}-tabs-nav--${a}-type`,`${e}-tabs-nav--${F}`,`${e}-tabs-nav`]},Se(w,m=>m&&u("div",{class:`${e}-tabs-nav__prefix`},m)),I?u("div",{class:`${e}-tabs-rail`,ref:"tabsRailElRef"},W?C.map((m,z)=>(p.value.push(m.props.name),u(ce,Object.assign({},m.props,{internalCreatedByPane:!0,internalLeftPadded:z!==0}),m.children?{default:m.children.tab}:void 0))):R.map((m,z)=>(p.value.push(m.props.name),z===0?m:Ee(m)))):u(Ce,{onResize:this.handleNavResize},{default:()=>u("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(F)?u(ga,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:E}):u("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll},E()))}),f&&c&&j?ke(c,!0):null,Se(h,m=>m&&u("div",{class:`${e}-tabs-nav__suffix`},m))),W&&(this.animated&&(F==="top"||F==="bottom")?u("div",{ref:"tabsPaneWrapperRef",style:b,class:[`${e}-tabs-pane-wrapper`,y]},je(C,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):je(C,this.mergedValue,this.renderedNames)))}});function je(e,a,d,f,c,g,p){const x=[];return e.forEach(y=>{const{name:b,displayDirective:v,"display-directive":w}=y.props,h=R=>v===R||w===R,C=a===b;if(y.key!==void 0&&(y.key=b),C||h("show")||h("show:lazy")&&d.has(b)){d.has(b)||d.add(b);const R=!h("if");x.push(R?oa(y,[[la,C]]):y)}}),p?u(ia,{name:`${p}-transition`,onBeforeLeave:f,onEnter:c,onAfterEnter:g},{default:()=>x}):x}function ke(e,a){return u(ce,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:a,disabled:typeof e=="object"&&e.disabled})}function Ee(e){const a=sa(e);return a.props?a.props.internalLeftPadded=!0:a.props={internalLeftPadded:!0},a}function de(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}function za(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!He(e)}const Pa=k({name:"RSignin",setup(){const e=P(),{t:a}=Oe(),d=Gt(),{signin:f}=d,{path:c}=Xt,g=()=>({name:"Ray Admin",pwd:"123456"}),{router:p}=Mt(),x=P(g()),y={name:{required:!0,message:a("views.login.index.NamePlaceholder"),trigger:["blur","input"]},pwd:{required:!0,message:a("views.login.index.PasswordPlaceholder"),trigger:["blur","input"]}};return{signinForm:x,loginFormRef:e,handleLogin:()=>{var v;(v=e.value)==null||v.validate(w=>{w||(Pe(!0),f(x.value).then(h=>{h.code===0&&setTimeout(()=>{Pe(!1),window.$message.success(`欢迎${x.value.name}登陆~`),$e(Te.token,"tokenValue"),$e(Te.signin,h.data),p.push(c)},2*1e3)}).catch(()=>{window.$message.error("不可以这样哟, 不可以哟")}))})},rules:y,t:a}},render(){let e;const{t:a}=this;return s(Ut,{model:this.signinForm,ref:"loginFormRef",rules:this.rules},{default:()=>[s(Re,{label:a("views.login.index.Name"),path:"name"},{default:()=>[s(ze,{value:this.signinForm.name,"onUpdate:value":d=>this.signinForm.name=d,placeholder:a("views.login.index.NamePlaceholder")},null)]}),s(Re,{label:a("views.login.index.Password"),path:"pwd"},{default:()=>[s(ze,{value:this.signinForm.pwd,"onUpdate:value":d=>this.signinForm.pwd=d,type:"password",placeholder:a("views.login.index.PasswordPlaceholder")},null)]}),s(qt,{style:["width: 100%","margin-to: 18px"],type:"primary",onClick:this.handleLogin.bind(this)},za(e=a("views.login.index.Login"))?e:{default:()=>[e]})]})}}),$a=k({name:"RRegister",render(){return s(Qt,{status:"info",title:"提示",description:"我实在是不想写了..."},null)}});const Ta=k({name:"QRCodeSignin",setup(){const e=Ve({qrcodeValue:"https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io"});return{...De(e)}},render(){return s("div",{class:"qrcode-signin"},[s(da,{value:this.qrcodeValue,size:200},null)])}});function _a(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!He(e)}const La=k({name:"SSOSignin",setup(){return{ssoSigninOptions:[{icon:"github",key:"github",tooltipLabel:"Github登陆"},{icon:"google",key:"google",tooltipLabel:"Google登陆"},{icon:"twitter",key:"twitter",tooltipLabel:"Twitter登陆"}],handleSSOSigninClick:d=>{window.$message.info(`调用${d.tooltipLabel}`)}}},render(){let e;return s(M,{class:"sso-signin",align:"center",itemStyle:{display:"flex"}},_a(e=this.ssoSigninOptions.map(a=>s(Yt,null,{trigger:()=>s(ee,{name:a.icon,size:"24",cursor:"pointer",onClick:this.handleSSOSigninClick.bind(this,a)},null),default:()=>a.tooltipLabel})))?e:{default:()=>[e]})}}),Oa=k({name:"RLogin",setup(){const{t:e}=Oe(),{layout:{copyright:a}}={pkg:{dependencies:{"@vueuse/core":"^9.1.0",axios:"^1.2.0",clipboard:"^2.0.11","crypto-js":"^4.1.1","currency.js":"^2.0.4",dayjs:"^1.11.7",echarts:"^5.4.0","lodash-es":"^4.17.21","naive-ui":"^2.34.4",pinia:"^2.0.17","pinia-plugin-persistedstate":"^2.4.0","print-js":"^1.6.0","qrcode.vue":"^3.3.4",sass:"^1.54.3",screenfull:"^6.0.2",vue:"^3.2.47","vue-i18n":"^9.2.2","vue-router":"^4.1.3",vuedraggable:"^4.1.0",xlsx:"^0.18.5"},devDependencies:{"@babel/core":"^7.20.2","@babel/eslint-parser":"^7.19.1","@commitlint/cli":"^17.4.2","@commitlint/config-conventional":"^17.4.2","@intlify/unplugin-vue-i18n":"^0.5.0","@types/crypto-js":"^4.1.1","@types/lodash-es":"^4.17.7","@types/scrollreveal":"^0.0.8","@typescript-eslint/eslint-plugin":"^5.61.0","@typescript-eslint/parser":"^5.61.0","@vitejs/plugin-vue":"^4.1.0","@vitejs/plugin-vue-jsx":"^3.0.1","@vue/eslint-config-prettier":"^7.1.0","@vue/eslint-config-typescript":"^11.0.3",autoprefixer:"^10.4.8",depcheck:"^1.4.3",eslint:"^8.44.0","eslint-config-prettier":"^8.8.0","eslint-config-standard-with-typescript":"^23.0.0","eslint-plugin-import":"^2.25.2","eslint-plugin-n":"^15.0.0","eslint-plugin-prettier":"^4.2.1","eslint-plugin-promise":"^6.0.0","eslint-plugin-react":"^7.31.10","eslint-plugin-vue":"^9.15.1",husky:"^8.0.3","lint-staged":"^13.1.0",postcss:"^8.1.0","postcss-px-to-viewport":"^1.1.1",prettier:"^2.7.1","rollup-plugin-visualizer":"^5.8.3","svg-sprite-loader":"^6.0.11",typescript:"^5.0.2","unplugin-auto-import":"^0.11.0","unplugin-vue-components":"^0.22.0",vite:"^4.3.9","vite-plugin-chunk-split":"^0.4.7","vite-plugin-compression":"^0.5.1","vite-plugin-ejs":"^1.6.4","vite-plugin-eslint":"^1.8.1","vite-plugin-imp":"^2.3.1","vite-plugin-inspect":"^0.7.26","vite-plugin-svg-icons":"^2.0.1","vite-svg-loader":"^3.4.0","vue-tsc":"^1.4.2"},name:"ray-template",version:"4.0.4"},layout:{copyright:"Copyright © 2022-present Ray",sideBarLogo:{icon:"ray",title:"Ray Template",url:"/dashboard",jumpType:"station"}},appPrimaryColor:{primaryColor:"#2d8cf0",primaryFadeColor:"rgba(45, 140, 240, 0.3)"}},d=Ve({tabsValue:"signin"}),{height:f,width:c}=Tt(),g=Kt(),{updateLocale:p}=g;return{...De(d),windowHeight:f,updateLocale:p,t:e,copyright:a,windowWidth:c}},render(){const{t:e}=this;return s("div",{class:["login"],style:[`height: ${this.windowHeight}px`,`--login-height: ${this.windowHeight}px`]},[s("div",{class:["login-wrapper",this.windowWidth>=1440?"login-wrapper--divider":""]},[s("div",{class:["login-wrapper__content"]},[s(M,{align:"center",class:"login-title__wrapper"},{default:()=>[s(ee,{name:"ray",size:"48"},null),s(We,{class:"login-title",type:"info",size:28},{default:()=>[Z("Ray Template")]})]}),s(M,{align:"center",class:"login-action__wrapper",itemStyle:{display:"flex"}},{default:()=>[s(Jt,null,null),s(Zt,{options:ea,onSelect:a=>this.updateLocale(a)},{default:()=>[s(ee,{customClassName:"login-icon",name:"language",size:"18"},null)]})]}),s(ua,{cols:"s:1 m:1 l:2 xl:2 2xl:2",itemResponsive:!1,responsive:"screen"},{default:()=>[s(Le,{span:"s:0 m:0 l:1 xl:1 2xl:1",class:"login__left-wrapper"},{default:()=>[s(M,{align:"center",vertical:!0},{default:()=>[s(ee,{name:"login_bg",width:"368",height:"368"},null),s(We,{class:"login-title",type:"info",size:36},{default:()=>[Z("开箱即用的中后台管理系统")]})]})]}),s(Le,{span:1,class:"login__right-wrapper"},{default:()=>[s(ta,{class:"login__right-wrapper__content",embedded:!0,bordered:!1},{default:()=>[s(Ra,{value:this.tabsValue,"onUpdate:value":a=>this.tabsValue=a,type:"line",animated:!0,size:"large"},{default:()=>s(Ie,null,[s(le,{tab:e("views.login.index.Signin"),name:"signin"},{default:()=>[s(Pa,null,null)]}),s(le,{tab:e("views.login.index.Register"),name:"register"},{default:()=>[s($a,null,null)]}),s(le,{tab:e("views.login.index.QRCodeSignin"),name:"qrcodeSignin"},{default:()=>[s(Ta,null,null)]})])}),s(_e,null,{default:()=>[Z("其他登陆方式")]}),s(La,null,null),s(_e,null,{default:()=>[Z("友情链接")]}),s(ca,null,null)]})]})]}),s(M,{align:"center",justify:"center",class:"login-copyright__wrapper",wrapItem:!1},{default:()=>[this.copyright]})])])])}});export{Oa as default};
