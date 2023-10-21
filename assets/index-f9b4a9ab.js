function s(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!Vue.isVNode(t)}const g=Vue.defineComponent({name:"RelyAbout",setup(){const{pkg:t}={pkg:{dependencies:{"@vueuse/core":"^9.13.0","awesome-qr":"2.1.5-rc.0",axios:"^1.2.0",clipboard:"^2.0.11","crypto-js":"^4.1.1","currency.js":"^2.0.4",dayjs:"^1.11.7",echarts:"^5.4.0","lodash-es":"^4.17.21",mockjs:"1.1.0","naive-ui":"^2.35.0",pinia:"^2.1.4","pinia-plugin-persistedstate":"^3.1.0","print-js":"^1.6.0",vue:"^3.3.4","vue-hooks-plus":"1.8.5","vue-i18n":"^9.2.2","vue-router":"^4.2.4",vuedraggable:"^4.1.0",xlsx:"^0.18.5"},devDependencies:{"@babel/core":"^7.20.2","@babel/eslint-parser":"^7.19.1","@commitlint/cli":"^17.4.2","@commitlint/config-conventional":"^17.4.2","@intlify/unplugin-vue-i18n":"^0.12.1","@types/crypto-js":"^4.1.1","@types/lodash-es":"^4.17.7","@types/mockjs":"1.0.7","@types/scrollreveal":"^0.0.8","@typescript-eslint/eslint-plugin":"^5.61.0","@typescript-eslint/parser":"^5.61.0","@vitejs/plugin-vue":"^4.2.3","@vitejs/plugin-vue-jsx":"^3.0.1","@vue-hooks-plus/resolvers":"1.2.4","@vue/eslint-config-prettier":"^7.1.0","@vue/eslint-config-typescript":"^11.0.3",autoprefixer:"^10.4.8",depcheck:"^1.4.3",eslint:"^8.44.0","eslint-config-prettier":"^8.8.0","eslint-config-standard-with-typescript":"^23.0.0","eslint-plugin-import":"^2.25.2","eslint-plugin-n":"^15.0.0","eslint-plugin-prettier":"^4.2.1","eslint-plugin-promise":"^6.0.0","eslint-plugin-react":"^7.31.10","eslint-plugin-vue":"^9.15.1",husky:"^8.0.3","lint-staged":"^13.1.0",postcss:"^8.1.0","postcss-px-to-viewport-8-plugin":"1.2.2",prettier:"^2.7.1","rollup-plugin-visualizer":"^5.8.3",sass:"1.54.3","svg-sprite-loader":"^6.0.11",typescript:"^5.0.2","unplugin-auto-import":"^0.15.0","unplugin-vue-components":"^0.25.1",vite:"^4.4.9","vite-plugin-cdn2":"0.12.4","vite-plugin-compression":"^0.5.1","vite-plugin-ejs":"^1.6.4","vite-plugin-eslint":"1.8.1","vite-plugin-imp":"^2.3.1","vite-plugin-inspect":"^0.7.26","vite-plugin-mock-dev-server":"1.3.0","vite-plugin-svg-icons":"^2.0.1","vite-svg-loader":"^4.0.0","vue-tsc":"^1.8.4"},name:"ray-template",version:"4.2.4"},layout:{copyright:"Copyright © 2022-present Ray",sideBarLogo:{icon:"ray",title:"Ray Template",url:"/dashboard",jumpType:"station"}},appPrimaryColor:{primaryColor:"#2d8cf0",primaryFadeColor:"rgba(45, 140, 240, 0.3)"}},{dependencies:u,devDependencies:i,name:e,version:c}=t,d=[{title:"依赖名称",key:"name"},{title:"依赖版本",key:"relyVersion"},{title:"依赖地址",key:"relyAddress"}],l=Vue.ref([]),a=Vue.ref([]),v=[{name:"项目名称",label:e},{name:"版本信息",label:c},{name:"项目地址",label:"GitHub",url:"https://github.com/XiaoDaiGua-Ray/ray-template"}],m=()=>{const n=o=>Object.keys(o).reduce((r,p)=>(r.push({name:p,relyVersion:o[p],relyAddress:""}),r),[]);l.value=n(u),a.value=n(i)},y=n=>{n.url&&window.open(n.url)};return Vue.onBeforeMount(()=>{m()}),{columns:d,dependenciesOptions:l,devDependenciesOptions:a,templateOptions:v,handleTagClick:y}},render(){let t,u,i;return Vue.createVNode("div",{class:"rely-about"},[Vue.createVNode(naive.NCard,{title:"关于项目"},{default:()=>[Vue.createTextVNode("ray template 是一个基于: tsx pinia vue3.x vite sass 的中后台解决方案. 项目干净与轻巧, 已经集成了很多项目中可能需要的搬砖工具可以让你快速起一个相关项目, 并且不需要剔除大量无用页面与组件.")]}),Vue.createVNode(naive.NCard,{title:"项目信息"},{default:()=>[Vue.createVNode(naive.NDescriptions,{bordered:!0,labelPlacement:"left"},s(t=this.templateOptions.map(e=>Vue.createVNode(naive.NDescriptionsItem,{key:e.name,label:e.name},{default:()=>[Vue.createVNode(naive.NTag,Vue.mergeProps({bordered:!1,type:"info"},{onClick:this.handleTagClick.bind(this,e)},{style:[e.url?"cursor: pointer":""]}),{default:()=>[e.label]})]})))?t:{default:()=>[t]})]}),Vue.createVNode(naive.NCard,{title:"生产依赖"},{default:()=>[Vue.createVNode(naive.NDescriptions,{bordered:!0,labelPlacement:"left"},s(u=this.dependenciesOptions.map(e=>Vue.createVNode(naive.NDescriptionsItem,{key:e.name,label:e.name},{default:()=>[e.relyVersion]})))?u:{default:()=>[u]})]}),Vue.createVNode(naive.NCard,{title:"开发依赖"},{default:()=>[Vue.createVNode(naive.NDescriptions,{bordered:!0,labelPlacement:"left"},s(i=this.devDependenciesOptions.map(e=>Vue.createVNode(naive.NDescriptionsItem,{key:e.name,label:e.name},{default:()=>[e.relyVersion]})))?i:{default:()=>[i]})]})])}});export{g as default};
