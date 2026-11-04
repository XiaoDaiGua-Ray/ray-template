import{At as e}from"./toString-BWDzaUQG.js";import{D as t,Dt as n,Et as r,O as i,Ot as a,St as o,Tt as s,_n as c,ft as l,it as u,kt as d,st as f,vn as p,wn as m,wt as h,xn as g,xt as _,zn as v}from"./Card-DpMmwG-0.js";import{Vn as y}from"./store-D8OSBe2K.js";import{B as b,K as x,p as S}from"./Switch-BFGmG5oX.js";import{n as C}from"./index-h40x_kVs.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=_([o(`descriptions`,{fontSize:`var(--n-font-size)`},[o(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),o(`descriptions-table-wrapper`,[o(`descriptions-table`,[o(`descriptions-table-row`,[o(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),o(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),r(`bordered`,[o(`descriptions-table-wrapper`,[o(`descriptions-table`,[o(`descriptions-table-row`,[_(`&:last-child`,[o(`descriptions-table-content`,{paddingBottom:0})])])])])]),s(`left-label-placement`,[o(`descriptions-table-content`,[_(`> *`,{verticalAlign:`top`})])]),s(`left-label-align`,[_(`th`,{textAlign:`left`})]),s(`center-label-align`,[_(`th`,{textAlign:`center`})]),s(`right-label-align`,[_(`th`,{textAlign:`right`})]),s(`bordered`,[o(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[o(`descriptions-table`,[o(`descriptions-table-row`,[_(`&:not(:last-child)`,[o(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),o(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),o(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[_(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),o(`descriptions-table-content`,[_(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),o(`descriptions-header`,`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),o(`descriptions-table-wrapper`,`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[o(`descriptions-table`,`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[o(`descriptions-table-row`,`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[o(`descriptions-table-header`,`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),o(`descriptions-table-content`,`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[h(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),h(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),o(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),a(o(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),d(o(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...t.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=m({name:`Descriptions`,props:M,slots:Object,setup(e){let{mergedClsPrefixRef:r,inlineThemeDisabled:a,mergedComponentPropsRef:o}=l(e),s=c(()=>e.size||o?.value?.Descriptions?.size||`medium`),u=t(`Descriptions`,`-descriptions`,T,C,e,r),d=c(()=>{let{bordered:t}=e,r=s.value,{common:{cubicBezierEaseInOut:i},self:{titleTextColor:a,thColor:o,thColorModal:c,thColorPopover:l,thTextColor:d,thFontWeight:f,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[n(`fontSize`,r)]:S,[n(t?`thPaddingBordered`:`thPadding`,r)]:C,[n(t?`tdPaddingBordered`:`tdPadding`,r)]:w}}=u.value;return{"--n-title-text-color":a,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":i,"--n-th-font-weight":f,"--n-line-height":x,"--n-th-text-color":d,"--n-td-text-color":p,"--n-th-color":o,"--n-th-color-modal":c,"--n-th-color-popover":l,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),f=a?i(`descriptions`,c(()=>{let t=``,{bordered:n}=e;return n&&(t+=`a`),t+=s.value[0],t}),d,e):void 0;return{mergedClsPrefix:r,cssVars:a?void 0:d,themeClass:f?.themeClass,onRender:f?.onRender,compitableColumn:y(e,[`columns`,`column`]),inlineThemeDisabled:a,mergedSize:s}},render(){let t=this.$slots.default,n=t?b(t()):[];n.length;let{contentClass:r,labelClass:i,compitableColumn:a,labelPlacement:o,labelAlign:s,mergedSize:c,bordered:l,title:d,cssVars:m,mergedClsPrefix:h,separator:_,onRender:y}=this;y?.();let C=n.filter(e=>D(e)),T=C.reduce((t,n,s)=>{let c=n.props||{},d=C.length-1===s,m=[`label`in c?c.label:w(n,`label`)],y=[w(n)],b=c.span||1,x=t.span;t.span+=b;let S=c.labelStyle||c[`label-style`]||this.labelStyle,T=c.contentStyle||c[`content-style`]||this.contentStyle;if(o===`left`)l?t.row.push((v(),g(`th`,{key:1,class:u([`${h}-descriptions-table-header`,i]),colspan:1,style:e(S)},[f(()=>m)],6)),(v(),g(`td`,{key:2,class:u([`${h}-descriptions-table-content`,r]),colspan:d?(a-x)*2+1:b*2-1,style:e(T)},[f(()=>y)],14,O))):t.row.push((v(),g(`td`,{key:3,class:u(`${h}-descriptions-table-content`),colspan:d?(a-x)*2:b*2},[p(`span`,{class:u([`${h}-descriptions-table-content__label`,i]),style:e(S)},[f(()=>[...m,_&&(v(),g(`span`,{key:4,class:u(`${h}-descriptions-separator`)},[f(()=>_)],2))])],6),p(`span`,{class:u([`${h}-descriptions-table-content__content`,r]),style:e(T)},[f(()=>y)],6)],10,k)));else{let n=d?(a-x)*2:b*2;t.row.push((v(),g(`th`,{key:5,class:u([`${h}-descriptions-table-header`,i]),colspan:n,style:e(S)},[f(()=>m)],14,A))),t.secondRow.push((v(),g(`td`,{key:6,class:u([`${h}-descriptions-table-content`,r]),colspan:n,style:e(T)},[f(()=>y)],14,j)))}return(t.span>=a||d)&&(t.span=0,t.row.length&&(t.rows.push(t.row),t.row=[]),o!==`left`&&t.secondRow.length&&(t.rows.push(t.secondRow),t.secondRow=[])),t},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(v(),g(`tr`,{class:u(`${h}-descriptions-table-row`)},[f(()=>e)],2)));return v(),g(`div`,{style:e(m),class:u([`${h}-descriptions`,this.themeClass,`${h}-descriptions--${o}-label-placement`,`${h}-descriptions--${s}-label-align`,`${h}-descriptions--${c}-size`,l&&`${h}-descriptions--bordered`])},[d||this.$slots.header?(v(),g(`div`,{key:0,class:u(`${h}-descriptions-header`)},[f(()=>d||S(this,`header`))],2)):f(()=>null),p(`div`,{class:u(`${h}-descriptions-table-wrapper`)},[p(`table`,{class:u(`${h}-descriptions-table`)},[p(`tbody`,null,[f(()=>o===`top`&&(v(),g(`tr`,{class:u(`${h}-descriptions-table-row`),style:{visibility:`collapse`}},[f(()=>x(a*2,(v(),g(`td`))))],2))),f(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=m({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};