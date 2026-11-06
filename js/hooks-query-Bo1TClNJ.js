import{G as e,L as t,S as n,T as r,d as i,f as a,h as o,i as s,v as c,y as l}from"./runtime-core.esm-bundler-BvnVMcQz.js";import{A as u,T as d,gt as f}from"./isSymbol-DERoyzaf.js";import"./src-DqXDpoH7.js";import{n as p,t as m}from"./person-BDQXze0_.js";import{$n as h,Ln as g,Nn as _,Pn as v,Z as y,hr as b,mn as x,nr as S,ur as C}from"./directives-DMEEq2hY.js";import{t as w}from"./useTablePro-Ceczz0Qe.js";import{D as T,Dt as E,O as D,St as O,Tt as k,b as A,ft as j,g as M,it as N,st as P,t as F,wt as I}from"./Card-CLV9EByv.js";import{t as L}from"./DemoPage-DXXea1cu.js";var R=O(`statistic`,[I(`label`,`
 font-weight: var(--n-label-font-weight);
 transition: .3s color var(--n-bezier);
 font-size: var(--n-label-font-size);
 color: var(--n-label-text-color);
 `),O(`statistic-value`,`
 margin-top: 4px;
 font-weight: var(--n-value-font-weight);
 `,[I(`prefix`,`
 margin: 0 4px 0 0;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-prefix-text-color);
 `,[O(`icon`,{verticalAlign:`-0.125em`})]),I(`content`,`
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-text-color);
 `),I(`suffix`,`
 margin: 0 0 0 4px;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-suffix-text-color);
 `,[O(`icon`,{verticalAlign:`-0.125em`})])])]),z={...T.props,tabularNums:Boolean,label:String,value:[String,Number]},B=l({name:`Statistic`,props:z,slots:Object,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedRtlRef:r}=j(e),a=T(`Statistic`,`-statistic`,R,v,e,t),o=M(`Statistic`,r,t),s=i(()=>{let{self:{labelFontWeight:e,valueFontSize:t,valueFontWeight:n,valuePrefixTextColor:r,labelTextColor:i,valueSuffixTextColor:o,valueTextColor:s,labelFontSize:c},common:{cubicBezierEaseInOut:l}}=a.value;return{"--n-bezier":l,"--n-label-font-size":c,"--n-label-font-weight":e,"--n-label-text-color":i,"--n-value-font-weight":n,"--n-value-font-size":t,"--n-value-prefix-text-color":r,"--n-value-suffix-text-color":o,"--n-value-text-color":s}}),c=n?D(`statistic`,void 0,s,e):void 0;return{rtlEnabled:o,mergedClsPrefix:t,cssVars:n?void 0:s,themeClass:c?.themeClass,onRender:c?.onRender}},render(){let{mergedClsPrefix:e,$slots:{default:n,label:r,prefix:i,suffix:c}}=this;return this.onRender?.(),t(),o(`div`,{class:N([`${e}-statistic`,this.themeClass,this.rtlEnabled&&`${e}-statistic--rtl`]),style:f(this.cssVars)},[P(()=>A(r,n=>(t(),o(`div`,{class:N(`${e}-statistic__label`)},[P(()=>this.label||n)],2)))),a(`div`,{class:N(`${e}-statistic-value`),style:f({fontVariantNumeric:this.tabularNums?`tabular-nums`:``})},[P(()=>A(i,n=>n&&(t(),o(`span`,{class:N(`${e}-statistic-value__prefix`)},[P(()=>n)],2)))),this.value===void 0?(t(),o(s,{key:1},[P(()=>A(n,n=>n&&(t(),o(`span`,{class:N(`${e}-statistic-value__content`)},[P(()=>n)],2))))],64)):(t(),o(`span`,{key:0,class:N(`${e}-statistic-value__content`)},[P(()=>this.value)],2)),P(()=>A(c,n=>n&&(t(),o(`span`,{class:N(`${e}-statistic-value__suffix`)},[P(()=>n)],2))))],6)],6)}}),V=O(`text`,`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`,[k(`strong`,`
 font-weight: var(--n-font-weight-strong);
 `),k(`italic`,{fontStyle:`italic`}),k(`underline`,{textDecoration:`underline`}),k(`code`,`
 line-height: 1.4;
 display: inline-block;
 font-family: var(--n-font-famliy-mono);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 box-sizing: border-box;
 padding: .05em .35em 0 .35em;
 border-radius: var(--n-code-border-radius);
 font-size: .9em;
 color: var(--n-code-text-color);
 background-color: var(--n-code-color);
 border: var(--n-code-border);
 `)]),H={...T.props,code:Boolean,type:{type:String,default:`default`},delete:Boolean,strong:Boolean,italic:Boolean,underline:Boolean,depth:[String,Number],tag:String,as:{type:String,validator:()=>!0,default:void 0}},U=l({name:`Text`,props:H,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:n}=j(e),r=T(`Typography`,`-text`,V,_,e,t),a=i(()=>{let{depth:t,type:n}=e,i=n==="default"?t===void 0?`textColor`:`textColor${t}Depth`:E(`textColor`,n),{common:{fontWeightStrong:a,fontFamilyMono:o,cubicBezierEaseInOut:s},self:{codeTextColor:c,codeBorderRadius:l,codeColor:u,codeBorder:d,[i]:f}}=r.value;return{"--n-bezier":s,"--n-text-color":f,"--n-font-weight-strong":a,"--n-font-famliy-mono":o,"--n-code-border-radius":l,"--n-code-text-color":c,"--n-code-color":u,"--n-code-border":d}}),o=n?D(`text`,i(()=>`${e.type[0]}${e.depth||``}`),a,e):void 0;return{mergedClsPrefix:t,compitableTag:b(e,[`as`,`tag`]),cssVars:n?void 0:a,themeClass:o?.themeClass,onRender:o?.onRender}},render(){let{mergedClsPrefix:e}=this;this.onRender?.();let r=[`${e}-text`,this.themeClass,{[`${e}-text--code`]:this.code,[`${e}-text--delete`]:this.delete,[`${e}-text--strong`]:this.strong,[`${e}-text--italic`]:this.italic,[`${e}-text--underline`]:this.underline}],i=this.$slots.default?.();return this.code?(t(),o(`code`,{key:1,class:N(r),style:f(this.cssVars)},[this.delete?(t(),o(`del`,{key:0},[P(()=>i)])):(t(),o(s,{key:1},[P(()=>i)],64))],6)):this.delete?(t(),o(`del`,{key:2,class:N(r),style:f(this.cssVars)},[P(()=>i)],6)):n(this.compitableTag||`span`,{class:r,style:this.cssVars},i)}});function W(e){return typeof e==`function`||Object.prototype.toString.call(e)===`[object Object]`&&!r(e)}var G={idle:`default`,loading:`info`,failed:`error`,loaded:`success`},K=l({name:`TableDemoHooksQuery`,setup(){let{t}=x(),[n,{isReady:r,queryState:a,reload:o,setPage:s,setPageSize:l}]=w(),f=e(),_=d(``),v=u({}),b=u({}),T=d(0),E=i(()=>p(e=>t(`table.${e}`)).slice(0,4)),D=i(()=>a.value?.loading?`loading`:a.value?.failed?`failed`:a.value?.total==null?`idle`:`loaded`),O=!1,k=async(e,t)=>{let n=O;return O=!1,T.value+=1,b.value=e,m({...e,fail:n},t)},A=e=>{if(!r.value)return;let t=e.trim()||void 0;t===v.value.name?o(!0):v.value={name:t}};return()=>{let e,i,u,d,p,m,x;return c(L,{title:t(`menu.TableHooksQuery`),description:t(`tableHooks.queryDescription`)},{default:()=>[c(F,null,{default:()=>[c(g,{vertical:!0},{default:()=>[c(`form`,{class:`r-table-search`,onSubmit:e=>{e.preventDefault(),A(_.value)}},[c(`div`,{class:`r-table-search__field`},[c(`label`,{for:f},[t(`table.name`)]),c(S,{inputProps:{id:f,name:`name`},value:_.value,"onUpdate:value":e=>_.value=e,placeholder:t(`table.nameHint`)},null)]),c(`div`,{class:`r-table-search__actions`},[c(h,{attrType:`submit`,type:`primary`,disabled:!r.value},W(e=t(`table.search`))?e:{default:()=>[e]}),c(h,{disabled:!r.value,onClick:()=>{_.value=``,A(``)}},W(i=t(`table.reset`))?i:{default:()=>[i]})])]),c(g,null,{default:()=>[c(h,{disabled:!r.value,onClick:()=>o()},W(u=t(`tableHooks.reloadPage`))?u:{default:()=>[u]}),c(h,{disabled:!r.value,onClick:()=>o(!0)},W(d=t(`tableHooks.reloadFirstPage`))?d:{default:()=>[d]}),c(h,{disabled:!r.value,onClick:()=>s(2)},W(p=t(`tableHooks.secondPage`))?p:{default:()=>[p]}),c(h,{disabled:!r.value,onClick:()=>l(20)},W(m=t(`table.twentyRows`))?m:{default:()=>[m]}),c(h,{disabled:!r.value||a.value?.loading,onClick:()=>{O=!0,o()}},W(x=t(`table.demoFailure`))?x:{default:()=>[x]})]})]})]}),c(F,{title:t(`tableHooks.queryStatus`)},{"header-extra":()=>{let e;return c(C,{size:`small`,type:G[D.value],bordered:!1},W(e=t(`tableHooks.queryPhase.${D.value}`))?e:{default:()=>[e]})},default:()=>c(g,{vertical:!0,size:12},{default:()=>[c(g,{size:[24,12]},{default:()=>[c(B,{tabularNums:!0,label:t(`tableHooks.currentPage`),value:a.value?.page??`—`},null),c(B,{tabularNums:!0,label:t(`tableHooks.rowsPerPage`),value:a.value?.pageSize??`—`},null),c(B,{tabularNums:!0,label:t(`tableHooks.resultTotal`),value:a.value?.total??`—`},null)]}),c(U,{depth:3},{default:()=>[t(`tableHooks.lastRequest`),` · `,t(`tableHooks.requestDetails`,{count:T.value,page:b.value.page??`—`,size:b.value.pageSize??`—`,name:b.value.name??`—`})]})]})}),c(y,{onRegister:n,title:t(`table.directory`),columns:E.value,request:k,params:v.value,scrollX:562},null)]})}}});export{K as default};