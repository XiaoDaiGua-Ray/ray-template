import{a6 as p,T as r,U as i,g as c,V as u}from"./naive-ui@2.34.4_vue@3.3.4-eacf875e.js";import{j as n,d as f}from"./index-8b362559.js";import{k as m,b as l,E as y}from"./@vue_runtime-core@3.3.4-073fad6e.js";import{k as C}from"./@vue_reactivity@3.3.4-2b3a1c4e.js";const g={open:{type:Boolean,default:!1},collapseToggleText:{type:Array,default:()=>["展开","收起"]},bordered:{type:Boolean,default:!1},onUpdateValue:{type:[Function,Array],default:null},"onUpdate:value":{type:[Function,Array],default:null},...p},T=m({name:"RayCollapseGrid",props:g,setup(a){const e=C(!a.open),s=()=>{e.value=!e.value;const{onUpdateValue:o,"onUpdate:value":d}=a;o&&n(o,e.value),d&&n(d,e.value)};return{modelCollapsed:e,handleCollapse:s,CollapseIcon:()=>l("div",{class:"collapse-icon",onClick:s.bind(this)},[l("span",null,[e.value?a.collapseToggleText[0]:a.collapseToggleText[1]]),l(f,{customClassName:`collapse-icon--arrow ${e.value?"":"collapse-icon--arrow__expanded"}`,name:"expanded",size:"14"},null)])}},render(){return l(u,{bordered:this.bordered},{default:()=>l(r,y({class:"ray-collapse-grid"},this.$props,{collapsed:this.modelCollapsed,xGap:this.xGap||12,yGap:this.yGap||18,collapsedRows:this.collapsedRows}),{default:()=>{var a,e;return[(e=(a=this.$slots).default)==null?void 0:e.call(a),l(i,{suffix:!0,class:"ray-collapse-grid__suffix--btn"},{default:({overflow:s})=>l(c,{justify:"end"},{default:()=>{var t,o;return[(o=(t=this.$slots).action)==null?void 0:o.call(t),s?this.CollapseIcon():""]}})})]}})})}});export{T as R};
