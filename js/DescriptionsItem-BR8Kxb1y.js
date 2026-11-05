import{Kn as e,Sn as t}from"./directives-Cup3lpxw.js";import{At as n}from"./toString-BWDzaUQG.js";import{$ as r,C as i,Ct as a,Fn as o,S as s,St as c,_t as l,bt as u,fn as d,gn as f,gt as p,nt as m,pn as h,st as g,wt as _,xt as v,yn as y,yt as b}from"./Close-D8ap5Wyu.js";import{B as x,P as S,m as C}from"./InputNumber-Bc7oBMaF.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=p([l(`descriptions`,{fontSize:`var(--n-font-size)`},[l(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),l(`descriptions-table-wrapper`,[l(`descriptions-table`,[l(`descriptions-table-row`,[l(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),l(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),v(`bordered`,[l(`descriptions-table-wrapper`,[l(`descriptions-table`,[l(`descriptions-table-row`,[p(`&:last-child`,[l(`descriptions-table-content`,{paddingBottom:0})])])])])]),u(`left-label-placement`,[l(`descriptions-table-content`,[p(`> *`,{verticalAlign:`top`})])]),u(`left-label-align`,[p(`th`,{textAlign:`left`})]),u(`center-label-align`,[p(`th`,{textAlign:`center`})]),u(`right-label-align`,[p(`th`,{textAlign:`right`})]),u(`bordered`,[l(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[l(`descriptions-table`,[l(`descriptions-table-row`,[p(`&:not(:last-child)`,[l(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),l(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),l(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[p(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),l(`descriptions-table-content`,[p(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),l(`descriptions-header`,`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),l(`descriptions-table-wrapper`,`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[l(`descriptions-table`,`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[l(`descriptions-table-row`,`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[l(`descriptions-table-header`,`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),l(`descriptions-table-content`,`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[b(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),b(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),a(l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),_(l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...s.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=y({name:`Descriptions`,props:M,slots:Object,setup(n){let{mergedClsPrefixRef:r,inlineThemeDisabled:a,mergedComponentPropsRef:o}=g(n),l=d(()=>n.size||o?.value?.Descriptions?.size||`medium`),u=s(`Descriptions`,`-descriptions`,T,t,n,r),f=d(()=>{let{bordered:e}=n,t=l.value,{common:{cubicBezierEaseInOut:r},self:{titleTextColor:i,thColor:a,thColorModal:o,thColorPopover:s,thTextColor:d,thFontWeight:f,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[c(`fontSize`,t)]:S,[c(e?`thPaddingBordered`:`thPadding`,t)]:C,[c(e?`tdPaddingBordered`:`tdPadding`,t)]:w}}=u.value;return{"--n-title-text-color":i,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":r,"--n-th-font-weight":f,"--n-line-height":x,"--n-th-text-color":d,"--n-td-text-color":p,"--n-th-color":a,"--n-th-color-modal":o,"--n-th-color-popover":s,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),p=a?i(`descriptions`,d(()=>{let e=``,{bordered:t}=n;return t&&(e+=`a`),e+=l.value[0],e}),f,n):void 0;return{mergedClsPrefix:r,cssVars:a?void 0:f,themeClass:p?.themeClass,onRender:p?.onRender,compitableColumn:e(n,[`columns`,`column`]),inlineThemeDisabled:a,mergedSize:l}},render(){let e=this.$slots.default,t=e?S(e()):[];t.length;let{contentClass:i,labelClass:a,compitableColumn:s,labelPlacement:c,labelAlign:l,mergedSize:u,bordered:d,title:p,cssVars:g,mergedClsPrefix:_,separator:v,onRender:y}=this;y?.();let b=t.filter(e=>D(e)),T=b.reduce((e,t,l)=>{let u=t.props||{},p=b.length-1===l,g=[`label`in u?u.label:w(t,`label`)],y=[w(t)],x=u.span||1,S=e.span;e.span+=x;let C=u.labelStyle||u[`label-style`]||this.labelStyle,T=u.contentStyle||u[`content-style`]||this.contentStyle;if(c===`left`)d?e.row.push((o(),f(`th`,{key:1,class:r([`${_}-descriptions-table-header`,a]),colspan:1,style:n(C)},[m(()=>g)],6)),(o(),f(`td`,{key:2,class:r([`${_}-descriptions-table-content`,i]),colspan:p?(s-S)*2+1:x*2-1,style:n(T)},[m(()=>y)],14,O))):e.row.push((o(),f(`td`,{key:3,class:r(`${_}-descriptions-table-content`),colspan:p?(s-S)*2:x*2},[h(`span`,{class:r([`${_}-descriptions-table-content__label`,a]),style:n(C)},[m(()=>[...g,v&&(o(),f(`span`,{key:4,class:r(`${_}-descriptions-separator`)},[m(()=>v)],2))])],6),h(`span`,{class:r([`${_}-descriptions-table-content__content`,i]),style:n(T)},[m(()=>y)],6)],10,k)));else{let t=p?(s-S)*2:x*2;e.row.push((o(),f(`th`,{key:5,class:r([`${_}-descriptions-table-header`,a]),colspan:t,style:n(C)},[m(()=>g)],14,A))),e.secondRow.push((o(),f(`td`,{key:6,class:r([`${_}-descriptions-table-content`,i]),colspan:t,style:n(T)},[m(()=>y)],14,j)))}return(e.span>=s||p)&&(e.span=0,e.row.length&&(e.rows.push(e.row),e.row=[]),c!==`left`&&e.secondRow.length&&(e.rows.push(e.secondRow),e.secondRow=[])),e},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(o(),f(`tr`,{class:r(`${_}-descriptions-table-row`)},[m(()=>e)],2)));return o(),f(`div`,{style:n(g),class:r([`${_}-descriptions`,this.themeClass,`${_}-descriptions--${c}-label-placement`,`${_}-descriptions--${l}-label-align`,`${_}-descriptions--${u}-size`,d&&`${_}-descriptions--bordered`])},[p||this.$slots.header?(o(),f(`div`,{key:0,class:r(`${_}-descriptions-header`)},[m(()=>p||C(this,`header`))],2)):m(()=>null),h(`div`,{class:r(`${_}-descriptions-table-wrapper`)},[h(`table`,{class:r(`${_}-descriptions-table`)},[h(`tbody`,null,[m(()=>c===`top`&&(o(),f(`tr`,{class:r(`${_}-descriptions-table-row`),style:{visibility:`collapse`}},[m(()=>x(s*2,(o(),f(`td`))))],2))),m(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=y({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};