import{y as a,z as c}from"./hooks-abDb_7tG.js";import"./dayjs@1.11.10-BYZwCyGy.js";import"./print-js@1.6.0-C3lAJnMa.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./awesome-qr@2.1.5-rc.0-Ds7AaOTE.js";import"./vue-hooks-plus@1.8.8_vue@3.4.21-C_BRgauB.js";import"./lodash@4.17.21-CM7ROh5r.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DuGDi0R7.js";import"./lodash-es@4.17.21-C8H4BJij.js";import"./@vueuse_core@10.9.0_vue@3.4.21--QrNzsXE.js";import"./@vueuse_shared@10.9.0_vue@3.4.21-7aSumFzu.js";import"./utils-BHY8vmkp.js";import"./interactjs@1.10.26-DmsZVOf4.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-CaeIWam-.js";import"./echarts@5.5.0-BEyY33Zi.js";import"./zrender@5.5.0-JN1hODMT.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vue_runtime-core@3.4.21-DW3iHaBZ.js";import"./@vue_reactivity@3.4.21-8_tu8c_o.js";import"./@vue_shared@3.4.21-DCcVmNGw.js";import"./canvas@2.11.2-CVRTzJty.js";import"./js-binary-schema-parser@2.0.3-D0akQrQ7.js";const J=Vue.defineComponent({name:"REchart",setup(){const[u,{getChartInstance:n,dispose:i,render:r,isDispose:o}]=c(),[t,{getChartInstance:v,dispose:h,render:p,isDispose:V}]=c(),m=Vue.ref(!1),d=Vue.ref(!1),l=Vue.reactive({loading:!1}),g={legend:{},tooltip:{},xAxis:{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},yAxis:{type:"value"},series:[{name:"日期",data:[120,200,150,80,70,110,130],type:"bar",showBackground:!0,backgroundStyle:{color:"rgba(180, 180, 180, 0.2)"}},{name:"数量",data:[12,220,250,180,20,10,190],type:"bar",showBackground:!0,backgroundStyle:{color:"rgba(180, 180, 180, 0.2)"}}]},N={title:{text:"Referer of a Website",subtext:"Fake Data",left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},series:[{name:"Access From",type:"pie",radius:"50%",data:[{value:1048,name:"Search Engine"},{value:735,name:"Direct"},{value:580,name:"Email"},{value:484,name:"Union Ads"},{value:300,name:"Video Ads"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},s=Vue.ref({tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{data:["Email","Union Ads","Video Ads","Direct","Search Engine"]},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}],yAxis:[{type:"value"}],series:[{name:"Email",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[120,132,101,134,90,230,210]},{name:"Union Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[220,182,191,234,290,330,310]},{name:"Video Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[150,232,201,154,190,330,410]},{name:"Direct",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[320,332,301,334,390,330,320]},{name:"Search Engine",type:"line",stack:"Total",label:{show:!0,position:"top"},areaStyle:{},emphasis:{focus:"series"},data:[820,932,901,934,1290,1330,1320]}]}),f=e=>{l.loading=e},C=e=>{d.value=e},E=()=>{o()?r():window.$message.warning("不可以重复渲染图表~")},A=()=>{i()},F=()=>{const e=()=>Math.floor((Math.random()+1)*100);s.value.series[0].data=new Array(7).fill(0).map(()=>e()),s.value.series[1].data=new Array(7).fill(0).map(()=>e())};return{baseOptions:g,chartLoading:m,handleLoadingShow:f,chartAria:d,handleAriaShow:C,basePieOptions:N,baseLineOptions:s,...Vue.toRefs(l),mountChart:E,unmountChart:A,updateChartOptions:F,register:u,register2:t,dispose2:h,render2:p,isDispose2:V}},render(){const{register:u,register2:n,dispose2:i,render2:r,isDispose2:o}=this;return Vue.createVNode("div",{class:"echart"},[Vue.createVNode(naive.NCard,{title:"chart 组件"},{default:()=>[Vue.createVNode("h3",null,[Vue.createTextVNode("该组件基于 ECharts, Vueuse 封装。默认做了最佳的优化封装实践。")]),Vue.createVNode("h3",null,[Vue.createTextVNode("开箱即用的优化策略：节流更新图表、异步渲染、自动销毁、贴花、加载、主题、视窗区域渲染、自动更新尺寸等高级特性。")])]}),Vue.createVNode(naive.NCard,{title:"预设 card 风格图表"},{default:()=>[Vue.createVNode(naive.NFlex,{style:["padding: 18px 0"]},{default:()=>[Vue.createVNode(naive.NButton,{onClick:this.mountChart.bind(this)},{default:()=>[Vue.createTextVNode("渲染")]}),Vue.createVNode(naive.NButton,{onClick:this.unmountChart.bind(this)},{default:()=>[Vue.createTextVNode("卸载")]}),Vue.createVNode(naive.NButton,{onClick:this.updateChartOptions.bind(this)},{default:()=>[Vue.createTextVNode("更新配置项")]})]}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(a,{onRegister:u,title:"周销售量",autoChangeTheme:!0,options:this.baseLineOptions,showAria:this.chartAria,preset:"card"},null)])]}),Vue.createVNode(naive.NCard,{title:"不跟随主题切换的暗色主题可视化图，并且手动指定原始主题色"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NButton,{onClick:()=>{o()?r():window.$message.warning("不可以重复渲染图表~")}},{default:()=>[Vue.createTextVNode("渲染")]}),Vue.createVNode(naive.NButton,{onClick:i.bind(this)},{default:()=>[Vue.createTextVNode("卸载")]})]}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(a,{onRegister:n,autoChangeTheme:!1,theme:"default",options:this.baseOptions},null)])]})]}),Vue.createVNode(naive.NCard,{title:"加载动画"},{default:()=>[Vue.createVNode(naive.NSwitch,{value:this.chartLoading,"onUpdate:value":t=>this.chartLoading=t,onUpdateValue:this.handleLoadingShow.bind(this),style:["padding: 18px 0"]},{checked:()=>"隐藏加载动画",unchecked:()=>"显示加载动画"}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(a,{loading:this.loading,options:this.baseOptions},null)])]}),Vue.createVNode(naive.NCard,{title:"贴画可视化图"},{default:()=>[Vue.createVNode(naive.NSwitch,{value:this.chartAria,"onUpdate:value":t=>this.chartAria=t,onUpdateValue:this.handleAriaShow.bind(this),style:["padding: 18px 0"]},{checked:()=>"隐藏贴花",unchecked:()=>"显示贴花"}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(a,{options:this.baseOptions,showAria:this.chartAria},null)])]})])}});export{J as default};