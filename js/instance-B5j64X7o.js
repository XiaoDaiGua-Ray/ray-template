import{Y as t,Z as n,e as R,$ as q}from"./hooks-DeCbIFFS.js";import"./print-js@1.6.0-BdoEj60G.js";import"./vue-hooks-plus@2.2.1_vue@3.4.38-DdMBTcyt.js";import"./lodash@4.17.21-Cw59kuJw.js";import"./js-cookie@3.0.5-Z_8Sd105.js";import"./screenfull@5.2.0-DmMZCkhi.js";import{g as d}from"./utils-DGuZdIHQ.js";import"./currency.js@2.0.4-9OAR_aOO.js";const A=(e,r)=>{t.removePendingRequest(e)},y=(e,r)=>{t.removePendingRequest(e)},p={implementResponseInterceptorArray:[A],implementResponseInterceptorErrorArray:[y]},{setImplement:m}=n(),E=()=>{const{implementResponseInterceptorArray:e}=p;m("implementResponseInterceptorArray",e,"ok")},k=()=>{const{implementResponseInterceptorErrorArray:e}=p;m("implementResponseInterceptorErrorArray",e,"error")},P=(e,r)=>{t.removePendingRequest(e),t.addPendingRequest(e)},g=(e,r)=>{t.removePendingRequest(e)},v=(e,r)=>{if(e){const o=e.headers;r.forEach(s=>{o[s.key]=s.value})}},C=(e,r)=>{const o=d(R.token,"localStorage");return e.url,{key:"X-TOKEN",value:o}},f=(e,r)=>{v(e,[C(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},c={implementRequestInterceptorArray:[f,P],implementRequestInterceptorErrorArray:[g]},{setImplement:a}=n(),H=()=>{const{implementRequestInterceptorArray:e}=c;a("implementRequestInterceptorArray",e,"ok")},j=()=>{const{implementRequestInterceptorErrorArray:e}=c;a("implementRequestInterceptorErrorArray",e,"error")},i=axios.create(q),{createAxiosInstance:u,beforeFetch:l,fetchError:I}=n();i.interceptors.request.use(e=>(u(e,"requestInstance"),H(),l("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(j(),I("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));i.interceptors.response.use(e=>{u(e,"responseInstance"),E(),l("responseInstance","implementResponseInterceptorArray","ok");const{data:r}=e;return Promise.resolve(r)},e=>(k(),I("responseError",e,"implementResponseInterceptorErrorArray"),Promise.reject(e)));export{i as s};