var A=Object.defineProperty;var F=(e,t,s)=>t in e?A(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var I=(e,t,s)=>(F(e,typeof t!="symbol"?t+"":t,s),s);import{a as C}from"./axios-760d4776.js";import{x as q,U as x,f,p as D,P as w,B as E,X as b,A as v}from"./naive-ui-6a867b5b.js";import{h as N,H as P,k,O as V,ad as u,e as c}from"./@vue-5ea710d1.js";import"./date-fns-43132c58.js";import"./vueuc-ab337559.js";import"./evtd-b614532e.js";import"./seemly-dc6f1e91.js";import"./@css-render-3e4116d4.js";import"./vooks-30ff42a2.js";import"./vdirs-b0483831.js";import"./@juggle-41516555.js";import"./css-render-d3958e6a.js";import"./@emotion-8a8e73f6.js";import"./lodash-es-de060e62.js";import"./treemate-25c27bff.js";import"./date-fns-tz-9041c6f6.js";import"./async-validator-dee29e8b.js";const j={baseURL:"",withCredentials:!1,timeout:5*1e3,headers:{"Content-Type":"application/json"}};class B{constructor(){I(this,"pendingRequest");this.pendingRequest=new Map}generateRequestKey(t){const{method:s,url:a}=t;return[a||"",s||"",JSON.stringify(t.params),JSON.stringify(t.data)].join("&")}addPendingRequest(t){const s=this.generateRequestKey(t);if(this.pendingRequest.has(s))t.signal=this.pendingRequest.get(s).signal;else{const a=new AbortController;t.signal=a.signal,this.pendingRequest.set(s,a)}}removePendingRequest(t){const s=this.generateRequestKey(t);this.pendingRequest.has(s)&&(this.pendingRequest.get(s).abort(),this.pendingRequest.delete(s))}}const p={requestInstance:null,responseInstance:null},l={implementRequestInterceptorArray:[],implementResponseInterceptorArray:[]},o=new B,m=()=>{const e=n=>n==="requestInstance"?"implementRequestInterceptorArray":"implementResponseInterceptorArray";return{createRequestAxiosInstance:n=>{p.requestInstance=n},createResponseAxiosInstance:n=>{p.responseInstance=n},beforeAxiosFetch:n=>{const r=l[e(n)];r==null||r.forEach(h=>{typeof h=="function"&&h()})},setImplementQueue:(n,r)=>{n&&r&&(l[e(r)]=n)},getImplementQueue:n=>l[e(n)],getAxiosFetchInstance:n=>p[n]}},K=(e,t)=>{const s=e.headers;t.forEach(a=>{s[a.key]=a.value})},{getAxiosFetchInstance:R,setImplementQueue:Q}=m(),O=()=>{const e=R("requestInstance");K(e,[{key:"X-TOKEN",value:"token"}])},_=()=>{const e=R("requestInstance");o.removePendingRequest(e),o.addPendingRequest(e)},H=()=>{Q([O,_],"requestInstance")},{getAxiosFetchInstance:T,setImplementQueue:L}=m(),S=()=>{const e=T("responseInstance");o.removePendingRequest(e.config)},$=()=>{L([S],"responseInstance")},d=C.create(j),{createRequestAxiosInstance:U,createResponseAxiosInstance:X,beforeAxiosFetch:g}=m();d.interceptors.request.use(e=>(U(e),H(),g("requestInstance"),e),e=>Promise.reject(e));d.interceptors.response.use(e=>{X(e),$(),g("responseInstance");const{data:t}=e;return Promise.resolve(t)},e=>(o.removePendingRequest(e.config||{}),Promise.reject(e)));const y=async e=>d({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`}),de=N({name:"RAxios",setup(){const e=P({weatherData:[],inputCityValue:""}),t=[{title:"空气指数",key:"air"},{title:"风速",key:"win_meter"},{title:"能见度",key:"visibility"},{title:"天气情况",key:"wea_day"},{title:"提示",key:"air_tips"}],s=async a=>{try{const i=await y(a);e.weatherData=i.data}catch{window.$message.error("请求已被取消")}};return k(async()=>{const a=await y("成都");e.weatherData=a.data}),{...V(e),columns:t,handleInputCityValue:s}},render(){return u(v,null,{default:()=>[u(q,{bordered:!0},{default:()=>[u(x,{title:"请求函数"},{default:()=>[c("基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题"),u("p",null,[c("打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")])]})]}),u(q,{bordered:!0},{default:()=>[u(f,{class:"axios-header__btn",align:"center"},{default:()=>[u(D,{value:this.inputCityValue,"onUpdate:value":e=>this.inputCityValue=e,onInput:this.handleInputCityValue.bind(this),placeholder:"请输入城市"},null),u(w,{onClick:this.handleInputCityValue.bind(this,"")},{default:()=>[c("搜索")]})]})]}),u(E,null,{default:()=>[u(b,{data:this.weatherData,columns:this.columns},null)]})]})}});export{de as default};
