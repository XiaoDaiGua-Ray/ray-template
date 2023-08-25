import{u as a}from"./vue-hooks-plus@1.7.6_vue@3.3.4-1baf6b87.js";import"./lodash@4.17.21-2cee12c8.js";import{s as i}from"./instance-89b60589.js";import{k as A,b as u,p as t}from"./@vue_runtime-core@3.3.4-073fad6e.js";import{h as g,v as V}from"./@vue_reactivity@3.3.4-2b3a1c4e.js";import{g as l,V as o,P as v,r,D as R}from"./naive-ui@2.34.4_vue@3.3.4-eacf875e.js";import"./@babel_runtime@7.22.6-960cbc2f.js";import"./axios@1.2.0-413e2d92.js";import"./form-data@4.0.0-19dc8c5e.js";import"./index-a3ee3b77.js";import"./vue-router@4.2.4_vue@3.3.4-e93fe26b.js";import"./lodash-es@4.17.21-b7de4195.js";import"./vue-i18n@9.2.2_vue@3.3.4-a7a92bd0.js";import"./@intlify_shared@9.2.2-e4047ebf.js";import"./@intlify_core-base@9.2.2-a0a8715c.js";import"./@intlify_message-compiler@9.2.2-8a818441.js";import"./@intlify_devtools-if@9.2.2-c61c979f.js";import"./dayjs@1.11.7-adc18375.js";import"./pinia@2.1.4_typescript@5.0.2_vue@3.3.4-ab93b4ec.js";import"./vue-demi@0.14.5_vue@3.3.4-71ba0ef2.js";import"./@vue_runtime-dom@3.3.4-d86573ec.js";import"./@vue_shared@3.3.4-896c5ecf.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.1.0_vue@3.3.4-3ed9a412.js";import"./@vueuse_shared@9.1.0_vue@3.3.4-e5bccb39.js";import"./pinia-plugin-persistedstate@3.1.0_pinia@2.1.4-4f3b1591.js";import"./clipboard@2.0.11-6193b289.js";import"./date-fns@2.30.0-0bf1b710.js";import"./vueuc@0.4.51_vue@3.3.4-6588b5bd.js";import"./evtd@0.2.4-b614532e.js";import"./seemly@0.3.6-dc6f1e91.js";import"./@css-render_vue3-ssr@0.15.12_vue@3.3.4-24369cc5.js";import"./vooks@0.2.12_vue@3.3.4-59877c34.js";import"./vdirs@0.1.8_vue@3.3.4-4519c5fd.js";import"./@juggle_resize-observer@3.4.0-41516555.js";import"./css-render@0.15.12-57b1a53f.js";import"./@emotion_hash@0.8.0-8a8e73f6.js";import"./treemate@0.3.11-25c27bff.js";import"./date-fns-tz@1.3.8_date-fns@2.30.0-7cff6900.js";import"./async-validator@4.2.5-dee29e8b.js";import"./@css-render_plugin-bem@0.15.12_css-render@0.15.12-9dde7ffe.js";function b(e,n){return a(()=>i(e),Object.assign({},n))}const w=e=>i({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`,method:"get"}),d=()=>i({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get"}),hu=A({name:"RAxios",setup(){const e=g({weatherData:[],inputCityValue:null,throttleDemoInputValue:null,debounceDemoInputValue:null,weatherDemoInputValue:null}),{data:n,loading:m,run:p}=a(d,{throttleWait:1e3,manual:!0}),{data:s,loading:D,run:F}=a(d,{debounceWait:1e3,manual:!0}),{data:h,loading:c,run:E}=a(w,{throttleWait:1e3,manual:!0}),{data:B,loading:C,run:f}=b({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get",cancelConfig:{needCancel:!0}},{manual:!0});return{...V(e),throttleDemoValue:n,throttleDemoLoading:m,throttleDemoRun:p,debounceDemoValue:s,debounceDemoLoading:D,debounceDemoRun:F,weatherDemoValue:h,weatherDemoLoading:c,weatherDemoRun:E,demoData:B,demoLoading:C,demoRun:f}},render(){return u(R,null,{default:()=>[u(l,{vertical:!0},{default:()=>[u("h1",null,[t("请求")]),u(o,null,{default:()=>[u("h2",null,[t("useRequest")]),u("p",null,[t("支持配置化请求数据")]),u("h2",null,[t("useHookPlusRequest")]),u("p",null,[t("支持包裹一个拥有 promise 状态的异步函数，可以用来包裹一个 axios 请求返回值方法")])]}),u("h1",null,[t("使用 useRequest 获取")]),u(o,{title:"请求函数"},{default:()=>[u("h3",null,[t("1.基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题")]),u("h3",null,[t("2.打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")]),u("h3",null,[t("3.详情请查看文档")])]}),u(o,{title:"useRequest示例（手动触发）"},{default:()=>[u(l,{vertical:!0},{default:()=>{var e;return[u(v,{onClick:this.demoRun.bind(this)},{default:()=>[t("获取数据")]}),u("h3",null,[t("结果: "),this.demoLoading?"获取中...":(e=this.demoData)==null?void 0:e.title])]}})]}),u("h1",null,[t("使用 useHookPlusRequest 获取")]),u(o,{title:"节流"},{default:()=>[u(l,{vertical:!0},{default:()=>[u(r,{value:this.throttleDemoInputValue,"onUpdate:value":e=>this.throttleDemoInputValue=e,onUpdateValue:()=>{this.throttleDemoRun()}},null),u("h3",null,[t("不论触发多少次，一秒钟之内仅会触发一次")]),u("h3",null,[t("当前状态: "),this.throttleDemoLoading?"获取中...":"获取成功!!!"])]})]}),u(o,{title:"防抖"},{default:()=>[u(l,{vertical:!0},{default:()=>[u(r,{value:this.debounceDemoInputValue,"onUpdate:value":e=>this.debounceDemoInputValue=e,onUpdateValue:()=>{this.debounceDemoRun()}},null),u("h3",null,[t("一秒后才会执行，如果中途重新请求，则会重新计时")]),u("h3",null,[t("当前状态: "),this.debounceDemoLoading?"获取中...":"获取成功!!!"])]})]}),u(o,{title:"获取气候"},{default:()=>[u(l,{vertical:!0},{default:()=>[u(r,{value:this.weatherDemoInputValue,"onUpdate:value":e=>this.weatherDemoInputValue=e,onUpdateValue:e=>{this.weatherDemoRun(e)}},null),u("h3",null,[t("该示例演示了如何根据动态值获取数据")]),u("h3",null,[t("当前状态: "),this.weatherDemoLoading?"获取中...":"获取成功!!!"])]})]})]})]})}});export{hu as default};