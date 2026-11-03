import{At as e}from"./toString-BWDzaUQG.js";import{Mn as t,Q as n,S as r,St as i,_n as a,_t as o,bt as s,dn as c,ht as l,mn as u,mt as d,ot as f,tt as p,un as m,vt as h,x as g,xt as _,yt as v}from"./replaceable-DW6s2lkT.js";import{n as y,t as b}from"./get-slot-jO3Rp7n2.js";import{Bt as x,Ht as S,ut as C}from"./index-DO-N-bSc.js";function w(e,t=`default`,n=[]){let{children:r}=e;if(typeof r==`object`&&r&&!Array.isArray(r)){let e=r[t];if(typeof e==`function`)return e()}return n}var T=d([l(`descriptions`,{fontSize:`var(--n-font-size)`},[l(`descriptions-separator`,`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),l(`descriptions-table-wrapper`,[l(`descriptions-table`,[l(`descriptions-table-row`,[l(`descriptions-table-header`,{padding:`var(--n-th-padding)`}),l(`descriptions-table-content`,{padding:`var(--n-td-padding)`})])])]),v(`bordered`,[l(`descriptions-table-wrapper`,[l(`descriptions-table`,[l(`descriptions-table-row`,[d(`&:last-child`,[l(`descriptions-table-content`,{paddingBottom:0})])])])])]),h(`left-label-placement`,[l(`descriptions-table-content`,[d(`> *`,{verticalAlign:`top`})])]),h(`left-label-align`,[d(`th`,{textAlign:`left`})]),h(`center-label-align`,[d(`th`,{textAlign:`center`})]),h(`right-label-align`,[d(`th`,{textAlign:`right`})]),h(`bordered`,[l(`descriptions-table-wrapper`,`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[l(`descriptions-table`,[l(`descriptions-table-row`,[d(`&:not(:last-child)`,[l(`descriptions-table-content`,{borderBottom:`1px solid var(--n-merged-border-color)`}),l(`descriptions-table-header`,{borderBottom:`1px solid var(--n-merged-border-color)`})]),l(`descriptions-table-header`,`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[d(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})]),l(`descriptions-table-content`,[d(`&:not(:last-child)`,{borderRight:`1px solid var(--n-merged-border-color)`})])])])])]),l(`descriptions-header`,`
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
 `,[o(`content`,`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),o(`label`,`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),_(l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),i(l(`descriptions-table-wrapper`,`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),E=`DESCRIPTION_ITEM_FLAG`;function D(e){return typeof e==`object`&&e&&!Array.isArray(e)?e.type&&e.type.DESCRIPTION_ITEM_FLAG:!1}var O=[`colspan`],k=[`colspan`],A=[`colspan`],j=[`colspan`],M={...g.props,title:String,column:{type:Number,default:3},columns:Number,labelPlacement:{type:String,default:`top`},labelAlign:{type:String,default:`left`},separator:{type:String,default:`:`},size:String,bordered:Boolean,labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},N=a({name:`Descriptions`,props:M,slots:Object,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedComponentPropsRef:i}=f(e),a=m(()=>e.size||i?.value?.Descriptions?.size||`medium`),o=g(`Descriptions`,`-descriptions`,T,C,e,t),c=m(()=>{let{bordered:t}=e,n=a.value,{common:{cubicBezierEaseInOut:r},self:{titleTextColor:i,thColor:c,thColorModal:l,thColorPopover:u,thTextColor:d,thFontWeight:f,tdTextColor:p,tdColor:m,tdColorModal:h,tdColorPopover:g,borderColor:_,borderColorModal:v,borderColorPopover:y,borderRadius:b,lineHeight:x,[s(`fontSize`,n)]:S,[s(t?`thPaddingBordered`:`thPadding`,n)]:C,[s(t?`tdPaddingBordered`:`tdPadding`,n)]:w}}=o.value;return{"--n-title-text-color":i,"--n-th-padding":C,"--n-td-padding":w,"--n-font-size":S,"--n-bezier":r,"--n-th-font-weight":f,"--n-line-height":x,"--n-th-text-color":d,"--n-td-text-color":p,"--n-th-color":c,"--n-th-color-modal":l,"--n-th-color-popover":u,"--n-td-color":m,"--n-td-color-modal":h,"--n-td-color-popover":g,"--n-border-radius":b,"--n-border-color":_,"--n-border-color-modal":v,"--n-border-color-popover":y}}),l=n?r(`descriptions`,m(()=>{let t=``,{bordered:n}=e;return n&&(t+=`a`),t+=a.value[0],t}),c,e):void 0;return{mergedClsPrefix:t,cssVars:n?void 0:c,themeClass:l?.themeClass,onRender:l?.onRender,compitableColumn:x(e,[`columns`,`column`]),inlineThemeDisabled:n,mergedSize:a}},render(){let r=this.$slots.default,i=r?y(r()):[];i.length;let{contentClass:a,labelClass:o,compitableColumn:s,labelPlacement:l,labelAlign:d,mergedSize:f,bordered:m,title:h,cssVars:g,mergedClsPrefix:_,separator:v,onRender:x}=this;x?.();let C=i.filter(e=>D(e)),T=C.reduce((r,i,d)=>{let f=i.props||{},h=C.length-1===d,g=[`label`in f?f.label:w(i,`label`)],y=[w(i)],b=f.span||1,x=r.span;r.span+=b;let S=f.labelStyle||f[`label-style`]||this.labelStyle,T=f.contentStyle||f[`content-style`]||this.contentStyle;if(l===`left`)m?r.row.push((t(),u(`th`,{key:1,class:n([`${_}-descriptions-table-header`,o]),colspan:1,style:e(S)},[p(()=>g)],6)),(t(),u(`td`,{key:2,class:n([`${_}-descriptions-table-content`,a]),colspan:h?(s-x)*2+1:b*2-1,style:e(T)},[p(()=>y)],14,O))):r.row.push((t(),u(`td`,{key:3,class:n(`${_}-descriptions-table-content`),colspan:h?(s-x)*2:b*2},[c(`span`,{class:n([`${_}-descriptions-table-content__label`,o]),style:e(S)},[p(()=>[...g,v&&(t(),u(`span`,{key:4,class:n(`${_}-descriptions-separator`)},[p(()=>v)],2))])],6),c(`span`,{class:n([`${_}-descriptions-table-content__content`,a]),style:e(T)},[p(()=>y)],6)],10,k)));else{let i=h?(s-x)*2:b*2;r.row.push((t(),u(`th`,{key:5,class:n([`${_}-descriptions-table-header`,o]),colspan:i,style:e(S)},[p(()=>g)],14,A))),r.secondRow.push((t(),u(`td`,{key:6,class:n([`${_}-descriptions-table-content`,a]),colspan:i,style:e(T)},[p(()=>y)],14,j)))}return(r.span>=s||h)&&(r.span=0,r.row.length&&(r.rows.push(r.row),r.row=[]),l!==`left`&&r.secondRow.length&&(r.rows.push(r.secondRow),r.secondRow=[])),r},{span:0,row:[],secondRow:[],rows:[]}).rows.map(e=>(t(),u(`tr`,{class:n(`${_}-descriptions-table-row`)},[p(()=>e)],2)));return t(),u(`div`,{style:e(g),class:n([`${_}-descriptions`,this.themeClass,`${_}-descriptions--${l}-label-placement`,`${_}-descriptions--${d}-label-align`,`${_}-descriptions--${f}-size`,m&&`${_}-descriptions--bordered`])},[h||this.$slots.header?(t(),u(`div`,{key:0,class:n(`${_}-descriptions-header`)},[p(()=>h||b(this,`header`))],2)):p(()=>null),c(`div`,{class:n(`${_}-descriptions-table-wrapper`)},[c(`table`,{class:n(`${_}-descriptions-table`)},[c(`tbody`,null,[p(()=>l===`top`&&(t(),u(`tr`,{class:n(`${_}-descriptions-table-row`),style:{visibility:`collapse`}},[p(()=>S(s*2,(t(),u(`td`))))],2))),p(()=>T)])],2)],2)],6)}}),P={label:String,span:{type:Number,default:1},labelClass:String,labelStyle:[Object,String],contentClass:String,contentStyle:[Object,String]},F=a({name:`DescriptionsItem`,[E]:!0,props:P,slots:Object,render(){return null}});export{N as n,F as t};