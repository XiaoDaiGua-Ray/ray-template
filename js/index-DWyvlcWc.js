import{J as u}from"./hooks-DeCbIFFS.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./print-js@1.6.0-BdoEj60G.js";import"./lodash-es@4.17.21-BALnwRTu.js";import"./@vueuse_core@10.9.0_vue@3.4.38-Cp_qoKMZ.js";import"./@vueuse_shared@10.9.0_vue@3.4.38-BTLxKjPf.js";import"./vue-hooks-plus@2.2.1_vue@3.4.38-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./utils-DGuZdIHQ.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.38-f9XU7P4m.js";import"./@vue_reactivity@3.4.38-CmXFqMGn.js";import"./@vue_shared@3.4.38-D8qfpBTH.js";const D=Vue.defineComponent({name:"RouterDemoHome",setup(){const t=VueRouter.useRouter(),r=Vue.ref([{title:"姓名",key:"name"},{title:"地址",key:"address"},{title:"联系方式",key:"phone"},{title:"操作",key:"",render:e=>Vue.createVNode(naive.NFlex,{align:"center"},{default:()=>[Vue.createVNode(naive.NButton,{type:"info",text:!0,size:"tiny",onClick:()=>{t.push({path:"/router-demo/router-demo-detail",query:{name:e.name}})}},{default:()=>[Vue.createTextVNode("详情")]})]})}]),o=[];for(let e=0;e<10;e++)o.push({name:"张三"+e,address:"New York No. 1 Lake Park",phone:"010-121212",key:e});return{dataSource:o,columns:r}},render(){return Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(u,{columns:this.columns,"onUpdate:columns":t=>this.columns=t,data:this.dataSource},null)]})}});export{D as default};