import{s as r,g as o,h as u,x as a}from"./utils-GfUBWZZf.js";import"./hooks-CcEUU9Ku.js";import"./awesome-qr@2.1.5-rc.0-UnPo3EFD.js";import"./vue-hooks-plus@1.8.5_vue@3.4.15-UGgZVZ2w.js";import"./lodash@4.17.21-yUHHMES2.js";import"./js-cookie@3.0.5-bc0KQLgp.js";import"./screenfull@5.2.0-q9gEF-YC.js";import"./qs@6.11.2-wwOruwhc.js";import"./dayjs@1.11.10-A-QuG2Ol.js";import"./print-js@1.6.0-gYKv6oGQ.js";import"./currency.js@2.0.4--or6eeOG.js";import"./lodash-es@4.17.21-xgd1l9mE.js";import"./@vueuse_core@10.7.1_vue@3.4.15-9UoKs_p_.js";import"./@vueuse_shared@10.7.1_vue@3.4.15--52Mx__5.js";import"./interactjs@1.10.26-I0IiZoEj.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.7-fNhqB16x.js";import"./dom-to-image@2.6.0-eHYYUq-2.js";import"./echarts@5.4.3-Vt5ZmFiA.js";import"./zrender@5.4.4-fafgp4mQ.js";import"./tslib@2.3.0-21A5UWR7.js";import"./@vue_runtime-core@3.4.15-xG7oRWIU.js";import"./@vue_reactivity@3.4.15-2zCDAkOA.js";import"./@vue_shared@3.4.15-JOA8BF6u.js";import"./canvas@2.11.2-dZp4QMlu.js";import"./js-binary-schema-parser@2.0.3-CCV6nRej.js";import"./side-channel@1.0.4-hl21th03.js";import"./get-intrinsic@1.2.1-NE0DZZ3B.js";import"./has-symbols@1.0.3-fNtejGuA.js";import"./has-proto@1.0.1-dzJH2Y5C.js";import"./function-bind@1.1.1-Y6-kkB5s.js";import"./has@1.0.3-rcPLRdvS.js";import"./call-bind@1.0.2-8lNE5ocE.js";const b=Vue.defineComponent({name:"CacheDemo",setup(){const e=Vue.ref("Ray"),t=Vue.ref("ray:");return{nameValue:e,currentPrefix:t}},render(){return Vue.createVNode(naive.NCard,{title:"cache 工具包示例"},{default:()=>Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("点击 setStorage 按钮，设置缓存示例")]),Vue.createVNode(naive.NInput,{value:this.nameValue,"onUpdate:value":e=>this.nameValue=e,placeholder:"请输入姓名"},null),Vue.createVNode(naive.NInput,{value:this.currentPrefix,"onUpdate:value":e=>this.currentPrefix=e,placeholder:"请输入前缀"},null)]}),action:()=>Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{r("name",this.nameValue,"sessionStorage",{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success("设置成功")}},{default:()=>[Vue.createTextVNode("setStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{const e=o("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`获取到的姓名为：${e}`)}},{default:()=>[Vue.createTextVNode("getStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{u("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success("删除成功")}},{default:()=>[Vue.createTextVNode("removeStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{const e=a("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`是否存在：${e}`)}},{default:()=>[Vue.createTextVNode("hasStorage")]})]})})}});export{b as default};