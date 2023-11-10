import{d as h,k as g,x as z,r as T}from"./index-fb555374.js";import{u as F}from"./vue-hooks-plus@1.8.5_vue@3.3.6-2f171f2e.js";import"./lodash@4.17.21-e6f077ad.js";import"./js-cookie@3.0.5-19aa770d.js";import"./qs@6.11.2-83b75eda.js";import{p as A}from"./print-js@1.6.0-4c3d86b1.js";const y={...naive.dataTableProps,title:{type:[String,Number,Object],default:null},toolOptions:{type:Array},coverTool:{type:Boolean,default:!1},contextMenuOptions:{type:Array},disabledContextMenu:{type:Boolean,default:!1},onContextMenuClick:{type:[Function,Array],default:null},downloadTableOptions:{type:Object,default:()=>({})},wrapperBordered:{type:Boolean,default:!1},printTableOptions:{type:Object,default:()=>({})},onDownloadSuccess:{type:[Function,Array],default:null},onDownloadError:{type:[Function,Array],default:null},onUpdateColumns:{type:[Function,Array],default:null},"onUpdate:columns":{type:[Function,Array],default:null},onContextmenu:{type:[Function,Array],default:null}},p={tableIconSize:"18",tableKey:Symbol("r-table")},R=Vue.defineComponent({name:"TableSizeSelect",props:{onChangeSize:{type:[Function,Array],default:null},...y},setup(e){const t=Vue.ref(!1);return{size:Vue.ref(e.size),sizeOptions:[{label:"默认",value:"medium"},{label:"紧凑",value:"small"},{label:"宽松",value:"large"}],popoverShow:t,updatePopselectValue:s=>{const{onChangeSize:l}=e;l&&g(l,s)}}},render(){return Vue.createVNode(naive.NPopselect,{value:this.size,"onUpdate:value":e=>this.size=e,options:this.sizeOptions,trigger:"click",onUpdateValue:this.updatePopselectValue.bind(this)},{default:()=>[Vue.createVNode(naive.NPopover,{showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:"adjustment",size:p.tableIconSize,cursor:"pointer"},null),default:()=>"密度"})]})}}),P=Vue.defineComponent({name:"TableFullscreen",setup(){const{wrapperRef:e}=Vue.inject(p.tableKey,{}),[t,{toggleFullscreen:o,isEnabled:a}]=F(e);return{toggleFullscreen:o,isFullscreen:t,isEnabled:a}},render(){const{toggleFullscreen:e,isEnabled:t,$t:o}=this;return Vue.createVNode(naive.NPopover,{showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:"fullscreen",size:p.tableIconSize,cursor:"pointer",onClick:()=>{t||o("globalMessage.isEnabledFullscreen"),e()}},null),default:()=>this.isFullscreen?"取消全屏":"全屏表格"})}}),M=()=>Vue.h(h,{name:"draggable",size:p.tableIconSize}),S=({icon:e,title:t,onClick:o,customClassName:a})=>Vue.createVNode(naive.NPopover,{showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:e,size:p.tableIconSize,cursor:"pointer",customClassName:a,onClick:o==null?void 0:o.bind(null)},null),default:()=>t}),x=(e,t)=>{if(!t)return[null,null];for(let o=0;o<t.length;++o){const a=t[o];if(a.key===e.key)return[t,o];const[u,s]=x(e,a.children);if(u&&s!==null)return[u,s]}return[null,null]},k=Vue.defineComponent({name:"TableC",props:{...y,onUpdateColumn:{type:[Function,Array],default:null}},setup(e){const t=Vue.computed({get:()=>e.columns.map((l,n)=>{const{key:f,title:c,children:V,fixed:d,isResizable:b,...v}=l,N=d==="left",r=d==="right",i={...v,title:c,key:f,fixed:d,isLeftFixedActivated:N,isRightFixedActivated:r,isResizable:b};return{...i,suffix:()=>Vue.createVNode(naive.NSpace,{wrapItem:!1,style:"padding-left: 32px;"},{default:()=>[Vue.createVNode(S,{icon:"row_head",title:"固定在列首",customClassName:N?"r-table__c-tool-icon--active":"",onClick:u.bind(this,"left",i,n)},null),Vue.createVNode(naive.NPopover,{showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:"resize_h",size:p.tableIconSize,cursor:"pointer",customClassName:b?"r-table__c-tool-icon--active":"",onClick:a.bind(this,i,n)},null),default:()=>"修改列宽"}),Vue.createVNode(S,{icon:"row_end",title:"固定在列尾",customClassName:r?"r-table__c-tool-icon--active":"",onClick:u.bind(this,"right",i,n)},null)]})}}),set:()=>{}}),o=l=>{const{onUpdateColumn:n}=e;n&&g(n,l)},a=(l,n)=>{l.isResizable=!l.isResizable,l.resizable=l.isResizable,t.value[n]=l,o(t.value)},u=(l,n,f)=>{const c=`${l}FixedActivated`,V=`${l==="left"?"right":"left"}FixedActivated`;n[V]=!1,n[c]=!n[c],n[c]?n.fixed=l:n.fixed=void 0,t.value[f]=n,o(t.value)};return{treeDataSource:t,treeDrop:({node:l,dragNode:n,dropPosition:f})=>{const[c,V]=x(n,t.value);if(c===null||V===null)return;c.splice(V,1);const[d,b]=x(l,t.value);d===null||b===null||(f==="before"?d.splice(b,0,n):d.splice(b+1,0,n),o(d))}}},render(){return Vue.createVNode(naive.NPopover,{displayDirective:"show",trigger:"click",showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:"setting",size:p.tableIconSize,cursor:"pointer",customClassName:"r-table__setting"},null),default:()=>Vue.createVNode(naive.NTree,{class:"r-table__c-tree",data:this.treeDataSource,blockLine:!0,draggable:!0,keyboard:!1,labelField:"title",selectable:!1,renderSwitcherIcon:M.bind(this),onDrop:this.treeDrop.bind(this)},null)})}}),I=Vue.defineComponent({name:"PrintTable",props:y,setup(e){const{uuidTable:t}=Vue.inject(p.tableKey,{});return{printTableClick:()=>{const{printTableOptions:a}=e,{type:u="html",printOptions:s={}}=a??{},l=Object.assign(s,{printable:t,type:u,documentTitle:s.documentTitle?s.documentTitle:"表格"});A(l)}}},render(){return Vue.createVNode(naive.NPopover,{showArrow:!1},{trigger:()=>Vue.createVNode(h,{name:"print",size:p.tableIconSize,cursor:"pointer",onClick:this.printTableClick.bind(this)},null),default:()=>"打印表格"})}});function O(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const E=Vue.defineComponent({name:"RTable",props:y,setup(e,t){const{expose:o}=t,a=Vue.ref(null),u=Vue.ref(null),s=z(16),l=z(16),n=Vue.reactive({x:0,y:0,showContextMenu:!1}),f=Vue.reactive({size:e.size}),c=(r,i)=>{const{onContextMenuClick:m}=e;m&&g(m,r,i),n.showContextMenu=!1},V=(r,i)=>{var w;return{...(w=e.rowProps)==null?void 0:w.call(e,r,i),onContextmenu:e.disabledContextMenu?void 0:C=>{C.preventDefault(),n.showContextMenu=!1,Vue.nextTick().then(()=>{n.showContextMenu=!0,n.x=C.clientX,n.y=C.clientY})}}},d=r=>{f.size=r},b=r=>{const{onUpdateColumns:i,"onUpdate:columns":m}=e;i&&g(i,r),m&&g(m,r)},v=()=>{const{toolOptions:r}=e;return r==null?void 0:r.filter(()=>Boolean).map(i=>typeof i=="function"?i():i)},N=r=>{const i=()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(I,r,null),Vue.createVNode(R,Vue.mergeProps(r,{onChangeSize:d.bind(this)}),null),Vue.createVNode(P,null,null),Vue.createVNode(k,Vue.mergeProps(r,{onUpdateColumn:b.bind(this)}),null)]);return e.toolOptions?e.coverTool?v:()=>Vue.createVNode(Vue.Fragment,null,[i(),v()]):i};return Vue.provide(p.tableKey,{uuidTable:l,uuidWrapper:s,wrapperRef:u}),o({rTableInst:a,uuidTable:l,uuidWrapper:s}),{uuidWrapper:s,uuidTable:l,contextMenuReactive:n,rTableInst:a,combineRowProps:V,contextMenuSelect:c,privateReactive:f,tool:N,wrapperRef:u}},render(){const{tool:e}=this;return Vue.createVNode(naive.NCard,Vue.mergeProps({ref:"wrapperRef",bordered:this.wrapperBordered},{id:this.uuidWrapper}),{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NDataTable,Vue.mergeProps({ref:"rTableInst"},{id:this.uuidTable},this.$props,this.$attrs,{rowProps:this.combineRowProps.bind(this),size:this.privateReactive.size}),{...this.$slots}),this.disabledContextMenu?null:Vue.createVNode(naive.NDropdown,{show:this.contextMenuReactive.showContextMenu,placement:"bottom-start",trigger:"manual",x:this.contextMenuReactive.x,y:this.contextMenuReactive.y,options:this.contextMenuOptions,onClickoutside:()=>this.contextMenuReactive.showContextMenu=!1,onSelect:this.contextMenuSelect.bind(this)},null)]),header:T(this.title,{defaultElement:Vue.createVNode("div",{style:"display: none;"},null)}),"header-extra":()=>{let t;return Vue.createVNode(naive.NSpace,{wrapItem:!1,align:"center"},O(t=e(this.$props))?t:{default:()=>[t]})},footer:()=>{var t,o;return(o=(t=this.$slots).tableFooter)==null?void 0:o.call(t)},action:()=>{var t,o;return(o=(t=this.$slots).tableAction)==null?void 0:o.call(t)}})}});export{E as R};