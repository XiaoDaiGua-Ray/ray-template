import{y as p}from"./hooks-HESpGiIM.js";import"./currency.js@2.0.4--or6eeOG.js";import"./awesome-qr@2.1.5-rc.0-UnPo3EFD.js";import"./vue-hooks-plus@1.8.8_vue@3.4.20-rsCVfHC6.js";import"./lodash@4.17.21-yUHHMES2.js";import"./js-cookie@3.0.5-bc0KQLgp.js";import"./screenfull@5.2.0-q9gEF-YC.js";import"./qs@6.11.2-Z-dpNlsu.js";import"./dayjs@1.11.10-A-QuG2Ol.js";import"./print-js@1.6.0-gYKv6oGQ.js";import"./@vueuse_core@10.7.1_vue@3.4.20--7WAvkKu.js";import"./@vueuse_shared@10.7.1_vue@3.4.20--52Mx__5.js";import"./utils-zTxN2cCS.js";import"./lodash-es@4.17.21-xgd1l9mE.js";import"./interactjs@1.10.26-I0IiZoEj.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.7-fNhqB16x.js";import"./dom-to-image@2.6.0-eHYYUq-2.js";import"./echarts@5.5.0-WNSrrRu3.js";import"./zrender@5.5.0-GTXoC3r-.js";import"./tslib@2.3.0-21A5UWR7.js";import"./@vue_runtime-core@3.4.20-d4vFfH7R.js";import"./@vue_reactivity@3.4.20-tq0PoOjZ.js";import"./@vue_shared@3.4.20-IXQMxlXI.js";import"./canvas@2.11.2-dZp4QMlu.js";import"./js-binary-schema-parser@2.0.3-CCV6nRej.js";import"./side-channel@1.0.4-JVVpKjRm.js";import"./get-intrinsic@1.2.1-1fqvy-Cp.js";import"./has-symbols@1.0.3-fNtejGuA.js";import"./has-proto@1.0.1-dzJH2Y5C.js";import"./function-bind@1.1.2-HMk2skFd.js";import"./has@1.0.3-vfHSusM3.js";import"./call-bind@1.0.2-X-jYgRcX.js";const I=Vue.defineComponent({name:"ContextMenuDemo",setup(){const e=Vue.ref(),o=Vue.ref(!1),r=Vue.ref([{label:"杰·盖茨比",key:"jay gatsby"},{label:"黛西·布坎南",key:"daisy buchanan"},{type:"divider",key:"d1"},{label:"尼克·卡拉威",key:"nick caraway"}]),{x:i,y:u,show:a,updateShow:t}=p(e);return{demoOneRef:e,demoOneShow:o,x:i,y:u,show:a,options:r,clickOutside:n=>{n.preventDefault(),t(!1)},updateShow:t}},render(){const{x:e,y:o,show:r}=this,{clickOutside:i,updateShow:u}=this;return Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NCard,{title:"useContextmenuCoordinate + NDropdown 实现右键菜单"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("默认点击元素外部会关闭菜单。")]),Vue.createVNode("div",{ref:"demoOneRef",style:"width: 100%; height: 200px; background-color: rgba(0, 128, 0, 0.5)"},[Vue.createTextVNode("右击")])]})]}),Vue.createVNode(naive.NDropdown,{show:r,x:e,y:o,options:this.options,trigger:"manual",placement:"bottom-start",onSelect:(a,t)=>{window.$message.info(`选中了 ${t.label}`),u(!1)},onClickoutside:i.bind(this)},null)]})}});export{I as default};