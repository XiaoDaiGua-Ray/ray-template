import{c as Re,t as je}from"./lodash-es@4.17.21-a64fa61b.js";import{e as _e,g as T,h as E,o as ze,i as Me,j as Pe}from"./index-eb51c16b.js";import{c as Ue}from"./@vueuse_core@9.13.0_vue@3.3.4-7e6f7ed6.js";import{u as S,r as He,i as Ze,a as Ie,b as qe,c as Ge,d as Xe,e as Je,f as Ke,g as Qe,h as Ye,j as et,k as tt,l as ot,m as at,n as rt,o as lt,p as it,q as ct,s as st}from"./echarts@5.4.3-e7579fe3.js";import{d as $}from"./dayjs@1.11.9-6a1565a1.js";import"./vue-hooks-plus@1.8.2_vue@3.3.4-df6d3964.js";import"./lodash@4.17.21-e6f077ad.js";import"./awesome-qr@2.1.5-rc.0-76c123e9.js";import"./canvas@2.11.2-f05bd587.js";import"./js-binary-schema-parser@2.0.3-9e47f7a8.js";import"./js-cookie@3.0.5-19aa770d.js";import"./screenfull@5.2.0-7567c894.js";import"./qs@6.11.2-83b75eda.js";import"./side-channel@1.0.4-36eac644.js";import"./get-intrinsic@1.2.1-c74897b4.js";import"./has-symbols@1.0.3-e8f3ca0e.js";import"./has-proto@1.0.1-f7d0b240.js";import"./function-bind@1.1.1-22e7ee79.js";import"./has@1.0.3-2d67dc68.js";import"./call-bind@1.0.2-c8357e2b.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.6-02097300.js";import"./clipboard@2.0.11-4ae3371d.js";import"./@vueuse_shared@9.13.0_vue@3.3.4-b2a32b41.js";import"./zrender@5.4.4-1ae8819b.js";import"./tslib@2.3.0-54e39b60.js";const W=["#fc97af","#87f7cf","#f7f494","#72ccff","#f7c5a0","#d4a4eb","#d2f5a6","#76f2f2"],B="rgba(41,52,65,1)",L={},O={textStyle:{color:"#ffffff"},subtextStyle:{color:"#dddddd"}},D={itemStyle:{borderWidth:"4"},lineStyle:{width:"3"},symbolSize:"0",symbol:"circle",smooth:!0},R={itemStyle:{borderWidth:"4"},lineStyle:{width:"3"},symbolSize:"0",symbol:"circle",smooth:!0},j={itemStyle:{barBorderWidth:0,barBorderColor:"#ccc"}},_={itemStyle:{borderWidth:0,borderColor:"#ccc"}},z={itemStyle:{borderWidth:0,borderColor:"#ccc"}},M={itemStyle:{borderWidth:0,borderColor:"#ccc"}},P={itemStyle:{borderWidth:0,borderColor:"#ccc"}},U={itemStyle:{borderWidth:0,borderColor:"#ccc"}},H={itemStyle:{borderWidth:0,borderColor:"#ccc"}},Z={itemStyle:{borderWidth:0,borderColor:"#ccc"}},I={itemStyle:{color:"#fc97af",color0:"transparent",borderColor:"#fc97af",borderColor0:"#87f7cf",borderWidth:"2"}},q={itemStyle:{borderWidth:0,borderColor:"#ccc"},lineStyle:{width:"1",color:"#ffffff"},symbolSize:"0",symbol:"circle",smooth:!0,color:["#fc97af","#87f7cf","#f7f494","#72ccff","#f7c5a0","#d4a4eb","#d2f5a6","#76f2f2"],label:{color:"#293441"}},G={itemStyle:{areaColor:"#f3f3f3",borderColor:"#999999",borderWidth:.5},label:{color:"#893448"},emphasis:{itemStyle:{areaColor:"rgba(255,178,72,1)",borderColor:"#eb8146",borderWidth:1},label:{color:"rgb(137,52,72)"}}},X={itemStyle:{areaColor:"#f3f3f3",borderColor:"#999999",borderWidth:.5},label:{color:"#893448"},emphasis:{itemStyle:{areaColor:"rgba(255,178,72,1)",borderColor:"#eb8146",borderWidth:1},label:{color:"rgb(137,52,72)"}}},J={axisLine:{show:!0,lineStyle:{color:"#666666"}},axisTick:{show:!1,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#aaaaaa"},splitLine:{show:!1,lineStyle:{color:["#e6e6e6"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.05)","rgba(200,200,200,0.02)"]}}},K={axisLine:{show:!0,lineStyle:{color:"#666666"}},axisTick:{show:!1,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#aaaaaa"},splitLine:{show:!1,lineStyle:{color:["#e6e6e6"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.05)","rgba(200,200,200,0.02)"]}}},Q={axisLine:{show:!0,lineStyle:{color:"#666666"}},axisTick:{show:!1,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#aaaaaa"},splitLine:{show:!1,lineStyle:{color:["#e6e6e6"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.05)","rgba(200,200,200,0.02)"]}}},Y={axisLine:{show:!0,lineStyle:{color:"#666666"}},axisTick:{show:!1,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#aaaaaa"},splitLine:{show:!1,lineStyle:{color:["#e6e6e6"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.05)","rgba(200,200,200,0.02)"]}}},ee={iconStyle:{borderColor:"#999999"},emphasis:{iconStyle:{borderColor:"#666666"}}},te={textStyle:{color:"#999999"}},oe={axisPointer:{lineStyle:{color:"#cccccc",width:1},crossStyle:{color:"#cccccc",width:1}}},ae={lineStyle:{color:"#87f7cf",width:1},itemStyle:{color:"#87f7cf",borderWidth:1},controlStyle:{color:"#87f7cf",borderColor:"#87f7cf",borderWidth:.5},checkpointStyle:{color:"#fc97af",borderColor:"#fc97af"},label:{color:"#87f7cf"},emphasis:{itemStyle:{color:"#f7f494"},controlStyle:{color:"#87f7cf",borderColor:"#87f7cf",borderWidth:.5},label:{color:"#87f7cf"}}},re={color:["#fc97af","#87f7cf"]},le={backgroundColor:"rgba(255,255,255,0)",dataBackgroundColor:"rgba(114,204,255,1)",fillerColor:"rgba(114,204,255,0.2)",handleColor:"#72ccff",handleSize:"100%",textStyle:{color:"#333333"}},ie={label:{color:"#293441"},emphasis:{label:{color:"#293441"}}},nt={color:W,backgroundColor:B,textStyle:L,title:O,line:D,radar:R,bar:j,pie:_,scatter:z,boxplot:M,parallel:P,sankey:U,funnel:H,gauge:Z,candlestick:I,graph:q,map:G,geo:X,categoryAxis:J,valueAxis:K,logAxis:Q,timeAxis:Y,toolbox:ee,legend:te,tooltip:oe,timeline:ae,visualMap:re,dataZoom:le,markPoint:ie},ut=Object.freeze(Object.defineProperty({__proto__:null,backgroundColor:B,bar:j,boxplot:M,candlestick:I,categoryAxis:J,color:W,dataZoom:le,default:nt,funnel:H,gauge:Z,geo:X,graph:q,legend:te,line:D,logAxis:Q,map:G,markPoint:ie,parallel:P,pie:_,radar:R,sankey:U,scatter:z,textStyle:L,timeAxis:Y,timeline:ae,title:O,toolbox:ee,tooltip:oe,valueAxis:K,visualMap:re},Symbol.toStringTag,{value:"Module"})),ce=["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552","#95706d","#dc69aa","#07a2a4","#9a7fd1","#588dd5","#f5994e","#c05050","#59678c","#c9ab00","#7eb00a","#6f5553","#c14089"],se="rgba(0,0,0,0)",ne={},ue={textStyle:{color:"#008acd"},subtextStyle:{color:"#aaaaaa"}},de={itemStyle:{borderWidth:1},lineStyle:{width:2},symbolSize:3,symbol:"emptyCircle",smooth:!0},he={itemStyle:{borderWidth:1},lineStyle:{width:2},symbolSize:3,symbol:"emptyCircle",smooth:!0},be={itemStyle:{barBorderWidth:0,barBorderColor:"#ccc"}},fe={itemStyle:{borderWidth:0,borderColor:"#ccc"}},me={itemStyle:{borderWidth:0,borderColor:"#ccc"}},ye={itemStyle:{borderWidth:0,borderColor:"#ccc"}},pe={itemStyle:{borderWidth:0,borderColor:"#ccc"}},ge={itemStyle:{borderWidth:0,borderColor:"#ccc"}},Se={itemStyle:{borderWidth:0,borderColor:"#ccc"}},Ce={itemStyle:{borderWidth:0,borderColor:"#ccc"}},Ve={itemStyle:{color:"#d87a80",color0:"#2ec7c9",borderColor:"#d87a80",borderColor0:"#2ec7c9",borderWidth:1}},xe={itemStyle:{borderWidth:0,borderColor:"#ccc"},lineStyle:{width:1,color:"#aaa"},symbolSize:3,symbol:"emptyCircle",smooth:!0,color:["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552","#95706d","#dc69aa","#07a2a4","#9a7fd1","#588dd5","#f5994e","#c05050","#59678c","#c9ab00","#7eb00a","#6f5553","#c14089"],label:{color:"#eee"}},we={itemStyle:{areaColor:"#dddddd",borderColor:"#eeeeee",borderWidth:.5},label:{color:"#d87a80"},emphasis:{itemStyle:{areaColor:"rgba(254,153,78,1)",borderColor:"#444",borderWidth:1},label:{color:"rgb(100,0,0)"}}},Ae={itemStyle:{areaColor:"#dddddd",borderColor:"#eeeeee",borderWidth:.5},label:{color:"#d87a80"},emphasis:{itemStyle:{areaColor:"rgba(254,153,78,1)",borderColor:"#444",borderWidth:1},label:{color:"rgb(100,0,0)"}}},ve={axisLine:{show:!0,lineStyle:{color:"#008acd"}},axisTick:{show:!0,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#333"},splitLine:{show:!1,lineStyle:{color:["#eee"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},ke={axisLine:{show:!0,lineStyle:{color:"#008acd"}},axisTick:{show:!0,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#333"},splitLine:{show:!0,lineStyle:{color:["#eee"]}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},Ne={axisLine:{show:!0,lineStyle:{color:"#008acd"}},axisTick:{show:!0,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#333"},splitLine:{show:!0,lineStyle:{color:["#eee"]}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},Fe={axisLine:{show:!0,lineStyle:{color:"#008acd"}},axisTick:{show:!0,lineStyle:{color:"#333"}},axisLabel:{show:!0,color:"#333"},splitLine:{show:!0,lineStyle:{color:["#eee"]}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},Te={iconStyle:{borderColor:"#2ec7c9"},emphasis:{iconStyle:{borderColor:"#18a4a6"}}},Ee={textStyle:{color:"#333333"}},$e={axisPointer:{lineStyle:{color:"#008acd",width:"1"},crossStyle:{color:"#008acd",width:"1"}}},We={lineStyle:{color:"#008acd",width:1},itemStyle:{color:"#008acd",borderWidth:1},controlStyle:{color:"#008acd",borderColor:"#008acd",borderWidth:.5},checkpointStyle:{color:"#2ec7c9",borderColor:"#2ec7c9"},label:{color:"#008acd"},emphasis:{itemStyle:{color:"#a9334c"},controlStyle:{color:"#008acd",borderColor:"#008acd",borderWidth:.5},label:{color:"#008acd"}}},Be={color:["#5ab1ef","#e0ffff"]},Le={backgroundColor:"rgba(47,69,84,0)",dataBackgroundColor:"#efefff",fillerColor:"rgba(182,162,222,0.2)",handleColor:"#008acd",handleSize:"100%",textStyle:{color:"#333333"}},Oe={label:{color:"#eee"},emphasis:{label:{color:"#eee"}}},dt={color:ce,backgroundColor:se,textStyle:ne,title:ue,line:de,radar:he,bar:be,pie:fe,scatter:me,boxplot:ye,parallel:pe,sankey:ge,funnel:Se,gauge:Ce,candlestick:Ve,graph:xe,map:we,geo:Ae,categoryAxis:ve,valueAxis:ke,logAxis:Ne,timeAxis:Fe,toolbox:Te,legend:Ee,tooltip:$e,timeline:We,visualMap:Be,dataZoom:Le,markPoint:Oe},ht=Object.freeze(Object.defineProperty({__proto__:null,backgroundColor:se,bar:be,boxplot:ye,candlestick:Ve,categoryAxis:ve,color:ce,dataZoom:Le,default:dt,funnel:Se,gauge:Ce,geo:Ae,graph:xe,legend:Ee,line:de,logAxis:Ne,map:we,markPoint:Oe,parallel:pe,pie:fe,radar:he,sankey:ge,scatter:me,textStyle:ne,timeAxis:Fe,timeline:We,title:ue,toolbox:Te,tooltip:$e,valueAxis:ke,visualMap:Be},Symbol.toStringTag,{value:"Module"})),bt=()=>{const e=Object.assign({"/src/components/RChart/theme/macarons/macarons-dark.json":ut,"/src/components/RChart/theme/macarons/macarons.json":ht}),m=/\/([^/]+)\.json$/;return Object.keys(e).reduce((i,n)=>{var t;const u=(t=n.match(m))==null?void 0:t[1];if(u)return i.push({name:u,theme:e[n].default}),i;throw new Error("theme name is not found")},[])},ft=e=>Object.assign({},{text:"loading",color:"#c23531",textColor:"#000",maskColor:"rgba(255, 255, 255, 0.9)",zlevel:0,fontSize:12,showSpinner:!0,spinnerRadius:10,lineWidth:5,fontWeight:"normal",fontStyle:"normal",fontFamily:"sans-serif"},e),C=Vue.defineComponent({name:"RChart",props:{width:{type:String,default:"100%"},height:{type:String,default:"100%"},autoResize:{type:[Boolean,Object],default:!0},canvasRender:{type:Boolean,default:!0},showAria:{type:Boolean,default:!1},options:{type:Object,default:()=>({})},onSuccess:{type:[Function,Array],default:null},onError:{type:[Function,Array],default:null},theme:{type:[String,Object],default:""},autoChangeTheme:{type:Boolean,default:!0},use:{type:Array,default:()=>[]},watchOptions:{type:Boolean,default:!0},loading:{type:Boolean,default:!1},loadingOptions:{type:Object,default:()=>ft()},observer:{type:Object,default:null},throttleWait:{type:Number,default:500},animation:{type:Boolean,default:!0},setChartOptions:{type:Object,default:()=>({})}},setup(e,{expose:m}){const y=_e(),{themeValue:i}=Pinia.storeToRefs(y),n=Vue.ref(),u=Vue.ref(),t=Vue.ref();let r,c;const{echartTheme:h}=Pe;let b;const V=Vue.computed(()=>({"--ray-chart-width":T(e.width),"--ray-chart-height":T(e.height)})),x=async()=>{var o;S([Ie,qe,Ge,Xe,Je,Ke,Qe,Ye]),S([et,tt,ot,at,rt,lt]),S([it,ct]),S([st]);try{S((o=e.use)==null?void 0:o.filter(Boolean))}catch{console.error("register chart Core error: wrong property and method passed in extend attribute")}},a=o=>{let l=Re(Vue.unref(o));const f=p=>Object.assign({animation:!0},l,p);return e.showAria&&(l=f({aria:{enabled:!0,decal:{show:!0}}})),l},s=(o=h)=>{const l=n.value,f=a(e.options),{height:p,width:A}=l.getBoundingClientRect(),{onSuccess:g,onError:F}=e;try{bt().forEach(d=>{He(d.name,d.theme)}),t.value=Ze(l,o,{width:A===0?200:void 0,height:p===0?200:void 0}),t.value.setOption({}),e.animation&&setTimeout(()=>{var d;f&&((d=t.value)==null||d.setOption(f))}),g&&E(g,t.value)}catch(d){F&&E(F),console.error("RChart render error: ",d)}},v=o=>{if(e.autoChangeTheme){o?s(`${h}-dark`):s();return}e.theme||s()},w=()=>{t.value&&(t.value.clear(),t.value.dispose())},De=()=>{t.value&&t.value.resize()},k=()=>{var o;if((o=t.value)!=null&&o.getDom()){console.warn("RChart mount: There is a chart instance already initialized on the dom. Execution was interrupted");return}e.autoChangeTheme?v(i.value):e.theme?s(`${h}-dark`):s(),e.autoResize&&(r=je(De,e.throttleWait),c=Ue(e.observer||u,r),ze(window,"resize",r))},N=()=>{var o;w(),r&&Me(window,"resize",r),r==null||r.cancel(),(o=c==null?void 0:c.stop)==null||o.call(c)};return Vue.watch(()=>i.value,o=>{e.autoChangeTheme&&(w(),v(o))}),Vue.watch(()=>e.showAria,()=>{w(),(e.autoChangeTheme||e.theme)&&i.value?s(`${h}-dark`):s()}),Vue.watchEffect(()=>{var o,l;e.watchOptions&&(b=Vue.watch(()=>e.options,f=>{var g;const p=a(f),A=Object.assign({},e.setChartOptions,{notMerge:!1,lazyUpdate:!0,silent:!1,replaceMerge:[]});(g=t.value)==null||g.setOption(p,A)},{deep:!0})),e.loading?(o=t.value)==null||o.showLoading(e.loadingOptions):(l=t.value)==null||l.hideLoading()}),m({echart:t,dispose:N,render:k}),Vue.onBeforeMount(async()=>{await x()}),Vue.onMounted(()=>{Vue.nextTick(()=>{k()})}),Vue.onBeforeUnmount(()=>{N(),b==null||b()}),{rayChartRef:n,cssVarsRef:V,rayChartWrapperRef:u}},render(){return Vue.createVNode("div",{class:"ray-chart",style:[this.cssVarsRef],ref:"rayChartWrapperRef"},[Vue.createVNode("div",{class:"ray-chart__container",ref:"rayChartRef"},null)])}}),zt=Vue.defineComponent({name:"REchart",setup(){const e=Vue.ref(),m=Vue.ref(!1),y=Vue.ref(!1),i=Vue.reactive({loading:!1}),n={legend:{},tooltip:{},xAxis:{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},yAxis:{type:"value"},series:[{name:"日期",data:[120,200,150,80,70,110,130],type:"bar",showBackground:!0,backgroundStyle:{color:"rgba(180, 180, 180, 0.2)"}},{name:"数量",data:[12,220,250,180,20,10,190],type:"bar",showBackground:!0,backgroundStyle:{color:"rgba(180, 180, 180, 0.2)"}}]},u={title:{text:"Referer of a Website",subtext:"Fake Data",left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},series:[{name:"Access From",type:"pie",radius:"50%",data:[{value:1048,name:"Search Engine"},{value:735,name:"Direct"},{value:580,name:"Email"},{value:484,name:"Union Ads"},{value:300,name:"Video Ads"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},t=Vue.ref({title:{text:$().valueOf()},tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{data:["Email","Union Ads","Video Ads","Direct","Search Engine"]},toolbox:{feature:{saveAsImage:{}}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}],yAxis:[{type:"value"}],series:[{name:"Email",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[120,132,101,134,90,230,210]},{name:"Union Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[220,182,191,234,290,330,310]},{name:"Video Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[150,232,201,154,190,330,410]},{name:"Direct",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[320,332,301,334,390,330,320]},{name:"Search Engine",type:"line",stack:"Total",label:{show:!0,position:"top"},areaStyle:{},emphasis:{focus:"series"},data:[820,932,901,934,1290,1330,1320]}]}),r=a=>{i.loading=a},c=a=>{y.value=a},h=a=>{window.$notification.info({title:"可视化图渲染成功回调函数",content:"可视化图渲染成功, 并且返回了当前可视化图实例",duration:5*1e3}),e.value},b=()=>{var a;(a=e.value)==null||a.render()},V=()=>{var a;(a=e.value)==null||a.dispose()},x=()=>{t.value.title.text=$().valueOf();const a=()=>Math.floor((Math.random()+1)*100);t.value.series[0].data=new Array(7).fill(0).map(()=>a()),t.value.series[1].data=new Array(7).fill(0).map(()=>a())};return{baseOptions:n,baseChartRef:e,chartLoading:m,handleLoadingShow:r,chartAria:y,handleAriaShow:c,handleChartRenderSuccess:h,basePieOptions:u,baseLineOptions:t,...Vue.toRefs(i),mountChart:b,unmountChart:V,handleUpdateTitle:x}},render(){return Vue.createVNode("div",{class:"echart"},[Vue.createVNode(naive.NCard,{title:"chart 组件"},{default:()=>[Vue.createVNode("ul",null,[Vue.createVNode("li",null,[Vue.createVNode("h3",null,[Vue.createTextVNode("当未获取到宽高时，组件会默认以 200*200 尺寸填充。")])]),Vue.createVNode("li",null,[Vue.createVNode("h3",null,[Vue.createTextVNode("默认启用 autoChangeTheme，自动监听模板主题变化（RayTemplate 独有）")])]),Vue.createVNode("li",null,[Vue.createVNode("h3",null,[Vue.createTextVNode("默认启用 watchOptions，自动监听配置项变化")])]),Vue.createVNode("li",null,[Vue.createVNode("h3",null,[Vue.createTextVNode("默认启用 animation，强制启用渲染过渡动画")])]),Vue.createVNode("li",null,[Vue.createVNode("h3",null,[Vue.createTextVNode("配置 setChartOptions 属性，可以定制化合并模式")])])])]}),Vue.createVNode(naive.NH2,null,{default:()=>[Vue.createTextVNode("强制渲染过渡动画（animation）")]}),Vue.createVNode(naive.NSpace,{style:["padding: 18px 0"]},{default:()=>[Vue.createVNode(naive.NButton,{onClick:this.mountChart.bind(this)},{default:()=>[Vue.createTextVNode("渲染")]}),Vue.createVNode(naive.NButton,{onClick:this.unmountChart.bind(this)},{default:()=>[Vue.createTextVNode("卸载")]}),Vue.createVNode(naive.NButton,{onClick:this.handleUpdateTitle.bind(this)},{default:()=>[Vue.createTextVNode("更新配置项")]})]}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(C,{ref:"baseChartRef",autoChangeTheme:!0,options:this.baseLineOptions,showAria:this.chartAria},null)]),Vue.createVNode(naive.NH2,null,{default:()=>[Vue.createTextVNode("不跟随主题切换的暗色主题可视化图")]}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(C,{autoChangeTheme:!1,theme:"dark",options:this.baseOptions},null)]),Vue.createVNode(naive.NH2,null,{default:()=>[Vue.createTextVNode("加载动画")]}),Vue.createVNode(naive.NSwitch,{value:this.chartLoading,"onUpdate:value":e=>this.chartLoading=e,onUpdateValue:this.handleLoadingShow.bind(this),style:["padding: 18px 0"]},{checked:()=>"隐藏加载动画",unchecked:()=>"显示加载动画"}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(C,{loading:this.loading,options:this.baseOptions},null)]),Vue.createVNode(naive.NH2,null,{default:()=>[Vue.createTextVNode("贴画可视化图")]}),Vue.createVNode(naive.NSwitch,{value:this.chartAria,"onUpdate:value":e=>this.chartAria=e,onUpdateValue:this.handleAriaShow.bind(this),style:["padding: 18px 0"]},{checked:()=>"隐藏贴花",unchecked:()=>"显示贴花"}),Vue.createVNode("div",{class:"chart--container"},[Vue.createVNode(C,{options:this.baseOptions,showAria:this.chartAria},null)])])}});export{zt as default};
