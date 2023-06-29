var w=Object.defineProperty;var x=(e,t,r)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var R=(e,t,r)=>(x(e,typeof t!="symbol"?t+"":t,r),r);import{a as b}from"./axios-760d4776.js";import{g as A,h as N,A as P}from"./index-d9edca07.js";import{x as E,U as V,f as H,p as _,P as j,B,X as K,A as O}from"./naive-ui-6aaba7d0.js";import{h as T,I as L,k as M,P as S,ad as a,e as d}from"./@vue-b109a2ec.js";import"./pinia-f785c1d8.js";import"./vue-demi-71ba0ef2.js";import"./lodash-es-92f3d5bd.js";import"./vue-i18n-5eb41bb0.js";import"./@intlify-deb68647.js";import"./dayjs-3e0825c6.js";import"./clipboard-9c798d85.js";import"./vue-router-b96fe403.js";import"./@vueuse-da6970f7.js";import"./screenfull-b3e6dc1f.js";import"./pinia-plugin-persistedstate-d93b4f94.js";import"./date-fns-6c225a00.js";import"./vueuc-7f8201e7.js";import"./evtd-b614532e.js";import"./seemly-dc6f1e91.js";import"./@css-render-555d5129.js";import"./vooks-5e400110.js";import"./vdirs-b0483831.js";import"./@juggle-41516555.js";import"./css-render-d3958e6a.js";import"./@emotion-8a8e73f6.js";import"./treemate-25c27bff.js";import"./date-fns-tz-39604516.js";import"./async-validator-dee29e8b.js";const U={baseURL:"",withCredentials:!1,timeout:5*1e3,headers:{"Content-Type":"application/json"}};class X{constructor(){R(this,"pendingRequest");this.pendingRequest=new Map}generateRequestKey(t){const{method:r,url:s}=t;return[s||"",r||"",JSON.stringify(t.params),JSON.stringify(t.data)].join("&")}addPendingRequest(t){var s;const r=this.generateRequestKey(t);if(this.pendingRequest.has(r))t.signal=(s=this.pendingRequest.get(r))==null?void 0:s.signal;else{const u=new AbortController;t.signal=u.signal,this.pendingRequest.set(r,u)}}removePendingRequest(t){const r=this.generateRequestKey(t);this.pendingRequest.has(r)&&(this.pendingRequest.get(r).abort(),this.pendingRequest.delete(r))}}const h={requestInstance:null,responseInstance:null},y={implementRequestInterceptorArray:[],implementResponseInterceptorArray:[]},c={implementRequestInterceptorErrorArray:[],implementResponseInterceptorErrorArray:[]},m=new X,I=()=>{const e=(n,o)=>{o==="requestInstance"?h.requestInstance=n:h.responseInstance=n},t=n=>h[n],r=(n,o,i)=>{i==="ok"?y[n]=o:c[n]=o},s=(n,o)=>o==="ok"?y[n]:c[n],u=(n,...o)=>{Array.isArray(n)&&(n==null||n.forEach(i=>{typeof i=="function"&&i(...o)}))};return{createAxiosInstance:e,setImplement:r,getImplement:s,getAxiosInstance:t,beforeFetch:(n,o,i)=>{const l=i==="ok"?y[o]:c[o],p=t(n),{MODE:v}=A();p&&u(l,p,v)},fetchError:(n,o,i)=>{const l=c[i],{MODE:p}=A();u(l,o,p)}}},{setImplement:C}=I(),$=(e,t)=>{m.removePendingRequest(e.config)},J=(e,t)=>{},Y=()=>{C("implementResponseInterceptorArray",[$],"ok")},z=()=>{C("implementResponseInterceptorErrorArray",[J],"error")},G=(e,t)=>{if(e){const r=e.headers;t.forEach(s=>{r[s.key]=s.value})}},{setImplement:f}=I(),Q=(e,t)=>{const r=N(P.token);return e.url,{key:"X-TOKEN",value:r}},W=(e,t)=>{G(e,[Q(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},Z=(e,t)=>{m.removePendingRequest(e),m.addPendingRequest(e)},ee=(e,t)=>{},te=()=>{f("implementRequestInterceptorArray",[W,Z],"ok")},re=()=>{f("implementRequestInterceptorErrorArray",[ee],"error")},q=b.create(U),{createAxiosInstance:F,beforeFetch:D,fetchError:k}=I();q.interceptors.request.use(e=>(F(e,"requestInstance"),te(),D("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(re(),k("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));q.interceptors.response.use(e=>{F(e,"responseInstance"),Y(),D("responseInstance","implementResponseInterceptorArray","ok");const{data:t}=e;return Promise.resolve(t)},e=>(z(),k("responseError",e,"implementResponseInterceptorErrorArray"),m.removePendingRequest(e.config||{}),Promise.reject(e)));const g=async e=>q({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`}),He=T({name:"RAxios",setup(){const e=L({weatherData:[],inputCityValue:""}),t=[{title:"空气指数",key:"air"},{title:"风速",key:"win_meter"},{title:"能见度",key:"visibility"},{title:"天气情况",key:"wea_day"},{title:"提示",key:"air_tips"}],r=async s=>{try{const u=await g(s);e.weatherData=u.data}catch{window.$message.error("请求已被取消")}};return M(async()=>{const s=await g("成都");e.weatherData=s.data}),{...S(e),columns:t,handleInputCityValue:r}},render(){return a(O,null,{default:()=>[a(E,{bordered:!0},{default:()=>[a(V,{title:"请求函数"},{default:()=>[d("基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题"),a("p",null,[d("打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")])]})]}),a(E,{bordered:!0},{default:()=>[a(H,{class:"axios-header__btn",align:"center"},{default:()=>[a(_,{value:this.inputCityValue,"onUpdate:value":e=>this.inputCityValue=e,onInput:this.handleInputCityValue.bind(this),placeholder:"请输入城市"},null),a(j,{onClick:this.handleInputCityValue.bind(this,"")},{default:()=>[d("搜索")]})]})]}),a(B,null,{default:()=>[a(K,{data:this.weatherData,columns:this.columns},null)]})]})}});export{He as default};
