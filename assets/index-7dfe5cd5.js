import{R as g}from"./index-d6db99e3.js";import{R as C}from"./index-3b40d9ad.js";import{u as A}from"./vue-hooks-plus@1.7.6_vue@3.3.4-1baf6b87.js";import{s as B}from"./instance-89b60589.js";import"./lodash@4.17.21-2cee12c8.js";import{V as p,M as k,a0 as n,r as y,P as a,g as l}from"./naive-ui@2.34.4_vue@3.3.4-eacf875e.js";import{k as h,D as w,v as D,b as t,p as o,F as R}from"./@vue_runtime-core@3.3.4-073fad6e.js";import{h as s,v}from"./@vue_reactivity@3.3.4-2b3a1c4e.js";import"./index-a3ee3b77.js";import"./vue-router@4.2.4_vue@3.3.4-e93fe26b.js";import"./lodash-es@4.17.21-b7de4195.js";import"./vue-i18n@9.2.2_vue@3.3.4-a7a92bd0.js";import"./@intlify_shared@9.2.2-e4047ebf.js";import"./@intlify_core-base@9.2.2-a0a8715c.js";import"./@intlify_message-compiler@9.2.2-8a818441.js";import"./@intlify_devtools-if@9.2.2-c61c979f.js";import"./dayjs@1.11.7-adc18375.js";import"./@babel_runtime@7.22.6-960cbc2f.js";import"./pinia@2.1.4_typescript@5.0.2_vue@3.3.4-ab93b4ec.js";import"./vue-demi@0.14.5_vue@3.3.4-71ba0ef2.js";import"./@vue_runtime-dom@3.3.4-d86573ec.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.1.0_vue@3.3.4-3ed9a412.js";import"./@vueuse_shared@9.1.0_vue@3.3.4-e5bccb39.js";import"./pinia-plugin-persistedstate@3.1.0_pinia@2.1.4-4f3b1591.js";import"./clipboard@2.0.11-6193b289.js";import"./date-fns@2.30.0-0bf1b710.js";import"./vueuc@0.4.51_vue@3.3.4-6588b5bd.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-24369cc5.js";import"./vooks@0.2.12_vue@3.3.4-59877c34.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-7cff6900.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";import"./vuedraggable@4.1.0_vue@3.3.4-c9b779ee.js";import"./vue@3.3.4-1da73de6.js";import"./sortablejs@1.14.0-ca132232.js";import"./print-js@1.6.0-31e6d2b4.js";import"./xlsx@0.18.5-65d3fcd1.js";import"./axios@1.2.0-413e2d92.js";import"./form-data@4.0.0-19dc8c5e.js";const b=u=>B({url:"/api/list",method:"get",params:u}),ht=h({name:"MockDemo",setup(){const u=s({page:1,pageSize:10,itemCount:0,pageSizes:[10,20,30,40,50],showSizePicker:!0,onUpdatePage:e=>{u.page=e,i()},onUpdatePageSize:e=>{u.pageSize=e,u.page=1,i()}}),{data:r,loading:d,run:F}=A(b,{manual:!0}),c=[{title:"id",key:"id"},{title:"邮箱",key:"email"},{title:"地址",key:"address"},{title:"姓名",key:"name"},{title:"年龄",key:"age"},{title:"创建时间",key:"createDate"},{title:"操作",key:"action",render:e=>t(l,{align:"center"},{default:()=>[t(a,{type:"primary",text:!0,onClick:()=>{window.$message.info("查看")}},{default:()=>[o("查看")]}),t(a,{type:"primary",text:!0,onClick:()=>{window.$message.warning("编辑")}},{default:()=>[o("编辑")]}),t(a,{type:"error",text:!0,onClick:()=>{window.$message.error("删除")}},{default:()=>[o("删除")]})]})}],m=s({email:null}),i=()=>{const{pageSize:e,page:E}=u,{email:f}=m;F({page:E,pageSize:e,email:f})};return w(()=>{r.value&&(u.itemCount=r.value.total)}),D(()=>{i()}),{personData:r,personLoading:d,paginationRef:u,columns:c,...v(m),getPerson:i}},render(){return t(l,{vertical:!0,wrapItem:!1},{default:()=>{var u;return[t(p,{title:"Mock 数据"},{default:()=>[t("h2",null,[o("mock 数据使用。但是，并没有启用生产环境的部署，所以生产环境结果为空。")])]}),t(p,{title:"提示"},{default:()=>[t("h2",null,[o("RayTable 组件有一个比较值得注意的地方就是，该组件会自动的按照数据量计算分页条数。所以你在异步获取数据的时候，一定要手动设置 remote 属性为 true，并且设置 itemCount 或者 pageCount。")])]}),t(k,{labelPlacement:"left"},{default:()=>[t(C,{bordered:!1,cols:3},{default:()=>t(R,null,[t(n,{label:"邮箱"},{default:()=>[t(y,{value:this.email,"onUpdate:value":r=>this.email=r,clearable:!0},null)]}),t(n,null,{default:()=>[t(a,{type:"primary",onClick:this.getPerson.bind(this)},{default:()=>[o("搜索")]})]})])})]}),t(g,{title:"分页表格",data:(u=this.personData)==null?void 0:u.data,loading:this.personLoading,columns:this.columns,pagination:this.paginationRef,remote:!0,action:!0},null)]}})}});export{ht as default};