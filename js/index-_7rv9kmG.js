import"./hooks-BFGxA73i.js";import"./dayjs@1.11.10-C8LoRVP6.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.1.0_vue@3.4.26-CIuz-_xn.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import{s as u,g as r,l as a,x as o}from"./utils-B_NGfO2V.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./lodash-es@4.17.21-Dos9GOhk.js";import"./@vueuse_core@10.9.0_vue@3.4.26-BxvIaqQO.js";import"./@vueuse_shared@10.9.0_vue@3.4.26-7aSumFzu.js";import"./interactjs@1.10.26-V8skghJH.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-DCOFUeQU.js";import"./echarts@5.5.0-BEyY33Zi.js";import"./zrender@5.5.0-JN1hODMT.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.26-Cq5aFJKF.js";import"./@vue_reactivity@3.4.26-DTbxPGxS.js";import"./@vue_shared@3.4.26-DWpY0PUk.js";const P=Vue.defineComponent({name:"CacheDemo",setup(){const e=Vue.ref("Ray"),t=Vue.ref("ray:");return{nameValue:e,currentPrefix:t}},render(){return Vue.createVNode(naive.NCard,{title:"cache 工具包示例"},{default:()=>Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("点击 setStorage 按钮，设置缓存示例")]),Vue.createVNode(naive.NInputGroup,null,{default:()=>[Vue.createVNode(naive.NInputGroupLabel,null,{default:()=>[Vue.createTextVNode("设置缓存内容")]}),Vue.createVNode(naive.NInput,{value:this.nameValue,"onUpdate:value":e=>this.nameValue=e,placeholder:"请输入姓名"},null)]}),Vue.createVNode(naive.NInputGroup,null,{default:()=>[Vue.createVNode(naive.NInputGroupLabel,null,{default:()=>[Vue.createTextVNode("设置前缀")]}),Vue.createVNode(naive.NInput,{value:this.currentPrefix,"onUpdate:value":e=>this.currentPrefix=e,placeholder:"请输入前缀"},null)]})]}),action:()=>Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{u("name",this.nameValue,"sessionStorage",{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success("设置成功")}},{default:()=>[Vue.createTextVNode("setStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{const e=r("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`获取到的姓名为：${e}`)}},{default:()=>[Vue.createTextVNode("getStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{a("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix}),window.$message.success("删除成功")}},{default:()=>[Vue.createTextVNode("removeStorage")]}),Vue.createVNode(naive.NButton,{onClick:()=>{const e=o("name","sessionStorage",{prefix:!0,prefixKey:this.currentPrefix});window.$message.success(`是否存在：${e}`)}},{default:()=>[Vue.createTextVNode("hasStorage")]})]})})}});export{P as default};
