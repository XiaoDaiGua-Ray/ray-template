import{t as e}from"./index-36b1636d.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./vue-hooks-plus@1.8.5_vue@3.3.6-2f171f2e.js";import"./lodash@4.17.21-e6f077ad.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./@vueuse_core@9.13.0_vue@3.3.6-52ac0131.js";import"./@vueuse_shared@9.13.0_vue@3.3.6-b2a32b41.js";import"./dayjs@1.11.9-6a1565a1.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";const t=Vue.defineComponent({name:"PageResult",props:{...naive.resultProps},render(){return Vue.createVNode("div",{class:"error-page"},[Vue.createVNode(naive.NResult,Vue.mergeProps(this.$props,{status:"500",title:"小调皮你走错地方了"}),{...this.$slots,footer:()=>Vue.createVNode(naive.NButton,{onClick:e.bind(this,!0)},{default:()=>[Vue.createTextVNode("返回首页")]})})])}}),R=Vue.defineComponent({name:"ErrorPage404",setup(){return{}},render(){return Vue.createVNode(t,{status:"404"},null)}});export{R as default};
