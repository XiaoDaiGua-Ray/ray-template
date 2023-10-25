import{d as e,_}from"./index-ea5f0cc8.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./@vueuse_core@9.13.0_vue@3.3.6-52ac0131.js";import"./@vueuse_shared@9.13.0_vue@3.3.6-b2a32b41.js";import"./dayjs@1.11.9-6a1565a1.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./vue-hooks-plus@1.8.5_vue@3.3.6-2f171f2e.js";import"./lodash@4.17.21-e6f077ad.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";function s(o){return typeof o=="function"||Object.prototype.toString.call(o)==="[object Object]"&&!Vue.isVNode(o)}const w=Vue.defineComponent({name:"PreviewSVGIcons",setup(){const o=Vue.ref([]);return Object.keys(Object.assign({"/src/icons/adjustment.svg":()=>_(()=>import("./adjustment-91fb1fd8.js"),[]),"/src/icons/axios.svg":()=>_(()=>import("./axios-9ecc62c2.js"),[]),"/src/icons/close.svg":()=>_(()=>import("./close-bc724241.js"),[]),"/src/icons/dark.svg":()=>_(()=>import("./dark-98aea478.js"),[]),"/src/icons/dashboard.svg":()=>_(()=>import("./dashboard-5e11323a.js"),[]),"/src/icons/doc.svg":()=>_(()=>import("./doc-d4c6ba19.js"),[]),"/src/icons/draggable.svg":()=>_(()=>import("./draggable-922ee20b.js"),[]),"/src/icons/echart.svg":()=>_(()=>import("./echart-a2af339b.js"),[]),"/src/icons/error.svg":()=>_(()=>import("./error-3ee80593.js"),[]),"/src/icons/expanded.svg":()=>_(()=>import("./expanded-6e53d7ca.js"),[]),"/src/icons/export_excel.svg":()=>_(()=>import("./export_excel-47c2c101.js"),[]),"/src/icons/fullscreen.svg":()=>_(()=>import("./fullscreen-80d7b90e.js"),[]),"/src/icons/github.svg":()=>_(()=>import("./github-43fc29a8.js"),[]),"/src/icons/google.svg":()=>_(()=>import("./google-4a171ad3.js"),[]),"/src/icons/language.svg":()=>_(()=>import("./language-0fe60c39.js"),[]),"/src/icons/left_arrow.svg":()=>_(()=>import("./left_arrow-045dade1.js"),[]),"/src/icons/light.svg":()=>_(()=>import("./light-8ec2a8de.js"),[]),"/src/icons/lock.svg":()=>_(()=>import("./lock-f5e2ebb5.js"),[]),"/src/icons/login_bg.svg":()=>_(()=>import("./login_bg-fae25ce3.js"),[]),"/src/icons/menu.svg":()=>_(()=>import("./menu-48aeb53b.js"),[]),"/src/icons/more.svg":()=>_(()=>import("./more-e37ec710.js"),[]),"/src/icons/mouse.svg":()=>_(()=>import("./mouse-67f26515.js"),[]),"/src/icons/office.svg":()=>_(()=>import("./office-1d6313bd.js"),[]),"/src/icons/other.svg":()=>_(()=>import("./other-02a77491.js"),[]),"/src/icons/print.svg":()=>_(()=>import("./print-b33dc2bb.js"),[]),"/src/icons/qrcode.svg":()=>_(()=>import("./qrcode-be91e4bc.js"),[]),"/src/icons/ray.svg":()=>_(()=>import("./ray-a033c254.js"),[]),"/src/icons/reload.svg":()=>_(()=>import("./reload-34b148c7.js"),[]),"/src/icons/rely.svg":()=>_(()=>import("./rely-e633b0a6.js"),[]),"/src/icons/resize_h.svg":()=>_(()=>import("./resize_h-360e34cf.js"),[]),"/src/icons/right_arrow.svg":()=>_(()=>import("./right_arrow-50c53f38.js"),[]),"/src/icons/row_end.svg":()=>_(()=>import("./row_end-68354635.js"),[]),"/src/icons/row_head.svg":()=>_(()=>import("./row_head-56a92cf3.js"),[]),"/src/icons/search.svg":()=>_(()=>import("./search-a922b782.js"),[]),"/src/icons/setting.svg":()=>_(()=>import("./setting-08b3b2ca.js"),[]),"/src/icons/table.svg":()=>_(()=>import("./table-e1bc2ddb.js"),[]),"/src/icons/twitter.svg":()=>_(()=>import("./twitter-7a46bd80.js"),[])})).forEach(t=>{const i=t.match(/\/(\w+)\.svg/)[1];i&&o.value.push(i)}),{icons:o}},render(){return Vue.createVNode(naive.NCard,{title:"svg图标"},{"header-extra":()=>"点击图标复制代码",default:()=>{let o;return Vue.createVNode(naive.NSpace,{wrapItem:!1},s(o=this.icons.map(r=>Vue.withDirectives(Vue.createVNode("div",{class:"pre-view-icons__card"},[Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(e,{name:r,size:"56",cursor:"pointer"},null),default:()=>r})]),[[Vue.resolveDirective("copy"),`<RIcon name="${r}" size="56" />`]])))?o:{default:()=>[o]})}})}});export{w as default};
