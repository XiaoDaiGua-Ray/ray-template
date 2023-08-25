import{R as k}from"./index-7b5adca4.js";import{R as b}from"./index-e3c3fdbe.js";import{$ as E,a3 as y,a4 as r,Z as a,P as n,U as o,k as A,r as i,a5 as h,g as N,f as R,B as w}from"./naive-ui@2.34.4_vue@3.3.4-8a777692.js";import{k as T,f as v,b as u,p as e,F as C,h as s}from"./@vue_runtime-core@3.3.4-073fad6e.js";import{k as d,h as L,v as S}from"./@vue_reactivity@3.3.4-2b3a1c4e.js";import"./index-7e447495.js";import"./vue-router@4.2.4_vue@3.3.4-e93fe26b.js";import"./lodash-es@4.17.21-b7de4195.js";import"./vue-i18n@9.2.2_vue@3.3.4-61e8862b.js";import"./@intlify_shared@9.2.2-e4047ebf.js";import"./@intlify_core-base@9.2.2-777854c2.js";import"./@intlify_message-compiler@9.2.2-8a818441.js";import"./@intlify_devtools-if@9.2.2-c61c979f.js";import"./dayjs@1.11.7-0fed7618.js";import"./@babel_runtime@7.22.6-47b11949.js";import"./pinia@2.1.4_typescript@5.0.2_vue@3.3.4-ab93b4ec.js";import"./vue-demi@0.14.5_vue@3.3.4-71ba0ef2.js";import"./@vue_runtime-dom@3.3.4-d86573ec.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.1.0_vue@3.3.4-3ed9a412.js";import"./@vueuse_shared@9.1.0_vue@3.3.4-e5bccb39.js";import"./pinia-plugin-persistedstate@3.1.0_pinia@2.1.4-4f3b1591.js";import"./clipboard@2.0.11-3174d29e.js";import"./date-fns@2.30.0-1707c6fa.js";import"./vueuc@0.4.51_vue@3.3.4-6588b5bd.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-24369cc5.js";import"./vooks@0.2.12_vue@3.3.4-59877c34.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-f45fcfa5.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";import"./vuedraggable@4.1.0_vue@3.3.4-15fb070b.js";import"./vue@3.3.4-3169e2a6.js";import"./sortablejs@1.14.0-ea08851c.js";import"./print-js@1.6.0-79725ec8.js";import"./xlsx@0.18.5-65d3fcd1.js";const bu=T({name:"TableView",setup(){const l=d(),m=[{title:"Name",key:"name"},{title:"Age",key:"age"},{title:"Address",key:"address"},{title:"Tags",key:"tags",render:t=>t.tags.map(D=>s(w,{style:{marginRight:"6px"},type:"info",bordered:!1},{default:()=>D}))},{title:"Remark",key:"remark",width:300},{title:"Action",key:"actions",render:t=>s(n,{size:"small"},{default:()=>"Send Email"})}],c=d([...m].map(t=>({...t,width:400}))),p=d([{key:0,name:"John Brown",age:32,address:"New York No. 1 Lake Park",tags:["nice","developer"],remark:"我是一条很长很长的备注"},{key:1,name:"Jim Green",age:42,address:"London No. 1 Lake Park",tags:["wow"],remark:"我是一条很长很长的备注"},{key:2,name:"Joe Black",age:32,address:"Sidney No. 1 Lake Park",tags:["cool","teacher"],remark:"我是一条很长很长的备注"}]),f=[{label:"编辑",key:"edit"},{label:()=>s("span",{style:{color:"red"}},"删除"),key:"delete"}],g=L({gridItemCount:4,gridCollapsedRows:1,tableLoading:!1}),B=(t,F)=>{t==="delete"&&p.value.splice(F,1)};return v(()=>{var t;(t=l.value)==null||t.tableMethods}),{...S(g),tableData:p,actionColumns:c,baseColumns:m,tableMenuOptions:f,handleMenuSelect:B,tableRef:l}},render(){return u("div",null,[u(E,null,{default:()=>[e("RayTable 组件使用")]}),u(y,{alignText:!0},{default:()=>[u(r,null,{default:()=>[e("该组件基于 Naive UI DataTable 组件封装。实现右键菜单、表格标题、导出为 excel 操作栏等功能")]}),u(r,null,{default:()=>[e("RayTable 完全继承 DataTable 的所有属性与方法")]}),u(r,null,{default:()=>[e("相关拓展 props 属性，可以在源码位置 src/components/RayTable/src/props.ts 中查看相关代码与注释")]}),u(r,null,{default:()=>[e("该组件可以配合 RayCollapseGird 组件使用实现可折叠搜索栏")]})]}),u(E,null,{default:()=>[e("配合 RayCollapseGird 组件使用与 RayTable 拓展功能")]}),u(a,null,{default:()=>[e("使用响应式方法代理 columns 并且打开 action 则可以启用操作栏(v-model:columns)")]}),u(a,null,{default:()=>[e("拖拽操作栏动态切换表格列")]}),u(a,null,{default:()=>[e("点击左右固定按钮，即可动态固定列")]}),u(a,null,{default:()=>[e("点击修改列宽度，即可拖动列修改宽度")]}),u(a,null,{default:()=>[e("点击导出按钮即可导出 excel 表格，默认以列为表头输出")]}),u(a,null,{default:()=>[e("点击打印按钮即可打印该表格")]}),u(a,null,{default:()=>[e("右键菜单")]}),u(a,null,{default:()=>[e("全屏表格")]}),u(b,{bordered:!1,collapsedRows:this.gridCollapsedRows,cols:this.gridItemCount,onUpdateValue:l=>window.$message.info(`我是 RayCollapseGrid 组件${l?"收起":"展开"}的回调函数`)},{action:()=>u(C,null,[u(n,{type:"primary"},{default:()=>[e("搜索")]}),u(n,null,{default:()=>[e("重置")]})]),default:()=>u(C,null,[u(o,null,{default:()=>[u(A,null,null)]}),u(o,null,{default:()=>[u(i,null,null)]}),u(o,null,{default:()=>[u(h,{type:"datetimerange",clearable:!0},null)]}),u(o,null,{default:()=>[u(i,null,null)]}),u(o,null,{default:()=>[u(i,null,null)]})])}),u(k,{style:"margin-top: 18px",ref:"tableRef",scrollX:2e3,title:u(N,{align:"center"},{default:()=>[u("span",null,[e("标题插槽:")]),u(R,{onUpdateValue:l=>this.tableLoading=l},null)]}),data:this.tableData,columns:this.actionColumns,"onUpdate:columns":l=>this.actionColumns=l,pagination:{pageSize:10},loading:this.tableLoading,rightClickOptions:this.tableMenuOptions,onRightMenuClick:this.handleMenuSelect.bind(this)},{tableFooter:()=>"表格的底部内容区域插槽，有时候你可能会用上"})])}});export{bu as default};
