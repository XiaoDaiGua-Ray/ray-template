import{I as f,z as h}from"./hooks-AGBWEt_R.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./dayjs@1.11.10-C8LoRVP6.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.5.12--wFVw10U.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import"./jsbarcode@3.11.6-DGNGFp02.js";import"./@logicflow_core@2.0.6-CHqfytjt.js";import"./mobx-preact@3.0.0_mobx@5.15.7_preact@10.22.0-q-IhwcFu.js";import"./preact@10.22.0-D1_UwAj3.js";import{a as v,ag as r,L as l,J as F,ak as b,al as y,am as s,c as N,O as m}from"./naive-ui@2.40.1_vue@3.5.12-i2yA9The.js";import{l as k,b as t,I as i}from"./@vue_runtime-core@3.5.12-rIgKm_Vg.js";import{k as d}from"./@vue_reactivity@3.5.12-Bs6EYLxJ.js";import"./lodash-es@4.17.21-B-5kLwAl.js";import"./@vueuse_core@11.1.0_vue@3.5.12-DNt1HURo.js";import"./@vueuse_shared@11.1.0_vue@3.5.12-DnrABUGp.js";import"./utils-DweTa4yD.js";import"./pinia-plugin-persistedstate@4.1.1_pinia@2.2.4_rollup@4.20.0-_Zka_ujQ.js";import"./destr@2.0.3-CVtkxrq9.js";import"./deep-pick-omit@1.2.1-CegYQlcN.js";import"./pinia@2.2.4_typescript@5.6.3_vue@3.5.12-DK9mYMr0.js";import"./vue-demi@0.14.10_vue@3.5.12-Dq6ymT-8.js";import"./html-to-image@1.11.11-BOFdlgi9.js";import"./vue-router@4.3.2_vue@3.5.12-Brd4YmBy.js";import"./vue-i18n@9.13.1_vue@3.5.12-DVUVmCuN.js";import"./@intlify_shared@9.13.1-BxU0OzX2.js";import"./@intlify_core-base@9.13.1-C6DqbPB6.js";import"./@intlify_message-compiler@9.13.1-GrLDMuy_.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-dom@3.5.12-BKraWVUW.js";import"./@vue_shared@3.5.12--5_uv9t5.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./mobx@5.15.7-CEMJDQot.js";import"./uuid@9.0.1-CQkTLCs1.js";import"./classnames@2.5.1-nUTIn1-D.js";import"./mousetrap@1.6.5-BTGDluHR.js";import"./mobx-utils@5.6.2_mobx@5.15.7-C1xBETkd.js";import"./date-fns@3.6.0-q9PkOyxq.js";import"./seemly@0.3.8-DjGKl9dV.js";import"./vueuc@0.4.64_vue@3.5.12-CjNIvAko.js";import"./evtd@0.2.4-CI_DDEu_.js";import"./@css-render_vue3-ssr@0.15.14_vue@3.5.12-BZYDXyJG.js";import"./vooks@0.2.12_vue@3.5.12--iLh4DJ5.js";import"./vdirs@0.1.8_vue@3.5.12-C0KV5pCE.js";import"./@juggle_resize-observer@3.4.0-C8OzoCMD.js";import"./css-render@0.15.14-C5toWlUr.js";import"./@emotion_hash@0.8.0-WldOFDRm.js";import"./treemate@0.3.11-DKekKYbv.js";import"./date-fns-tz@3.1.3_date-fns@3.6.0-ztskLDQQ.js";import"./async-validator@4.2.5-DKvM95Vc.js";import"./@css-render_plugin-bem@0.15.14_css-render@0.15.14-Be8eOoM-.js";const Bt=k({name:"RFormDemo",setup(){const[u,{getFormInstance:p,validate:o,restoreValidation:n,formModel:a,formRules:e}]=f({name:null,age:null,gender:null,date:null,remark:null},{name:{required:!0,message:"请输入姓名",trigger:["blur","change"]},date:{required:!0,message:"请选择日期",trigger:["blur","change"],type:"number"},gender:{required:!0,message:"请选择性别",trigger:"change"},age:{required:!0,message:"请输入年龄",trigger:["blur","change"],type:"number"}}),g=d(e()),c=d(a());return{register:u,rules:g,condition:c,restoreValidation:n,formModel:a,validate:o}},render(){const{rules:u}=this,{register:p,restoreValidation:o,formModel:n,validate:a}=this;return t(h,{onRegister:p,rules:u,model:this.condition},{default:()=>[t(v,{cols:24,xGap:24},{default:()=>[t(r,{label:"姓名",path:"name",span:12},{default:()=>[t(l,{value:this.condition.name,"onUpdate:value":e=>this.condition.name=e},null)]}),t(r,{label:"年龄",path:"age",span:12},{default:()=>[t(F,{value:this.condition.age,"onUpdate:value":e=>this.condition.age=e,showButton:!1,style:"width: 100%"},null)]}),t(r,{label:"出生日期",path:"date",span:12},{default:()=>[t(b,{value:this.condition.date,"onUpdate:value":e=>this.condition.date=e,style:"width: 100%"},null)]}),t(r,{label:"性别",path:"gender",span:12},{default:()=>[t(y,{value:this.condition.gender,"onUpdate:value":e=>this.condition.gender=e},{default:()=>[t(s,{value:"girl"},{default:()=>[i("女")]}),t(s,{value:"man"},{default:()=>[i("男")]})]})]}),t(r,{label:"备注信息",span:24},{default:()=>[t(l,{type:"textarea",value:this.condition.remark,"onUpdate:value":e=>this.condition.remark=e},null)]}),t(r,{span:24},{default:()=>[t(N,{justify:"flex-end",style:"width: 100%"},{default:()=>[t(m,{type:"info",onClick:()=>{this.condition=n(),o()}},{default:()=>[i("重置表单为初始状态")]}),t(m,{type:"warning",onClick:o.bind(this)},{default:()=>[i("移除校验状态")]}),t(m,{type:"primary",onClick:()=>a()},{default:()=>[i("校验")]})]})]})]})]})}});export{Bt as default};
