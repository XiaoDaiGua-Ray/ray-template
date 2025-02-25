import{i as N,p as O,x as C,R as L,y as F,f as v,z as r,e as P,u as A,j as $,B as z}from"./hooks-DAFrMGjY.js";import{s as f}from"./utils-Bic_iDtY.js";import"./currency.js@2.0.4-9OAR_aOO.js";import"./crypto-js@4.2.0-CXjOS6lk.js";import"./dayjs@1.11.13-BWvakrn1.js";import"./print-js@1.6.0-BptnCCm-.js";import{u as G}from"./vue-router@4.4.0_vue@3.5.13_typescript@5.6.3_-Ddx7y29b.js";import"./vue-hooks-plus@2.2.3_vue@3.5.13_typescript@5.6.3_-F-c4u1GS.js";import"./lodash@4.17.21-Bv2ueefR.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-CClqR5rE.js";import"./jsbarcode@3.11.6-CfPZaUx-.js";import"./@logicflow_core@2.0.10-ofLqxMRW.js";import"./mobx-preact@3.0.0_mobx@5.15.7_preact@10.25.4-CFsMsPXj.js";import"./preact@10.25.4--QYavupV.js";import{I as y,M as w,P as V,W as q,p as I,e as l,y as D,J as E,A as S,k as Q,a as U,b,N as H,v as W,T as g,F as k}from"./naive-ui@2.41.0_vue@3.5.13_typescript@5.6.3_-DW0tiym6.js";import{m as a,b as e,q as m,J as c,F as B}from"./@vue_runtime-core@3.5.13-pPpmd6wL.js";import{k as d,e as x,x as _}from"./@vue_reactivity@3.5.13-CVvlldVq.js";import{Q as J}from"./vue3-next-qrcode@2.0.10_typescript@5.6.3-wzrC7cBz.js";import{L as K}from"./ray-dCjhX_JK.js";import{f as M}from"./@vueuse_core@12.4.0_typescript@5.6.3-DzjsbTKf.js";import{A as X}from"./index-KVQuX6r5.js";import"./lodash-es@4.17.21-BbYRMHep.js";import"./pinia-plugin-persistedstate@4.2.0_pinia@2.3.0_typescript@5.6.3_vue@3.5.13_typescript@5.6.3___rollup@4.31.0-7e9nenNP.js";import"./destr@2.0.3-Cx7WjB9q.js";import"./deep-pick-omit@1.2.1-B1UrSIxj.js";import"./pinia@2.3.0_typescript@5.6.3_vue@3.5.13_typescript@5.6.3_-D39uhmss.js";import"./html-to-image@1.11.11-D6_yziCT.js";import"./@vue_runtime-dom@3.5.13-DJqlZTHq.js";import"./@vue_shared@3.5.13-CQ6Z-5d1.js";import"./interactjs@1.10.27-0Tgk5CYh.js";import"./call-bind-apply-helpers@1.0.1-BosuxZz1.js";import"./vue-i18n@9.13.1_vue@3.5.13_typescript@5.6.3_-DQlA9smo.js";import"./@intlify_shared@9.13.1-BxU0OzX2.js";import"./@intlify_core-base@9.13.1-CVxc1Bsn.js";import"./@intlify_message-compiler@9.13.1-GrLDMuy_.js";import"./echarts@5.6.0-Dq866SEH.js";import"./zrender@5.6.1-B_T0sHVE.js";import"./tslib@2.3.0-BDyQ-Jie.js";import"./@vueuse_shared@12.4.0_typescript@5.6.3-BcXCAzGo.js";import"./mobx@5.15.7-BvNiR7Ki.js";import"./uuid@9.0.1-CtRu48qb.js";import"./classnames@2.5.1-iH4Bdr9I.js";import"./mousetrap@1.6.5-C2A6yrpM.js";import"./mobx-utils@5.6.2_mobx@5.15.7-D4RSJWSh.js";import"./date-fns@3.6.0-CG906D2E.js";import"./seemly@0.3.9-BnJ6M8Cl.js";import"./vueuc@0.4.64_vue@3.5.13_typescript@5.6.3_-DZgPmxv3.js";import"./evtd@0.2.4-CI_DDEu_.js";import"./@css-render_vue3-ssr@0.15.14_vue@3.5.13_typescript@5.6.3_-DvmkD8RF.js";import"./vooks@0.2.12_vue@3.5.13_typescript@5.6.3_-rG9g4GjQ.js";import"./vdirs@0.1.8_vue@3.5.13_typescript@5.6.3_-C0KV5pCE.js";import"./@juggle_resize-observer@3.4.0-DY95s5UV.js";import"./css-render@0.15.14-BwokE0u2.js";import"./@emotion_hash@0.8.0-WldOFDRm.js";import"./treemate@0.3.11-CWtmm0QO.js";import"./date-fns-tz@3.2.0_date-fns@3.6.0-CULxTaQG.js";import"./async-validator@4.2.5-P8scd9xB.js";import"./@css-render_plugin-bem@0.15.14_css-render@0.15.14-BrMTnGYY.js";function Y(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!m(t)}const Z=a({name:"RSigning",setup(){const[t,{validate:i}]=N(),{t:n}=F(),{signing:s}=O(),{getRootPath:o}=C(),p=d(!1),j=()=>({name:"Ray Admin",pwd:"123456"}),R=G(),u=d(j()),T={name:{required:!0,message:n("views.login.index.NamePlaceholder"),trigger:["blur","input"]},pwd:{required:!0,message:n("views.login.index.PasswordPlaceholder"),trigger:["blur","input"]}};return{signingForm:u,register:t,handleLogin:()=>{i().then(()=>{p.value=!0,s(u.value).then(h=>{h.code===0&&setTimeout(()=>{window.$message.success(`欢迎${u.value.name}登陆~`),f(v.token,"tokenValue","localStorage"),f(v.signing,h.data,"localStorage"),R.push(o.value),p.value=!1},2*1e3)}).catch(()=>{window.$message.error("不可以这样哟, 不可以哟")})})},rules:T,loading:p}},render(){let t;const{$t:i,loading:n,register:s}=this;return e(L,{model:this.signingForm,onRegister:s,rules:this.rules},{default:()=>[e(y,{label:i("views.login.index.Name"),path:"name"},{default:()=>[e(w,{value:this.signingForm.name,"onUpdate:value":o=>this.signingForm.name=o,placeholder:i("views.login.index.NamePlaceholder")},null)]}),e(y,{label:i("views.login.index.Password"),path:"pwd"},{default:()=>[e(w,{value:this.signingForm.pwd,"onUpdate:value":o=>this.signingForm.pwd=o,type:"password",showPasswordOn:"click",placeholder:i("views.login.index.PasswordPlaceholder"),onKeydown:o=>o.key==="Enter"&&this.handleLogin()},null)]}),e(V,{style:["width: 100%","margin-to: 18px"],type:"primary",onClick:this.handleLogin.bind(this),loading:n},Y(t=i("views.login.index.Login"))?t:{default:()=>[t]})]})}}),ee=a({name:"RRegister",render(){return e(q,{status:"info",title:"提示",description:"我实在是不想写了..."},null)}}),te=a({name:"QRCodeSigning",setup(){const t=x({qrcodeValue:"https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io"});return{..._(t)}},render(){return e("div",{class:"qrcode-signing"},[e(J,{text:"ray template yes",size:200,logoImage:K},null)])}});function ie(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!m(t)}const ne=a({name:"SSOSigning",setup(){return{ssoSigningOptions:[{icon:"github",key:"github",tooltipLabel:"Github登陆"},{icon:"google",key:"google",tooltipLabel:"Google登陆"},{icon:"twitter",key:"twitter",tooltipLabel:"Twitter登陆"}],handleSSOSigningClick:n=>{window.$message.info(`调用${n.tooltipLabel}`)}}},render(){let t;return e(l,{class:"sso-signing",align:"center"},ie(t=this.ssoSigningOptions.map(i=>e(I,{key:i.key},{trigger:()=>e(r,{name:i.icon,size:"24",cursor:"pointer",onClick:this.handleSSOSigningClick.bind(this,i)},null),default:()=>i.tooltipLabel})))?t:{default:()=>[t]})}}),oe=a({name:"ThemeSwitch",setup(){const{darkTheme:t,lightTheme:i}=A(),{getAppTheme:n}=P(),s=d(n.value);return{darkTheme:t,lightTheme:i,getAppTheme:n,railStyle:({checked:p})=>p?{backgroundColor:"#000000"}:{color:"#000000"},modelAppThemeRef:s}},render(){const{$t:t,darkTheme:i,lightTheme:n,railStyle:s}=this;return e(l,{justify:"center"},{default:()=>[e(D,null,{trigger:()=>e(E,{value:this.modelAppThemeRef,"onUpdate:value":o=>this.modelAppThemeRef=o,railStyle:s.bind(this),onUpdateValue:o=>o?i():n()},{"checked-icon":()=>e(r,{name:"dark"},null),"unchecked-icon":()=>e(r,{name:"light"},null),checked:()=>"亮",unchecked:()=>"暗"}),default:()=>this.getAppTheme?t("headerSettingOptions.ThemeOptions.Dark"):t("headerSettingOptions.ThemeOptions.Light")})]})}});var se={pkg:{dependencies:{"@logicflow/core":"2.0.10","@logicflow/extension":"2.0.14","@vueuse/core":"^12.4.0",axios:"^1.7.9",clipboard:"^2.0.11","crypto-js":"4.2.0","currency.js":"^2.0.4",dayjs:"^1.11.13",echarts:"^5.6.0","html-to-image":"1.11.11",interactjs:"1.10.27",jsbarcode:"3.11.6","lodash-es":"^4.17.21",mockjs:"1.1.0","naive-ui":"^2.41.0",pinia:"^2.3.0","pinia-plugin-persistedstate":"^4.2.0","print-js":"^1.6.0",vue:"^3.5.13","vue-demi":"0.14.10","vue-hooks-plus":"2.2.3","vue-i18n":"^9.13.1","vue-router":"^4.4.0","vue3-next-qrcode":"2.0.10"},devDependencies:{"@amap/amap-jsapi-types":"0.0.15","@ant-design/icons-vue":"7.0.1","@commitlint/cli":"19.3.0","@commitlint/config-conventional":"19.2.2","@interactjs/types":"1.10.27","@intlify/unplugin-vue-i18n":"4.0.0","@types/crypto-js":"4.2.2","@types/jsbarcode":"3.11.4","@types/lodash-es":"4.17.12","@types/mockjs":"1.0.10","@types/three":"0.171.0","@typescript-eslint/eslint-plugin":"8.20.0","@typescript-eslint/parser":"8.20.0","@vitejs/plugin-vue":"5.2.1","@vitejs/plugin-vue-jsx":"4.1.1","@vitest/ui":"2.1.8","@vue/eslint-config-prettier":"10.1.0","@vue/eslint-config-typescript":"14.2.0","@vue/test-utils":"2.4.6",autoprefixer:"10.4.20",depcheck:"1.4.7",eslint:"9.18.0","eslint-config-prettier":"10.0.1","eslint-plugin-prettier":"5.2.2","eslint-plugin-vue":"9.32.0",globals:"15.14.0","happy-dom":"16.6.0",husky:"8.0.3","lint-staged":"15.3.0",postcss:"8.5.1","postcss-px-to-viewport-8-with-include":"1.2.2",prettier:"3.4.2","rollup-plugin-gzip":"4.0.1",sass:"1.83.4","svg-sprite-loader":"6.0.11",typescript:"5.6.3","unplugin-auto-import":"19.0.0","unplugin-vue-components":"0.28.0",vite:"6.1.0","vite-bundle-analyzer":"0.16.0","vite-plugin-cdn2":"1.1.0","vite-plugin-ejs":"1.7.0","vite-plugin-eslint":"1.8.1","vite-plugin-inspect":"0.8.4","vite-plugin-mock-dev-server":"1.8.3","vite-plugin-svg-icons":"2.0.1","vite-svg-loader":"5.1.0",vitest:"2.1.8","vue-tsc":"2.2.0"},name:"ray-template",version:"5.1.0"},layout:{copyright:"Copyright © 2022-present Ray"},appPrimaryColor:{primaryColor:"#2d8cf0",primaryFadeColor:"rgba(45, 140, 240, 0.85)"}};function le(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!m(t)}const dt=a({name:"RLogin",setup(){const{layout:{copyright:t}}=se,i=x({tabsValue:"signing"}),{height:n,width:s}=M(),{updateLocale:o}=$();return{..._(i),windowHeight:n,updateLocale:o,copyright:t,windowWidth:s}},render(){let t;const{$t:i}=this;return e("div",{class:["login"],style:[`height: ${this.windowHeight}px`,`--login-height: ${this.windowHeight}px`]},[e("div",{class:["login-wrapper",this.windowWidth>=1440?"login-wrapper--divider":""]},[e("div",{class:["login-wrapper__content"]},[e(l,{align:"center",class:"login-title__wrapper"},{default:()=>[e(r,{name:"ray",size:"48"},null),e(S,{class:"login-title",type:"info",size:28},{default:()=>[c("Ray Template")]})]}),e(l,{align:"center",class:"login-action__wrapper"},{default:()=>[e(oe,null,null),e(Q,{options:z,onSelect:n=>this.updateLocale(n),trigger:"click"},{default:()=>[e(r,{customClassName:"login-icon",name:"language",size:"18",cursor:"pointer"},null)]})]}),e(U,{cols:"s:1 m:1 l:2 xl:2 2xl:2",itemResponsive:!1,responsive:"screen"},{default:()=>[e(b,{span:"s:0 m:0 l:1 xl:1 2xl:1",class:"login__left-wrapper"},{default:()=>[e(l,{align:"center",vertical:!0},{default:()=>[e(r,{name:"login_bg",width:"368",height:"368"},null),e(S,{class:"login-title",type:"info",size:36},le(t=i("views.login.index.RayTemplate"))?t:{default:()=>[t]})]})]}),e(b,{span:1,class:"login__right-wrapper"},{default:()=>[e(H,{class:"login__right-wrapper__content",embedded:!0,bordered:!1},{default:()=>[e(W,{value:this.tabsValue,"onUpdate:value":n=>this.tabsValue=n,type:"line",animated:!0,size:"large"},{default:()=>e(B,null,[e(g,{tab:i("views.login.index.Signing"),name:"signing"},{default:()=>[e(Z,null,null)]}),e(g,{tab:i("views.login.index.Register"),name:"register"},{default:()=>[e(ee,null,null)]}),e(g,{tab:i("views.login.index.QRCodeSigning"),name:"qrcodeSigning"},{default:()=>[e(te,null,null)]})])}),e(k,null,{default:()=>[c("其他登陆方式")]}),e(ne,null,null),e(k,null,{default:()=>[c("友情链接")]}),e(X,null,null)]})]})]}),e(l,{align:"center",justify:"center",class:"login-copyright__wrapper"},{default:()=>[this.copyright]})])])])}});export{dt as default};
