import{K as p}from"./hooks-BwPndLx3.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./dayjs@1.11.10-D8VSY-p2.js";import"./print-js@1.6.0-BdoEj60G.js";import{u as a}from"./vue-router@4.3.2_vue@3.5.12-DrIOQ45i.js";import"./jsbarcode@3.11.6-DGNGFp02.js";import{P as n,c as m}from"./naive-ui@2.40.1_vue@3.5.12-DyRQVgeU.js";import{l as u,b as o,I as s}from"./@vue_runtime-core@3.5.12-Ds-HrVrM.js";import{k as l}from"./@vue_reactivity@3.5.12-Bs6EYLxJ.js";import"./lodash-es@4.17.21-CeZG2a4n.js";import"./@vueuse_core@11.1.0_vue@3.5.12-C00EZtgk.js";import"./@vueuse_shared@11.1.0_vue@3.5.12-B9WpRTpD.js";import"./vue-hooks-plus@2.2.1_vue@3.5.12-C6aYKqdf.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./utils-Dh5AVlvo.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./pinia-plugin-persistedstate@4.1.1_pinia@2.2.4-_Zka_ujQ.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.1-CegYQlcN.js";import"./pinia@2.2.4_typescript@5.2.2_vue@3.5.12-DjAImzYl.js";import"./vue-demi@0.14.10_vue@3.5.12-Dq6ymT-8.js";import"./html-to-image@1.11.11-BOFdlgi9.js";import"./vue-i18n@9.13.1_vue@3.5.12-DJkg4ac8.js";import"./@intlify_shared@9.13.1-BxU0OzX2.js";import"./@intlify_core-base@9.13.1-C6DqbPB6.js";import"./@intlify_message-compiler@9.13.1-GrLDMuy_.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-dom@3.5.12-ewSD1rNh.js";import"./@vue_shared@3.5.12--5_uv9t5.js";import"./date-fns@3.6.0-q9PkOyxq.js";import"./seemly@0.3.8-DjGKl9dV.js";import"./vueuc@0.4.64_vue@3.5.12-gFk5c7Fb.js";import"./evtd@0.2.4-CI_DDEu_.js";import"./@css-render_vue3-ssr@0.15.14_vue@3.5.12-CJ-8xq3W.js";import"./vooks@0.2.12_vue@3.5.12-CeQQlSXI.js";import"./vdirs@0.1.8_vue@3.5.12-C0KV5pCE.js";import"./@juggle_resize-observer@3.4.0-C8OzoCMD.js";import"./css-render@0.15.14-C5toWlUr.js";import"./@emotion_hash@0.8.0-WldOFDRm.js";import"./treemate@0.3.11-DKekKYbv.js";import"./date-fns-tz@3.1.3_date-fns@3.6.0-ztskLDQQ.js";import"./async-validator@4.2.5-DKvM95Vc.js";import"./@css-render_plugin-bem@0.15.14_css-render@0.15.14-Be8eOoM-.js";const pt=u({name:"RouterDemoHome",setup(){const r=a(),i=l([{title:"姓名",key:"name"},{title:"地址",key:"address"},{title:"联系方式",key:"phone"},{title:"操作",key:"",render:t=>o(m,{align:"center"},{default:()=>[o(n,{type:"info",text:!0,size:"tiny",onClick:()=>{r.push({path:"/router-demo/router-demo-detail",query:{name:t.name}})}},{default:()=>[s("详情")]})]})}]),e=[];for(let t=0;t<10;t++)e.push({name:"张三"+t,address:"New York No. 1 Lake Park",phone:"010-121212",key:t});return{dataSource:e,columns:i}},render(){return o(m,null,{default:()=>[o(p,{columns:this.columns,"onUpdate:columns":r=>this.columns=r,data:this.dataSource},null)]})}});export{pt as default};