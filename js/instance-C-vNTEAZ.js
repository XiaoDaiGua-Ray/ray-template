import{a as R}from"./axios@1.7.9-upsvKRUO.js";import{$ as t,a0 as n,f as q,a1 as d}from"./hooks-DkwyRhJW.js";import"./dayjs@1.11.13-DmclB1g0.js";import"./print-js@1.6.0-CSPo0Tcq.js";import"./vue-hooks-plus@2.2.1_vue@3.5.13_typescript@5.6.3_-aIJXVmKG.js";import"./lodash@4.17.21-DdnujIRq.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-Beyjefx-.js";import"./jsbarcode@3.11.6-oBoQ6a3L.js";import"./@logicflow_core@2.0.6-RNiIy_D6.js";import"./mobx-preact@3.0.0_mobx@5.15.7_preact@10.22.0-q-IhwcFu.js";import"./preact@10.22.0-D1_UwAj3.js";import{g as A}from"./utils-D0vAZTsb.js";import"./currency.js@2.0.4-9OAR_aOO.js";const y=(e,r)=>{t.removePendingRequest(e)},E=(e,r)=>{t.removePendingRequest(e)},p={implementResponseInterceptorArray:[y],implementResponseInterceptorErrorArray:[E]},{setImplement:m}=n(),k=()=>{const{implementResponseInterceptorArray:e}=p;m("implementResponseInterceptorArray",e,"ok")},P=()=>{const{implementResponseInterceptorErrorArray:e}=p;m("implementResponseInterceptorErrorArray",e,"error")},f=(e,r)=>{t.removePendingRequest(e),t.addPendingRequest(e)},g=(e,r)=>{t.removePendingRequest(e)},v=(e,r)=>{if(e){const o=e.headers;r.forEach(s=>{o[s.key]=s.value})}},C=(e,r)=>{const o=A(q.token,"localStorage");return e.url,{key:"X-TOKEN",value:o}},H=(e,r)=>{v(e,[C(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},c={implementRequestInterceptorArray:[H,f],implementRequestInterceptorErrorArray:[g]},{setImplement:a}=n(),j=()=>{const{implementRequestInterceptorArray:e}=c;a("implementRequestInterceptorArray",e,"ok")},x=()=>{const{implementRequestInterceptorErrorArray:e}=c;a("implementRequestInterceptorErrorArray",e,"error")},i=R.create(d),{createAxiosInstance:u,beforeFetch:l,fetchError:I}=n();i.interceptors.request.use(e=>(u(e,"requestInstance"),j(),l("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(x(),I("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));i.interceptors.response.use(e=>{u(e,"responseInstance"),k(),l("responseInstance","implementResponseInterceptorArray","ok");const{data:r}=e;return Promise.resolve(r)},e=>(P(),I("responseError",e,"implementResponseInterceptorErrorArray"),Promise.reject(e)));export{i as s};