import{m as n,b as e,p as s,q as i}from"./@vue_runtime-core@3.5.13-pPpmd6wL.js";import{y as r,Y as c,e as p}from"./naive-ui@2.41.0_vue@3.5.13_typescript@5.6.3_-Pd0MfMWr.js";function l(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!i(t)}const m=n({name:"AppShareLink",setup(){return{handleLinkClick:a=>{window.open(a.src)},avatarOptions:[{key:"ray-js-note",src:"https://note.youdao.com/s/ObWEe2BB",tooltip:"Ray的前端学习笔记",icon:"https://avatars.githubusercontent.com/u/51957438?v=4"},{key:"ray-js-cover",src:"https://note.youdao.com/s/IC8xKPdB",tooltip:"Ray的面试题总结",icon:"https://avatars.githubusercontent.com/u/51957438?v=4"},{key:"ray-template-doc",src:"https://xiaodaigua-ray.github.io/ray-template-doc/",tooltip:"Ray Template Doc",icon:"https://avatars.githubusercontent.com/u/51957438?v=4"},{key:"ray-template-doc-out",src:"https://ray-template.yunkuangao.com/",tooltip:"Ray Template Doc (国内地址)",icon:"https://avatars.githubusercontent.com/u/51957438?v=4"}]}},render(){let t;return e(p,null,l(t=this.avatarOptions.map(o=>e(r,{key:o.key},{trigger:()=>e(c,s({round:!0,src:o.icon,style:["cursor: pointer"]},{onClick:this.handleLinkClick.bind(this,o)},{objectFit:"cover",size:24}),null),default:()=>o.tooltip})))?t:{default:()=>[t]})}});export{m as A};