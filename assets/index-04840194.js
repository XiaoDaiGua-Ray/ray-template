import{r as e}from"./index-f0e321ba.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.13.0_vue@3.3.4-7e6f7ed6.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-b2a32b41.js";import"./dayjs@1.11.9-208bf754.js";import"./awesome-qr@2.1.5-rc.0-423f5ed7.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-3371ee7a.js";const r=Vue.defineComponent({name:"PageResult",props:{...naive.resultProps},render(){return Vue.createVNode("div",{class:"error-page"},[Vue.createVNode(naive.NResult,Vue.mergeProps(this.$props,{status:"500",title:"小调皮你走错地方了"}),{...this.$slots,footer:()=>Vue.createVNode(naive.NButton,{onClick:e.bind(this,!0)},{default:()=>[Vue.createTextVNode("返回首页")]})})])}}),l=Vue.defineComponent({name:"ErrorPage404",setup(){return{}},render(){return Vue.createVNode(r,{status:"404"},null)}});export{l as default};
