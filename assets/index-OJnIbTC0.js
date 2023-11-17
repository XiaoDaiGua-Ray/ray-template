import{R as e,L as t}from"./ray-cRawy-kT.js";import"./index-EwlO25Hg.js";import"./lodash-es@4.17.21-zBC-oVE3.js";import"./vue-hooks-plus@1.8.5_vue@3.3.8-KaZQIedQ.js";import"./lodash@4.17.21-aCqas35P.js";import"./awesome-qr@2.1.5-rc.0-UnPo3EFD.js";import"./canvas@2.11.2-dZp4QMlu.js";import"./js-binary-schema-parser@2.0.3-CCV6nRej.js";import"./js-cookie@3.0.5-bc0KQLgp.js";import"./screenfull@5.2.0-q9gEF-YC.js";import"./qs@6.11.2-wwOruwhc.js";import"./side-channel@1.0.4-hl21th03.js";import"./get-intrinsic@1.2.1-NE0DZZ3B.js";import"./has-symbols@1.0.3-fNtejGuA.js";import"./has-proto@1.0.1-dzJH2Y5C.js";import"./function-bind@1.1.1-Y6-kkB5s.js";import"./has@1.0.3-rcPLRdvS.js";import"./call-bind@1.0.2-8lNE5ocE.js";import"./@vueuse_core@10.6.1_vue@3.3.8-OY_VXukt.js";import"./@vueuse_shared@10.6.1_vue@3.3.8-fG4vX-4M.js";import"./dayjs@1.11.10-IrZctHvJ.js";import"./@vue_runtime-core@3.3.8-VrcJ4P69.js";import"./@vue_reactivity@3.3.8-4NsB6yaG.js";import"./@vue_shared@3.3.8-W5PO5ES3.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-fNhqB16x.js";import"./clipboard@2.0.11-1jqEMlOW.js";const q=Vue.defineComponent({name:"RQRCode",setup(){const u=Vue.ref("ray template yes"),a=Vue.ref(),o=Vue.ref();return{qrcodeText:u,qrcodeStatus:a,rayQRCodeRef:o}},render(){return Vue.createVNode(naive.NSpace,{wrapItem:!1},{default:()=>[Vue.createVNode(naive.NCard,null,{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("基于 awesome-qr 进行封装，支持 LOGO、gif、backgroundImage 等属性。")]),Vue.createVNode("h2",null,[Vue.createTextVNode("该组件会自动监听文本内容变化，然后重新渲染（watchText）")]),Vue.createVNode("h2",null,[Vue.createTextVNode("具体使用请参考 props 配置项")])]}),Vue.createVNode(naive.NCard,{title:"基础二维码"},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:"ray template yes"},null),Vue.createVNode(e,{text:"ray template yes",logoImage:t},null),Vue.createVNode(e,{text:"ray template yes",gifBackgroundURL:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",dotScale:.5,colorDark:"#64d9d6"},null)]})]}),Vue.createVNode(naive.NCard,{title:"状态二维码"},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:"ray template yes",logoImage:t,status:"error",onReload:()=>{window.$message.error("relod props")}},null),Vue.createVNode(e,{text:"ray template yes",logoImage:t,status:"loading"},null)]})]}),Vue.createVNode(naive.NCard,{title:"监听内容变化"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{this.qrcodeStatus="loading",setTimeout(()=>{this.qrcodeText="text updated: "+new Date().getTime(),this.qrcodeStatus=void 0},1e3)}},{default:()=>[Vue.createTextVNode("更新二维码内容")]}),Vue.createVNode(naive.NButton,{onClick:()=>{var u;(u=this.rayQRCodeRef)==null||u.downloadQRCode()}},{default:()=>[Vue.createTextVNode("下载二维码")]})]}),Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(e,{text:this.qrcodeText,status:this.qrcodeStatus,logoImage:t,ref:"rayQRCodeRef"},null),Vue.createTextVNode("当前二维码内容："),this.qrcodeText]})]})]})]})}});export{q as default};
