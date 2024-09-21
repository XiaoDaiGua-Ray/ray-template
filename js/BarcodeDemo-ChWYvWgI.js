import{z as e}from"./hooks-DUpKDX8W.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.6-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./lodash-es@4.17.21-BALnwRTu.js";import"./@vueuse_core@10.9.0_vue@3.5.6-CMHqEu2-.js";import"./@vueuse_shared@10.9.0_vue@3.5.6-BTLxKjPf.js";import"./utils-DvxnuKiq.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@4.0.1_pinia@2.1.7-MNUqeAcu.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.0-DyxInw53.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.5.6-CUaD_-7Q.js";import"./@vue_reactivity@3.5.6-CXMPYrvZ.js";import"./@vue_shared@3.5.6-6BrT-eFF.js";const T=Vue.defineComponent({name:"BarcodeDemo",setup(){const u={width:4},t=Vue.ref(!1),a=Vue.ref("RayTemplate");return{baseOptions:u,loading:t,text:a}},render(){const{baseOptions:u}=this;return Vue.createVNode(naive.NGrid,{cols:2,xGap:12,yGap:12},{default:()=>[Vue.createVNode(naive.NGridItem,{span:2},{default:()=>[Vue.createVNode(naive.NCard,{title:"详细配置项说明"},{default:()=>[Vue.createTextVNode("点击查看详细配置项："),Vue.createVNode("a",{href:"https://github.com/lindell/JsBarcode/wiki/Options"},[Vue.createTextVNode("js-barcode options")]),Vue.createTextVNode("。")]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"基础条形码"},{default:()=>[Vue.createVNode(e,{text:"RayTemplate",options:{...u}},null)]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"自定义颜色条形码"},{default:()=>[Vue.createVNode(e,{text:"RayTemplate",options:{...u,lineColor:"red"}},null)]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"pharmacode 模式"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NAlert,{type:"warning",title:"注意"},{default:()=>[Vue.createTextVNode("该模式下，条形码只能渲染有效数值，否则将会渲染失败。可以查看官网说明："),Vue.createVNode("a",{href:"https://github.com/lindell/JsBarcode/wiki/pharmacode"},[Vue.createTextVNode("pharmacode")]),Vue.createTextVNode("。")]}),Vue.createVNode(e,{text:"1234",format:"pharmacode",options:{width:4,height:40,displayValue:!1,background:"#eee"}},null)]})]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"codabar 模式"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NAlert,{type:"warning",title:"注意"},{default:()=>[Vue.createTextVNode("该模式下，需要注意 text 中的特殊字符，可以查看官网说明："),Vue.createVNode("a",{href:"https://github.com/lindell/JsBarcode/wiki/codabar"},[Vue.createTextVNode("codabar")]),Vue.createTextVNode("。")]}),Vue.createVNode(e,{text:"1234",format:"codabar",options:{width:4,height:40,displayValue:!1,background:"#eee"}},null)]})]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"有状态的条形码"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0,size:"large",justify:"flex-start",inline:!0},{default:()=>[Vue.createVNode(naive.NSwitch,{value:this.loading,"onUpdate:value":t=>this.loading=t,style:"width: fit-content"},{checked:()=>"loading...",unchecked:()=>"success!"}),Vue.createVNode(e,{text:"RayTemplate",loading:this.loading},null)]})]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"watchText 主动监听 text 变化"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.text,"onUpdate:value":t=>this.text=t},null),Vue.createVNode(e,{text:this.text,watchText:!0},null)]})]})]})]})}});export{T as default};
