import{d as l}from"./index-964c9a5b.js";import{R as i}from"./index-1feb5b87.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./vue-hooks-plus@1.8.5_vue@3.3.4-2f171f2e.js";import"./lodash@4.17.21-e6f077ad.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./@vueuse_core@9.13.0_vue@3.3.4-4ff65e9a.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-4d28bfd0.js";import"./vue-demi@0.14.5_vue@3.3.4-79e8410f.js";import"./dayjs@1.11.9-6a1565a1.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";function o(u){return typeof u=="function"||Object.prototype.toString.call(u)==="[object Object]"&&!Vue.isVNode(u)}const O=Vue.defineComponent({name:"RDashboard",setup(){return{coverLetterOptions:[{label:"掌握搬砖框架",des:()=>Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(naive.NTag,{type:"success"},{default:()=>[Vue.createTextVNode("Vue3.x")]}),Vue.createVNode(naive.NTag,{type:"info"},{default:()=>[Vue.createTextVNode("React")]})]})},{label:"从事搬砖时长",des:()=>Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(naive.NTag,{type:"success"},{default:()=>[Vue.createTextVNode("练习时长两年半的小白前端搬砖师")]})]})},{label:"个人",des:()=>Vue.createVNode(naive.NSpace,{align:"center"},{default:()=>[Vue.createVNode(l,{name:"ray",size:"22"},null),Vue.createTextVNode("努力搬砖、努力摸鱼, 建设美丽家园")]}),span:2},{label:"补充说明",des:()=>Vue.createVNode(naive.NSpace,{align:"center"},{default:()=>[Vue.createTextVNode("如果有希望补充的功能可以在"),Vue.createVNode("a",{class:"dashboard-link",href:"https://github.com/XiaoDaiGua-Ray/ray-template"},[Vue.createTextVNode("GitHub")]),Vue.createTextVNode("提一个 Issues")]}),span:2}],technologyTagOptions:[{label:"Vue3.x",value:"Vue3.x"},{label:"Vite4.0",value:"Vite4.0"},{label:"Pinia",value:"Pinia"},{label:"TSX",value:"TSX"}]}},render(){let u,t;return Vue.createVNode(naive.NLayout,{class:"dashboard-layout layout-full"},{default:()=>[Vue.createVNode(naive.NCard,null,{header:()=>Vue.h(l,{name:"ray",size:"64"},{}),default:()=>"当你看见这个页面后, 就说明项目已经启动成功了~"}),Vue.createVNode(naive.NCard,{title:"个人介绍"},{default:()=>[Vue.createVNode(naive.NDescriptions,{bordered:!0,labelPlacement:"left",column:2},o(u=this.coverLetterOptions.map(e=>{let a;return Vue.createVNode(naive.NDescriptionsItem,{key:e.label,label:e.label,span:e==null?void 0:e.span},o(a=e.des())?a:{default:()=>[a]})}))?u:{default:()=>[u]})]}),Vue.createVNode(naive.NCard,{title:"项目介绍"},{default:()=>[Vue.createVNode(naive.NH6,null,{default:()=>[Vue.createTextVNode("技术栈")]}),Vue.createVNode(naive.NP,null,{default:()=>[Vue.createVNode(naive.NSpace,null,o(t=this.technologyTagOptions.map(e=>Vue.createVNode(naive.NTag,{key:e.value,type:"info"},{default:()=>[e.label]})))?t:{default:()=>[t]})]}),Vue.createVNode(naive.NH6,null,{default:()=>[Vue.createTextVNode("项目介绍")]}),Vue.createVNode(naive.NP,null,{default:()=>[Vue.createTextVNode("预设了最佳构建体验的配置与常用搬砖工具。意在提供一个简洁、快速上手的模板。")]})]}),Vue.createVNode(naive.NCard,{title:"友情链接"},{default:()=>[Vue.createVNode(i,null,null)]})]})}});export{O as default};
