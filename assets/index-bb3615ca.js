import{R as e,L as t}from"./ray-49c2c9fa.js";import"./index-cb5c6b30.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.13.0_vue@3.3.4-7e6f7ed6.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-b2a32b41.js";import"./dayjs@1.11.9-208bf754.js";import"./awesome-qr@2.1.5-rc.0-423f5ed7.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-3371ee7a.js";const f=Vue.defineComponent({name:"RQRCode",setup(){const u=Vue.ref("ray template yes"),a=Vue.ref(),o=Vue.ref();return{qrcodeText:u,qrcodeStatus:a,rayQRCodeRef:o}},render(){return Vue.createVNode(naive.NSpace,{wrapItem:!1},{default:()=>[Vue.createVNode(naive.NCard,null,{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("基于 awesome-qr 进行封装，支持 LOGO、gif、backgroundImage 等属性。")]),Vue.createVNode("h2",null,[Vue.createTextVNode("该组件会自动监听文本内容变化，然后重新渲染（watchText）")]),Vue.createVNode("h2",null,[Vue.createTextVNode("具体使用请参考 props 配置项")])]}),Vue.createVNode(naive.NCard,{title:"基础二维码"},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:"ray template yes"},null),Vue.createVNode(e,{text:"ray template yes",logoImage:t},null),Vue.createVNode(e,{text:"ray template yes",gifBackgroundURL:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",dotScale:.5,colorDark:"#64d9d6"},null)]})]}),Vue.createVNode(naive.NCard,{title:"状态二维码"},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:"ray template yes",logoImage:t,status:"error",onReload:()=>{window.$message.error("relod props")}},null),Vue.createVNode(e,{text:"ray template yes",logoImage:t,status:"loading"},null)]})]}),Vue.createVNode(naive.NCard,{title:"监听内容变化"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{this.qrcodeStatus="loading",setTimeout(()=>{this.qrcodeText="text updated: "+new Date().getTime(),this.qrcodeStatus=void 0},1e3)}},{default:()=>[Vue.createTextVNode("更新二维码内容")]}),Vue.createVNode(naive.NButton,{onClick:()=>{var u;(u=this.rayQRCodeRef)==null||u.downloadQRCode()}},{default:()=>[Vue.createTextVNode("下载二维码")]})]}),Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:this.qrcodeText,status:this.qrcodeStatus,logoImage:t,ref:"rayQRCodeRef"},null),Vue.createTextVNode("当前二维码内容："),this.qrcodeText]})]})]})]})}});export{f as default};