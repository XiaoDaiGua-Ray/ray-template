import{w as o,x as u,f as i}from"./hooks-DUpKDX8W.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.6-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import{g as a}from"./utils-DvxnuKiq.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./lodash-es@4.17.21-BALnwRTu.js";import"./@vueuse_core@10.9.0_vue@3.5.6-CMHqEu2-.js";import"./@vueuse_shared@10.9.0_vue@3.5.6-BTLxKjPf.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@4.0.1_pinia@2.1.7-MNUqeAcu.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.0-DyxInw53.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.5.6-CUaD_-7Q.js";import"./@vue_reactivity@3.5.6-CXMPYrvZ.js";import"./@vue_shared@3.5.6-6BrT-eFF.js";const s=Vue.defineComponent({name:"PageResult",props:{...naive.resultProps},setup(){const{router:e}=u();return{goBack:()=>{const{appMenuKey:r}=i,t=a(r,"sessionStorage",{defaultValue:""});t&&e.replace(t)}}},render(){const{goBack:e}=this;return Vue.createVNode("div",{class:"error-page"},[Vue.createVNode(naive.NResult,Vue.mergeProps(this.$props,{status:"500",title:"404 资源不存在",description:"小调皮你走错地方了"}),{...this.$slots,footer:()=>Vue.createVNode(naive.NFlex,{align:"center",justify:"center"},{default:()=>[Vue.createVNode(naive.NButton,{onClick:o.bind(this,!0)},{default:()=>[Vue.createTextVNode("返回首页")]}),Vue.createVNode(naive.NButton,{type:"primary",onClick:e.bind(this)},{default:()=>[Vue.createTextVNode("返回上一页面")]})]})})])}}),T=Vue.defineComponent({name:"ErrorPage404",setup(){return{}},render(){return Vue.createVNode(s,{status:"404"},null)}});export{T as default};
