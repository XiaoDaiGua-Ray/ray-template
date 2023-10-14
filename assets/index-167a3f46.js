import{d as n}from"./index-4b0ad17f.js";import{R as E}from"./index-17afcb18.js";import{V as i,l as f,m as c,Y as m,Z as d,g as l,B as p,D as b}from"./naive-ui@2.34.4_vue@3.3.4-e7ad8e4e.js";import{k as y,b as u,h as C,p as t,q as F}from"./@vue_runtime-core@3.3.4-a86a886b.js";import"./vue-router@4.2.4_vue@3.3.4-a47c9d72.js";import"./@vue_reactivity@3.3.4-71bff6b7.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./lodash-es@4.17.21-b7de4195.js";import"./vue-i18n@9.2.2_vue@3.3.4-6c164407.js";import"./@intlify_shared@9.2.2-e4047ebf.js";import"./@intlify_core-base@9.2.2-777854c2.js";import"./@intlify_message-compiler@9.2.2-8a818441.js";import"./@intlify_devtools-if@9.2.2-c61c979f.js";import"./dayjs@1.11.9-2359b210.js";import"./@babel_runtime@7.22.11-b49cf076.js";import"./pinia@2.1.6_typescript@5.0.2_vue@3.3.4-0a90ace5.js";import"./vue-demi@0.14.5_vue@3.3.4-71ba0ef2.js";import"./@vue_runtime-dom@3.3.4-57742c1f.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.13.0_vue@3.3.4-4407158f.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-c98d11e6.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-bbefc804.js";import"./date-fns@2.30.0-f997f5eb.js";import"./vueuc@0.4.51_vue@3.3.4-644d6bd7.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-10c76817.js";import"./vooks@0.2.12_vue@3.3.4-50640e3d.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-8f0f3131.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";function r(a){return typeof a=="function"||Object.prototype.toString.call(a)==="[object Object]"&&!F(a)}const au=y({name:"RDashboard",setup(){return{coverLetterOptions:[{label:"掌握搬砖框架",des:()=>u(l,null,{default:()=>[u(p,{type:"success"},{default:()=>[t("Vue3.x")]}),u(p,{type:"info"},{default:()=>[t("React")]})]})},{label:"从事搬砖时长",des:()=>u(l,null,{default:()=>[u(p,{type:"success"},{default:()=>[t("练习时长两年半的小白前端搬砖师")]})]})},{label:"个人",des:()=>u(l,{align:"center"},{default:()=>[u(n,{name:"ray",size:"22"},null),t("努力搬砖、努力摸鱼, 建设美丽家园")]}),span:2},{label:"补充说明",des:()=>u(l,{align:"center"},{default:()=>[t("如果有希望补充的功能可以在"),u("a",{class:"dashboard-link",href:"https://github.com/XiaoDaiGua-Ray/ray-template"},[t("GitHub")]),t("提一个 Issues")]}),span:2}],technologyTagOptions:[{label:"Vue3.x",value:"Vue3.x"},{label:"Vite4.0",value:"Vite4.0"},{label:"Pinia",value:"Pinia"},{label:"TSX",value:"TSX"}]}},render(){let a,o;return u(b,{class:"dashboard-layout layout-full"},{default:()=>[u(i,null,{header:()=>C(n,{name:"ray",size:"64"},{}),default:()=>"当你看见这个页面后, 就说明项目已经启动成功了~"}),u(i,{title:"个人介绍"},{default:()=>[u(f,{bordered:!0,labelPlacement:"left",column:2},r(a=this.coverLetterOptions.map(e=>{let s;return u(c,{key:e.label,label:e.label,span:e==null?void 0:e.span},r(s=e.des())?s:{default:()=>[s]})}))?a:{default:()=>[a]})]}),u(i,{title:"项目介绍"},{default:()=>[u(m,null,{default:()=>[t("技术栈")]}),u(d,null,{default:()=>[u(l,null,r(o=this.technologyTagOptions.map(e=>u(p,{key:e.value,type:"info"},{default:()=>[e.label]})))?o:{default:()=>[o]})]}),u(m,null,{default:()=>[t("项目介绍")]}),u(d,null,{default:()=>[t("预设了最佳构建体验的配置与常用搬砖工具。意在提供一个简洁、快速上手的模板。")]})]}),u(i,{title:"友情链接"},{default:()=>[u(E,null,null)]})]})}});export{au as default};