import{F as c,G as p,H as V}from"./hooks-BFGxA73i.js";import"./dayjs@1.11.10-C8LoRVP6.js";import"./print-js@1.6.0-BdoEj60G.js";import"./currency.js@2.0.4-9OAR_aOO.js";import{a as F}from"./vue-hooks-plus@2.1.0_vue@3.4.26-CIuz-_xn.js";import{s as E}from"./instance-ClAhwUsY.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./lodash-es@4.17.21-Dos9GOhk.js";import"./@vueuse_core@10.9.0_vue@3.4.26-BxvIaqQO.js";import"./@vueuse_shared@10.9.0_vue@3.4.26-7aSumFzu.js";import"./utils-B_NGfO2V.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./interactjs@1.10.26-V8skghJH.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-DCOFUeQU.js";import"./echarts@5.5.0-BEyY33Zi.js";import"./zrender@5.5.0-JN1hODMT.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.26-Cq5aFJKF.js";import"./@vue_reactivity@3.4.26-DTbxPGxS.js";import"./@vue_shared@3.4.26-DWpY0PUk.js";const N=u=>E({url:"/api/list",method:"get",params:u}),H=Vue.defineComponent({name:"MockDemo",setup(){const u=[{type:"selection",multiple:!0},{title:"id",key:"id"},{title:"邮箱",key:"email"},{title:"地址",key:"address"},{title:"姓名",key:"name"},{title:"年龄",key:"age"},{title:"创建时间",key:"createDate"},{title:"操作",key:"action",render:o=>Vue.createVNode(naive.NFlex,{align:"center"},{default:()=>[Vue.createVNode(naive.NButton,{type:"primary",text:!0,onClick:()=>{window.$message.info("查看")}},{default:()=>[Vue.createTextVNode("查看")]}),Vue.createVNode(naive.NButton,{type:"primary",text:!0,onClick:()=>{window.$message.warning("编辑")}},{default:()=>[Vue.createTextVNode("编辑")]}),Vue.createVNode(naive.NButton,{type:"error",text:!0,onClick:()=>{window.$message.error("删除")}},{default:()=>[Vue.createTextVNode("删除")]})]})}],e=Vue.reactive({email:null}),[r,{getPage:t,getPageSize:a,setItemCount:i,getCallback:n,setPage:g,setPageSize:C}]=c(()=>{m({page:t(),pageSize:a(),email:e.email})}),{data:l,loading:d,run:m}=F(N,{defaultParams:[{page:t(),pageSize:a(),email:e.email}],onSuccess:o=>{const{total:s}=o;i(s)}});return{personData:l,personLoading:d,columns:u,...Vue.toRefs(e),getCallback:n,paginationRef:r}},render(){return Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>{var u;return[Vue.createVNode(naive.NCard,{title:"Mock 数据"},{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("mock 数据使用。但是，并没有启用生产环境的部署，所以生产环境结果为空。")])]}),Vue.createVNode(naive.NCard,{title:"提示"},{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("RTable 组件有一个比较值得注意的地方就是，该组件会自动的按照数据量计算分页条数。所以你在异步获取数据的时候，一定要手动设置 remote 属性为 true，并且设置 itemCount 或者 pageCount。")])]}),Vue.createVNode(naive.NForm,{labelPlacement:"left"},{default:()=>[Vue.createVNode(p,{bordered:!1,cols:3},{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NFormItemGi,{label:"邮箱"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.email,"onUpdate:value":e=>this.email=e,clearable:!0},null)]})]),action:()=>{var e;return Vue.createVNode(naive.NButton,{type:"primary",onClick:(e=this.getCallback)==null?void 0:e.bind(this)},{default:()=>[Vue.createTextVNode("搜索")]})}})]}),Vue.createVNode(V,{title:"Mock数据表格",data:(u=this.personData)==null?void 0:u.data,loading:this.personLoading,columns:this.columns,"onUpdate:columns":e=>this.columns=e,pagination:this.paginationRef,remote:!0,rowKey:e=>e.id},null)]}})}});export{H as default};
