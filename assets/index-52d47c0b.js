import{c as F}from"./lodash-es@4.17.21-b7de4195.js";import{c as o}from"./currency.js@2.0.4-57f74176.js";import{h as m,V as s,a1 as a,a2 as h,E as C}from"./naive-ui@2.34.4_vue@3.3.4-ac34c8ed.js";import{k as b,b as i,p as f,n as D}from"./@vue_runtime-core@3.3.4-1efe2776.js";import{h as O,w as B}from"./@vue_reactivity@3.3.4-dab4163d.js";import"./date-fns@2.30.0-f997f5eb.js";import"./@babel_runtime@7.22.11-b49cf076.js";import"./vueuc@0.4.51_vue@3.3.4-34da2438.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-776d8979.js";import"./vooks@0.2.12_vue@3.3.4-668fb067.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./@vue_runtime-dom@3.3.4-e8744c5b.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-8f0f3131.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";const l=(t,u,e)=>t!=null&&t.length?t.length===1?o(t[0]):t.reduce((r,p,d,c)=>(r=e==null?void 0:e(r,p,d,c),r),u):0,E=(t,u,e="number")=>e==="number"?o(t,u).value:o(t,u).toString(),V=(...t)=>l(t,0,(u,e)=>o(u).add(e)),y=(...t)=>{if(t.length===2){const[n,r]=t;return o(n).subtract(r)}const u=F(t),e=u.shift();return u.length?l(u,e,(n,r)=>o(n).subtract(r)):e},v=(...t)=>l(t,1,(u,e)=>o(u).multiply(e)),A=(...t)=>{if(t.length===2){const[n,r]=t;return o(n).divide(r)}const u=F(t),e=u.shift();return u.length?l(u,e,(n,r)=>o(n).divide(r)):e},U=(t,u,e)=>u<=1?[t||0]:t?o(t,e).distribute(u).map(r=>E(r,e)):new Array(u).fill(0),Y=b({name:"CalculatePrecision",setup(){const t=O({addOptions:["1","0.2","0.1","1.1"],subtractOptions:["1","0.2","0.1","1.1"],multiplyOptions:["1","0.2","0.1","1.1"],divideOptions:["1","0.2","0.1","1.1"],distributeValue:12,distributeOutputValue:[],distributeLength:3}),u={addOptions:V,subtractOptions:y,multiplyOptions:v,divideOptions:A},e=(r,p)=>{const d=u[p],c=d(...r);return"结果: "+E(c)},n=()=>{D().then(()=>{t.distributeOutputValue=U(t.distributeValue,t.distributeLength)})};return n(),{...B(t),copilotFunc:e,updateDistributeValue:n}},render(){return i(C,null,{default:()=>[i("h2",{style:"margin: 0 0 20px 0"},[f("计算方法，默认都保留两位小数与四舍五入，可以根据 format 方法自行转换")]),i("h3",{style:"margin: 0 0 20px 0"},[f("示例方法都基于 currency.js 封装，利用其精度处理能力封装了常用的一些计算方法，解决精度问题。如果需要其他的方法请阅读官方文档 https://currency.js.org/#subtract")]),i(m,{vertical:!0},{default:()=>[i(s,{title:"加法"},{default:()=>i(a,{value:this.addOptions,"onUpdate:value":t=>this.addOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"addOptions")}},null),footer:()=>this.copilotFunc(this.addOptions,"addOptions")}),i(s,{title:"减法"},{default:()=>i(a,{value:this.subtractOptions,"onUpdate:value":t=>this.subtractOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"subtractOptions")}},null),footer:()=>this.copilotFunc(this.subtractOptions,"subtractOptions")}),i(s,{title:"乘法"},{default:()=>i(a,{value:this.multiplyOptions,"onUpdate:value":t=>this.multiplyOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"multiplyOptions")}},null),footer:()=>this.copilotFunc(this.multiplyOptions,"multiplyOptions")}),i(s,{title:"除法（非取模）"},{default:()=>i(a,{value:this.divideOptions,"onUpdate:value":t=>this.divideOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"divideOptions")}},null),footer:()=>this.copilotFunc(this.divideOptions,"divideOptions")}),i(s,{title:"平分一个值"},{default:()=>i(m,{wrapItem:!1},{default:()=>[i(h,{value:this.distributeValue,"onUpdate:value":t=>this.distributeValue=t,onUpdateValue:()=>{this.updateDistributeValue()}},null),i(h,{value:this.distributeLength,"onUpdate:value":t=>this.distributeLength=t,onUpdateValue:()=>{this.updateDistributeValue()}},null)]}),footer:()=>"结果: "+this.distributeOutputValue.join(", ")})]})]})}});export{Y as default};
