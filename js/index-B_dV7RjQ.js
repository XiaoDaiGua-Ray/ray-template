import{s as u}from"./utils-BHY8vmkp.js";import{i as v,o as h,k as N,p as f,q as p,d,r as y,t as o,e as w,T as b,L as S}from"./hooks-abDb_7tG.js";import"./dayjs@1.11.10-BYZwCyGy.js";import"./print-js@1.6.0-C3lAJnMa.js";import"./awesome-qr@2.1.5-rc.0-Ds7AaOTE.js";import"./vue-hooks-plus@1.8.8_vue@3.4.21-C_BRgauB.js";import"./lodash@4.17.21-CM7ROh5r.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DuGDi0R7.js";import"./currency.js@2.0.4-9OAR_aOO.js";import{L as x}from"./ray-dCjhX_JK.js";import{e as R}from"./@vueuse_core@10.9.0_vue@3.4.21--QrNzsXE.js";import{A as _}from"./index-43Sr2ZDd.js";import"./lodash-es@4.17.21-C8H4BJij.js";import"./interactjs@1.10.26-DmsZVOf4.js";import"./pinia-plugin-persistedstate@3.2.1_pinia@2.1.7-RV7uh3T-.js";import"./dom-to-image@2.6.0-CaeIWam-.js";import"./echarts@5.5.0-BEyY33Zi.js";import"./zrender@5.5.0-JN1hODMT.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vueuse_shared@10.9.0_vue@3.4.21-7aSumFzu.js";import"./@vue_runtime-core@3.4.21-DW3iHaBZ.js";import"./@vue_reactivity@3.4.21-8_tu8c_o.js";import"./@vue_shared@3.4.21-DCcVmNGw.js";import"./canvas@2.11.2-CVRTzJty.js";import"./js-binary-schema-parser@2.0.3-D0akQrQ7.js";function j(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const k=Vue.defineComponent({name:"RSigning",setup(){const e=Vue.ref(),{t}=f(),{signing:i}=v(),{getRootPath:n}=h(),a=N("globalSpinning"),g=()=>({name:"Ray Admin",pwd:"123456"}),c=VueRouter.useRouter(),r=Vue.ref(g()),m={name:{required:!0,message:t("views.login.index.NamePlaceholder"),trigger:["blur","input"]},pwd:{required:!0,message:t("views.login.index.PasswordPlaceholder"),trigger:["blur","input"]}};return{signingForm:r,loginFormRef:e,handleLogin:()=>{var l;(l=e.value)==null||l.validate(V=>{V||(p("globalSpinning",!0),i(r.value).then(s=>{s.code===0&&setTimeout(()=>{p("globalSpinning",!1),window.$message.success(`欢迎${r.value.name}登陆~`),u(d.token,"tokenValue"),u(d.signing,s.data),c.push(n.value)},2*1e3)}).catch(()=>{window.$message.error("不可以这样哟, 不可以哟")}))})},rules:m,globalSpinning:a}},render(){let e;const{$t:t,globalSpinning:i}=this;return Vue.createVNode(naive.NForm,{model:this.signingForm,ref:"loginFormRef",rules:this.rules},{default:()=>[Vue.createVNode(naive.NFormItem,{label:t("views.login.index.Name"),path:"name"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.signingForm.name,"onUpdate:value":n=>this.signingForm.name=n,placeholder:t("views.login.index.NamePlaceholder")},null)]}),Vue.createVNode(naive.NFormItem,{label:t("views.login.index.Password"),path:"pwd"},{default:()=>[Vue.createVNode(naive.NInput,{value:this.signingForm.pwd,"onUpdate:value":n=>this.signingForm.pwd=n,type:"password",showPasswordOn:"click",placeholder:t("views.login.index.PasswordPlaceholder")},null)]}),Vue.createVNode(naive.NButton,{style:["width: 100%","margin-to: 18px"],type:"primary",onClick:this.handleLogin.bind(this),loading:i},j(e=t("views.login.index.Login"))?e:{default:()=>[e]})]})}}),C=Vue.defineComponent({name:"RRegister",render(){return Vue.createVNode(naive.NResult,{status:"info",title:"提示",description:"我实在是不想写了..."},null)}}),F=Vue.defineComponent({name:"QRCodeSigning",setup(){const e=Vue.reactive({qrcodeValue:"https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io"});return{...Vue.toRefs(e)}},render(){return Vue.createVNode("div",{class:"qrcode-signing"},[Vue.createVNode(y,{text:"ray template yes",size:200,logoImage:x},null)])}});function L(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const O=Vue.defineComponent({name:"SSOSigning",setup(){return{ssoSigningOptions:[{icon:"github",key:"github",tooltipLabel:"Github登陆"},{icon:"google",key:"google",tooltipLabel:"Google登陆"},{icon:"twitter",key:"twitter",tooltipLabel:"Twitter登陆"}],handleSSOSigningClick:i=>{window.$message.info(`调用${i.tooltipLabel}`)}}},render(){let e;return Vue.createVNode(naive.NFlex,{class:"sso-signing",align:"center"},L(e=this.ssoSigningOptions.map(t=>Vue.createVNode(naive.NPopover,{key:t.key},{trigger:()=>Vue.createVNode(o,{name:t.icon,size:"24",cursor:"pointer",onClick:this.handleSSOSigningClick.bind(this,t)},null),default:()=>t.tooltipLabel})))?e:{default:()=>[e]})}});var T={pkg:{dependencies:{"@vueuse/core":"^10.9.0","awesome-qr":"2.1.5-rc.0",axios:"^1.6.7",clipboard:"^2.0.11","crypto-js":"^4.1.1","currency.js":"^2.0.4",dayjs:"^1.11.10","dom-to-image":"2.6.0",echarts:"^5.5.0",interactjs:"1.10.26","lodash-es":"^4.17.21",mockjs:"1.1.0","naive-ui":"^2.38.1",pinia:"^2.1.7","pinia-plugin-persistedstate":"^3.2.0","print-js":"^1.6.0",vue:"^3.4.21","vue-demi":"0.14.6","vue-hooks-plus":"1.8.8","vue-i18n":"^9.9.0","vue-router":"^4.2.5"},devDependencies:{"@babel/core":"^7.23.9","@babel/eslint-parser":"^7.23.3","@commitlint/cli":"^17.7.1","@commitlint/config-conventional":"^17.7.0","@interactjs/types":"1.10.21","@intlify/unplugin-vue-i18n":"^2.0.0","@types/crypto-js":"^4.1.1","@types/dom-to-image":"2.6.7","@types/lodash-es":"^4.17.11","@types/mockjs":"1.0.7","@typescript-eslint/eslint-plugin":"^6.5.0","@typescript-eslint/parser":"^6.5.0","@vitejs/plugin-vue":"^5.0.4","@vitejs/plugin-vue-jsx":"^3.1.0","@vitest/ui":"1.4.0","@vue-hooks-plus/resolvers":"1.2.4","@vue/eslint-config-prettier":"^9.0.0","@vue/eslint-config-typescript":"^12.0.0","@vue/test-utils":"2.4.3",autoprefixer:"^10.4.15",depcheck:"^1.4.5",eslint:"^8.56.0","eslint-config-prettier":"^9.1.0","eslint-config-standard-with-typescript":"^43.0.0","eslint-plugin-import":"^2.29.0","eslint-plugin-n":"^16.6.2","eslint-plugin-prettier":"^5.1.3","eslint-plugin-promise":"^6.1.1","eslint-plugin-vue":"^9.18.1","happy-dom":"14.3.1",husky:"8.0.3","lint-staged":"^15.1.0",postcss:"^8.4.31","postcss-px-to-viewport-8-plugin":"1.2.3",prettier:"^3.2.5",sass:"1.71.1","svg-sprite-loader":"^6.0.11",typescript:"^5.2.2","unplugin-auto-import":"^0.17.5","unplugin-vue-components":"^0.26.0",vite:"^5.2.8","vite-bundle-analyzer":"0.8.1","vite-plugin-cdn2":"1.1.0","vite-plugin-compression":"^0.5.1","vite-plugin-ejs":"^1.7.0","vite-plugin-eslint":"1.8.1","vite-plugin-imp":"^2.4.0","vite-plugin-inspect":"^0.8.3","vite-plugin-mock-dev-server":"1.4.7","vite-plugin-svg-icons":"^2.0.1","vite-svg-loader":"^4.0.0","vite-tsconfig-paths":"4.3.2",vitest:"1.4.0","vue-tsc":"^1.8.27"},name:"ray-template",version:"4.7.5"},layout:{copyright:"Copyright © 2022-present Ray",sideBarLogo:{icon:"ray",title:"Ray Template",url:"/dashboard",jumpType:"station"}},appPrimaryColor:{primaryColor:"#2d8cf0",primaryFadeColor:"rgba(45, 140, 240, 0.3)"}};function P(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!Vue.isVNode(e)}const se=Vue.defineComponent({name:"RLogin",setup(){const{layout:{copyright:e}}=T,t=Vue.reactive({tabsValue:"signing"}),{height:i,width:n}=R(),{updateLocale:a}=w();return{...Vue.toRefs(t),windowHeight:i,updateLocale:a,copyright:e,windowWidth:n}},render(){let e;const{$t:t}=this;return Vue.createVNode("div",{class:["login"],style:[`height: ${this.windowHeight}px`,`--login-height: ${this.windowHeight}px`]},[Vue.createVNode("div",{class:["login-wrapper",this.windowWidth>=1440?"login-wrapper--divider":""]},[Vue.createVNode("div",{class:["login-wrapper__content"]},[Vue.createVNode(naive.NFlex,{align:"center",class:"login-title__wrapper"},{default:()=>[Vue.createVNode(o,{name:"ray",size:"48"},null),Vue.createVNode(naive.NGradientText,{class:"login-title",type:"info",size:28},{default:()=>[Vue.createTextVNode("Ray Template")]})]}),Vue.createVNode(naive.NFlex,{align:"center",class:"login-action__wrapper"},{default:()=>[Vue.createVNode(b,null,null),Vue.createVNode(naive.NDropdown,{options:S,onSelect:i=>this.updateLocale(i),trigger:"click"},{default:()=>[Vue.createVNode(o,{customClassName:"login-icon",name:"language",size:"18",cursor:"pointer"},null)]})]}),Vue.createVNode(naive.NGrid,{cols:"s:1 m:1 l:2 xl:2 2xl:2",itemResponsive:!1,responsive:"screen"},{default:()=>[Vue.createVNode(naive.NGridItem,{span:"s:0 m:0 l:1 xl:1 2xl:1",class:"login__left-wrapper"},{default:()=>[Vue.createVNode(naive.NFlex,{align:"center",vertical:!0},{default:()=>[Vue.createVNode(o,{name:"login_bg",width:"368",height:"368"},null),Vue.createVNode(naive.NGradientText,{class:"login-title",type:"info",size:36},P(e=t("views.login.index.RayTemplate"))?e:{default:()=>[e]})]})]}),Vue.createVNode(naive.NGridItem,{span:1,class:"login__right-wrapper"},{default:()=>[Vue.createVNode(naive.NCard,{class:"login__right-wrapper__content",embedded:!0,bordered:!1},{default:()=>[Vue.createVNode(naive.NTabs,{value:this.tabsValue,"onUpdate:value":i=>this.tabsValue=i,type:"line",animated:!0,size:"large"},{default:()=>Vue.createVNode(Vue.Fragment,null,[Vue.createVNode(naive.NTabPane,{tab:t("views.login.index.Signing"),name:"signing"},{default:()=>[Vue.createVNode(k,null,null)]}),Vue.createVNode(naive.NTabPane,{tab:t("views.login.index.Register"),name:"register"},{default:()=>[Vue.createVNode(C,null,null)]}),Vue.createVNode(naive.NTabPane,{tab:t("views.login.index.QRCodeSigning"),name:"qrcodeSigning"},{default:()=>[Vue.createVNode(F,null,null)]})])}),Vue.createVNode(naive.NDivider,null,{default:()=>[Vue.createTextVNode("其他登陆方式")]}),Vue.createVNode(O,null,null),Vue.createVNode(naive.NDivider,null,{default:()=>[Vue.createTextVNode("友情链接")]}),Vue.createVNode(_,null,null)]})]})]}),Vue.createVNode(naive.NFlex,{align:"center",justify:"center",class:"login-copyright__wrapper"},{default:()=>[this.copyright]})])])])}});export{se as default};
