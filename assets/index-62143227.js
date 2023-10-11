import{a as u}from"./vue-hooks-plus@1.8.2_vue@3.3.4-df6d3964.js";import"./lodash@4.17.21-e6f077ad.js";import{s as o}from"./instance-32c3dba4.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./index-eb51c16b.js";import"./lodash-es@4.17.21-a64fa61b.js";import"./@vueuse_core@9.13.0_vue@3.3.4-7e6f7ed6.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-b2a32b41.js";import"./dayjs@1.11.9-6a1565a1.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";function D(e,t){return u(()=>o(e),Object.assign({},t))}const F=e=>o({url:`https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${e}`,method:"get"}),l=()=>o({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get"}),H=Vue.defineComponent({name:"RAxios",setup(){const e=Vue.reactive({weatherData:[],inputCityValue:null,throttleDemoInputValue:null,debounceDemoInputValue:null,weatherDemoInputValue:null}),{data:t,loading:a,run:r}=u(l,{throttleWait:1e3,manual:!0}),{data:n,loading:d,run:V}=u(l,{debounceWait:1e3,manual:!0}),{data:i,loading:c,run:s}=u(F,{throttleWait:1e3,manual:!0}),{data:m,loading:N,run:p}=D({url:"https://jsonplaceholder.typicode.com/todos/1",method:"get",cancelConfig:{needCancel:!0}},{manual:!0});return{...Vue.toRefs(e),throttleDemoValue:t,throttleDemoLoading:a,throttleDemoRun:r,debounceDemoValue:n,debounceDemoLoading:d,debounceDemoRun:V,weatherDemoValue:i,weatherDemoLoading:c,weatherDemoRun:s,demoData:m,demoLoading:N,demoRun:p}},render(){return Vue.createVNode(naive.NLayout,null,{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode("h1",null,[Vue.createTextVNode("请求")]),Vue.createVNode(naive.NCard,null,{default:()=>[Vue.createVNode("h2",null,[Vue.createTextVNode("useRequest")]),Vue.createVNode("p",null,[Vue.createTextVNode("支持配置化请求数据")]),Vue.createVNode("h2",null,[Vue.createTextVNode("useHookPlusRequest")]),Vue.createVNode("p",null,[Vue.createTextVNode("支持包裹一个拥有 promise 状态的异步函数，可以用来包裹一个 axios 请求返回值方法")])]}),Vue.createVNode("h1",null,[Vue.createTextVNode("使用 useRequest 获取")]),Vue.createVNode(naive.NCard,{title:"请求函数"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("1.基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题")]),Vue.createVNode("h3",null,[Vue.createTextVNode("2.打开控制台 => 网络 => 使用低速3g网络 => 查看控制台被取消的请求")]),Vue.createVNode("h3",null,[Vue.createTextVNode("3.详情请查看文档")])]}),Vue.createVNode(naive.NCard,{title:"useRequest示例（手动触发）"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>{var e;return[Vue.createVNode(naive.NButton,{onClick:this.demoRun.bind(this)},{default:()=>[Vue.createTextVNode("获取数据")]}),Vue.createVNode("h3",null,[Vue.createTextVNode("结果: "),this.demoLoading?"获取中...":(e=this.demoData)==null?void 0:e.title])]}})]}),Vue.createVNode("h1",null,[Vue.createTextVNode("使用 useHookPlusRequest 获取")]),Vue.createVNode(naive.NCard,{title:"节流"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.throttleDemoInputValue,"onUpdate:value":e=>this.throttleDemoInputValue=e,onUpdateValue:()=>{this.throttleDemoRun()}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("不论触发多少次，一秒钟之内仅会触发一次")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.throttleDemoLoading?"获取中...":"获取成功!!!"])]})]}),Vue.createVNode(naive.NCard,{title:"防抖"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.debounceDemoInputValue,"onUpdate:value":e=>this.debounceDemoInputValue=e,onUpdateValue:()=>{this.debounceDemoRun()}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("一秒后才会执行，如果中途重新请求，则会重新计时")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.debounceDemoLoading?"获取中...":"获取成功!!!"])]})]}),Vue.createVNode(naive.NCard,{title:"获取气候"},{default:()=>[Vue.createVNode(naive.NSpace,{vertical:!0},{default:()=>[Vue.createVNode(naive.NInput,{value:this.weatherDemoInputValue,"onUpdate:value":e=>this.weatherDemoInputValue=e,onUpdateValue:e=>{this.weatherDemoRun(e)}},null),Vue.createVNode("h3",null,[Vue.createTextVNode("该示例演示了如何根据动态值获取数据")]),Vue.createVNode("h3",null,[Vue.createTextVNode("当前状态: "),this.weatherDemoLoading?"获取中...":"获取成功!!!"])]})]})]})]})}});export{H as default};
