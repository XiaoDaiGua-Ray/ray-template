import"./hooks-abDb_7tG.js";import"./dayjs@1.11.10-BYZwCyGy.js";import"./print-js@1.6.0-C3lAJnMa.js";import"./awesome-qr@2.1.5-rc.0-Ds7AaOTE.js";import"./vue-hooks-plus@1.8.8_vue@3.4.21-C_BRgauB.js";import"./lodash@4.17.21-CM7ROh5r.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DuGDi0R7.js";import{A as s,B as p,C as d,D as l,E as c,F as V}from"./utils-BHY8vmkp.js";import"./lodash-es@4.17.21-C8H4BJij.js";import"./@vueuse_core@10.9.0_vue@3.4.21--QrNzsXE.js";import"./@vueuse_shared@10.9.0_vue@3.4.21-7aSumFzu.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./interactjs@1.10.26-DmsZVOf4.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-CaeIWam-.js";import"./echarts@5.5.0-BEyY33Zi.js";import"./zrender@5.5.0-JN1hODMT.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.21-DW3iHaBZ.js";import"./@vue_reactivity@3.4.21-8_tu8c_o.js";import"./@vue_shared@3.4.21-DCcVmNGw.js";import"./canvas@2.11.2-CVRTzJty.js";import"./js-binary-schema-parser@2.0.3-D0akQrQ7.js";const R=Vue.defineComponent({name:"CalculatePrecision",setup(){const t=Vue.reactive({addOptions:["1","0.2","0.1","1.1"],subtractOptions:["1","0.2","0.1","1.1"],multiplyOptions:["1","0.2","0.1","1.1"],divideOptions:["1","0.2","0.1","1.1"],distributeValue:12,distributeOutputValue:[],distributeLength:3}),e={addOptions:d,subtractOptions:l,multiplyOptions:c,divideOptions:V},i=(a,o)=>{const r=e[o],n=r(...a);return"结果: "+s(n)},u=()=>{Vue.nextTick().then(()=>{t.distributeOutputValue=p(t.distributeValue,t.distributeLength)})};return u(),{...Vue.toRefs(t),copilotFunc:i,updateDistributeValue:u}},render(){return Vue.createVNode(naive.NLayout,null,{default:()=>[Vue.createVNode("h2",{style:"margin: 0 0 20px 0"},[Vue.createTextVNode("计算方法，默认都保留八位小数与四舍五入，可以根据 format 方法自行转换")]),Vue.createVNode("h3",{style:"margin: 0 0 20px 0"},[Vue.createTextVNode("示例方法都基于 currency.js 封装，利用其精度处理能力封装了常用的一些计算方法，解决精度问题。如果需要其他的方法请阅读官方文档 https://currency.js.org/#subtract")]),Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NCard,{title:"加法"},{default:()=>Vue.createVNode(naive.NDynamicTags,{value:this.addOptions,"onUpdate:value":t=>this.addOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"addOptions")}},null),footer:()=>this.copilotFunc(this.addOptions,"addOptions")}),Vue.createVNode(naive.NCard,{title:"减法"},{default:()=>Vue.createVNode(naive.NDynamicTags,{value:this.subtractOptions,"onUpdate:value":t=>this.subtractOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"subtractOptions")}},null),footer:()=>this.copilotFunc(this.subtractOptions,"subtractOptions")}),Vue.createVNode(naive.NCard,{title:"乘法"},{default:()=>Vue.createVNode(naive.NDynamicTags,{value:this.multiplyOptions,"onUpdate:value":t=>this.multiplyOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"multiplyOptions")}},null),footer:()=>this.copilotFunc(this.multiplyOptions,"multiplyOptions")}),Vue.createVNode(naive.NCard,{title:"除法（非取模）"},{default:()=>Vue.createVNode(naive.NDynamicTags,{value:this.divideOptions,"onUpdate:value":t=>this.divideOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"divideOptions")}},null),footer:()=>this.copilotFunc(this.divideOptions,"divideOptions")}),Vue.createVNode(naive.NCard,{title:"平分一个值"},{default:()=>Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NInputNumber,{value:this.distributeValue,"onUpdate:value":t=>this.distributeValue=t,onUpdateValue:()=>{this.updateDistributeValue()}},null),Vue.createVNode(naive.NInputNumber,{value:this.distributeLength,"onUpdate:value":t=>this.distributeLength=t,onUpdateValue:()=>{this.updateDistributeValue()}},null)]}),footer:()=>"结果: "+this.distributeOutputValue.join(", ")})]})]})}});export{R as default};