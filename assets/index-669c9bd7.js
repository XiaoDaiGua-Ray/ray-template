import{u}from"./vue-hooks-plus@1.8.2_vue@3.3.4-91a549ba.js";import"./lodash@4.17.21-2c729a72.js";import{s as a}from"./instance-f9d48c04.js";import"./awesome-qr@2.1.5-rc.0-423f5ed7.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./index-f0e321ba.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./screenfull@6.0.2-b3e6dc1f.js";import"./@vueuse_core@9.13.0_vue@3.3.4-7e6f7ed6.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-b2a32b41.js";import"./dayjs@1.11.9-208bf754.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-3371ee7a.js";function h(e,t){return u(()=>a(e),Object.assign({},t))}const m=e=>a({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`,method:"get"}),l=()=>a({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get"}),L=Vue.defineComponent({name:"RAxios",setup(){const e=Vue.reactive({weatherData:[],inputCityValue:null,throttleDemoInputValue:null,debounceDemoInputValue:null,weatherDemoInputValue:null}),{data:t,loading:o,run:r}=u(l,{throttleWait:1e3,manual:!0}),{data:n,loading:d,run:V}=u(l,{debounceWait:1e3,manual:!0}),{data:c,loading:i,run:s}=u(m,{throttleWait:1e3,manual:!0}),{data:N,loading:D,run:F}=h({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get",cancelConfig:{needCancel:!0}},{manual:!0});return{...Vue.toRefs(e),throttleDemoValue:t,throttleDemoLoading:o,throttleDemoRun:r,debounceDemoValue:n,debounceDemoLoading:d,debounceDemoRun:V,weatherDemoValue:c,weatherDemoLoading:i,weatherDemoRun:s,demoData:N,demoLoading:D,demoRun:F}},render(){return Vue.createVNode(naive.NLayout,null,{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode("h1",null,[Vue.createTextVNode("请求")]),Vue.createVNode(naive.NCard,null,{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("useRequest")]),Vue.createVNode("p",null,[Vue.createTextVNode("支持配置化请求数据")]),Vue.createVNode("h2",null,[Vue.createTextVNode("useHookPlusRequest")]),Vue.createVNode("p",null,[Vue.createTextVNode("支持包裹一个拥有 promise 状态的异步函数，可以用来包裹一个 axios 请求返回值方法")])]}),Vue.createVNode("h1",null,[Vue.createTextVNode("使用 useRequest 获取")]),Vue.createVNode(naive.NCard,{title:"请求函数"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("1.基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题")]),Vue.createVNode("h3",null,[Vue.createTextVNode("2.打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")]),Vue.createVNode("h3",null,[Vue.createTextVNode("3.详情请查看文档")])]}),Vue.createVNode(naive.NCard,{title:"useRequest示例（手动触发）"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>{var e;return[Vue.createVNode(naive.NButton,{onClick:this.demoRun.bind(this)},{default:()=>[Vue.createTextVNode("获取数据")]}),Vue.createVNode("h3",null,[Vue.createTextVNode("结果: "),this.demoLoading?"获取中...":(e=this.demoData)==null?void 0:e.title])]}})]}),Vue.createVNode("h1",null,[Vue.createTextVNode("使用 useHookPlusRequest 获取")]),Vue.createVNode(naive.NCard,{title:"节流"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.throttleDemoInputValue,"onUpdate:value":e=>this.throttleDemoInputValue=e,onUpdateValue:()=>{this.throttleDemoRun()}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("不论触发多少次，一秒钟之内仅会触发一次")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.throttleDemoLoading?"获取中...":"获取成功!!!"])]})]}),Vue.createVNode(naive.NCard,{title:"防抖"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.debounceDemoInputValue,"onUpdate:value":e=>this.debounceDemoInputValue=e,onUpdateValue:()=>{this.debounceDemoRun()}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("一秒后才会执行，如果中途重新请求，则会重新计时")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.debounceDemoLoading?"获取中...":"获取成功!!!"])]})]}),Vue.createVNode(naive.NCard,{title:"获取气候"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.weatherDemoInputValue,"onUpdate:value":e=>this.weatherDemoInputValue=e,onUpdateValue:e=>{this.weatherDemoRun(e)}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("该示例演示了如何根据动态值获取数据")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.weatherDemoLoading?"获取中...":"获取成功!!!"])]})]})]})]})}});export{L as default};
