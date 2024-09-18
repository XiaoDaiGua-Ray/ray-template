import{m as A,e as E,a2 as h,t as f,a3 as x,a4 as k,a5 as g,u as T,a6 as b}from"./hooks-DUpKDX8W.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.6-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./lodash-es@4.17.21-BALnwRTu.js";import"./@vueuse_core@10.9.0_vue@3.5.6-CMHqEu2-.js";import"./@vueuse_shared@10.9.0_vue@3.5.6-BTLxKjPf.js";import"./utils-DvxnuKiq.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@4.0.1_pinia@2.1.7-MNUqeAcu.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.0-DyxInw53.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.5.6-CUaD_-7Q.js";import"./@vue_reactivity@3.5.6-CXMPYrvZ.js";import"./@vue_shared@3.5.6-6BrT-eFF.js";const _=Vue.defineComponent({name:"TemplateHooks",setup(){const t=Vue.ref(""),a=A("layoutContentMaximize"),o=Vue.ref(E().getWatermarkConfig.value.content),n=Vue.ref("new"),{navigationTo:i}=x(),{maximize:r,isLayoutContentMaximized:l}=h(),{reload:d,openSpin:V,closeSpin:F}=k(),{showWatermark:c,hiddenWatermark:N,setWatermarkContent:m,toggleWatermark:C}=g(),{darkTheme:B,lightTheme:s,toggleTheme:u,getAppTheme:e}=T(),{hidden:p,show:v,update:D}=b();return{navigationTo:i,reload:d,currentMenuOption:t,maximize:r,maximizeRef:a,openSpin:V,closeSpin:F,showWatermark:c,hiddenWatermark:N,setWatermarkContent:m,watermark:o,toggleWatermark:C,darkTheme:B,lightTheme:s,toggleTheme:u,getAppTheme:e,isLayoutContentMaximized:l,badgeHidden:p,badgeShow:v,badgeUpdateLabel:D,badgeValue:n}},render(){const{navigationTo:t,reload:a,maximize:o,openSpin:n,closeSpin:i,showWatermark:r,hiddenWatermark:l,setWatermarkContent:d,toggleWatermark:V,darkTheme:F,lightTheme:c,toggleTheme:N,getAppTheme:m,isLayoutContentMaximized:C,badgeHidden:B,badgeShow:s,badgeUpdateLabel:u}=this;return Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NCard,{title:"接口说明"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("hooks/template 包存放模板专属 hook 方法。这里不做过多的赘述，可以查看文档具体描述。")])]}),Vue.createVNode(naive.NCard,{title:"useBadge 菜单标记"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.badgeValue,"onUpdate:value":e=>this.badgeValue=e},null),Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>B("/template-hooks")},{default:()=>[Vue.createTextVNode("隐藏当前菜单标记")]}),Vue.createVNode(naive.NButton,{onClick:()=>s("/template-hooks")},{default:()=>[Vue.createTextVNode("显示当前菜单标记")]}),Vue.createVNode(naive.NButton,{onClick:()=>u("/template-hooks",{label:this.badgeValue})},{default:()=>[Vue.createTextVNode("更新当前菜单标记")]}),Vue.createVNode(naive.NButton,{onClick:()=>{u("/template-hooks",{label:this.badgeValue,icon:Vue.createVNode(f,{name:"error",size:"18"},null)})}},{default:()=>[Vue.createTextVNode("添加标记图标")]}),Vue.createVNode(naive.NButton,{onClick:()=>{u("/template-hooks",{label:this.badgeValue,icon:void 0})}},{default:()=>[Vue.createTextVNode("隐藏标记图标")]})]})]})]}),Vue.createVNode(naive.NCard,{title:"useTheme 主题"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("getAppTheme 获取当前主题色: "),m().themeLabel]),Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>F()},{default:()=>[Vue.createTextVNode("切换暗黑主题")]}),Vue.createVNode(naive.NButton,{onClick:()=>c()},{default:()=>[Vue.createTextVNode("切换明亮主题")]}),Vue.createVNode(naive.NButton,{onClick:()=>N()},{default:()=>[Vue.createTextVNode("切换主题")]})]})]})]}),Vue.createVNode(naive.NCard,{title:"useWatermark 水印"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.watermark,"onUpdate:value":e=>this.watermark=e,onInput:e=>{d(e)}},null),Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>r()},{default:()=>[Vue.createTextVNode("显示水印")]}),Vue.createVNode(naive.NButton,{onClick:()=>l()},{default:()=>[Vue.createTextVNode("隐藏水印")]}),Vue.createVNode(naive.NButton,{onClick:()=>V()},{default:()=>[Vue.createTextVNode("切换水印")]})]})]})]}),Vue.createVNode(naive.NCard,{title:"useSpinning"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("手动刷新内容区域，会使得当前路由页面内容强制重新加载（会执行完整的 vue 生命周期）。默认 800ms 延迟。")]),Vue.createVNode("br",null,null),Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{a()}},{default:()=>[Vue.createTextVNode("刷新（强制刷新）")]}),Vue.createVNode(naive.NButton,{onClick:()=>{n(),setTimeout(()=>{i()},800)}},{default:()=>[Vue.createTextVNode("触发加载动画（不强制刷新）")]})]})]}),Vue.createVNode(naive.NCard,{title:"useMaximize 内容区域最大化"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("isLayoutContentMaximized 检测当前内容区域是否最大化:"),C?"最大化":"正常尺寸"]),Vue.createVNode(naive.NButton,{onClick:()=>{o(!this.maximizeRef,{scrollToOptions:{left:0,top:0}})}},{default:()=>[Vue.createTextVNode("最大化内容区域，并且滚动至顶部")]})]}),Vue.createVNode(naive.NCard,{title:"useAppNavigation 导航方法"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("navigationTo 参数为正整数时，会更具当前的菜单顺序进行自动导航匹配。但是此方法仅能导航一级菜单。并且如果导航菜单非根菜单项，会自动递归导航至一子菜单。 支持传入完整的菜单路径，如：/multi/multi-menu-one。")]),Vue.createVNode("br",null,null),Vue.createVNode(naive.NButton,{onClick:()=>t("/multi/multi-menu-one")},{default:()=>[Vue.createTextVNode("跳转至多级菜单")]})]})]})}});export{_ as default};
