import{u as a}from"./vue-router@4.2.4_vue@3.3.4-4991130b.js";import{a1 as p,f as r,P as u}from"./naive-ui@2.34.4_vue@3.3.4-eb250861.js";import{k as n,b as e,p as s}from"./@vue_runtime-core@3.3.4-073fad6e.js";import"./@vue_reactivity@3.3.4-2b3a1c4e.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./date-fns@2.30.0-0bf1b710.js";import"./@babel_runtime@7.22.6-960cbc2f.js";import"./vueuc@0.4.51_vue@3.3.4-6588b5bd.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-24369cc5.js";import"./vooks@0.2.12_vue@3.3.4-59877c34.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./@vue_runtime-dom@3.3.4-d86573ec.js";import"./lodash-es@4.17.21-b7de4195.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-7cff6900.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";const z=n({name:"RouterDemoHome",setup(){const m=a(),i=[{title:"姓名",key:"name"},{title:"地址",key:"address"},{title:"联系方式",key:"phone"},{title:"操作",key:"",render:t=>e(r,{align:"center"},{default:()=>[e(u,{type:"info",text:!0,size:"tiny",onClick:()=>{m.push({path:"/router-demo/router-demo-detail",query:{row:JSON.stringify(t)}})}},{default:()=>[s("详情")]})]})}],o=[];for(let t=0;t<10;t++)o.push({name:"张三",address:"New York No. 1 Lake Park",phone:"010-121212",key:t});return{dataSource:o,columns:i}},render(){return e(r,{wrapItem:!1},{default:()=>[e(p,{columns:this.columns,data:this.dataSource},null)]})}});export{z as default};