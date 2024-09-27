import{t as d,O as u}from"./hooks-DMyQYazF.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.8-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./lodash-es@4.17.21-BALnwRTu.js";import"./@vueuse_core@10.9.0_vue@3.5.8-C_86Yqwm.js";import"./@vueuse_shared@10.9.0_vue@3.5.8-BTLxKjPf.js";import"./utils-CPRm4XW8.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@4.0.1_pinia@2.1.7-MNUqeAcu.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.0-DyxInw53.js";import"./html-to-image@1.11.11-BOFdlgi9.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.5.8-rrkW69pg.js";import"./@vue_reactivity@3.5.8-Bdjt7y-I.js";import"./@vue_shared@3.5.8-BZqwzCoV.js";const R=Vue.defineComponent({name:"SegmentDemo",setup(){const t=[{label:"这是一",key:"this is one"},{label:"这是二",key:"this is two"},{label:"这是三",key:"this is three"}],a=[...t,{label:"这是四",key:"this is four",slots:{default:()=>"我是自定义"}}],o=[...t,{label:"不许点",key:"disabled option",disabled:!0},{label:"popover",key:"popover",popover:"我是 popover"},{label:"popover options",key:"popover options",popover:{label:"我是配置项的 popover"}}],i=[{label:"设置",key:"setting",icon:Vue.createVNode(d,{name:"setting"},null)},{label:"刷新",key:"reload",icon:Vue.createVNode(d,{name:"reload"},null)},{label:"搜索",key:"search",icon:Vue.createVNode(d,{name:"search"},null),popover:"我是搜索"}],l=Vue.ref("this is three"),e=Vue.ref("medium"),n=Vue.ref("block");return{baseOptions:t,options:a,segmentValueOne:l,segmentChange:r=>{window.$message.info(String(r))},size:e,width:n,disabledOptions:o,iconOptions:i}},render(){const{options:t,baseOptions:a,disabledOptions:o,iconOptions:i}=this,{segmentChange:l}=this;return Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NAlert,{title:"警告⚠️",type:"warning"},{default:()=>[Vue.createTextVNode("n-tabs 默认情况下会从 slot 获取默认展示的 tab 值，因此会产生一个 vue slot 的 warning。如果你不想看到这个 warning，请设定一个 default-value。")]}),Vue.createVNode(naive.NAlert,{title:"已知问题",type:"warning"},{default:()=>[Vue.createTextVNode("由于 NTabs 设计缘故，手动设置 width 为 fitContent 后，配置了 disabled, popover 的配置项，会丢失过度效果。具体可以看下面的例子。"),Vue.createVNode("br",null,null),Vue.createTextVNode("解决方法，在该组件外层包一层 div，设置宽度，但是不能为 fit-content。")]}),Vue.createVNode(naive.NCard,{title:"分段器"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("该组件基于 NTabs + NTabPane 封装，所以保留了一些该组件的特性。")])]}),Vue.createVNode(naive.NGrid,{cols:2,xGap:8,yGap:12},{default:()=>[Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"基础非受控分段器"},{default:()=>[Vue.createVNode(u,{defaultValue:"this is two",options:a},null)]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"自定义分段器插槽"},{default:()=>[Vue.createVNode(u,{defaultValue:this.segmentValueOne,options:t},null)]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"updateValue 事件"},{default:()=>[Vue.createVNode(u,{value:this.segmentValueOne,"onUpdate:value":e=>this.segmentValueOne=e,defaultValue:"this is two",options:o,onUpdateValue:l.bind(this),width:"block"},null)]})]}),Vue.createVNode(naive.NGridItem,{span:1},{default:()=>[Vue.createVNode(naive.NCard,{title:"自适应宽度"},{default:()=>[Vue.createVNode(u,{defaultValue:"setting",options:i,width:"block"},null)]})]}),Vue.createVNode(naive.NGridItem,{span:2},{default:()=>[Vue.createVNode(naive.NCard,{title:"尺寸"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0,size:"large"},{default:()=>[Vue.createVNode(naive.NRadioGroup,{value:this.size,"onUpdate:value":e=>this.size=e},{default:()=>[Vue.createVNode(naive.NRadio,{value:"small"},{default:()=>[Vue.createTextVNode("小")]}),Vue.createVNode(naive.NRadio,{value:"medium"},{default:()=>[Vue.createTextVNode("不小")]}),Vue.createVNode(naive.NRadio,{value:"large"},{default:()=>[Vue.createTextVNode("不太小")]})]}),Vue.createVNode(u,{defaultValue:"this is two",options:a,size:this.size,width:"block"},null)]})]})]}),Vue.createVNode(naive.NGridItem,{span:2},{default:()=>[Vue.createVNode(naive.NCard,{title:"宽度"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0,size:"large"},{default:()=>[Vue.createVNode(naive.NAlert,{title:"注意",type:"info"},{default:()=>[Vue.createTextVNode("RSegment 组件宽度默认为 fitContent，按照内容自适应宽度；如果需要自适应宽度，请设置 width 为 block；如果需要手动指定宽度请设置一个数字。")]}),Vue.createVNode(naive.NRadioGroup,{value:this.width,"onUpdate:value":e=>this.width=e},{default:()=>[Vue.createVNode(naive.NRadio,{value:"fitContent"},{default:()=>[Vue.createTextVNode("fitContent")]}),Vue.createVNode(naive.NRadio,{value:"block"},{default:()=>[Vue.createTextVNode("block")]}),Vue.createVNode(naive.NRadio,{value:800},{default:()=>[Vue.createTextVNode("800")]})]}),Vue.createVNode(u,{defaultValue:"this is two",options:o,width:this.width},null)]})]})]})]})]})}});export{R as default};
