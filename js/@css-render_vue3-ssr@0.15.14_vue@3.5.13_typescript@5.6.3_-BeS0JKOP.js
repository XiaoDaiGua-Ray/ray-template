import{i as u}from"./@vue_runtime-core@3.5.13-BsGyjLIk.js";const i="@css-render/vue3-ssr";function o(e,n){return`<style cssr-id="${e}">
${n}
</style>`}function c(e,n,t){const{styles:r,ids:s}=t;s.has(e)||r!==null&&(s.add(e),r.push(o(e,n)))}const d=typeof document<"u";function l(){if(d)return;const e=u(i,null);if(e!==null)return{adapter:(n,t)=>c(n,t,e),context:e}}export{l as u};
