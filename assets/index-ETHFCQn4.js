import{h as l,o as i,m as o,j as f}from"./index-EwlO25Hg.js";const d={src:{type:String,required:!0},iframeWrapperClass:{type:String,default:null},frameborder:{type:Number,default:0},width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"100%"},allow:{type:String,default:null},name:{type:String,default:null},title:{type:String,default:null},onSuccess:{type:[Function,Array],default:null},onError:{type:[Function,Array],default:null},customSpinProps:{type:Object,default:()=>({})},lazy:{type:Boolean,default:!0},wrapperClass:{type:String,default:null}},h=Vue.defineComponent({name:"RIframe",props:d,setup(r,{expose:c}){const m=Vue.computed(()=>({"--ray-iframe-frameborder":l(r.frameborder),"--ray-iframe-width":l(r.width),"--ray-iframe-height":l(r.height)})),e=Vue.ref(),s=Vue.ref(!0),n=a=>{s.value=!1;const{onSuccess:t}=r;t&&f(t,e.value,a)},u=a=>{s.value=!1;const{onError:t}=r;t&&f(t,a)};return c({iframeInst:e}),Vue.onMounted(()=>{i(e.value,"load",n.bind(this)),i(e.value,"error",u)}),Vue.onBeforeUnmount(()=>{o(e.value,"load",n),o(e.value,"error",u)}),{cssVars:m,iframeRef:e,spinShow:s}},render(){return Vue.createVNode("div",{class:["ray-iframe",this.iframeWrapperClass],style:[this.cssVars]},[Vue.createVNode(naive.NSpin,Vue.mergeProps(this.customSpinProps,{show:this.spinShow}),{...this.$slots,default:()=>Vue.createVNode("iframe",Vue.mergeProps({class:["ray-iframe__container",this.wrapperClass],ref:"iframeRef",src:this.src,allow:this.allow,name:this.name,title:this.title},{loading:this.lazy?"lazy":null}),null)})])}});export{h as R};
