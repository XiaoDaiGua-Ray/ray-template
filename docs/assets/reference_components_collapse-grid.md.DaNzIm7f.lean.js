import{g as As,p as I,c as J}from"./chunks/element.IaaiWsV4.js";import{c as E,a as c,b as _s,d as m,e as F,i as Rs,f as ws,u as as,n as y,g as x,h as ts,j as Gs,k as L,l as $s}from"./chunks/light.BSHrazt5.js";import{r as N,e as z,u as Ns,c as zs,a as qs,b as M,i as Is,B as Ts,_ as Ps}from"./chunks/DemoFrame.vue_vue_type_script_setup_true_lang.DSP73oZ5.js";import{C as Vs,g as Os,F as js,I as Ms}from"./chunks/Flex.Clpohchy.js";import{i as Us,S as Ls,V as Xs,f as Qs,b as Ws,R as Js}from"./chunks/Icon.GZHVaZrY.js";import{h as C,$ as Ys,p as _,d as V,o as u,b as P,w,c as S,N as G,j as Q,L as Hs,a8 as Zs,a9 as ns,a2 as Y,K as W,v as Ks,aa as H,X as si,ab as Z,E as f,s as ii,u as ai,k as U,F as ti,B as ni,a as ei,t as K,ac as li,C as ri,a3 as ss}from"./chunks/framework.DdJ92B9j.js";import"./chunks/isSymbol.DLIdL1YQ.js";function pi(s){if(typeof s=="number")return{"":s.toString()};const t={};return s.split(/ +/).forEach(n=>{if(n==="")return;const[i,e]=n.split(":");e===void 0?t[""]=i:t[i]=e}),t}function q(s,t){var n;if(s==null)return;const i=pi(s);if(t===void 0)return i[""];if(typeof t=="string")return(n=i[t])!==null&&n!==void 0?n:i[""];if(Array.isArray(t)){for(let e=t.length-1;e>=0;--e){const a=t[e];if(a in i)return i[a]}return i[""]}else{let e,a=-1;return Object.keys(i).forEach(p=>{const k=Number(p);!Number.isNaN(k)&&t>=k&&k>=a&&(a=k,e=i[p])}),e}}const hi={xs:0,s:640,m:1024,l:1280,xl:1536,"2xl":1920};function ki(s){return`(min-width: ${s}px)`}const T={};function oi(s=hi){if(!Us)return C(()=>[]);if(typeof window.matchMedia!="function")return C(()=>[]);const t=_({}),n=Object.keys(s),i=(e,a)=>{e.matches?t.value[a]=!0:t.value[a]=!1};return n.forEach(e=>{const a=s[e];let p,k;T[a]===void 0?(p=window.matchMedia(ki(a)),p.addEventListener?p.addEventListener("change",h=>{k.forEach(l=>{l(h,e)})}):p.addListener&&p.addListener(h=>{k.forEach(l=>{l(h,e)})}),k=new Set,T[a]={mql:p,cbs:k}):(p=T[a].mql,k=T[a].cbs),k.add(i),p.matches&&k.forEach(h=>{h(p,e)})}),Ys(()=>{n.forEach(e=>{const{cbs:a}=T[s[e]];a.has(i)&&a.delete(i)})}),C(()=>{const{value:e}=t;return n.filter(a=>e[a])})}const is=c("card-content",`
 flex: 1;
 min-width: 0;
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
`);var di=E([c("card",`
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
 `,[_s({background:"var(--n-color-modal)"}),m("hoverable",[E("&:hover","box-shadow: var(--n-box-shadow);")]),m("content-segmented",[E(">",[c("card-content",`
 padding-top: var(--n-padding-bottom);
 `),F("content-scrollbar",[E(">",[c("scrollbar-container",[E(">",[c("card-content",`
 padding-top: var(--n-padding-bottom);
 `)])])])])])]),m("content-soft-segmented",[E(">",[c("card-content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `),F("content-scrollbar",[E(">",[c("scrollbar-container",[E(">",[c("card-content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])])])])])]),m("footer-segmented",[E(">",[F("footer",`
 padding-top: var(--n-padding-bottom);
 `)])]),m("footer-soft-segmented",[E(">",[F("footer",`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),E(">",[c("card-header",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[F("main",`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),F("extra",`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),F("close",`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),F("action",`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),is,c("card-content",[E("&:first-child",`
 padding-top: var(--n-padding-bottom);
 `)]),F("content-scrollbar",`
 display: flex;
 flex-direction: column;
 `,[E(">",[c("scrollbar-container",[E(">",[is])])]),E("&:first-child >",[c("scrollbar-container",[E(">",[c("card-content",`
 padding-top: var(--n-padding-bottom);
 `)])])])]),F("footer",`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[E("&:first-child",`
 padding-top: var(--n-padding-bottom);
 `)]),F("action",`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),c("card-cover",`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[E("img",`
 display: block;
 width: 100%;
 `)]),m("bordered",`
 border: 1px solid var(--n-border-color);
 `,[E("&:target","border-color: var(--n-color-target);")]),m("action-segmented",[E(">",[F("action",[E("&:not(:first-child)",`
 border-top: 1px solid var(--n-border-color);
 `)])])]),m("content-segmented, content-soft-segmented",[E(">",[c("card-content",`
 transition: border-color 0.3s var(--n-bezier);
 `,[E("&:not(:first-child)",`
 border-top: 1px solid var(--n-border-color);
 `)]),F("content-scrollbar",`
 transition: border-color 0.3s var(--n-bezier);
 `,[E("&:not(:first-child)",`
 border-top: 1px solid var(--n-border-color);
 `)])])]),m("footer-segmented, footer-soft-segmented",[E(">",[F("footer",`
 transition: border-color 0.3s var(--n-bezier);
 `,[E("&:not(:first-child)",`
 border-top: 1px solid var(--n-border-color);
 `)])])]),m("embedded",`
 background-color: var(--n-color-embedded);
 `)]),Rs(c("card",`
 background: var(--n-color-modal);
 `,[m("embedded",`
 background-color: var(--n-color-embedded-modal);
 `)])),ws(c("card",`
 background: var(--n-color-popover);
 `,[m("embedded",`
 background-color: var(--n-color-embedded-popover);
 `)]))]);const Ei={title:[String,Function],contentClass:String,contentStyle:[Object,String],contentScrollable:Boolean,headerClass:String,headerStyle:[Object,String],headerExtraClass:String,headerExtraStyle:[Object,String],footerClass:String,footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:String,bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:"div"},cover:Function,content:[String,Function],footer:Function,action:Function,headerExtra:Function,closeFocusable:Boolean},ci={...as.props,...Ei};var gi=V({name:"Card",props:ci,slots:Object,setup(s){const t=()=>{const{onClose:d}=s;d&&zs(d)},{inlineThemeDisabled:n,mergedClsPrefixRef:i,mergedRtlRef:e,mergedComponentPropsRef:a}=ts(s),p=as("Card","-card",di,qs,s,i),k=Ns("Card",e,i),h=C(()=>{var d,v;return s.size||((v=(d=a==null?void 0:a.value)==null?void 0:d.Card)==null?void 0:v.size)||"medium"}),l=C(()=>{const d=h.value,{self:{color:v,colorModal:b,colorTarget:$,textColor:o,titleTextColor:D,titleFontWeight:g,borderColor:B,actionColor:R,borderRadius:O,lineHeight:j,closeIconColor:A,closeIconColorHover:hs,closeIconColorPressed:ks,closeColorHover:os,closeColorPressed:ds,closeBorderRadius:Es,closeIconSize:cs,closeSize:gs,boxShadow:ys,colorPopover:us,colorEmbedded:Fs,colorEmbeddedModal:fs,colorEmbeddedPopover:ms,[L("padding",d)]:Cs,[L("fontSize",d)]:vs,[L("titleFontSize",d)]:bs},common:{cubicBezierEaseInOut:Bs}}=p.value,{top:xs,left:Ss,bottom:Ds}=As(Cs);return{"--n-bezier":Bs,"--n-border-radius":O,"--n-color":v,"--n-color-modal":b,"--n-color-popover":us,"--n-color-embedded":Fs,"--n-color-embedded-modal":fs,"--n-color-embedded-popover":ms,"--n-color-target":$,"--n-text-color":o,"--n-line-height":j,"--n-action-color":R,"--n-title-text-color":D,"--n-title-font-weight":g,"--n-close-icon-color":A,"--n-close-icon-color-hover":hs,"--n-close-icon-color-pressed":ks,"--n-close-color-hover":os,"--n-close-color-pressed":ds,"--n-border-color":B,"--n-box-shadow":ys,"--n-padding-top":xs,"--n-padding-bottom":Ds,"--n-padding-left":Ss,"--n-font-size":vs,"--n-title-font-size":bs,"--n-close-size":gs,"--n-close-icon-size":cs,"--n-close-border-radius":Es}}),r=n?Gs("card",C(()=>h.value[0]),l,s):void 0;return{rtlEnabled:k,mergedClsPrefix:i,mergedTheme:p,handleCloseClick:t,cssVars:n?void 0:l,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){const{segmented:s,bordered:t,hoverable:n,mergedClsPrefix:i,rtlEnabled:e,onRender:a,embedded:p,tag:k,$slots:h}=this;return a==null||a(),u(),P(k,{class:x([`${i}-card`,this.themeClass,p&&`${i}-card--embedded`,{[`${i}-card--rtl`]:e,[`${i}-card--content-scrollable`]:this.contentScrollable,[`${i}-card--content${typeof s!="boolean"&&s.content==="soft"?"-soft":""}-segmented`]:s===!0||s!==!1&&s.content,[`${i}-card--footer${typeof s!="boolean"&&s.footer==="soft"?"-soft":""}-segmented`]:s===!0||s!==!1&&s.footer,[`${i}-card--action-segmented`]:s===!0||s!==!1&&s.action,[`${i}-card--bordered`]:t,[`${i}-card--hoverable`]:n}]),style:G(this.cssVars),role:this.role},{default:w(()=>[y(()=>N(h.cover,l=>{const r=this.cover?z([this.cover()]):l;return r&&(u(),S("div",{class:x(`${i}-card-cover`),role:"none"},[y(()=>r)],2))})),y(()=>N(h.header,l=>{const{title:r}=this,d=r?z(typeof r=="function"?[r()]:[r]):l;return d||this.closable?(u(),S("div",{key:1,class:x([`${i}-card-header`,this.headerClass]),style:G(this.headerStyle),role:"heading"},[Q("div",{class:x(`${i}-card-header__main`),role:"heading"},[y(()=>d)],2),y(()=>N(h["header-extra"],v=>{const b=this.headerExtra?z([this.headerExtra()]):v;return b&&(u(),S("div",{class:x([`${i}-card-header__extra`,this.headerExtraClass]),style:G(this.headerExtraStyle)},[y(()=>b)],6))})),y(()=>this.closable&&(u(),P(Vs,{clsPrefix:i,class:x(`${i}-card-header__close`),onClick:this.handleCloseClick,focusable:this.closeFocusable,absolute:!0},null,8,["clsPrefix","class","onClick","focusable"])))],6)):null})),y(()=>N(h.default,l=>{const{content:r}=this,d=r?z(typeof r=="function"?[r()]:[r]):l;return d?this.contentScrollable?(u(),P(Ls,{key:2,class:x(`${i}-card__content-scrollbar`),contentClass:[`${i}-card-content`,this.contentClass],contentStyle:this.contentStyle},{default:()=>d},1032,["class","contentClass","contentStyle"])):(u(),S("div",{key:3,class:x([`${i}-card-content`,this.contentClass]),style:G(this.contentStyle),role:"none"},[y(()=>d)],6)):null})),y(()=>N(h.footer,l=>{const r=this.footer?z([this.footer()]):l;return r&&(u(),S("div",{class:x([`${i}-card__footer`,this.footerClass]),style:G(this.footerStyle),role:"none"},[y(()=>r)],6))})),y(()=>N(h.action,l=>{const r=this.action?z([this.action()]):l;return r&&(u(),S("div",{class:x(`${i}-card__action`),role:"none"},[y(()=>r)],2))}))]),_:2},1032,["class","style","role"])}});const es=$s("n-grid"),yi={span:{type:[Number,String],default:1},offset:{type:[Number,String],default:0},suffix:Boolean,privateOffset:Number,privateSpan:Number,privateColStart:Number,privateShow:{type:Boolean,default:!0}};var ls=V({__GRID_ITEM__:!0,name:"GridItem",alias:["Gi"],props:yi,setup(){const{isSsrRef:s,xGapRef:t,itemStyleRef:n,overflowRef:i,layoutShiftDisabledRef:e}=Hs(es),a=Zs();return{overflow:i,itemStyle:n,layoutShiftDisabled:e,mergedXGap:C(()=>I(t.value||0)),deriveStyle:()=>{s.value;const{privateSpan:p=1,privateShow:k=!0,privateColStart:h=void 0,privateOffset:l=0}=a.vnode.props,{value:r}=t,d=I(r||0);return{display:k?"":"none",gridColumn:`${h??`span ${p}`} / span ${p}`,marginLeft:l?`calc((100% - (${p} - 1) * ${d}) / ${p} * ${l} + ${d} * ${l})`:""}}}},render(){if(this.layoutShiftDisabled){const{span:s,offset:t,mergedXGap:n}=this;return u(),S("div",{key:1,style:G({gridColumn:`span ${s} / span ${s}`,marginLeft:t?`calc((100% - (${s} - 1) * ${n}) / ${s} * ${t} + ${n} * ${t})`:""})},[y(()=>{var i,e;return(e=(i=this.$slots).default)==null?void 0:e.call(i)})],4)}return u(),S("div",{style:G([this.itemStyle,this.deriveStyle()])},[y(()=>{var s,t;return(t=(s=this.$slots).default)==null?void 0:t.call(s,{overflow:this.overflow})})],4)}});function ui(s){var n;const t=(n=s.dirs)==null?void 0:n.find(({dir:i})=>i===ns);return!!(t&&t.value===!1)}const Fi={xs:0,s:640,m:1024,l:1280,xl:1536,xxl:1920},rs=24,X="__ssr__",ps={layoutShiftDisabled:Boolean,responsive:{type:[String,Boolean],default:"self"},cols:{type:[Number,String],default:rs},itemResponsive:Boolean,collapsed:Boolean,collapsedRows:{type:Number,default:1},itemStyle:[Object,String],xGap:{type:[Number,String],default:0},yGap:{type:[Number,String],default:0}};var fi=V({name:"Grid",inheritAttrs:!1,props:ps,setup(s){const{mergedClsPrefixRef:t,mergedBreakpointsRef:n}=ts(s),i=/^\d+$/,e=_(void 0),a=oi((n==null?void 0:n.value)||Fi),p=M(()=>!!(s.itemResponsive||!i.test(s.cols.toString())||!i.test(s.xGap.toString())||!i.test(s.yGap.toString()))),k=C(()=>{if(p.value)return s.responsive==="self"?e.value:a.value}),h=M(()=>Number(q(s.cols.toString(),k.value))??rs),l=M(()=>q(s.xGap.toString(),k.value)),r=M(()=>q(s.yGap.toString(),k.value)),d=g=>{e.value=g.contentRect.width},v=g=>{Ws(d,g)},b=_(!1),$=C(()=>{if(s.responsive==="self")return v}),o=_(!1),D=_();return Ks(()=>{const{value:g}=D;g&&g.hasAttribute(X)&&(g.removeAttribute(X),o.value=!0)}),si(es,{layoutShiftDisabledRef:Z(s,"layoutShiftDisabled"),isSsrRef:o,itemStyleRef:Z(s,"itemStyle"),xGapRef:l,overflowRef:b}),{isSsr:!Is,contentEl:D,mergedClsPrefix:t,style:C(()=>s.layoutShiftDisabled?{width:"100%",display:"grid",gridTemplateColumns:`repeat(${s.cols}, minmax(0, 1fr))`,columnGap:I(s.xGap),rowGap:I(s.yGap)}:{width:"100%",display:"grid",gridTemplateColumns:`repeat(${h.value}, minmax(0, 1fr))`,columnGap:I(l.value),rowGap:I(r.value)}),isResponsive:p,responsiveQuery:k,responsiveCols:h,handleResize:$,overflow:b}},render(){if(this.layoutShiftDisabled)return Y("div",W({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style},this.$attrs),this.$slots);const s=()=>{var d,v,b,$;this.overflow=!1;const t=Qs(Os(this)),n=[],{collapsed:i,collapsedRows:e,responsiveCols:a,responsiveQuery:p}=this;t.forEach(o=>{var B,R,O,j;if(((B=o==null?void 0:o.type)==null?void 0:B.__GRID_ITEM__)!==!0)return;if(ui(o)){const A=H(o);A.props?A.props.privateShow=!1:A.props={privateShow:!1},n.push({child:A,rawChildSpan:0});return}o.dirs=((R=o.dirs)==null?void 0:R.filter(({dir:A})=>A!==ns))||null,((O=o.dirs)==null?void 0:O.length)===0&&(o.dirs=null);const D=H(o),g=Number(q((j=D.props)==null?void 0:j.span,p)??1);g!==0&&n.push({child:D,rawChildSpan:g})});let k=0;const h=(d=n[n.length-1])==null?void 0:d.child;if(h!=null&&h.props){const o=(v=h.props)==null?void 0:v.suffix;o!==void 0&&o!==!1&&(k=Number(q((b=h.props)==null?void 0:b.span,p)??1),h.props.privateSpan=k,h.props.privateColStart=a+1-k,h.props.privateShow=h.props.privateShow??!0)}let l=0,r=!1;for(const{child:o,rawChildSpan:D}of n){if(r&&(this.overflow=!0),!r){const g=Number(q(($=o.props)==null?void 0:$.offset,p)??0),B=Math.min(D+g,a);if(o.props?(o.props.privateSpan=B,o.props.privateOffset=g):o.props={privateSpan:B,privateOffset:g},i){const R=l%a;B+R>a&&(l+=a-R),B+l+k>e*a?r=!0:l+=B}}r&&(o.props?o.props.privateShow!==!0&&(o.props.privateShow=!1):o.props={privateShow:!1})}return Y("div",W({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style,[X]:this.isSsr||void 0},this.$attrs),n.map(({child:o})=>o))};return this.isResponsive&&this.responsive==="self"?(u(),P(Xs,{key:1,onResize:this.handleResize},{default:s},1032,["onResize"])):s()}});const mi={actionSpan:{type:Number,default:1},actionAlign:{type:String,default:"end"},open:{type:Boolean,default:!1},collapseToggleText:{type:Array,default:()=>["展开","收起"]},bordered:{type:Boolean,default:!0},onUpdateOpen:{type:[Function,Array],default:null},"onUpdate:open":{type:[Function,Array],default:null},...ps},Ci=V({name:"RCollapseGrid",props:mi,setup(s){const t=_(!s.open),n=C(()=>({"--r-collapse-grid-action-align":s.actionAlign})),i=()=>{const{onUpdateOpen:a,"onUpdate:open":p}=s;t.value=!t.value,a&&J(a,t.value),p&&J(p,t.value)},e=a=>f("div",{class:"collapse-icon",onClick:i.bind(this)},[f("span",null,[a?s.collapseToggleText[0]:s.collapseToggleText[1]]),f(Js,{customClassName:`collapse-icon--arrow ${a?"":"collapse-icon--arrow__expanded"}`,name:"directional/expanded",size:"14"},null)]);return ii(()=>{t.value=!s.open}),{modelCollapsed:t,collapseClick:i,CollapseIcon:e,cssVars:n}},render(){const{$slots:{collapse:s,action:t,default:n},CollapseIcon:i,$props:e,modelCollapsed:a,xGap:p,yGap:k,collapsedRows:h,cssVars:l,actionSpan:r,bordered:d}=this;return f(gi,{bordered:d,style:[l]},{default:()=>f(fi,W({class:"r-collapse-grid"},e,{collapsed:a,xGap:p||12,yGap:k||12,collapsedRows:h}),{default:()=>[n==null?void 0:n(),f(ls,{suffix:!0,class:"r-collapse-grid__suffix--btn",span:r},{default:()=>[f(js,{justify:"end",align:"center"},{default:()=>[t==null?void 0:t(),s?s(a):i(a)]})]})]})})}}),vi={class:"ray-demo"},bi={class:"ray-demo-result"},Bi=V({__name:"CollapseGridDemo",setup(s){const t=["name","department","role","id"],n=li({name:"",department:"",role:"",id:""}),{lang:i}=ai(),e=C(()=>i.value.startsWith("en")?{fields:{name:"Name",department:"Department",role:"Role",id:"ID"},toggle:["Expand","Collapse"],search:"Search",hint:"Expand to show more filters."}:{fields:{name:"姓名",department:"部门",role:"岗位",id:"编号"},toggle:["展开","收起"],search:"查询",hint:"展开后可填写更多条件"}),a=_(!1),p=_();return(k,h)=>(u(),P(Ps,null,{default:w(()=>[Q("div",vi,[f(U(Ci),{open:a.value,cols:2,collapsedRows:1,collapseToggleText:e.value.toggle,"onUpdate:open":h[1]||(h[1]=l=>a.value=!l)},{action:w(()=>[f(U(Ts),{type:"primary",onClick:h[0]||(h[0]=l=>p.value={...n})},{default:w(()=>[ei(K(e.value.search),1)]),_:1})]),default:w(()=>[(u(),S(ti,null,ni(t,l=>f(U(ls),{key:l},{default:w(()=>[f(U(Ms),{value:n[l],"onUpdate:value":r=>n[l]=r,placeholder:e.value.fields[l],"aria-label":e.value.fields[l]},null,8,["value","onUpdate:value","placeholder","aria-label"])]),_:2},1024)),64))]),_:1},8,["open","collapseToggleText"]),Q("output",bi,K(p.value??e.value.hint),1)])]),_:1}))}}),$i=JSON.parse('{"title":"RCollapseGrid","description":"","frontmatter":{},"headers":[],"relativePath":"reference/components/collapse-grid.md","filePath":"reference/components/collapse-grid.md"}'),xi={name:"reference/components/collapse-grid.md"},Ni=Object.assign(xi,{setup(s){return(t,n)=>{const i=ri("ClientOnly");return u(),S("div",null,[n[0]||(n[0]=ss("",3)),f(i,null,{default:w(()=>[f(Bi)]),_:1}),n[1]||(n[1]=ss("",6))])}}});export{$i as __pageData,Ni as default};
