import{Bn as e,Gn as t,hr as n,mr as r,vr as i}from"./directives-C3MG3Skx.js";import{gt as a}from"./isSymbol-DERoyzaf.js";import{L as o,d as s,f as c,h as l,y as u}from"./runtime-core.esm-bundler-BvnVMcQz.js";import{D as d,Dt as f,Et as p,O as m,Ot as h,St as g,Tt as _,ft as v,it as y,kt as b,st as x,wt as S,xt as C}from"./Card-CLV9EByv.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=C([g(`descriptions`,{fontSize:`var(--n-font-size)`},[g(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),g(`descriptions-table-wrapper`,[g(`descriptions-table`,[g(`descriptions-table-row`,[g(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),g(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),p(`bordered`,[g(`descriptions-table-wrapper`,[g(`descriptions-table`,[g(`descriptions-table-row`,[C(`&:last-child`,[g(`descriptions-table-content`,{paddingBottom:0})])])])])]),_(`left-label-placement`,[g(`descriptions-table-content`,[C(`> *`,{verticalAlign:`top`})])]),_(`left-label-align`,[C(`th`,{textAlign:`left`})]),_(`center-label-align`,[C(`th`,{textAlign:`center`})]),_(`right-label-align`,[C(`th`,{textAlign:`right`})]),_(`bordered`,[g(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[g(`descriptions-table`,[g(`descriptions-table-row`,[C(`&:not(:last-child)`,[g(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),g(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),g(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[C(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),g(`descriptions-table-content`,[C(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),g(`descriptions-header`,`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),g(`descriptions-table-wrapper`,`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[g(`descriptions-table`,`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[g(`descriptions-table-row`,`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[g(`descriptions-table-header`,`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),g(`descriptions-table-content`,`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[S(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),S(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),g(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),h(g(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),b(g(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...d.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=u({name:`Descriptions`,props:M,slots:Object,setup(t){let{mergedClsPrefixRef:r,inlineThemeDisabled:i,mergedComponentPropsRef:a}=v(t),o=s(()=>t.size||a?.value?.Descriptions?.size||`medium`),c=d(`Descriptions`,`-descriptions`,T,e,t,r),l=s(()=>{let{bordered:e}=t,n=o.value,{common:{cubicBezierEaseInOut:r},self:{titleTextColor:i,thColor:a,thColorModal:s,thColorPopover:l,thTextColor:u,thFontWeight:d,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[f(`fontSize`,n)]:S,[f(e?`thPaddingBordered`:`thPadding`,n)]:C,[f(e?`tdPaddingBordered`:`tdPadding`,n)]:w}}=c.value;return{"--n-title-text-color":i,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":r,"--n-th-font-weight":d,"--n-line-height":x,"--n-th-text-color":u,"--n-td-text-color":p,"--n-th-color":a,"--n-th-color-modal":s,"--n-th-color-popover":l,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),u=i?m(`descriptions`,s(()=>{let e=``,{bordered:n}=t;return n&&(e+=`a`),e+=o.value[0],e}),l,t):void 0;return{mergedClsPrefix:r,cssVars:i?void 0:l,themeClass:u?.themeClass,onRender:u?.onRender,compitableColumn:n(t,[`columns`,`column`]),inlineThemeDisabled:i,mergedSize:o}},render(){let e=this.$slots.default,n=e?r(e()):[];n.length;let{contentClass:s,labelClass:u,compitableColumn:d,labelPlacement:f,labelAlign:p,mergedSize:m,bordered:h,title:g,cssVars:_,mergedClsPrefix:v,separator:b,onRender:S}=this;S?.();let C=n.filter(e=>D(e)),T=C.reduce((e,t,n)=>{let r=t.props||{},i=C.length-1===n,p=[`label`in r?r.label:w(t,`label`)],m=[w(t)],g=r.span||1,_=e.span;e.span+=g;let S=r.labelStyle||r[`label-style`]||this.labelStyle,T=r.contentStyle||r[`content-style`]||this.contentStyle;if(f===`left`)h?e.row.push((o(),l(`th`,{key:1,class:y([`${v}-descriptions-table-header`,u]),colspan:1,style:a(S)},[x(()=>p)],6)),(o(),l(`td`,{key:2,class:y([`${v}-descriptions-table-content`,s]),colspan:i?(d-_)*2+1:g*2-1,style:a(T)},[x(()=>m)],14,O))):e.row.push((o(),l(`td`,{key:3,class:y(`${v}-descriptions-table-content`),colspan:i?(d-_)*2:g*2},[c(`span`,{class:y([`${v}-descriptions-table-content__label`,u]),style:a(S)},[x(()=>[...p,b&&(o(),l(`span`,{key:4,class:y(`${v}-descriptions-separator`)},[x(()=>b)],2))])],6),c(`span`,{class:y([`${v}-descriptions-table-content__content`,s]),style:a(T)},[x(()=>m)],6)],10,k)));else{let t=i?(d-_)*2:g*2;e.row.push((o(),l(`th`,{key:5,class:y([`${v}-descriptions-table-header`,u]),colspan:t,style:a(S)},[x(()=>p)],14,A))),e.secondRow.push((o(),l(`td`,{key:6,class:y([`${v}-descriptions-table-content`,s]),colspan:t,style:a(T)},[x(()=>m)],14,j)))}return(e.span>=d||i)&&(e.span=0,e.row.length&&(e.rows.push(e.row),e.row=[]),f!==`left`&&e.secondRow.length&&(e.rows.push(e.secondRow),e.secondRow=[])),e},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(o(),l(`tr`,{class:y(`${v}-descriptions-table-row`)},[x(()=>e)],2)));return o(),l(`div`,{style:a(_),class:y([`${v}-descriptions`,this.themeClass,`${v}-descriptions--${f}-label-placement`,`${v}-descriptions--${p}-label-align`,`${v}-descriptions--${m}-size`,h&&`${v}-descriptions--bordered`])},[g||this.$slots.header?(o(),l(`div`,{key:0,class:y(`${v}-descriptions-header`)},[x(()=>g||t(this,`header`))],2)):x(()=>null),c(`div`,{class:y(`${v}-descriptions-table-wrapper`)},[c(`table`,{class:y(`${v}-descriptions-table`)},[c(`tbody`,null,[x(()=>f===`top`&&(o(),l(`tr`,{class:y(`${v}-descriptions-table-row`),style:{visibility:`collapse`}},[x(()=>i(d*2,(o(),l(`td`))))],2))),x(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=u({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};