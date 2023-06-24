import{c as F}from"./lodash-es-92f3d5bd.js";import{c as s}from"./currency.js-57f74176.js";import{f as m,U as o,a1 as a,a2 as h,A as E}from"./naive-ui-0ce76152.js";import{h as O,I as C,P as B,ad as i,e as f,n as D}from"./@vue-eb7e5abd.js";import"./date-fns-6c225a00.js";import"./clipboard-9c798d85.js";import"./vueuc-04532b35.js";import"./evtd-b614532e.js";import"./seemly-dc6f1e91.js";import"./@css-render-0c635611.js";import"./vooks-25f0401a.js";import"./vdirs-b0483831.js";import"./@juggle-41516555.js";import"./css-render-d3958e6a.js";import"./@emotion-8a8e73f6.js";import"./treemate-25c27bff.js";import"./date-fns-tz-39604516.js";import"./async-validator-dee29e8b.js";const l=(t,u,e)=>t!=null&&t.length?t.length===1?s(t[0]):t.reduce((r,d,p,c)=>(r=e==null?void 0:e(r,d,p,c),r),u):0,b=(t,u,e="number")=>e==="number"?s(t,u).value:s(t,u).toString(),V=(...t)=>l(t,0,(u,e)=>s(u).add(e)),y=(...t)=>{if(t.length===2){const[n,r]=t;return s(n).subtract(r)}const u=F(t),e=u.shift();return u.length?l(u,e,(n,r)=>s(n).subtract(r)):e},v=(...t)=>l(t,1,(u,e)=>s(u).multiply(e)),U=(...t)=>{if(t.length===2){const[n,r]=t;return s(n).divide(r)}const u=F(t),e=u.shift();return u.length?l(u,e,(n,r)=>s(n).divide(r)):e},A=(t,u,e)=>u<=1?[t||0]:t?s(t,e).distribute(u).map(r=>b(r,e)):new Array(u).fill(0),K=O({name:"CalculatePrecision",setup(){const t=C({addOptions:["1","0.2","0.1","1.1"],subtractOptions:["1","0.2","0.1","1.1"],multiplyOptions:["1","0.2","0.1","1.1"],divideOptions:["1","0.2","0.1","1.1"],distributeValue:12,distributeOutputValue:[],distributeLength:3}),u={addOptions:V,subtractOptions:y,multiplyOptions:v,divideOptions:U},e=(r,d)=>{const p=u[d],c=p(...r);return"结果: "+b(c)},n=()=>{D().then(()=>{t.distributeOutputValue=A(t.distributeValue,t.distributeLength)})};return n(),{...B(t),copilotFunc:e,updateDistributeValue:n}},render(){return i(E,null,{default:()=>[i("h2",{style:"margin: 0 0 20px 0"},[f("计算方法，默认都保留两位小数与四舍五入，可以根据 format 方法自行转换")]),i("h3",{style:"margin: 0 0 20px 0"},[f("示例方法都基于 currency.js 封装，利用其精度处理能力封装了常用的一些计算方法，解决精度问题。如果需要其他的方法请阅读官方文档 https://currency.js.org/#subtract")]),i(m,{vertical:!0},{default:()=>[i(o,{title:"加法"},{default:()=>i(a,{value:this.addOptions,"onUpdate:value":t=>this.addOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"addOptions")}},null),footer:()=>this.copilotFunc(this.addOptions,"addOptions")}),i(o,{title:"减法"},{default:()=>i(a,{value:this.subtractOptions,"onUpdate:value":t=>this.subtractOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"subtractOptions")}},null),footer:()=>this.copilotFunc(this.subtractOptions,"subtractOptions")}),i(o,{title:"乘法"},{default:()=>i(a,{value:this.multiplyOptions,"onUpdate:value":t=>this.multiplyOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"multiplyOptions")}},null),footer:()=>this.copilotFunc(this.multiplyOptions,"multiplyOptions")}),i(o,{title:"除法（非取模）"},{default:()=>i(a,{value:this.divideOptions,"onUpdate:value":t=>this.divideOptions=t,onUpdateValue:t=>{this.copilotFunc(t,"divideOptions")}},null),footer:()=>this.copilotFunc(this.divideOptions,"divideOptions")}),i(o,{title:"平分一个值"},{default:()=>i(m,{wrapItem:!1},{default:()=>[i(h,{value:this.distributeValue,"onUpdate:value":t=>this.distributeValue=t,onUpdateValue:()=>{this.updateDistributeValue()}},null),i(h,{value:this.distributeLength,"onUpdate:value":t=>this.distributeLength=t,onUpdateValue:()=>{this.updateDistributeValue()}},null)]}),footer:()=>"结果: "+this.distributeOutputValue.join(", ")})]})]})}});export{K as default};