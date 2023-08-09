import{u as i}from"./vue-hooks-plus@1.7.6_vue@3.3.4-1baf6b87.js";import"./lodash@4.17.21-2cee12c8.js";import{a as y}from"./axios@1.2.0-413e2d92.js";import{g as c,h as m,i as b,A as k}from"./index-5408ceb5.js";import{k as x,b as u,p as t}from"./@vue_runtime-core@3.3.4-073fad6e.js";import{h as w,v as P}from"./@vue_reactivity@3.3.4-2b3a1c4e.js";import{g as s,V as n,P as L,r as p,D as N}from"./naive-ui@2.34.4_vue@3.3.4-2bead240.js";import"./@babel_runtime@7.22.6-960cbc2f.js";import"./form-data@4.0.0-19dc8c5e.js";import"./vue-router@4.2.4_vue@3.3.4-e93fe26b.js";import"./lodash-es@4.17.21-b7de4195.js";import"./vue-i18n@9.2.2_vue@3.3.4-a7a92bd0.js";import"./@intlify_shared@9.2.2-e4047ebf.js";import"./@intlify_core-base@9.2.2-a0a8715c.js";import"./@intlify_message-compiler@9.2.2-8a818441.js";import"./@intlify_devtools-if@9.2.2-c61c979f.js";import"./dayjs@1.11.7-adc18375.js";import"./pinia@2.1.4_typescript@5.0.2_vue@3.3.4-ab93b4ec.js";import"./vue-demi@0.14.5_vue@3.3.4-71ba0ef2.js";import"./@vue_runtime-dom@3.3.4-d86573ec.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.1.0_vue@3.3.4-3ed9a412.js";import"./@vueuse_shared@9.1.0_vue@3.3.4-e5bccb39.js";import"./pinia-plugin-persistedstate@3.1.0_pinia@2.1.4-4f3b1591.js";import"./clipboard@2.0.11-6193b289.js";import"./date-fns@2.30.0-0bf1b710.js";import"./vueuc@0.4.51_vue@3.3.4-6588b5bd.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-24369cc5.js";import"./vooks@0.2.12_vue@3.3.4-59877c34.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-7cff6900.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";const j={baseURL:"",withCredentials:!1,timeout:5*1e3,headers:{"Content-Type":"application/json"}},{setImplement:D}=c(),H=(e,o)=>{m.removePendingRequest(e.config)},U=(e,o)=>{},T=()=>{D("implementResponseInterceptorArray",[H],"ok")},O=()=>{D("implementResponseInterceptorErrorArray",[U],"error")},W=(e,o)=>{if(e){const r=e.headers;o.forEach(a=>{r[a.key]=a.value})}},{setImplement:F}=c(),K=(e,o)=>{const r=b(k.token);return e.url,{key:"X-TOKEN",value:r}},S=(e,o)=>{W(e,[K(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},_=(e,o)=>{m.removePendingRequest(e),m.addPendingRequest(e)},$=(e,o)=>{},X=()=>{F("implementRequestInterceptorArray",[S,_],"ok")},Y=()=>{F("implementRequestInterceptorErrorArray",[$],"error")},l=y.create(j),{createAxiosInstance:E,beforeFetch:C,fetchError:A}=c();l.interceptors.request.use(e=>(E(e,"requestInstance"),X(),C("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(Y(),A("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));l.interceptors.response.use(e=>{E(e,"responseInstance"),T(),C("responseInstance","implementResponseInterceptorArray","ok");const{data:o}=e;return Promise.resolve(o)},e=>(O(),A("responseError",e,"implementResponseInterceptorErrorArray"),m.removePendingRequest(e.config||{}),Promise.reject(e)));function z(e,o){return i(()=>l(e),Object.assign({},o))}const G=e=>l({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`,method:"get"}),h=()=>l({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get"}),je=x({name:"RAxios",setup(){const e=w({weatherData:[],inputCityValue:null,throttleDemoInputValue:null,debounceDemoInputValue:null,weatherDemoInputValue:null}),{data:o,loading:r,run:a}=i(h,{throttleWait:1e3,manual:!0}),{data:d,loading:R,run:B}=i(h,{debounceWait:1e3,manual:!0}),{data:f,loading:I,run:g}=i(G,{throttleWait:1e3,manual:!0}),{data:q,loading:v,run:V}=z({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get",cancelConfig:{needCancel:!0}},{manual:!0});return{...P(e),throttleDemoValue:o,throttleDemoLoading:r,throttleDemoRun:a,debounceDemoValue:d,debounceDemoLoading:R,debounceDemoRun:B,weatherDemoValue:f,weatherDemoLoading:I,weatherDemoRun:g,demoData:q,demoLoading:v,demoRun:V}},render(){return u(N,null,{default:()=>[u(s,{vertical:!0},{default:()=>[u("h1",null,[t("请求")]),u(n,null,{default:()=>[u("h2",null,[t("useRequest")]),u("p",null,[t("支持配置化请求数据")]),u("h2",null,[t("useHookPlusRequest")]),u("p",null,[t("支持包裹一个拥有 promise 状态的异步函数，可以用来包裹一个 axios 请求返回值方法")])]}),u("h1",null,[t("使用 useRequest 获取")]),u(n,{title:"请求函数"},{default:()=>[u("h3",null,[t("1.基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题")]),u("h3",null,[t("2.打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")]),u("h3",null,[t("3.详情请查看文档")])]}),u(n,{title:"useRequest示例（手动触发）"},{default:()=>[u(s,{vertical:!0},{default:()=>{var e;return[u(L,{onClick:this.demoRun.bind(this)},{default:()=>[t("获取数据")]}),u("h3",null,[t("结果: "),this.demoLoading?"获取中...":(e=this.demoData)==null?void 0:e.title])]}})]}),u("h1",null,[t("使用 useHookPlusRequest 获取")]),u(n,{title:"节流"},{default:()=>[u(s,{vertical:!0},{default:()=>[u(p,{value:this.throttleDemoInputValue,"onUpdate:value":e=>this.throttleDemoInputValue=e,onUpdateValue:()=>{this.throttleDemoRun()}},null),u("h3",null,[t("不论触发多少次，一秒钟之内仅会触发一次")]),u("h3",null,[t("当前状态: "),this.throttleDemoLoading?"获取中...":"获取成功!!!"])]})]}),u(n,{title:"防抖"},{default:()=>[u(s,{vertical:!0},{default:()=>[u(p,{value:this.debounceDemoInputValue,"onUpdate:value":e=>this.debounceDemoInputValue=e,onUpdateValue:()=>{this.debounceDemoRun()}},null),u("h3",null,[t("一秒后才会执行，如果中途重新请求，则会重新计时")]),u("h3",null,[t("当前状态: "),this.debounceDemoLoading?"获取中...":"获取成功!!!"])]})]}),u(n,{title:"获取气候"},{default:()=>[u(s,{vertical:!0},{default:()=>[u(p,{value:this.weatherDemoInputValue,"onUpdate:value":e=>this.weatherDemoInputValue=e,onUpdateValue:e=>{this.weatherDemoRun(e)}},null),u("h3",null,[t("该示例演示了如何根据动态值获取数据")]),u("h3",null,[t("当前状态: "),this.weatherDemoLoading?"获取中...":"获取成功!!!"])]})]})]})]})}});export{je as default};
