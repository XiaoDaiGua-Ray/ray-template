import{d as c,K as e,u as n,b as p}from"./vue-vendor-0e3aae74.js";import{al as s,aD as i,an as r}from"./vendor-1f51a4af.js";function l(o){return typeof o=="function"||Object.prototype.toString.call(o)==="[object Object]"&&!p(o)}const m=c({name:"RayLink",setup(){return{handleLinkClick:a=>{window.open(a.src)},avatarOptions:[{key:"yunhome",src:"https://yunkuangao.me/",tooltip:"云之家",icon:"https://yunkuangao.me/wp-content/uploads/2022/05/cropped-cropped-QQ%E5%9B%BE%E7%89%8720220511113928.jpg"},{key:"yun-cloud-images",src:"https://yunkuangao.com/",tooltip:"云图床",icon:"https://yunkuangao.me/wp-content/uploads/2022/05/cropped-cropped-QQ%E5%9B%BE%E7%89%8720220511113928.jpg"},{key:"ray-js-note",src:"https://note.youdao.com/s/ObWEe2BB",tooltip:"Ray的前端学习笔记",icon:"https://usc1.contabostorage.com/c2e495d7890844d392e8ec0c6e5d77eb:image/longmao.jpeg"},{key:"ray-js-cover",src:"https://note.youdao.com/s/IC8xKPdB",tooltip:"Ray的面试题总结",icon:"https://usc1.contabostorage.com/c2e495d7890844d392e8ec0c6e5d77eb:image/longmao.jpeg"},{key:"ray-template-doc",src:"https://xiaodaigua-ray.github.io/ray-template-doc/",tooltip:"Ray Template Doc",icon:"https://usc1.contabostorage.com/c2e495d7890844d392e8ec0c6e5d77eb:image/longmao.jpeg"},{key:"ray-template-doc-out",src:"https://ray-template.yunkuangao.com/",tooltip:"Ray Template Doc (国内地址)",icon:"https://usc1.contabostorage.com/c2e495d7890844d392e8ec0c6e5d77eb:image/longmao.jpeg"}]}},render(){let o;return e(r,null,l(o=this.avatarOptions.map(t=>e(s,null,{trigger:()=>e(i,n({round:!0,src:t.icon,style:["cursor: pointer"]},{onClick:this.handleLinkClick.bind(this,t)},{objectFit:"cover",size:24}),null),default:()=>t.tooltip})))?o:{default:()=>[o]})}});export{m as R};
