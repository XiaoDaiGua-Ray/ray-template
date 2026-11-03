import{Mn as e,Q as t,S as n,_n as r,_t as i,bt as a,gn as o,hn as s,ht as c,mn as l,ot as u,tt as d,un as f,x as p}from"./replaceable-DW6s2lkT.js";import{At as m,z as h}from"./toString-BWDzaUQG.js";import{i as g,n as _,r as v,t as y}from"./cache-O_hPMSdv.js";import{Ot as b,st as x}from"./index-DO-N-bSc.js";import{t as S}from"./Button-vr5e8LJV.js";import{t as C}from"./Card-D38P0NK6.js";import{n as w,t as T}from"./Input-CcCbIWFY.js";import{c as E}from"./browser-m4QWgN_p.js";var D=c(`input-group-label`,`
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 box-sizing: border-box;
 padding: 0 12px;
 display: inline-block;
 border-radius: var(--n-border-radius);
 background-color: var(--n-group-label-color);
 color: var(--n-group-label-text-color);
 font-size: var(--n-font-size);
 line-height: var(--n-height);
 height: var(--n-height);
 flex-shrink: 0;
 white-space: nowrap;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[i(`border`,`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]),O={...p.props,size:String,bordered:{type:Boolean,default:void 0}},k=r({name:`InputGroupLabel`,props:O,setup(e){let{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:i,mergedComponentPropsRef:o}=u(e),s=p(`Input`,`-input-group-label`,D,w,e,r),{mergedSizeRef:c}=E(e,{mergedSize(t){return e.size===void 0?t?t.mergedSize.value:o?.value?.Input?.size||`medium`:e.size}}),l=f(()=>{let{value:e}=c,{common:{cubicBezierEaseInOut:t},self:{groupLabelColor:n,borderRadius:r,groupLabelTextColor:i,lineHeight:o,groupLabelBorder:l,[a(`fontSize`,e)]:u,[a(`height`,e)]:d}}=s.value;return{"--n-bezier":t,"--n-group-label-color":n,"--n-group-label-border":l,"--n-border-radius":r,"--n-group-label-text-color":i,"--n-font-size":u,"--n-line-height":o,"--n-height":d}}),d=i?n(`input-group-label`,f(()=>c.value[0]),l,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:i?void 0:l,themeClass:d?.themeClass,onRender:d?.onRender}},render(){let{mergedClsPrefix:n}=this;return this.onRender?.(),e(),l(`div`,{class:t([`${n}-input-group-label`,this.themeClass]),style:m(this.cssVars)},[d(()=>this.$slots.default?.()),this.mergedBordered?(e(),l(`div`,{key:0,class:t(`${n}-input-group-label__border`)},null,2)):d(()=>null)],6)}}),A=r({name:`CacheDemo`,setup(){return{nameValue:h(`Ray`),currentPrefix:h(`ray:`)}},render(){return o(C,{title:`cache 工具包示例`},{default:()=>o(x,{vertical:!0},{default:()=>[o(`h3`,null,[s(`点击 setStorage 按钮，设置缓存示例`)]),o(b,null,{default:()=>[o(k,null,{default:()=>[s(`设置缓存内容`)]}),o(T,{value:this.nameValue,"onUpdate:value":e=>this.nameValue=e,placeholder:`请输入姓名`},null)]}),o(b,null,{default:()=>[o(k,null,{default:()=>[s(`设置前缀`)]}),o(T,{value:this.currentPrefix,"onUpdate:value":e=>this.currentPrefix=e,placeholder:`请输入前缀`},null)]})]}),action:()=>o(x,null,{default:()=>[o(S,{onClick:()=>{g(`name`,this.nameValue,`sessionStorage`,{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success(`设置成功`)}},{default:()=>[s(`setStorage`)]}),o(S,{onClick:()=>{let e=y(`name`,`sessionStorage`,{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`获取到的姓名为：${e}`)}},{default:()=>[s(`getStorage`)]}),o(S,{onClick:()=>{v(`name`,`sessionStorage`,{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success(`删除成功`)}},{default:()=>[s(`removeStorage`)]}),o(S,{onClick:()=>{let e=_(`name`,`sessionStorage`,{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`是否存在：${e}`)}},{default:()=>[s(`hasStorage`)]})]})})}});export{A as default};