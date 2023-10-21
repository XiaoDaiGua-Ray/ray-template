import{R as c}from"./Table-2a977e20.js";import{R as d}from"./index-5e6c7b4a.js";import{a as p}from"./vue-hooks-plus@1.8.5_vue@3.3.6-2f171f2e.js";import{s}from"./instance-3a84c60b.js";import"./lodash@4.17.21-e6f077ad.js";import"./index-36b1636d.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./@vueuse_core@9.13.0_vue@3.3.6-52ac0131.js";import"./@vueuse_shared@9.13.0_vue@3.3.6-b2a32b41.js";import"./dayjs@1.11.9-6a1565a1.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";import"./print-js@1.6.0-4c3d86b1.js";const V=e=>s({url:"/api/list",method:"get",params:e}),G=Vue.defineComponent({name:"MockDemo",setup(){const e=Vue.reactive({page:1,pageSize:10,itemCount:0,pageSizes:[10,20,30,40,50],showSizePicker:!0,onUpdatePage:u=>{e.page=u,a()},onUpdatePageSize:u=>{e.pageSize=u,e.page=1,a()}}),{data:t,loading:r,run:i}=p(V,{manual:!0,onSuccess:u=>{}}),n=Vue.ref([{title:"id",key:"id"},{title:"邮箱",key:"email"},{title:"地址",key:"address"},{title:"姓名",key:"name"},{title:"年龄",key:"age"},{title:"创建时间",key:"createDate"},{title:"操作",key:"action",render:u=>Vue.createVNode(naive.NSpace,{align:"center"},{default:()=>[Vue.createVNode(naive.NButton,{type:"primary",text:!0,onClick:()=>{window.$message.info("查看")}},{default:()=>[Vue.createTextVNode("查看")]}),Vue.createVNode(naive.NButton,{type:"primary",text:!0,onClick:()=>{window.$message.warning("编辑")}},{default:()=>[Vue.createTextVNode("编辑")]}),Vue.createVNode(naive.NButton,{type:"error",text:!0,onClick:()=>{window.$message.error("删除")}},{default:()=>[Vue.createTextVNode("删除")]})]})}]),o=Vue.reactive({email:null}),a=()=>{const{pageSize:u,page:l}=e,{email:m}=o;i({page:l,pageSize:u,email:m})};return Vue.watchEffect(()=>{t.value&&(e.itemCount=t.value.total)}),Vue.onBeforeMount(()=>{a()}),{personData:t,personLoading:r,paginationRef:e,columns:n,...Vue.toRefs(o),getPerson:a}},render(){return Vue.createVNode(naive.NSpace,{vertical:!0,wrapItem:!1},{default:()=>{var e;return[Vue.createVNode(naive.NCard,{title:"Mock 数据"},{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("mock 数据使用。但是，并没有启用生产环境的部署，所以生产环境结果为空。")])]}),Vue.createVNode(naive.NCard,{title:"提示"},{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("RTable 组件有一个比较值得注意的地方就是，该组件会自动的按照数据量计算分页条数。所以你在异步获取数据的时候，一定要手动设置 remote 属性为 true，并且设置 itemCount 或者 pageCount。")])]}),Vue.createVNode(naive.NForm,{labelPlacement:"left"},{default:()=>[Vue.createVNode(d,{bordered:!1,cols:3},{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NFormItemGi,{label:"邮箱"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.email,"onUpdate:value":t=>this.email=t,clearable:!0},null)]})]),action:()=>Vue.createVNode(naive.NButton,{type:"primary",onClick:this.getPerson.bind(this)},{default:()=>[Vue.createTextVNode("搜索")]})})]}),Vue.createVNode(c,{title:"分页表格",data:(e=this.personData)==null?void 0:e.data,loading:this.personLoading,columns:this.columns,"onUpdate:columns":t=>this.columns=t,pagination:this.paginationRef,remote:!0},null)]}})}});export{G as default};
