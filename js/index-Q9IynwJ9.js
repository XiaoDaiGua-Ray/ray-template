import{t as d,O as o}from"./hooks-BwPndLx3.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./dayjs@1.11.10-D8VSY-p2.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.12-C6aYKqdf.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./jsbarcode@3.11.6-DGNGFp02.js";import{l as h,b as u,I as t}from"./@vue_runtime-core@3.5.12-Ds-HrVrM.js";import{k as m}from"./@vue_reactivity@3.5.12-Bs6EYLxJ.js";import{ae as F,N as i,a as b,b as l,c as B,aj as f,ak as a}from"./naive-ui@2.40.1_vue@3.5.12-DyRQVgeU.js";import"./lodash-es@4.17.21-CeZG2a4n.js";import"./@vueuse_core@11.1.0_vue@3.5.12-C00EZtgk.js";import"./@vueuse_shared@11.1.0_vue@3.5.12-B9WpRTpD.js";import"./utils-Dh5AVlvo.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@4.1.1_pinia@2.2.4-_Zka_ujQ.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.1-CegYQlcN.js";import"./pinia@2.2.4_typescript@5.2.2_vue@3.5.12-DjAImzYl.js";import"./vue-demi@0.14.10_vue@3.5.12-Dq6ymT-8.js";import"./html-to-image@1.11.11-BOFdlgi9.js";import"./vue-router@4.3.2_vue@3.5.12-DrIOQ45i.js";import"./vue-i18n@9.13.1_vue@3.5.12-DJkg4ac8.js";import"./@intlify_shared@9.13.1-BxU0OzX2.js";import"./@intlify_core-base@9.13.1-C6DqbPB6.js";import"./@intlify_message-compiler@9.13.1-GrLDMuy_.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-dom@3.5.12-ewSD1rNh.js";import"./@vue_shared@3.5.12--5_uv9t5.js";import"./date-fns@3.6.0-q9PkOyxq.js";import"./seemly@0.3.8-DjGKl9dV.js";import"./vueuc@0.4.64_vue@3.5.12-gFk5c7Fb.js";import"./evtd@0.2.4-CI_DDEu_.js";import"./@css-render_vue3-ssr@0.15.14_vue@3.5.12-CJ-8xq3W.js";import"./vooks@0.2.12_vue@3.5.12-CeQQlSXI.js";import"./vdirs@0.1.8_vue@3.5.12-C0KV5pCE.js";import"./@juggle_resize-observer@3.4.0-C8OzoCMD.js";import"./css-render@0.15.14-C5toWlUr.js";import"./@emotion_hash@0.8.0-WldOFDRm.js";import"./treemate@0.3.11-DKekKYbv.js";import"./date-fns-tz@3.1.3_date-fns@3.6.0-ztskLDQQ.js";import"./async-validator@4.2.5-DKvM95Vc.js";import"./@css-render_plugin-bem@0.15.14_css-render@0.15.14-Be8eOoM-.js";const fu=h({name:"SegmentDemo",setup(){const s=[{label:"这是一",key:"this is one"},{label:"这是二",key:"this is two"},{label:"这是三",key:"this is three"}],n=[...s,{label:"这是四",key:"this is four",slots:{default:()=>"我是自定义"}}],p=[...s,{label:"不许点",key:"disabled option",disabled:!0},{label:"popover",key:"popover",popover:"我是 popover"},{label:"popover options",key:"popover options",popover:{label:"我是配置项的 popover"}}],r=[{label:"设置",key:"setting",icon:u(d,{name:"setting"},null)},{label:"刷新",key:"reload",icon:u(d,{name:"reload"},null)},{label:"搜索",key:"search",icon:u(d,{name:"search"},null),popover:"我是搜索"}],E=m("this is three"),e=m("medium"),C=m("block");return{baseOptions:s,options:n,segmentValueOne:E,segmentChange:A=>{window.$message.info(String(A))},size:e,width:C,disabledOptions:p,iconOptions:r}},render(){const{options:s,baseOptions:n,disabledOptions:p,iconOptions:r}=this,{segmentChange:E}=this;return u(B,{vertical:!0},{default:()=>[u(F,{title:"警告⚠️",type:"warning"},{default:()=>[t("n-tabs 默认情况下会从 slot 获取默认展示的 tab 值，因此会产生一个 vue slot 的 warning。如果你不想看到这个 warning，请设定一个 default-value。")]}),u(F,{title:"已知问题",type:"warning"},{default:()=>[t("由于 NTabs 设计缘故，手动设置 width 为 fitContent 后，配置了 disabled, popover 的配置项，会丢失过度效果。具体可以看下面的例子。"),u("br",null,null),t("解决方法，在该组件外层包一层 div，设置宽度，但是不能为 fit-content。")]}),u(i,{title:"分段器"},{default:()=>[u("h3",null,[t("该组件基于 NTabs + NTabPane 封装，所以保留了一些该组件的特性。")])]}),u(b,{cols:2,xGap:8,yGap:12},{default:()=>[u(l,{span:1},{default:()=>[u(i,{title:"基础非受控分段器"},{default:()=>[u(o,{defaultValue:"this is two",options:n},null)]})]}),u(l,{span:1},{default:()=>[u(i,{title:"自定义分段器插槽"},{default:()=>[u(o,{defaultValue:this.segmentValueOne,options:s},null)]})]}),u(l,{span:1},{default:()=>[u(i,{title:"updateValue 事件"},{default:()=>[u(o,{value:this.segmentValueOne,"onUpdate:value":e=>this.segmentValueOne=e,defaultValue:"this is two",options:p,onUpdateValue:E.bind(this),width:"block"},null)]})]}),u(l,{span:1},{default:()=>[u(i,{title:"自适应宽度"},{default:()=>[u(o,{defaultValue:"setting",options:r,width:"block"},null)]})]}),u(l,{span:2},{default:()=>[u(i,{title:"尺寸"},{default:()=>[u(B,{vertical:!0,size:"large"},{default:()=>[u(f,{value:this.size,"onUpdate:value":e=>this.size=e},{default:()=>[u(a,{value:"small"},{default:()=>[t("小")]}),u(a,{value:"medium"},{default:()=>[t("不小")]}),u(a,{value:"large"},{default:()=>[t("不太小")]})]}),u(o,{defaultValue:"this is two",options:n,size:this.size,width:"block"},null)]})]})]}),u(l,{span:2},{default:()=>[u(i,{title:"宽度"},{default:()=>[u(B,{vertical:!0,size:"large"},{default:()=>[u(F,{title:"注意",type:"info"},{default:()=>[t("RSegment 组件宽度默认为 fitContent，按照内容自适应宽度；如果需要自适应宽度，请设置 width 为 block；如果需要手动指定宽度请设置一个数字。")]}),u(f,{value:this.width,"onUpdate:value":e=>this.width=e},{default:()=>[u(a,{value:"fitContent"},{default:()=>[t("fitContent")]}),u(a,{value:"block"},{default:()=>[t("block")]}),u(a,{value:800},{default:()=>[t("800")]})]}),u(o,{defaultValue:"this is two",options:p,width:this.width},null)]})]})]})]})]})}});export{fu as default};