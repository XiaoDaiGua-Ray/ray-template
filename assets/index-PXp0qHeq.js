import{j as d,R as n}from"./index-EwlO25Hg.js";const r={open:{type:Boolean,default:!1},collapseToggleText:{type:Array,default:()=>["展开","收起"]},bordered:{type:Boolean,default:!1},onUpdateValue:{type:[Function,Array],default:null},"onUpdate:value":{type:[Function,Array],default:null},...naive.gridProps},c=Vue.defineComponent({name:"RCollapseGrid",props:r,setup(a){const e=Vue.ref(!a.open),l=()=>{e.value=!e.value;const{onUpdateValue:s,"onUpdate:value":t}=a;s&&d(s,e.value),t&&d(t,e.value)};return{modelCollapsed:e,collapseClick:l,CollapseIcon:()=>Vue.createVNode("div",{class:"collapse-icon",onClick:l.bind(this)},[Vue.createVNode("span",null,[e.value?a.collapseToggleText[0]:a.collapseToggleText[1]]),Vue.createVNode(n,{customClassName:`collapse-icon--arrow ${e.value?"":"collapse-icon--arrow__expanded"}`,name:"expanded",size:"14"},null)])}},render(){return Vue.createVNode(naive.NCard,{bordered:this.bordered},{default:()=>Vue.createVNode(naive.NGrid,Vue.mergeProps({class:"ray-collapse-grid"},this.$props,{collapsed:this.modelCollapsed,xGap:this.xGap||12,yGap:this.yGap||18,collapsedRows:this.collapsedRows}),{default:()=>{var a,e;return[(e=(a=this.$slots).default)==null?void 0:e.call(a),Vue.createVNode(naive.NGridItem,{suffix:!0,class:"ray-collapse-grid__suffix--btn"},{default:()=>[Vue.createVNode(naive.NSpace,{justify:"end"},{default:()=>{var l,o;return[(o=(l=this.$slots).action)==null?void 0:o.call(l),this.CollapseIcon()]}})]})]}})})}});export{c as R};
