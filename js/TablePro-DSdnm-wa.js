import{O as j,P as O,F as I,I as U,Q as G,U as $,H as L,J as z,V as M,W as _,X as H}from"./hooks-C7ZgHAXE.js";import"./currency.js@2.0.4-9OAR_aOO.js";import{d as S}from"./dayjs@1.11.10-C8LoRVP6.js";import"./print-js@1.6.0-BdoEj60G.js";import{a as J}from"./vue-hooks-plus@2.2.1_vue@3.4.38-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import{d as q,u as Q}from"./utils-DCtVzoYl.js";import{o as W}from"./lodash-es@4.17.21-BALnwRTu.js";import"./instance-B383KSvY.js";import{M as A}from"./mockjs@1.1.0-CxlURkif.js";import"./@vueuse_core@10.9.0_vue@3.4.38-Cp_qoKMZ.js";import"./@vueuse_shared@10.9.0_vue@3.4.38-BTLxKjPf.js";import"./interactjs@1.10.26-DZL_TZzP.js";import"./call-bind@1.0.7-Cpj98o6Y.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-DCOFUeQU.js";import"./echarts@5.5.0-CezqL3m-.js";import"./zrender@5.5.0-DW8ownf1.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.38-f9XU7P4m.js";import"./@vue_reactivity@3.4.38-CmXFqMGn.js";import"./@vue_shared@3.4.38-D8qfpBTH.js";function X(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Vue.isVNode(t)}const Y=Vue.defineComponent({name:"RCollapse",props:Object.assign({},{...j,open:{type:Boolean,default:!0},cols:{type:Number,default:4}},O),render(){const{$slots:t,$props:p}=this,{labelPlacement:V,showFeedback:l,...c}=p;return Vue.createVNode(I,Vue.mergeProps(c,{labelPlacement:"top",showFeedback:!1}),{default:()=>[Vue.createVNode(U,c,X(t)?t:{default:()=>[t]})]})}}),Z={...W(G,["pagination"]),paginationCount:{type:Number,default:1},onRegister:{type:Function,default:void 0},manual:{type:Boolean,default:!1},request:{type:Function},onTablePaginationUpdate:{type:Function},requestConfig:{type:Object,default:()=>({})},showPagination:{type:Boolean,default:!1},remote:{type:Boolean,default:!0}},ee=Z;function te(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Vue.isVNode(t)}const ae=Vue.defineComponent({name:"RTablePro",props:ee,setup(t){const[p,{getTableInstance:V}]=$(),[l,{getPage:c,getPageSize:i,setCallback:s,setItemCount:y,getPagination:v,resetPagination:T,getItemCount:b}]=L(void 0,{prefix:e=>`共 ${e.itemCount} 条`}),d=Vue.computed(()=>t.request),k=()=>(v(),{getItemCount:b,getPage:c,getPageSize:i}),E=()=>{const{onTablePaginationUpdate:e}=t;e&&q(e,k())},N=e=>{const f=Object.assign({},t.requestConfig,e),{params:a,formatRangeTime:g}=f;return g!=null&&g.length&&a&&g.forEach(h=>{const{key:u,target:o}=h,n=a[u];if(n&&(o!=null&&o.length)){const[r,F]=n;a[o[0]]=r,a[o[1]]=F}else a[u]=null,a[o[0]]=null,a[o[1]]=null}),Object.assign({},a,{page:c(),pageSize:i()})},P=e=>{var a;T();const f=N(e);(a=d.value)==null||a.call(d,f)},C=e=>{var a;const f=N(e);(a=d.value)==null||a.call(d,f)};return Vue.watchEffect(()=>{y(t.paginationCount),s(()=>{const{manual:e}=t;e||C(),E()})}),Vue.onMounted(()=>{const{onRegister:e}=t;if(e&&V()){const{clearFilters:f,clearSorter:a,downloadCsv:g,filters:B,page:h,scrollTo:u,sort:o,filter:n,print:r}=V();q(e,{getTablePagination:k,runTableRequest:P,clearFilters:f,clearSorter:a,downloadCsv:g,filters:B,page:h,scrollTo:u,sort:o,filter:n,print:r,getCurrentTableRequestParams:N})}}),{register:p,paginationRef:l}},render(){const{register:t,$props:p,paginationRef:V,$slots:l}=this,{onRegister:c,showPagination:i,...s}=p;return Vue.createVNode(z,Vue.mergeProps(s,{onRegister:t,pagination:i?V:void 0}),te(l)?l:{default:()=>[l]})}});function ue(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Vue.isVNode(t)}const Ee=Vue.defineComponent({name:"TableProDemo",setup(){const{format:t}=H(),[p,{runTableRequest:V,getCurrentTableRequestParams:l,print:c,downloadCsv:i}]=M(),s=Vue.ref([]),y=[{type:"selection"},{title:"Name",key:"name"},{title:"Sign Status",key:"statusText"},{title:"Sign Time",key:"signTimeStart",render:u=>t(u.signTimeStart)+" ~ "+t(u.signTimeEnd)},{title:"Age",key:"age"},{title:"Address",key:"address"},{title:"Tags",key:"tags",render:u=>u.tags.map(n=>Vue.createVNode(naive.NTag,{type:"info",bordered:!1,style:"margin-right: 6px"},ue(n)?n:{default:()=>[n]}))},{title:"Remark",key:"remark"}],v=Vue.ref(0),T=Vue.ref({}),b=Vue.ref((()=>{const o=[],n=S().valueOf();for(let r=0;r<30;r++)o.push({key:Q(),name:A.Random.cname(),age:r+20,address:A.Random.city(),tags:["nice","developer"],remark:"我是一条很长很长的备注",status:r%2===0?"success":"error",statusText:r%2===0?"在线":"离线",signTimeStart:S(n).add(r*2,"year").valueOf(),signTimeEnd:S(n).add(r+5,"day").valueOf()});return o})()),d=Vue.ref({pagination:!0,manual:!1}),[k,{checkedRowKeysBind:E,getKeys:N,getRows:P,clearKey:C,clearAll:e,selectKey:f}]=_(s,y,{rowKey:"key",onChange:(u,o,n)=>{}}),a=u=>u==null,g=u=>new Promise(o=>{const{page:n=1,pageSize:r=10,name:F,status:w,signTimeStart:D,signTimeEnd:x}=u||{};let m=b.value;const K=b.value.length;F&&(m=m.filter(R=>R.name.includes(F))),w&&(m=m.filter(R=>R.status===w)),D&&x&&(m=m.filter(R=>R.signTimeStart>=D&&R.signTimeEnd<=x)),m=m.slice((n-1)*r,n*r),setTimeout(()=>{o({code:0,data:m,total:a(w)&&a(F)&&(a(D)||a(x))?K:m.length,message:"success",page:n,pageSize:r})},1e3)}),{run:B,loading:h}=J(g,{onSuccess:u=>{const{data:o,total:n}=u;s.value=o,v.value=n}});return{tableDataRef:s,baseColumns:y,itemCountRef:v,loadingGetPersonList:h,runGetPersonList:B,conditionRef:T,radioRef:d,runTableRequest:V,tableProRegister:p,print:c,downloadCsv:i,checkedRowKeysBind:E,checkedRowKeys:k,getKeys:N,getRows:P,clearKey:C,clearAll:e,selectKey:f}},render(){const{tableDataRef:t,baseColumns:p,itemCountRef:V,loadingGetPersonList:l,runGetPersonList:c,conditionRef:i,radioRef:s,runTableRequest:y,tableProRegister:v,print:T,downloadCsv:b,checkedRowKeysBind:d,getKeys:k,getRows:E,clearKey:N,clearAll:P,selectKey:C}=this;return Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(Y,null,{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NFormItemGi,{label:"用户名"},{default:()=>[Vue.createVNode(naive.NInput,{value:i.name,"onUpdate:value":e=>i.name=e,clearable:!0},null)]}),Vue.createVNode(naive.NFormItemGi,{label:"状态"},{default:()=>[Vue.createVNode(naive.NSelect,{value:i.status,"onUpdate:value":e=>i.status=e,clearable:!0,options:[{label:"成功",value:"success"},{label:"失败",value:"error"}]},null)]}),Vue.createVNode(naive.NFormItemGi,{label:"登陆时间"},{default:()=>[Vue.createVNode(naive.NDatePicker,{type:"datetimerange",value:i.RangeTime,"onUpdate:value":e=>i.RangeTime=e,clearable:!0},null)]}),Vue.createVNode(naive.NFormItemGi,{label:"演示折叠的条件框"},{default:()=>[Vue.createVNode(naive.NInput,{readonly:!0,placeholder:"我只是为了占位"},null)]})]),action:()=>Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>y(),loading:l},{default:()=>[Vue.createTextVNode("查询")]})]})}),Vue.createVNode(naive.NCard,{title:"常用高级拓展功能"},{default:()=>[Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NFormItem,{label:"分页"},{default:()=>[Vue.createVNode(naive.NRadioGroup,{value:s.pagination,"onUpdate:value":e=>s.pagination=e},{default:()=>[Vue.createVNode(naive.NRadioButton,{value:!0},{default:()=>[Vue.createTextVNode("显示分页")]}),Vue.createVNode(naive.NRadioButton,{value:!1},{default:()=>[Vue.createTextVNode("隐藏分页")]})]})]}),Vue.createVNode(naive.NFormItem,{label:"自动更新"},{default:()=>[Vue.createVNode(naive.NRadioGroup,{value:s.manual,"onUpdate:value":e=>s.manual=e},{default:()=>[Vue.createVNode(naive.NRadioButton,{value:!1},{default:()=>[Vue.createTextVNode("自动更新")]}),Vue.createVNode(naive.NRadioButton,{value:!0},{default:()=>[Vue.createTextVNode("取消自动")]})]})]})]})]}),Vue.createVNode(naive.NCard,{title:"useTablePro 部分方法"},{default:()=>[Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{type:"primary",onClick:T},{default:()=>[Vue.createTextVNode("打印")]}),Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>b()},{default:()=>[Vue.createTextVNode("下载 csv")]})]})]}),Vue.createVNode(naive.NCard,{title:"useCheckedRowKeys 部分方法"},{default:()=>[Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>{const e=t[1].key;C(e)}},{default:()=>[Vue.createTextVNode("选中第二行")]}),Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>{const e=t[1].key;N(e)}},{default:()=>[Vue.createTextVNode("取消选中第二行")]}),Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>{t==null||t.forEach(e=>C(e.key))}},{default:()=>[Vue.createTextVNode("选中当前页面所有行")]}),Vue.createVNode(naive.NButton,{type:"primary",onClick:()=>{P()}},{default:()=>[Vue.createTextVNode("取消所有已选中行")]})]})]}),Vue.createVNode(ae,{onRegister:v,data:t,columns:p,loading:l,paginationCount:V,request:c,requestConfig:{params:i,formatRangeTime:[{key:"RangeTime",target:["signTimeStart","signTimeEnd"]}]},showPagination:s.pagination,manual:s.manual,rowKey:e=>e.key,checkedRowKeys:this.checkedRowKeys,"onUpdate:checkedRowKeys":e=>this.checkedRowKeys=e,onUpdateCheckedRowKeys:d},null)]})}});export{Ee as default};
