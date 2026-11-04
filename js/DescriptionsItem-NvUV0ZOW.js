import{c as e}from"./directives-CPgDhRPZ.js";import{At as t}from"./toString-BWDzaUQG.js";import{D as n,Dt as r,Et as i,O as a,Ot as o,St as s,Tt as c,_n as l,ft as u,it as d,kt as f,st as p,vn as m,wn as h,wt as g,xn as _,xt as v,zn as y}from"./Card-DpMmwG-0.js";import{hr as b}from"./store-CHbAjMIY.js";import{B as x,K as S,p as C}from"./Switch-BFGmG5oX.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=v([s(`descriptions`,{fontSize:`var(--n-font-size)`},[s(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),s(`descriptions-table-wrapper`,[s(`descriptions-table`,[s(`descriptions-table-row`,[s(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),s(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),i(`bordered`,[s(`descriptions-table-wrapper`,[s(`descriptions-table`,[s(`descriptions-table-row`,[v(`&:last-child`,[s(`descriptions-table-content`,{paddingBottom:0})])])])])]),c(`left-label-placement`,[s(`descriptions-table-content`,[v(`> *`,{verticalAlign:`top`})])]),c(`left-label-align`,[v(`th`,{textAlign:`left`})]),c(`center-label-align`,[v(`th`,{textAlign:`center`})]),c(`right-label-align`,[v(`th`,{textAlign:`right`})]),c(`bordered`,[s(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[s(`descriptions-table`,[s(`descriptions-table-row`,[v(`&:not(:last-child)`,[s(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),s(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),s(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[v(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),s(`descriptions-table-content`,[v(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),s(`descriptions-header`,`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),s(`descriptions-table-wrapper`,`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[s(`descriptions-table`,`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[s(`descriptions-table-row`,`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[s(`descriptions-table-header`,`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),s(`descriptions-table-content`,`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[g(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),g(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),s(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),o(s(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),f(s(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...n.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=h({name:`Descriptions`,props:M,slots:Object,setup(t){let{mergedClsPrefixRef:i,inlineThemeDisabled:o,mergedComponentPropsRef:s}=u(t),c=l(()=>t.size||s?.value?.Descriptions?.size||`medium`),d=n(`Descriptions`,`-descriptions`,T,e,t,i),f=l(()=>{let{bordered:e}=t,n=c.value,{common:{cubicBezierEaseInOut:i},self:{titleTextColor:a,thColor:o,thColorModal:s,thColorPopover:l,thTextColor:u,thFontWeight:f,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[r(`fontSize`,n)]:S,[r(e?`thPaddingBordered`:`thPadding`,n)]:C,[r(e?`tdPaddingBordered`:`tdPadding`,n)]:w}}=d.value;return{"--n-title-text-color":a,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":i,"--n-th-font-weight":f,"--n-line-height":x,"--n-th-text-color":u,"--n-td-text-color":p,"--n-th-color":o,"--n-th-color-modal":s,"--n-th-color-popover":l,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),p=o?a(`descriptions`,l(()=>{let e=``,{bordered:n}=t;return n&&(e+=`a`),e+=c.value[0],e}),f,t):void 0;return{mergedClsPrefix:i,cssVars:o?void 0:f,themeClass:p?.themeClass,onRender:p?.onRender,compitableColumn:b(t,[`columns`,`column`]),inlineThemeDisabled:o,mergedSize:c}},render(){let e=this.$slots.default,n=e?x(e()):[];n.length;let{contentClass:r,labelClass:i,compitableColumn:a,labelPlacement:o,labelAlign:s,mergedSize:c,bordered:l,title:u,cssVars:f,mergedClsPrefix:h,separator:g,onRender:v}=this;v?.();let b=n.filter(e=>D(e)),T=b.reduce((e,n,s)=>{let c=n.props||{},u=b.length-1===s,f=[`label`in c?c.label:w(n,`label`)],v=[w(n)],x=c.span||1,S=e.span;e.span+=x;let C=c.labelStyle||c[`label-style`]||this.labelStyle,T=c.contentStyle||c[`content-style`]||this.contentStyle;if(o===`left`)l?e.row.push((y(),_(`th`,{key:1,class:d([`${h}-descriptions-table-header`,i]),colspan:1,style:t(C)},[p(()=>f)],6)),(y(),_(`td`,{key:2,class:d([`${h}-descriptions-table-content`,r]),colspan:u?(a-S)*2+1:x*2-1,style:t(T)},[p(()=>v)],14,O))):e.row.push((y(),_(`td`,{key:3,class:d(`${h}-descriptions-table-content`),colspan:u?(a-S)*2:x*2},[m(`span`,{class:d([`${h}-descriptions-table-content__label`,i]),style:t(C)},[p(()=>[...f,g&&(y(),_(`span`,{key:4,class:d(`${h}-descriptions-separator`)},[p(()=>g)],2))])],6),m(`span`,{class:d([`${h}-descriptions-table-content__content`,r]),style:t(T)},[p(()=>v)],6)],10,k)));else{let n=u?(a-S)*2:x*2;e.row.push((y(),_(`th`,{key:5,class:d([`${h}-descriptions-table-header`,i]),colspan:n,style:t(C)},[p(()=>f)],14,A))),e.secondRow.push((y(),_(`td`,{key:6,class:d([`${h}-descriptions-table-content`,r]),colspan:n,style:t(T)},[p(()=>v)],14,j)))}return(e.span>=a||u)&&(e.span=0,e.row.length&&(e.rows.push(e.row),e.row=[]),o!==`left`&&e.secondRow.length&&(e.rows.push(e.secondRow),e.secondRow=[])),e},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(y(),_(`tr`,{class:d(`${h}-descriptions-table-row`)},[p(()=>e)],2)));return y(),_(`div`,{style:t(f),class:d([`${h}-descriptions`,this.themeClass,`${h}-descriptions--${o}-label-placement`,`${h}-descriptions--${s}-label-align`,`${h}-descriptions--${c}-size`,l&&`${h}-descriptions--bordered`])},[u||this.$slots.header?(y(),_(`div`,{key:0,class:d(`${h}-descriptions-header`)},[p(()=>u||C(this,`header`))],2)):p(()=>null),m(`div`,{class:d(`${h}-descriptions-table-wrapper`)},[m(`table`,{class:d(`${h}-descriptions-table`)},[m(`tbody`,null,[p(()=>o===`top`&&(y(),_(`tr`,{class:d(`${h}-descriptions-table-row`),style:{visibility:`collapse`}},[p(()=>S(a*2,(y(),_(`td`))))],2))),p(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=h({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};