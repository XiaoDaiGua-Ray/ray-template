import{d as I,t as j,c as x}from"./lodash@4.17.21-e6f077ad.js";import"./js-cookie@3.0.5-19aa770d.js";import{s as m}from"./screenfull@5.2.0-7567c894.js";import"./qs@6.11.2-83b75eda.js";const H=(n,{manual:e,ready:t=!0,refreshDeps:s=[],refreshDepsAction:r})=>{const u=Vue.ref(!1);return Vue.watchEffect(()=>{!e&&n.options.refreshDeps!==!0&&(u.value=Vue.unref(t))}),s instanceof Array?Vue.watch([u,...s],([i])=>{i&&!e&&i&&(r?r():n.refresh())},{deep:!0,immediate:!1}):Vue.watch(u,i=>{!e&&i&&(r?r():n.refresh())}),{name:"autoRunPlugin",onBefore:()=>{if(!Vue.unref(t))return{stopNow:!0}}}};H.onInit=({ready:n=!0,manual:e})=>({loading:!e&&Vue.unref(n)});const R=new Map,Q=(n,e,t)=>{const s=R.get(n);s!=null&&s.timer&&clearTimeout(s.timer);let r;e>-1&&(r=setTimeout(()=>{R.delete(n)},e)),R.set(n,{...t,timer:r})},W=n=>R.get(n),S=new Map,G=n=>S.get(n),Y=(n,e)=>{S.set(n,e),e.then(t=>(S.delete(n),t)).catch(t=>{throw S.delete(n),t})},V={},z=[],J=(n,e)=>{V[n]&&(V[n].forEach(t=>t(e)),z.forEach(t=>t({type:n,data:e})))},T=(n,e)=>(V[n]||(V[n]=[]),V[n].push(e),function(){const s=V[n].indexOf(e);V[n].splice(s,1)}),X=(n,{cacheKey:e,cacheTime:t=5*60*1e3,staleTime:s=0,setCache:r,getCache:u})=>{const i=Vue.ref(),c=Vue.ref(),a=(o,l)=>{r?r(l):Q(o,t,l),J(o,l.data)},f=(o,l=[])=>u?u(l):W(o);return Vue.watchEffect(()=>{if(!e)return;const o=f(e);o&&Object.hasOwnProperty.call(o,"data")&&(n.state.data=o.data,n.state.params=o.params,(s===-1||new Date().getTime()-o.time<=s)&&(n.state.loading=!1)),i.value=T(e,l=>{n.setState({data:l})})}),Vue.onScopeDispose(()=>{var o;(o=i.value)==null||o.call(i)}),e?{name:"cachePlugin",onBefore:o=>{const l=f(e,o);return!l||!Object.hasOwnProperty.call(l,"data")?{}:s===-1||new Date().getTime()-l.time<=s?{loading:!1,data:l==null?void 0:l.data,returnNow:!0}:{data:l==null?void 0:l.data}},onRequest:(o,l)=>{let d=G(e);return d&&d!==c.value?{servicePromise:d}:(d=o(...l),c.value=d,Y(e,d),{servicePromise:d})},onSuccess:(o,l)=>{var d;e&&((d=i.value)==null||d.call(i),a(e,{data:o,params:l,time:new Date().getTime()}),i.value=T(e,h=>{n.setState({data:h})}))},onMutate:o=>{var l;e&&((l=i.value)==null||l.call(i),a(e,{data:o,params:n.state.params,time:new Date().getTime()}),i.value=T(e,d=>{n.setState({data:d})}))}}:{}},Z=(n,{debounceWait:e,debounceLeading:t,debounceTrailing:s,debounceMaxWait:r})=>{const u=Vue.ref(),i=Vue.computed(()=>{const c={},a=Vue.unref(t),f=Vue.unref(s),o=Vue.unref(r);return a!==void 0&&(c.leading=a),f!==void 0&&(c.trailing=f),o!==void 0&&(c.maxWait=o),c});return Vue.watchEffect(c=>{if(Vue.unref(e)){const a=n.runAsync.bind(n);u.value=I(f=>{f()},Vue.unref(e),i.value),n.runAsync=(...f)=>new Promise((o,l)=>{var d;(d=u.value)==null||d.call(u,()=>{a(...f).then(o).catch(l)})}),c(()=>{var f;(f=u.value)==null||f.cancel(),n.runAsync=a})}}),Vue.unref(e)?{name:"debouncePlugin",onCancel:()=>{var c;(c=u.value)==null||c.cancel()}}:{}};var K=Object.defineProperty,k=(n,e,t)=>e in n?K(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,y=(n,e,t)=>(k(n,typeof e!="symbol"?e+"":e,t),t);class ee{constructor(){y(this,"table",{}),y(this,"hashTable",{})}insert(e){const t=Symbol(e);return this.table[e]=!0,this.hashTable[t]=e,t}find(e){return this.hashTable[e]}}new ee;var te=Object.defineProperty,ne=(n,e,t)=>e in n?te(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,L=(n,e,t)=>(ne(n,typeof e!="symbol"?e+"":e,t),t);class se{constructor(){L(this,"requestInstances",new Map),L(this,"listeners",[])}emit(e){this.listeners.forEach(t=>t(e))}subscribe(e){return this.listeners.push(e),()=>{const t=this.listeners.indexOf(e);this.listeners.splice(t,1)}}insert(e,t){this.requestInstances.set(e,{...t}),this.emit({key:e,...t})}update(e,t){this.has(e)&&this.requestInstances.set(e,{...this.requestInstances.get(e),...t})}has(e){return this.requestInstances.has(e)}reset(e){if(this.requestInstances.has(e)){const t=this.requestInstances.get(e);this.requestInstances.clear(),this.insert(e,t)}else this.requestInstances.clear()}getAll(){return this.requestInstances}}new se;const re=(n,{loadingDelay:e})=>{const t=Vue.ref();if(!Vue.unref(e))return{};const s=()=>{t.value&&clearTimeout(t.value)};return{name:"loadingDelayPlugin",onBefore:()=>(s(),t.value=setTimeout(()=>{n.setState({loading:!0})},Vue.unref(e)),{loading:!1}),onFinally:()=>{s()},onCancel:()=>{s()}}};function D(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}const ie=!!(typeof window<"u"&&window.document&&window.document.createElement);function A(){return D()?document.visibilityState!=="hidden":!0}const w=[];function ue(n){return w.push(n),function(){const t=w.indexOf(n);w.splice(t,1)}}if(D()){const n=()=>{if(A())for(let e=0;e<w.length;e++){const t=w[e];t()}};window.addEventListener("visibilitychange",n,!1)}const oe=(n,{pollingInterval:e,pollingWhenHidden:t=!0,pollingErrorRetryCount:s=-1})=>{const r=Vue.ref(),u=Vue.ref(),i=Vue.ref(0),c=()=>{var a;r.value&&clearInterval(r.value),(a=u.value)==null||a.call(u)};return Vue.watchEffect(()=>{Vue.unref(e)||c()}),Vue.unref(e)?{name:"pollingPlugin",onBefore:()=>{c()},onError:()=>{i.value+=1},onSuccess:()=>{i.value=0},onFinally:()=>{s===-1||s!==-1&&i.value<=s?r.value=setTimeout(()=>{!t&&!A()?u.value=ue(()=>{n.refresh()}):n.refresh()},Vue.unref(e)):i.value=0},onCancel:()=>{c()}}:{}};function ae(n,e){let t=!1;return(...s)=>{t||(t=!0,n(...s),setTimeout(()=>{t=!1},e))}}function le(){return D()&&typeof navigator.onLine<"u"?navigator.onLine:!0}const E=[];function ce(n){return E.push(n),function(){const t=E.indexOf(n);t>-1&&E.splice(t,1)}}if(ie){const n=()=>{if(!(!A()||!le()))for(let e=0;e<E.length;e++){const t=E[e];t()}};window.addEventListener("visibilitychange",n,!1),window.addEventListener("focus",n,!1)}const fe=(n,{refreshOnWindowFocus:e,focusTimespan:t=5e3})=>{const s=Vue.ref(),r=()=>{var u;(u=s.value)==null||u.call(s)};return Vue.watchEffect(u=>{if(Vue.unref(e)){const i=ae(n.refresh.bind(n),Vue.unref(t));s.value=ce(()=>{i()})}u(()=>{r()})}),Vue.onScopeDispose(()=>{r()}),{name:"refreshOnWindowFocusPlugin"}},de=(n,{retryInterval:e,retryCount:t})=>{const s=Vue.ref(),r=Vue.ref(0),u=Vue.ref(!1);return t?{name:"retryPlugin",onBefore:()=>{u.value||(r.value=0),u.value=!1,s.value&&clearTimeout(s.value)},onSuccess:()=>{r.value=0},onError:()=>{if(r.value+=1,t===-1||r.value<=t){const i=e??Math.min(1e3*2**r.value,3e4);s.value=setTimeout(()=>{u.value=!0,n.refresh()},i)}else r.value=0},onCancel:()=>{r.value=0,s.value&&clearTimeout(s.value)}}:{}},he=(n,{throttleWait:e,throttleLeading:t,throttleTrailing:s})=>{const r=Vue.computed(()=>{const i={};return Vue.unref(t)!==void 0&&(i.leading=Vue.unref(t)),Vue.unref(s)!==void 0&&(i.trailing=Vue.unref(s)),i}),u=Vue.computed(()=>j(i=>{i()},Vue.unref(e),r.value));return Vue.watchEffect(i=>{if(Vue.unref(e)){const c=n.runAsync.bind(n);n.runAsync=(...a)=>new Promise((f,o)=>{var l;(l=u.value)==null||l.call(u,()=>{c(...a).then(f).catch(o)})}),i(()=>{var a;n.runAsync=c,(a=u.value)==null||a.cancel()})}}),Vue.unref(e)?{name:"throttlePlugin",onCancel:()=>{var i;(i=u.value)==null||i.cancel()}}:{}},$=n=>typeof n=="function",ve=n=>typeof n=="boolean";var me=Object.defineProperty,pe=(n,e,t)=>e in n?me(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,P=(n,e,t)=>(pe(n,typeof e!="symbol"?e+"":e,t),t);class be{constructor(e,t,s,r={}){P(this,"pluginImpls"),P(this,"count",0),P(this,"state",{loading:!1,params:void 0,data:void 0,error:void 0}),P(this,"previousValidData"),this.serviceRef=e,this.options=t,this.setUpdateData=s,this.initState=r,this.state={...this.state,loading:!t.manual,...r}}setState(e={}){this.state={...this.state,...e},this.setUpdateData(this.state)}setData(e,t){console.warn("Please use 'setFetchState' instead of 'setData'"),t instanceof Array?t.forEach(s=>{this.state[s]=e,this.setUpdateData(e,s)}):(this.state[t]=e,this.setUpdateData(e,t))}setFetchState(e,t){t instanceof Array?t.forEach(s=>{this.state[s]=e,this.setUpdateData(e,s)}):(this.state[t]=e,this.setUpdateData(e,t))}runPluginHandler(e,...t){var s,r,u;const i=(u=(r=(s=this.pluginImpls)==null?void 0:s.map(c=>{var a;return(a=c[e])==null?void 0:a.call(c,...t)}))!=null?r:[])==null?void 0:u.filter(Boolean);return Object.assign({},...i)}async runAsync(...e){var t,s,r,u,i,c,a,f,o;this.count+=1;const l=this.count,{stopNow:d=!1,returnNow:h=!1,...b}=this.runPluginHandler("onBefore",e);if(d)return new Promise(()=>{});if(this.setState({loading:!0,params:e,...b}),h)return Promise.resolve(b.data);(s=(t=this.options).onBefore)==null||s.call(t,e);try{let{servicePromise:v}=this.runPluginHandler("onRequest",this.serviceRef.value,e);const p=F=>{var C,B,q,U;if(l!==this.count)return new Promise(()=>{});const g=this.options.formatResult?this.options.formatResult(F):F;return this.setState({data:g,error:void 0,loading:!1}),(B=(C=this.options).onSuccess)==null||B.call(C,g,e),this.runPluginHandler("onSuccess",g,e),this.previousValidData=g,(U=(q=this.options).onFinally)==null||U.call(q,e,g,void 0),l===this.count&&this.runPluginHandler("onFinally",e,g,void 0),g};v||(v=this.serviceRef.value(...e));const M=await v;return p(M)}catch(v){if(l!==this.count)return new Promise(()=>{});throw this.setState({error:v,loading:!1}),(u=(r=this.options).onError)==null||u.call(r,v,e),this.runPluginHandler("onError",v,e),($((i=this.options)==null?void 0:i.rollbackOnError)&&((c=this.options)!=null&&c.rollbackOnError(e))||ve((a=this.options)==null?void 0:a.rollbackOnError)&&this.options.rollbackOnError)&&this.setState({data:this.previousValidData}),(o=(f=this.options).onFinally)==null||o.call(f,e,void 0,v),l===this.count&&this.runPluginHandler("onFinally",e,void 0,v),v}}run(...e){this.runAsync(...e).catch(t=>{this.options.onError||console.error(t)})}cancel(){this.count+=1,this.setState({loading:!1}),this.runPluginHandler("onCancel")}refresh(){this.run(...this.state.params||[])}refreshAsync(){return this.runAsync(...this.state.params||[])}mutate(e){const t=$(e)?e(this.state.data):e;this.runPluginHandler("onMutate",t),this.setState({data:t})}}const ge=Symbol("USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY");function _e(n){return Object.keys(n).filter(t=>["data","loading","params","error"].includes(t)).length===4}function Ve(n,e={},t=[]){const s=Vue.inject(ge,{}),{initialData:r=void 0,manual:u=!1,ready:i=!0,...c}={...s??{},...e??{}},a={manual:u,ready:i,...c},f=Vue.ref(n),o=Vue.reactive({data:r,loading:!1,params:void 0,error:void 0}),l=(v,p)=>{p?o[p]=v:_e(v)&&(o.data=v.data,o.loading=v.loading,o.error=v.error,o.params=v.params)},d=t.map(v=>{var p;return(p=v==null?void 0:v.onInit)==null?void 0:p.call(v,a)}).filter(Boolean),h=new be(f,a,l,Object.assign({},...d,o));h.options=a,h.pluginImpls=t.map(v=>v(h,a));const b=Vue.computed(()=>Vue.isRef(i)?i.value:i);if(Vue.watchEffect(()=>{if(!u){const v=h.state.params||e.defaultParams||[];b.value&&h.options.refreshDeps===!0&&f.value&&h.run(...v)}}),!u&&h.options.refreshDeps!==!0){const v=h.state.params||e.defaultParams||[];Vue.unref(i)&&h.run(...v)}return Vue.onScopeDispose(()=>{h.cancel()}),{...Vue.toRefs(o),cancel:h.cancel.bind(h),refresh:h.refresh.bind(h),refreshAsync:h.refreshAsync.bind(h),run:h.run.bind(h),runAsync:h.runAsync.bind(h),mutate:h.mutate.bind(h)}}function Fe(n,e,t){var s;const r=(s=[null,Z,re,oe,fe,he,H,X,de])==null?void 0:s.filter(Boolean);return Ve(n,e,[...t||[],...r])}const we=!!(typeof window<"u"&&window.document&&window.document.createElement);function O(n,e){var t,s;if(!we)return;if(!n)return e;let r;return typeof n=="function"?r=n():Vue.isRef(n)?r=(s=(t=n.value)==null?void 0:t.$el)!=null?s:n.value:r=n,r}function N(n,e){if(n===e)return!0;for(let t=0;t<n.length;t++)if(!Object.is(n[t],e[t]))return!1;return!0}const Ee=n=>(t,s,r)=>{const u=Vue.ref(!1),i=Vue.ref([]),c=Vue.ref([]),a=Vue.ref();n(()=>{var f;const l=(Array.isArray(r)?r:[r]).map(d=>O(d));if(!u.value){u.value=!0,i.value=l,c.value=s,a.value=t();return}(l.length!==i.value.length||!N(l,i.value)||!N(s,c.value))&&((f=a.value)==null||f.call(a),i.value=l,c.value=s,a.value=t())}),Vue.onUnmounted(()=>{var f;(f=a.value)==null||f.call(a),u.value=!1})};Ee(Vue.watchEffect);var Pe=Object.defineProperty,Re=(n,e,t)=>e in n?Pe(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,_=(n,e,t)=>(Re(n,typeof e!="symbol"?e+"":e,t),t);class Se{constructor(){_(this,"subscriptions",new Map),_(this,"emitEffectCache",new Map),_(this,"useSubscription",(e,t)=>{const s=Vue.ref();Vue.watchEffect(r=>{var u,i;s.value=t;function c(f){s.value&&s.value(f)}const a=(i=(u=this.subscriptions)==null?void 0:u.get(e))!=null?i:[];a.push(c),this.subscriptions.set(e,a),this.emitEffect(e),r(()=>{this.subscriptions.delete(e)})})}),_(this,"emit",(e,...t)=>{if(typeof e=="string"||typeof e=="number"){const s=this.subscriptions.get(e);s==null||s.forEach(r=>{r==null||r({params:x(t),event:e})}),this.emitEffectCache.set(e,{params:x(t),event:e})}else throw new TypeError("event must be string or number !")}),_(this,"emitEffect",e=>{const t=this.emitEffectCache.get(e),s=this.subscriptions.get(e);t&&(s==null||s.forEach(r=>{r==null||r({...t})}))}),_(this,"removeListener",e=>{this.subscriptions.delete(e)}),_(this,"clear",()=>{this.subscriptions.clear()}),this.clear()}}new Se;const Ce=(n,e)=>{const{onExit:t,onEnter:s}=e||{},r=Vue.ref(t),u=Vue.ref(s),i=Vue.ref(!1),c=d=>{i.value=d},a=()=>{var d,h,b;if(m.isEnabled){const v=O(n);if(!m.element)(d=r.value)==null||d.call(r),c(!1),m.off("change",a);else{const p=m.element===v;p?(h=u.value)==null||h.call(u):(b=r.value)==null||b.call(r),c(p)}}},f=()=>{const d=O(n);if(d&&m.isEnabled)try{m.request(d),m.on("change",a)}catch(h){console.error(h)}},o=()=>{const d=O(n);m.isEnabled&&m.element===d&&m.exit()},l=()=>{i.value?o():f()};return Vue.onUnmounted(()=>{m.isEnabled&&m.off("change",a)}),[Vue.readonly(i),{enterFullscreen:f,exitFullscreen:o,toggleFullscreen:l,isEnabled:m.isEnabled}]};export{Fe as a,Ce as u};
