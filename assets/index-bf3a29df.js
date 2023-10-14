import{e as O,d as f,h as v,q as w}from"./index-f0e321ba.js";import{V as A}from"./vuedraggable@4.1.0_vue@3.3.4-15830514.js";import{s as x}from"./screenfull@6.0.2-b3e6dc1f.js";import{p as F}from"./print-js@1.6.0-8c6cc636.js";import{d as D}from"./dayjs@1.11.9-208bf754.js";const U=e=>e.map(t=>(t.fixed&&(t.fixed==="right"?t.rightFixedActivated=!0:t.leftFixedActivated=!0),t.resizable&&(t.resizeColumnActivated=!0),t)),R=Vue.defineComponent({name:"TableSetting",emits:["columnsUpdate"],setup(e,{emit:i}){const t=Vue.inject("tableSettingProvider",{}),a=O(),n=Vue.ref(U(t.modelColumns.value)),g=Vue.ref(!0),{themeValue:s}=Pinia.storeToRefs(a);return{settingOptions:n,handleDraggableEnd:()=>{i("columnsUpdate",n.value)},handleFixedClick:(c,r)=>{const h=`${c}FixedActivated`,d=n.value[r];h==="leftFixedActivated"?d.rightFixedActivated=!1:h==="rightFixedActivated"&&(d.leftFixedActivated=!1),d[h]=!d[h],d[h]?d.fixed=c:d.fixed=void 0,n.value[r]=d,i("columnsUpdate",n.value)},disableDraggable:g,FixedPopoverIcon:c=>{const{element:r,name:h,tooltip:d,fn:N,index:T,fixed:_,key:S}=c;return Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(f,{customClassName:`draggable-item__icon ray-table-icon ${r[S]?"draggable-item__icon--actived":""}`,name:h,size:"18",onClick:N.bind(this,_,T)},null),default:()=>d})},handleResizeColumnClick:c=>{const r=n.value[c];r.resizeColumnActivated=!r.resizeColumnActivated,r.resizable=r.resizeColumnActivated,n.value[c]=r,i("columnsUpdate",n.value)},themeValue:s}},render(){return Vue.createVNode(naive.NPopover,{trigger:"click",placement:"bottom",showArrow:!1,raw:!0},{trigger:()=>Vue.createVNode(f,{customClassName:"ray-table__setting",name:"setting",size:"18"},null),default:()=>Vue.createVNode(naive.NCard,{bordered:!1,class:"table-setting__card"},{default:()=>Vue.createVNode(A,Vue.mergeProps({class:["ray-table__setting-option--draggable"],modelValue:this.settingOptions,"onUpdate:modelValue":e=>this.settingOptions=e,itemKey:"key"},{disabled:!this.disableDraggable,onEnd:this.handleDraggableEnd.bind(this)}),{item:({element:e,index:i})=>Vue.createVNode("div",{class:["draggable-item",this.themeValue?"draggable-item--dark":""]},[Vue.createVNode(f,{customClassName:"draggable-item__d--icon",name:"draggable",size:"18"},null),Vue.createVNode(naive.NEllipsis,null,{default:()=>[Vue.createVNode("span",null,[e.title])]}),this.FixedPopoverIcon({element:e,name:"left_arrow",tooltip:"左固定",fn:this.handleFixedClick,index:i,fixed:"left",key:"leftFixedActivated"}),Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(f,{customClassName:`draggable-item__icon ${e.resizeColumnActivated?"draggable-item__icon--actived":""}`,name:"resize_h",size:"18",onClick:this.handleResizeColumnClick.bind(this,i)},null),default:()=>"修改列宽"}),this.FixedPopoverIcon({element:e,name:"right_arrow",tooltip:"右固定",fn:this.handleFixedClick,index:i,fixed:"right",key:"rightFixedActivated"})])})})})}}),k=Vue.defineComponent({name:"TableAction",props:{tooltip:{type:String,required:!0},negativeText:{type:String,default:"取消"},positiveText:{type:String,default:"确认"},icon:{type:String,required:!0},iconSize:{type:Number,default:18},popoverContent:{type:String,required:!0}},emits:["positive","negative"],setup(e,{emit:i}){const t=Vue.ref(!1);return{handleEmit:n=>{i(n==="positive"?"positive":"negative"),t.value=!1},showPopoconfirm:t}},render(){return Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(naive.NPopconfirm,{show:this.showPopoconfirm,"onUpdate:show":e=>this.showPopoconfirm=e,showArrow:!0},{trigger:()=>Vue.createVNode(f,{name:this.icon,size:this.iconSize,customClassName:"ray-table-icon"},null),default:()=>this.tooltip,action:()=>Vue.createVNode(naive.NSpace,null,{default:()=>[Vue.createVNode(naive.NButton,{size:"small",ghost:!0,onClick:this.handleEmit.bind(this,"negative")},{default:()=>[this.negativeText]}),Vue.createVNode(naive.NButton,{size:"small",ghost:!0,type:"info",onClick:this.handleEmit.bind(this,"positive")},{default:()=>[this.positiveText]})]})}),default:()=>this.popoverContent})}});const I=Vue.defineComponent({name:"TableSize",props:{onChangeSize:{type:[Function,Array],default:null}},emits:["changeSize"],setup(e){const i=Vue.inject("tableSettingProvider",{}),t=Vue.ref(!1),a=Vue.computed({get:()=>i.size,set:s=>{const{onChangeSize:l}=e;l&&v(l,s)}}),n=Vue.ref([{label:"默认",key:"medium"},{label:"紧凑",key:"small"},{label:"宽松",key:"large"}]);return{size:a,sizeOptions:n,handleDropdownClick:s=>{n.value.forEach(l=>{l.key===s&&(a.value=s,t.value=!1)})},popoverShow:t}},render(){return Vue.createVNode(naive.NPopover,{show:this.popoverShow,"onUpdate:show":e=>this.popoverShow=e,trigger:"click",placement:"bottom",showArrow:!1,raw:!0},{trigger:()=>Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(f,{name:"adjustment",size:"18",customClassName:"ray-table-icon"},null),default:()=>"表格密度"}),default:()=>Vue.createVNode(naive.NCard,{bordered:!1,class:"ray-table__table-size ray-table__table-size--dark ray-table__table-size--light"},{default:()=>[Vue.createVNode("div",{class:"table-size__dropdown"},[Vue.createVNode("div",{class:"table-size__dropdown-wrapper"},[this.sizeOptions.map(e=>Vue.createVNode("div",{class:["dropdown-item",e.key===this.size?"dropdown-item--active":""],key:e.key,onClick:this.handleDropdownClick.bind(this,e.key)},[Vue.createVNode("div",{class:"drop-item__label"},[e.label])]))])])]})})}});const M=Vue.defineComponent({name:"TableScreenfull",setup(){const e=Vue.inject("tableSettingProvider",{}),i=Vue.computed(()=>e.rayTableUUID);let t=x.isFullscreen;return{handleScreenfull:()=>{const n=document.getElementById(i.value);t=!t,n&&x.isEnabled&&t?x.request(n):x.exit()}}},render(){return Vue.createVNode(naive.NPopover,null,{trigger:()=>Vue.createVNode(f,{name:"fullscreen",size:"18",customClassName:"ray-table-icon tay-table-icon__screenfull",onClick:this.handleScreenfull.bind(this)},null),default:()=>"全屏表格"})}}),X={...naive.dataTableProps,rightClickOptions:{type:Array,default:()=>[]},onRightMenuClick:{type:[Function,Array],default:null},title:{type:[String,Object],default:null},action:{type:Boolean,default:!0},actionExtra:{type:Object,default:()=>({})},exportTooltip:{type:String,default:"是否导出为Excel表格?"},exportType:{type:String,default:"xlsx"},exportPositiveText:{type:String,default:"确认"},exportNegativeText:{type:String,default:"取消"},exportFilename:{type:String,default:""},printPositiveText:{type:String,default:"确认"},printNegativeText:{type:String,default:"取消"},printTooltip:{type:String,default:"是否打印该表格?"},printType:{type:String,default:"html"},printOptions:{type:Object,default:()=>({})},printIcon:{type:String,default:"print"},exportExcelIcon:{type:String,default:"export_excel"},tableHeaderSpace:{type:String,default:"10px"},bordered:{type:Boolean,default:!1},onExportSuccess:{type:[Function,Array],default:null},onExportError:{type:[Function,Array],default:null},onUpdateColumns:{type:[Function,Array],default:null},"onUpdate:columns":{type:[Function,Array],default:null}},j=e=>e.reduce((t,a)=>(t[a.key]=a.title,t),{}),$=(e,i,t)=>{for(let a=e.s.c;a<=e.e.c;a++){const n=DO_NOT_EXPORT_CODEPAGE.utils.encode_col(a)+"1";i[n].v=t[i[n].v]}},B=async(e,i,t={})=>{await new Promise((a,n)=>{if(Array.isArray(e))if(e.length){const g=j(i??[]),s=DO_NOT_EXPORT_CODEPAGE.utils.json_to_sheet(e),l=DO_NOT_EXPORT_CODEPAGE.utils.book_new(),b=t.filename?t.filename+".xlsx":D().format("YYYY-MM-DD")+"导出表格.xlsx";DO_NOT_EXPORT_CODEPAGE.utils.book_append_sheet(l,s,"Data");const m=DO_NOT_EXPORT_CODEPAGE.utils.decode_range(s["!ref"]);i!=null&&i.length&&$(m,s,g),DO_NOT_EXPORT_CODEPAGE.writeFileXLSX(l,b),a()}else a();else n()})},K=Vue.defineComponent({name:"RayTable",props:X,setup(e,{expose:i}){const t=Vue.ref(),a=w(16),n=w(16),g=Vue.computed(()=>e.rightClickOptions),s=Vue.computed({get:()=>e.columns,set:o=>{const{onUpdateColumns:u,"onUpdate:columns":p}=e;u&&v(u,o),p&&v(p,o)}}),l=Vue.reactive({x:0,y:0,showMenu:!1}),b=Vue.computed(()=>({"--ray-table-header-space":e.tableHeaderSpace})),m=Vue.ref(e.size),C=Vue.ref();let c=-1;Vue.provide("tableSettingProvider",{modelRightClickMenu:g,modelColumns:s,size:m,rayTableUUID:n});const r=o=>{s.value=o},h=(o,u)=>{const{onRightMenuClick:p}=e;p&&v(p,o,c,u),l.showMenu=!1},d=(o,u)=>{var y;const p=(y=e.rowProps)==null?void 0:y.call(e,o,u),P=g.value.length?V=>{V.preventDefault(),c=u,l.showMenu=!1,Vue.nextTick().then(()=>{l.showMenu=!0,l.x=V.clientX,l.y=V.clientY})}:void 0;return{...p,onContextmenu:P}},N=async()=>{const{onExportSuccess:o,onExportError:u}=e;if(e.data.length&&e.columns.length)try{await B(e.data,e.columns,{filename:e.exportFilename}),o&&v(o)}catch{u&&v(u)}},T=()=>{const o=Object.assign({},e.printOptions,{printable:a,type:e.printType,documentTitle:e.printOptions.documentTitle?e.printOptions.documentTitle:"表格"});F(o)},_=o=>{m.value=o},S=o=>{const{clearFilters:u,clearSorter:p,filters:P,page:y,scrollTo:V,sort:z,filter:E}=o;C.value={clearFilters:u,clearSorter:p,filters:P,page:y,scrollTo:V,sort:z,filter:E}};return i({tableMethods:Vue.computed(()=>C.value)}),Vue.onMounted(()=>{S(t.value)}),{tableUUID:a,rayTableUUID:n,handleColumnsUpdate:r,...Vue.toRefs(l),handleRowProps:d,handleRightMenuSelect:h,handleExportPositive:N,handlePrintPositive:T,cssVars:b,handleChangeTableSize:_,tableSize:m,rayTableInstance:t,modelRightClickMenu:g}},render(){return Vue.createVNode(naive.NCard,Vue.mergeProps({class:"ray-table",bordered:this.bordered,style:[this.cssVars]},{id:this.rayTableUUID}),{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NDataTable,Vue.mergeProps({ref:"rayTableInstance"},{id:this.tableUUID},this.$props,{rowProps:this.handleRowProps.bind(this),size:this.tableSize}),{...this.$slots}),Vue.createVNode(naive.NDropdown,{show:this.showMenu,placement:"bottom-start",trigger:"manual",x:this.x,y:this.y,options:this.modelRightClickMenu,onClickoutside:()=>this.showMenu=!1,onSelect:this.handleRightMenuSelect.bind(this)},null)]),header:()=>this.title||Vue.createVNode("div",{style:"display: none;"},null),"header-extra":()=>this.action?Vue.createVNode("div",{class:"ray-table-header-extra__space"},[Vue.createVNode(k,{icon:this.printIcon,tooltip:this.printTooltip,popoverContent:"打印表格",positiveText:this.printPositiveText,negativeText:this.printNegativeText,onPositive:this.handlePrintPositive.bind(this)},null),Vue.createVNode(k,{icon:this.exportExcelIcon,tooltip:this.exportTooltip,popoverContent:"导出表格",positiveText:this.exportPositiveText,negativeText:this.exportNegativeText,onPositive:this.handleExportPositive.bind(this)},null),Vue.createVNode(I,{onChangeSize:this.handleChangeTableSize.bind(this)},null),Vue.createVNode(M,null,null),Vue.createVNode(R,{onColumnsUpdate:this.handleColumnsUpdate.bind(this)},null)]):"",footer:()=>{var e,i;return(i=(e=this.$slots).tableFooter)==null?void 0:i.call(e)}})}});export{K as R};