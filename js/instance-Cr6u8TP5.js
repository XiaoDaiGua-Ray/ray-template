import{B as t,C as n,d as R,E as q}from"./hooks-tayE4ZeM.js";import{g as d}from"./utils-CoTBVCjC.js";import"./dayjs@1.11.10-BYZwCyGy.js";import"./print-js@1.6.0-C3lAJnMa.js";import"./awesome-qr@2.1.5-rc.0-Ds7AaOTE.js";import"./vue-hooks-plus@1.8.8_vue@3.4.21-C_BRgauB.js";import"./lodash@4.17.21-CM7ROh5r.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DuGDi0R7.js";import"./currency.js@2.0.4-9OAR_aOO.js";const A=(e,r)=>{t.removePendingRequest(e)},y=(e,r)=>{t.removePendingRequest(e)},p={implementResponseInterceptorArray:[A],implementResponseInterceptorErrorArray:[y]},{setImplement:m}=n(),E=()=>{const{implementResponseInterceptorArray:e}=p;m("implementResponseInterceptorArray",e,"ok")},k=()=>{const{implementResponseInterceptorErrorArray:e}=p;m("implementResponseInterceptorErrorArray",e,"error")},P=(e,r)=>{if(e){const o=e.headers;r.forEach(s=>{o[s.key]=s.value})}},v=(e,r)=>{const o=d(R.token);return e.url,{key:"X-TOKEN",value:o}},C=(e,r)=>{P(e,[v(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},g=(e,r)=>{t.removePendingRequest(e),t.addPendingRequest(e)},f=(e,r)=>{t.removePendingRequest(e)},c={implementRequestInterceptorArray:[C,g],implementRequestInterceptorErrorArray:[f]},{setImplement:a}=n(),H=()=>{const{implementRequestInterceptorArray:e}=c;a("implementRequestInterceptorArray",e,"ok")},j=()=>{const{implementRequestInterceptorErrorArray:e}=c;a("implementRequestInterceptorErrorArray",e,"error")},i=axios.create(q),{createAxiosInstance:u,beforeFetch:l,fetchError:I}=n();i.interceptors.request.use(e=>(u(e,"requestInstance"),H(),l("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(j(),I("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));i.interceptors.response.use(e=>{u(e,"responseInstance"),E(),l("responseInstance","implementResponseInterceptorArray","ok");const{data:r}=e;return Promise.resolve(r)},e=>(k(),I("responseError",e,"implementResponseInterceptorErrorArray"),Promise.reject(e)));export{i as s};
