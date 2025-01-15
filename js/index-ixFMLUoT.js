import{V as F,n as a}from"./hooks-CpaAYtdw.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./crypto-js@4.2.0-CO3T8151.js";import"./dayjs@1.11.13-BI9XULUM.js";import"./print-js@1.6.0-CWwD-D0p.js";import"./vue-hooks-plus@2.2.1_vue@3.5.13_typescript@5.6.3_-Dq_uaxSm.js";import"./lodash@4.17.21-D1YkSij2.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DQHhvod-.js";import"./jsbarcode@3.11.6-VhIBVAt6.js";import"./@logicflow_core@2.0.6-xGbnZl_7.js";import"./mobx-preact@3.0.0_mobx@5.15.7_preact@10.22.0-DV7O4jNC.js";import"./preact@10.22.0-Dw4c-0kT.js";import{N as e,e as d,P as o}from"./naive-ui@2.41.0_vue@3.5.13_typescript@5.6.3_-DTO2mq-c.js";import{l as p,b as u,I as t}from"./@vue_runtime-core@3.5.13-BsGyjLIk.js";import{e as s,x as E}from"./@vue_reactivity@3.5.13-CjJL8SnF.js";import"./lodash-es@4.17.21-l6r90Unf.js";import"./@vueuse_core@12.0.0_typescript@5.6.3-oQ6A83ET.js";import"./@vueuse_shared@12.0.0_typescript@5.6.3-CbGzeoiM.js";import"./utils-DBF0WsFC.js";import"./pinia-plugin-persistedstate@4.1.3_pinia@2.3.0_typescript@5.6.3_vue@3.5.13_typescript@5.6.3____ll7leqg3hb3s3tfh7h2g4rh3je-7e9nenNP.js";import"./destr@2.0.3-Cx7WjB9q.js";import"./deep-pick-omit@1.2.1-B1UrSIxj.js";import"./pinia@2.3.0_typescript@5.6.3_vue@3.5.13_typescript@5.6.3_-Dn2Mq2HM.js";import"./html-to-image@1.11.11-D6_yziCT.js";import"./vue-router@4.4.0_vue@3.5.13_typescript@5.6.3_-BdV6wPvH.js";import"./@vue_runtime-dom@3.5.13-CwqXTXrC.js";import"./@vue_shared@3.5.13-DbMIZLZJ.js";import"./interactjs@1.10.27-hUbPqkuo.js";import"./call-bind@1.0.7-BosuxZz1.js";import"./vue-i18n@9.13.1_vue@3.5.13_typescript@5.6.3_-BNHXouJk.js";import"./@intlify_shared@9.13.1-BxU0OzX2.js";import"./@intlify_core-base@9.13.1-CVxc1Bsn.js";import"./@intlify_message-compiler@9.13.1-GrLDMuy_.js";import"./echarts@5.5.1-Dj_7IMQj.js";import"./zrender@5.6.0-DbjVw6Tx.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./mobx@5.15.7-BvNiR7Ki.js";import"./uuid@9.0.1-CtRu48qb.js";import"./classnames@2.5.1-BXd8anFz.js";import"./mousetrap@1.6.5-D2xAa-oQ.js";import"./mobx-utils@5.6.2_mobx@5.15.7-D4RSJWSh.js";import"./date-fns@3.6.0-CG906D2E.js";import"./seemly@0.3.9-BnJ6M8Cl.js";import"./vueuc@0.4.64_vue@3.5.13_typescript@5.6.3_-DTLIKCUU.js";import"./evtd@0.2.4-CI_DDEu_.js";import"./@css-render_vue3-ssr@0.15.14_vue@3.5.13_typescript@5.6.3_-BeS0JKOP.js";import"./vooks@0.2.12_vue@3.5.13_typescript@5.6.3_-CEDoXTzE.js";import"./vdirs@0.1.8_vue@3.5.13_typescript@5.6.3_-C0KV5pCE.js";import"./@juggle_resize-observer@3.4.0-DY95s5UV.js";import"./css-render@0.15.14-BwokE0u2.js";import"./@emotion_hash@0.8.0-WldOFDRm.js";import"./treemate@0.3.11-CWtmm0QO.js";import"./date-fns-tz@3.2.0_date-fns@3.6.0-CULxTaQG.js";import"./async-validator@4.2.5-P8scd9xB.js";import"./@css-render_plugin-bem@0.15.14_css-render@0.15.14-BrMTnGYY.js";const Au=p({name:"ModalDemo",setup(){const l=s({modal1:!1,modal2:!1,modal3:!1}),{create:i}=F(),r=()=>{i({title:"卡片模态框",draggable:!0,preset:"card",content:()=>u("div",{style:"height: 3000px;"},[t("我可以被拖拽的全屏card模态框")]),fullscreen:!0})},m=()=>{i({title:"模态框",content:"内容",preset:"dialog",draggable:!0})};return{...E(l),createCardModal:r,createDialogModal:m}},render(){const{createCardModal:l,createDialogModal:i}=this;return u(d,{vertical:!0},{default:()=>[u(e,{title:"props"},{default:()=>[u(d,{vertical:!0},{default:()=>[u("h3",null,[t("fullscreen: 全屏模态框。")])]})]}),u(a,{show:this.modal1,"onUpdate:show":r=>this.modal1=r,title:"全屏模态框",fullscreen:!0,preset:"card"},{default:()=>[u("div",{style:"height: 3000px;"},[t("我可以被拖拽的全屏card模态框")])]}),u(a,{show:this.modal2,"onUpdate:show":r=>this.modal2=r,preset:"card",title:"可拖拽卡片模态框",draggable:!0},{default:()=>[u("p",null,[t("我可以被拖拽")])]}),u(a,{show:this.modal3,"onUpdate:show":r=>this.modal3=r,preset:"dialog",title:"可拖拽卡片模态框",draggable:!0},{default:()=>[u("p",null,[t("我可以被拖拽")])]}),u(e,{title:"可拖拽模态框"},{default:()=>[u(o,{onClick:()=>this.modal2=!0},{default:()=>[t("卡片模态框")]}),u(o,{onClick:()=>this.modal3=!0},{default:()=>[t("对话框模态框")]})]}),u(e,{title:"全屏模态框"},{default:()=>[u(d,{vertical:!0},{default:()=>[u("h4",null,[t("全屏模态框需要同时设置：fullscreen 为 true，并且 preset 为 card 时才会生效。")]),u(o,{onClick:()=>this.modal1=!0},{default:()=>[t("打开")]})]})]}),u(e,{title:"手动设置宽度"},{default:()=>[u("h4",null,[t("width（--r-modal-width）: 当 preset 不为 dialog 或者 card 的时候，你可能用得上。")]),u("h4",null,[t("dialogWidth（--r-modal-dialog-width）: 当 preset 为 dialog，你可能用得上。")]),u("h4",null,[t("cardWidth（--r-modal-card-width）: 当 preset 为 card，你可能用得上。")]),u("h4",null,[t("所有的宽度配置属性都会注入一个对应的 `css variable`，有时候会用上。")])]}),u(e,{title:"重写 useModal"},{default:()=>[u(o,{onClick:l.bind(this)},{default:()=>[t("创建卡片模态框")]}),u(o,{onClick:i.bind(this)},{default:()=>[t("创建对话框模态框")]})]})]})}});export{Au as default};
