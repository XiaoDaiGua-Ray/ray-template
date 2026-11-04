import{c as e}from"./directives-C6DZxtNX.js";import{At as t}from"./toString-BWDzaUQG.js";import{Bn as n,D as r,Dt as i,Et as a,O as o,Ot as s,St as c,Tt as l,_n as u,ft as d,it as f,kt as p,st as m,vn as h,wn as g,wt as _,xn as v,xt as y}from"./Card-B_oozRxS.js";import{ar as b}from"./store-DP5ZqOPA.js";import{B as x,K as S,p as C}from"./Switch-tIQIUmgT.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=y([c(`descriptions`,{fontSize:`var(--n-font-size)`},[c(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),c(`descriptions-table-wrapper`,[c(`descriptions-table`,[c(`descriptions-table-row`,[c(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),c(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),a(`bordered`,[c(`descriptions-table-wrapper`,[c(`descriptions-table`,[c(`descriptions-table-row`,[y(`&:last-child`,[c(`descriptions-table-content`,{paddingBottom:0})])])])])]),l(`left-label-placement`,[c(`descriptions-table-content`,[y(`> *`,{verticalAlign:`top`})])]),l(`left-label-align`,[y(`th`,{textAlign:`left`})]),l(`center-label-align`,[y(`th`,{textAlign:`center`})]),l(`right-label-align`,[y(`th`,{textAlign:`right`})]),l(`bordered`,[c(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[c(`descriptions-table`,[c(`descriptions-table-row`,[y(`&:not(:last-child)`,[c(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),c(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),c(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[y(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),c(`descriptions-table-content`,[y(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),c(`descriptions-header`,`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),c(`descriptions-table-wrapper`,`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[c(`descriptions-table`,`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[c(`descriptions-table-row`,`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[c(`descriptions-table-header`,`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),c(`descriptions-table-content`,`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[_(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),_(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),c(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),s(c(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),p(c(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...r.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=g({name:`Descriptions`,props:M,slots:Object,setup(t){let{mergedClsPrefixRef:n,inlineThemeDisabled:a,mergedComponentPropsRef:s}=d(t),c=u(()=>t.size||s?.value?.Descriptions?.size||`medium`),l=r(`Descriptions`,`-descriptions`,T,e,t,n),f=u(()=>{let{bordered:e}=t,n=c.value,{common:{cubicBezierEaseInOut:r},self:{titleTextColor:a,thColor:o,thColorModal:s,thColorPopover:u,thTextColor:d,thFontWeight:f,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[i(`fontSize`,n)]:S,[i(e?`thPaddingBordered`:`thPadding`,n)]:C,[i(e?`tdPaddingBordered`:`tdPadding`,n)]:w}}=l.value;return{"--n-title-text-color":a,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":r,"--n-th-font-weight":f,"--n-line-height":x,"--n-th-text-color":d,"--n-td-text-color":p,"--n-th-color":o,"--n-th-color-modal":s,"--n-th-color-popover":u,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),p=a?o(`descriptions`,u(()=>{let e=``,{bordered:n}=t;return n&&(e+=`a`),e+=c.value[0],e}),f,t):void 0;return{mergedClsPrefix:n,cssVars:a?void 0:f,themeClass:p?.themeClass,onRender:p?.onRender,compitableColumn:b(t,[`columns`,`column`]),inlineThemeDisabled:a,mergedSize:c}},render(){let e=this.$slots.default,r=e?x(e()):[];r.length;let{contentClass:i,labelClass:a,compitableColumn:o,labelPlacement:s,labelAlign:c,mergedSize:l,bordered:u,title:d,cssVars:p,mergedClsPrefix:g,separator:_,onRender:y}=this;y?.();let b=r.filter(e=>D(e)),T=b.reduce((e,r,c)=>{let l=r.props||{},d=b.length-1===c,p=[`label`in l?l.label:w(r,`label`)],y=[w(r)],x=l.span||1,S=e.span;e.span+=x;let C=l.labelStyle||l[`label-style`]||this.labelStyle,T=l.contentStyle||l[`content-style`]||this.contentStyle;if(s===`left`)u?e.row.push((n(),v(`th`,{key:1,class:f([`${g}-descriptions-table-header`,a]),colspan:1,style:t(C)},[m(()=>p)],6)),(n(),v(`td`,{key:2,class:f([`${g}-descriptions-table-content`,i]),colspan:d?(o-S)*2+1:x*2-1,style:t(T)},[m(()=>y)],14,O))):e.row.push((n(),v(`td`,{key:3,class:f(`${g}-descriptions-table-content`),colspan:d?(o-S)*2:x*2},[h(`span`,{class:f([`${g}-descriptions-table-content__label`,a]),style:t(C)},[m(()=>[...p,_&&(n(),v(`span`,{key:4,class:f(`${g}-descriptions-separator`)},[m(()=>_)],2))])],6),h(`span`,{class:f([`${g}-descriptions-table-content__content`,i]),style:t(T)},[m(()=>y)],6)],10,k)));else{let r=d?(o-S)*2:x*2;e.row.push((n(),v(`th`,{key:5,class:f([`${g}-descriptions-table-header`,a]),colspan:r,style:t(C)},[m(()=>p)],14,A))),e.secondRow.push((n(),v(`td`,{key:6,class:f([`${g}-descriptions-table-content`,i]),colspan:r,style:t(T)},[m(()=>y)],14,j)))}return(e.span>=o||d)&&(e.span=0,e.row.length&&(e.rows.push(e.row),e.row=[]),s!==`left`&&e.secondRow.length&&(e.rows.push(e.secondRow),e.secondRow=[])),e},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(n(),v(`tr`,{class:f(`${g}-descriptions-table-row`)},[m(()=>e)],2)));return n(),v(`div`,{style:t(p),class:f([`${g}-descriptions`,this.themeClass,`${g}-descriptions--${s}-label-placement`,`${g}-descriptions--${c}-label-align`,`${g}-descriptions--${l}-size`,u&&`${g}-descriptions--bordered`])},[d||this.$slots.header?(n(),v(`div`,{key:0,class:f(`${g}-descriptions-header`)},[m(()=>d||C(this,`header`))],2)):m(()=>null),h(`div`,{class:f(`${g}-descriptions-table-wrapper`)},[h(`table`,{class:f(`${g}-descriptions-table`)},[h(`tbody`,null,[m(()=>s===`top`&&(n(),v(`tr`,{class:f(`${g}-descriptions-table-row`),style:{visibility:`collapse`}},[m(()=>S(o*2,(n(),v(`td`))))],2))),m(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=g({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};