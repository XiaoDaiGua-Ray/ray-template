const i=Vue.defineComponent({name:"RDirective",setup(){const e=Vue.reactive({copyValueOne:"我是待复制内容区域一",copyValueTwo:"我是待复制内容区域二",throttleBtnClickCount:0,debounceBtnClickCount:0,disabledValue:!1}),u=Vue.ref(2),t=a=>{e[a]++};return{...Vue.toRefs(e),updateDemoValue:t,ellipsisLineClamp:u}},render(){return Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.createVNode(naive.NCard,{title:"指令"},{default:()=>[Vue.createTextVNode("该页面展示如何使用已封装好的指令")]}),Vue.createVNode(naive.NCard,{title:"水波纹"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NAlert,{title:"modifiers",type:"info"},{default:()=>[Vue.createTextVNode("你可以手动显示的声明水波纹效果，默认为 circle。你可以手动的声明为 center。")]}),Vue.createVNode(naive.NAlert,{title:"vue template",type:"success"},{default:()=>[Vue.createTextVNode('"v-ripple.center" 或者 "v-ripple.circle"。')]}),Vue.createVNode(naive.NAlert,{title:"tsx",type:"success"},{default:()=>[JSON.stringify("v-ripple={[true, ['center']]}"),Vue.createTextVNode(" 或者"),JSON.stringify("v-ripple={[true, ['circle']]}"),Vue.createTextVNode("。")]}),Vue.createVNode(naive.NFlex,null,{default:()=>[Vue.withDirectives(Vue.createVNode(naive.NTag,{type:"success",size:"large"},{default:()=>[Vue.createTextVNode("水波纹效果的Tag")]}),[[Vue.resolveDirective("ripple")]]),Vue.withDirectives(Vue.createVNode(naive.NTag,{type:"warning",size:"large"},{default:()=>[Vue.createTextVNode("水波纹效果的Tag")]}),[[Vue.resolveDirective("ripple")]]),Vue.withDirectives(Vue.createVNode(naive.NTag,{type:"error",size:"large"},{default:()=>[Vue.createTextVNode("水波纹效果的Tag")]}),[[Vue.resolveDirective("ripple")]]),Vue.withDirectives(Vue.createVNode(naive.NButton,{type:"info"},{default:()=>[Vue.createTextVNode("水波纹效果的Button")]}),[[Vue.resolveDirective("ripple")]]),Vue.withDirectives(Vue.createVNode("div",{style:"height: 20px; line-height: 20px;text-align: center; border: 1px solid; padding: 6px;"},[Vue.createTextVNode("原生元素绑定水波纹效果，并且手动绑定 modifiers 为 center")]),[[Vue.resolveDirective("ripple"),!0,void 0,{center:!0}]])]})]})]}),Vue.createVNode(naive.NCard,{title:"文本省略"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NCard,{title:"单行省略"},{default:()=>[Vue.withDirectives(Vue.createVNode("div",null,[Vue.createTextVNode("我是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本。")]),[[Vue.resolveDirective("ellipsis"),{type:"block",width:"100px"}]])]}),Vue.createVNode(naive.NCard,{title:"多行省略"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0,size:"large"},{default:()=>[Vue.createVNode(naive.NAlert,{title:"注意",type:"warning"},{default:()=>[Vue.createTextVNode("该方法基于非标准属性实现（-webkit-line-clamp），可能会有兼容性问题，所以请谨慎使用。 详情参考："),Vue.createVNode("a",{href:"https://caniuse.com/?search=line-clamp"},[Vue.createTextVNode("can i use")])]}),Vue.withDirectives(Vue.createVNode("div",null,[Vue.createTextVNode("我是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本。")]),[[Vue.resolveDirective("ellipsis"),{type:"line",width:"100px",line:this.ellipsisLineClamp}]]),Vue.createVNode(naive.NInputNumber,{value:this.ellipsisLineClamp,"onUpdate:value":e=>this.ellipsisLineClamp=e,min:1},null)]})]})]})]}),Vue.createVNode(naive.NCard,{title:"文本复制示例一"},{default:()=>[Vue.createVNode(naive.NInputGroup,null,{default:()=>[Vue.createVNode(naive.NInput,{value:this.copyValueOne,"onUpdate:value":e=>this.copyValueOne=e},null),Vue.withDirectives(Vue.createVNode(naive.NButton,null,{default:()=>[Vue.createTextVNode("复制")]}),[[Vue.resolveDirective("copy"),this.copyValueOne]])]})]}),Vue.createVNode(naive.NCard,{title:"文本复制示例二"},{default:()=>[Vue.createVNode(naive.NInputGroup,null,{default:()=>[Vue.createVNode(naive.NInput,{value:this.copyValueTwo,"onUpdate:value":e=>this.copyValueTwo=e},null),Vue.withDirectives(Vue.createVNode(naive.NButton,null,{default:()=>[Vue.createTextVNode("复制")]}),[[Vue.resolveDirective("copy"),this.copyValueTwo]])]})]}),Vue.createVNode(naive.NCard,{title:"节流"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.withDirectives(Vue.createVNode(naive.NButton,null,{default:()=>[Vue.createTextVNode("点击执行")]}),[[Vue.resolveDirective("throttle"),{func:this.updateDemoValue.bind(null,"throttleBtnClickCount"),trigger:"click",wait:3e3,options:{}}]]),Vue.createVNode("p",null,[Vue.createTextVNode("我执行了"),this.throttleBtnClickCount,Vue.createTextVNode("次")]),Vue.createVNode("p",null,[Vue.createTextVNode("该方法 3s 内仅会执行一次")])]})]}),Vue.createVNode(naive.NCard,{title:"防抖"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.withDirectives(Vue.createVNode(naive.NButton,null,{default:()=>[Vue.createTextVNode("点击执行")]}),[[Vue.resolveDirective("debounce"),{func:this.updateDemoValue.bind(null,"debounceBtnClickCount"),trigger:"click",wait:3e3,options:{}}]]),Vue.createVNode("p",null,[Vue.createTextVNode("我执行了"),this.debounceBtnClickCount,Vue.createTextVNode("次")]),Vue.createVNode("p",null,[Vue.createTextVNode("该方法将延迟 3s 执行")])]})]}),Vue.createVNode(naive.NCard,{title:"禁用"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.createVNode(naive.NSwitch,{value:this.disabledValue,"onUpdate:value":e=>this.disabledValue=e},{checked:()=>"取消",unchecked:()=>"禁用"}),Vue.createVNode(naive.NCard,{title:"描述"},{default:()=>[Vue.createVNode("p",null,[Vue.createTextVNode("该指令会强制禁用（通过 css 层面）禁用元素交互。但是 naive ui 组件提供了完整的 disabled 属性，所以在组件库有禁用需求时，直接调用组件库 disabled 属性即可。但是值得注意的是，该指令优先级最高，会覆盖组件 disabled 属性。")])]}),Vue.createVNode(naive.NCard,{title:"原生表单"},{default:()=>[Vue.withDirectives(Vue.createVNode("form",null,[Vue.createVNode("input",{type:"text",placeholder:"请输入"},null),Vue.createVNode("button",null,[Vue.createTextVNode("提交")])]),[[Vue.resolveDirective("disabled"),this.disabledValue]])]}),Vue.createVNode(naive.NCard,{title:"文本内容"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0},{default:()=>[Vue.withDirectives(Vue.createVNode("p",null,[Vue.createTextVNode("我是可以被禁用的文本内容")]),[[Vue.resolveDirective("disabled"),this.disabledValue]])]})]}),Vue.createVNode(naive.NCard,{title:"naive 组件"},{default:()=>[Vue.createVNode(naive.NFlex,{vertical:!0,justify:"start"},{default:()=>[Vue.withDirectives(Vue.createVNode(naive.NForm,null,{default:()=>[Vue.createVNode(naive.NFormItem,null,{default:()=>[Vue.createVNode(naive.NInput,null,null)]})]}),[[Vue.resolveDirective("disabled"),this.disabledValue]]),Vue.withDirectives(Vue.createVNode(naive.NButton,null,{default:()=>[Vue.createTextVNode("按钮")]}),[[Vue.resolveDirective("disabled"),this.disabledValue]]),Vue.withDirectives(Vue.createVNode(naive.NSwitch,null,null),[[Vue.resolveDirective("disabled"),this.disabledValue]])]})]})]})]})]})}});export{i as default};