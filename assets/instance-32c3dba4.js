import{k as o,l as t,m as l,A as d}from"./index-eb51c16b.js";const I={baseURL:"",withCredentials:!1,timeout:5*1e3,headers:{"Content-Type":"application/json"}},{setImplement:c}=o(),R=(e,r)=>{t.removePendingRequest(e.config)},q=(e,r)=>{},A=()=>{c("implementResponseInterceptorArray",[R],"ok")},E=()=>{c("implementResponseInterceptorErrorArray",[q],"error")},y=(e,r)=>{if(e){const s=e.headers;r.forEach(n=>{s[n.key]=n.value})}},{setImplement:p}=o(),k=(e,r)=>{const s=l(d.token);return e.url,{key:"X-TOKEN",value:s}},f=(e,r)=>{y(e,[k(e),{key:"Demo-Header-Key",value:"Demo Header Value"}])},P=(e,r)=>{t.removePendingRequest(e),t.addPendingRequest(e)},g=(e,r)=>{},v=()=>{p("implementRequestInterceptorArray",[f,P],"ok")},C=()=>{p("implementRequestInterceptorErrorArray",[g],"error")},a=axios.create(I),{createAxiosInstance:m,beforeFetch:u,fetchError:i}=o();a.interceptors.request.use(e=>(m(e,"requestInstance"),v(),u("requestInstance","implementRequestInterceptorArray","ok"),e),e=>(C(),i("requestError",e,"implementRequestInterceptorErrorArray"),Promise.reject(e)));a.interceptors.response.use(e=>{m(e,"responseInstance"),A(),u("responseInstance","implementResponseInterceptorArray","ok");const{data:r}=e;return Promise.resolve(r)},e=>(E(),i("responseError",e,"implementResponseInterceptorErrorArray"),t.removePendingRequest(e.config||{}),Promise.reject(e)));export{a as s};
