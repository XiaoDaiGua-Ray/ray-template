import{s as u}from"./utils-3eX7XowR.js";import{k as v,f as h,l as N,h as f,m as p,o as d,p as w,q as o,c as y,T as b,L as S}from"./hooks-9K4kgpy8.js";import"./awesome-qr@2.1.5-rc.0-UnPo3EFD.js";import"./vue-hooks-plus@1.8.5_vue@3.4.7-UGgZVZ2w.js";import"./lodash@4.17.21-yUHHMES2.js";import"./js-cookie@3.0.5-bc0KQLgp.js";import"./screenfull@5.2.0-q9gEF-YC.js";import"./qs@6.11.2-wwOruwhc.js";import"./dayjs@1.11.10-IrZctHvJ.js";import"./print-js@1.6.0-gYKv6oGQ.js";import"./currency.js@2.0.4--or6eeOG.js";import{L as x}from"./ray-9TfU2AhD.js";import{b as R}from"./@vueuse_core@10.6.1_vue@3.4.7-6NPuvy-v.js";import{R as _}from"./index-arW2HKyR.js";import"./lodash-es@4.17.21-xgd1l9mE.js";import"./interactjs@1.10.26-I0IiZoEj.js";import"./pinia-plugin-persistedstate@3.2.0_pinia@2.1.7-fNhqB16x.js";import"./dom-to-image@2.6.0-eHYYUq-2.js";import"./echarts@5.4.3-Vt5ZmFiA.js";import"./zrender@5.4.4-fafgp4mQ.js";import"./tslib@2.3.0-21A5UWR7.js";import"./@vue_runtime-core@3.4.7-pkrnDrzv.js";import"./@vue_reactivity@3.4.7-UV591Pbc.js";import"./@vue_shared@3.4.7--wkmpvo9.js";import"./canvas@2.11.2-dZp4QMlu.js";import"./js-binary-schema-parser@2.0.3-CCV6nRej.js";import"./side-channel@1.0.4-hl21th03.js";import"./get-intrinsic@1.2.1-NE0DZZ3B.js";import"./has-symbols@1.0.3-fNtejGuA.js";import"./has-proto@1.0.1-dzJH2Y5C.js";import"./function-bind@1.1.1-Y6-kkB5s.js";import"./has@1.0.3-rcPLRdvS.js";import"./call-bind@1.0.2-8lNE5ocE.js";import"./@vueuse_shared@10.6.1_vue@3.4.7-DJDYauAH.js";function k(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const C=Vue.defineComponent({name:"RSigning",setup(){const e=Vue.ref(),{t:i}=v(),{signing:t}=h(),{getRootPath:n}=N(),a=f("globalSpinning"),g=()=>({name:"Ray Admin",pwd:"123456"}),c=VueRouter.useRouter(),r=Vue.ref(g()),m={name:{required:!0,message:i("views.login.index.NamePlaceholder"),trigger:["blur","input"]},pwd:{required:!0,message:i("views.login.index.PasswordPlaceholder"),trigger:["blur","input"]}};return{signingForm:r,loginFormRef:e,handleLogin:()=>{var l;(l=e.value)==null||l.validate(V=>{V||(p("globalSpinning",!0),t(r.value).then(s=>{s.code===0&&setTimeout(()=>{p("globalSpinning",!1),window.$message.success(`欢迎${r.value.name}登陆~`),u(d.token,"tokenValue"),u(d.signing,s.data),c.push(n.value)},2*1e3)}).catch(()=>{window.$message.error("不可以这样哟, 不可以哟")}))})},rules:m,globalSpinning:a}},render(){let e;const{$t:i,globalSpinning:t}=this;return Vue.createVNode(naive.NForm,{model:this.signingForm,ref:"loginFormRef",rules:this.rules},{default:()=>[Vue.createVNode(naive.NFormItem,{label:i("views.login.index.Name"),path:"name"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.signingForm.name,"onUpdate:value":n=>this.signingForm.name=n,placeholder:i("views.login.index.NamePlaceholder")},null)]}),Vue.createVNode(naive.NFormItem,{label:i("views.login.index.Password"),path:"pwd"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.signingForm.pwd,"onUpdate:value":n=>this.signingForm.pwd=n,type:"password",showPasswordOn:"click",placeholder:i("views.login.index.PasswordPlaceholder")},null)]}),Vue.createVNode(naive.NButton,{style:["width: 100%","margin-to: 18px"],type:"primary",onClick:this.handleLogin.bind(this),loading:t},k(e=i("views.login.index.Login"))?e:{default:()=>[e]})]})}}),F=Vue.defineComponent({name:"RRegister",render(){return Vue.createVNode(naive.NResult,{status:"info",title:"提示",description:"我实在是不想写了..."},null)}}),j=Vue.defineComponent({name:"QRCodeSigning",setup(){const e=Vue.reactive({qrcodeValue:"https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io"});return{...Vue.toRefs(e)}},render(){return Vue.createVNode("div",{class:"qrcode-signing"},[Vue.createVNode(w,{text:"ray template yes",size:200,logoImage:x},null)])}});function L(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const T=Vue.defineComponent({name:"SSOSigning",setup(){return{ssoSigningOptions:[{icon:"github",key:"github",tooltipLabel:"Github登陆"},{icon:"google",key:"google",tooltipLabel:"Google登陆"},{icon:"twitter",key:"twitter",tooltipLabel:"Twitter登陆"}],handleSSOSigningClick:t=>{window.$message.info(`调用${t.tooltipLabel}`)}}},render(){let e;return Vue.createVNode(naive.NFlex,{class:"sso-signing",align:"center"},L(e=this.ssoSigningOptions.map(i=>Vue.createVNode(naive.NPopover,{key:i.key},{trigger:()=>Vue.createVNode(o,{name:i.icon,size:"24",cursor:"pointer",onClick:this.handleSSOSigningClick.bind(this,i)},null),default:()=>i.tooltipLabel})))?e:{default:()=>[e]})}});var P={pkg:{dependencies:{"@vueuse/core":"^10.6.1","awesome-qr":"2.1.5-rc.0",axios:"^1.6.2",clipboard:"^2.0.11","crypto-js":"^4.1.1","currency.js":"^2.0.4",dayjs:"^1.11.10","dom-to-image":"2.6.0",echarts:"^5.4.3",interactjs:"1.10.26","lodash-es":"^4.17.21",mockjs:"1.1.0","naive-ui":"^2.37.3",pinia:"^2.1.7","pinia-plugin-persistedstate":"^3.2.0","print-js":"^1.6.0",vue:"^3.4.7","vue-hooks-plus":"1.8.5","vue-i18n":"^9.9.0","vue-router":"^4.2.5",xlsx:"^0.18.5"},devDependencies:{"@babel/core":"^7.23.2","@babel/eslint-parser":"^7.22.11","@commitlint/cli":"^17.7.1","@commitlint/config-conventional":"^17.7.0","@interactjs/types":"1.10.21","@intlify/unplugin-vue-i18n":"^1.5.0","@types/crypto-js":"^4.1.1","@types/dom-to-image":"2.6.7","@types/lodash-es":"^4.17.11","@types/mockjs":"1.0.7","@typescript-eslint/eslint-plugin":"^6.5.0","@typescript-eslint/parser":"^6.5.0","@vitejs/plugin-vue":"^5.0.0","@vitejs/plugin-vue-jsx":"^3.1.0","@vue-hooks-plus/resolvers":"1.2.4","@vue/eslint-config-prettier":"^8.0.0","@vue/eslint-config-typescript":"^11.0.3",autoprefixer:"^10.4.15",depcheck:"^1.4.5",eslint:"^8.52.0","eslint-config-prettier":"^9.0.0","eslint-config-standard-with-typescript":"^39.0.0","eslint-plugin-import":"^2.29.0","eslint-plugin-n":"^16.2.0","eslint-plugin-prettier":"^5.0.1","eslint-plugin-promise":"^6.1.1","eslint-plugin-vue":"^9.18.1",husky:"8.0.3","lint-staged":"^15.1.0",postcss:"^8.4.31","postcss-px-to-viewport-8-plugin":"1.2.2",prettier:"^3.0.3","rollup-plugin-visualizer":"^5.9.2",sass:"1.69.5","svg-sprite-loader":"^6.0.11",typescript:"^5.2.2","unplugin-auto-import":"^0.16.6","unplugin-vue-components":"^0.25.2",vite:"^5.0.10","vite-plugin-cdn2":"0.15.2","vite-plugin-compression":"^0.5.1","vite-plugin-ejs":"^1.7.0","vite-plugin-eslint":"1.8.1","vite-plugin-imp":"^2.4.0","vite-plugin-inspect":"^0.7.38","vite-plugin-mock-dev-server":"1.3.4","vite-plugin-svg-icons":"^2.0.1","vite-svg-loader":"^4.0.0","vue-tsc":"^1.8.8"},name:"ray-template",version:"4.6.0"},layout:{copyright:"Copyright © 2022-present Ray",sideBarLogo:{icon:"ray",title:"Ray Template",url:"/dashboard",jumpType:"station"}},appPrimaryColor:{primaryColor:"#2d8cf0",primaryFadeColor:"rgba(45, 140, 240, 0.3)"}};const Ve=Vue.defineComponent({name:"RLogin",setup(){const{layout:{copyright:e}}=P,i=Vue.reactive({tabsValue:"signing"}),{height:t,width:n}=R(),{updateLocale:a}=y();return{...Vue.toRefs(i),windowHeight:t,updateLocale:a,copyright:e,windowWidth:n}},render(){const{$t:e}=this;return Vue.createVNode("div",{class:["login"],style:[`height: ${this.windowHeight}px`,`--login-height: ${this.windowHeight}px`]},[Vue.createVNode("div",{class:["login-wrapper",this.windowWidth>=1440?"login-wrapper--divider":""]},[Vue.createVNode("div",{class:["login-wrapper__content"]},[Vue.createVNode(naive.NFlex,{align:"center",class:"login-title__wrapper"},{default:()=>[Vue.createVNode(o,{name:"ray",size:"48"},null),Vue.createVNode(naive.NGradientText,{class:"login-title",type:"info",size:28},{default:()=>[Vue.createTextVNode("Ray Template")]})]}),Vue.createVNode(naive.NFlex,{align:"center",class:"login-action__wrapper"},{default:()=>[Vue.createVNode(b,null,null),Vue.createVNode(naive.NDropdown,{options:S,onSelect:i=>this.updateLocale(i),trigger:"click"},{default:()=>[Vue.createVNode(o,{customClassName:"login-icon",name:"language",size:"18",cursor:"pointer"},null)]})]}),Vue.createVNode(naive.NGrid,{cols:"s:1 m:1 l:2 xl:2 2xl:2",itemResponsive:!1,responsive:"screen"},{default:()=>[Vue.createVNode(naive.NGridItem,{span:"s:0 m:0 l:1 xl:1 2xl:1",class:"login__left-wrapper"},{default:()=>[Vue.createVNode(naive.NFlex,{align:"center",vertical:!0},{default:()=>[Vue.createVNode(o,{name:"login_bg",width:"368",height:"368"},null),Vue.createVNode(naive.NGradientText,{class:"login-title",type:"info",size:36},{default:()=>[Vue.createTextVNode("开箱即用的中后台管理系统")]})]})]}),Vue.createVNode(naive.NGridItem,{span:1,class:"login__right-wrapper"},{default:()=>[Vue.createVNode(naive.NCard,{class:"login__right-wrapper__content",embedded:!0,bordered:!1},{default:()=>[Vue.createVNode(naive.NTabs,{value:this.tabsValue,"onUpdate:value":i=>this.tabsValue=i,type:"line",animated:!0,size:"large"},{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NTabPane,{tab:e("views.login.index.Signing"),name:"signing"},{default:()=>[Vue.createVNode(C,null,null)]}),Vue.createVNode(naive.NTabPane,{tab:e("views.login.index.Register"),name:"register"},{default:()=>[Vue.createVNode(F,null,null)]}),Vue.createVNode(naive.NTabPane,{tab:e("views.login.index.QRCodeSigning"),name:"qrcodeSigning"},{default:()=>[Vue.createVNode(j,null,null)]})])}),Vue.createVNode(naive.NDivider,null,{default:()=>[Vue.createTextVNode("其他登陆方式")]}),Vue.createVNode(T,null,null),Vue.createVNode(naive.NDivider,null,{default:()=>[Vue.createTextVNode("友情链接")]}),Vue.createVNode(_,null,null)]})]})]}),Vue.createVNode(naive.NFlex,{align:"center",justify:"center",class:"login-copyright__wrapper"},{default:()=>[this.copyright]})])])])}});export{Ve as default};
