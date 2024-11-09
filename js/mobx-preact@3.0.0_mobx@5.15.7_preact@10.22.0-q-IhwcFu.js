import{_ as N,b}from"./preact@10.22.0-D1_UwAj3.js";import{d as E,R as C,g as m}from"./mobx@5.15.7-CEMJDQot.js";function I(e){return!(e.prototype&&e.prototype.render)&&!b.isPrototypeOf(e)}function R(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},o=t.prefix,n=o===void 0?"":o,r=t.suffix,i=r===void 0?"":r,a=e.displayName||e.name||e.constructor&&e.constructor.name||"<component>";return n+a+i}var O=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},M=function(){function e(t,o){for(var n=0;n<o.length;n++){var r=o[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}(),U=function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},W=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t&&(typeof t=="object"||typeof t=="function")?t:e},w=console;function A(e){var t=m().allowStateChanges;return m().allowStateChanges=e,t}function F(e){m().allowStateChanges=e}function X(e,t,o,n,r){var i=A(e),a=void 0;try{a=t(o,n,r)}finally{F(i)}return a}function P(e,t){var o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,n=e[t],r=$[t],i=n?o===!0?function(){r.apply(this,arguments),n.apply(this,arguments)}:function(){n.apply(this,arguments),r.apply(this,arguments)}:r;e[t]=i}function x(e,t){if(e==null||t==null||(typeof e>"u"?"undefined":O(e))!=="object"||(typeof t>"u"?"undefined":O(t))!=="object")return e!==t;var o=Object.keys(e);if(o.length!==Object.keys(t).length)return!0;for(var n=void 0,r=o.length-1;n=o[r];r--)if(t[n]!==e[n])return!0;return!1}var $={componentWillMount:function(){var t=this,o=R(this),n=!1,r=!1;function i(f){var u=this[f],l=E("reactive "+f);Object.defineProperty(this,f,{configurable:!0,enumerable:!0,get:function(){return l.reportObserved(),u},set:function(s){!r&&x(u,s)?(u=s,n=!0,l.reportChanged(),n=!1):u=s}})}i.call(this,"props"),i.call(this,"state");var a=this.render.bind(this),c=null,p=!1,g=function(){return c=new C(o+".render()",function(){if(!p&&(p=!0,typeof t.componentWillReact=="function"&&t.componentWillReact(),t.__$mobxIsUnmounted!==!0)){var u=!0;try{r=!0,n||b.prototype.forceUpdate.call(t),u=!1}finally{r=!1,u&&c.dispose()}}}),c.reactComponent=t,y.$mobx=c,t.render=y,y(t.props,t.state,t.context)},y=function(u,l,d){p=!1;var s=void 0,v=void 0;if(c.track(function(){try{v=X(!1,a,u,l,d)}catch(h){s=h}}),s)throw s;return v};this.render=g},componentWillUnmount:function(){this.render.$mobx&&this.render.$mobx.dispose(),this.__$mobxIsUnmounted=!0},componentDidMount:function(){},componentDidUpdate:function(){},shouldComponentUpdate:function(t,o){return this.state!==o?!0:x(this.props,t)}};function T(e){if(arguments.length>1&&w.warn('Mobx observer: Using observer to inject stores is not supported. Use `@connect(["store1", "store2"]) ComponentClass instead or preferably, use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))``'),e.isMobxInjector===!0&&w.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"),I(e)){var t,o;return T((o=t=function(r){U(i,r);function i(){return _(this,i),W(this,(i.__proto__||Object.getPrototypeOf(i)).apply(this,arguments))}return M(i,[{key:"render",value:function(){return e.call(this,this.props,this.context)}}]),i}(b),t.displayName=R(e),o))}if(!e)throw new Error("Please pass a valid component to 'observer'");var n=e.prototype||e;return G(n),e.isMobXReactObserver=!0,e}function G(e){P(e,"componentWillMount",!0),P(e,"componentDidMount"),e.shouldComponentUpdate||(e.shouldComponentUpdate=$.shouldComponentUpdate)}var K=T(function(e){var t=e.children;return t[0]()});K.displayName="Observer";var k=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function q(e,t){return t={exports:{}},e(t,t.exports),t.exports}q(function(e,t){(function(o,n){e.exports=n()})(k,function(){var o={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},n={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},r=Object.defineProperty,i=Object.getOwnPropertyNames,a=Object.getOwnPropertySymbols,c=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,g=p&&p(Object);return function y(f,u,l){if(typeof u!="string"){if(g){var d=p(u);d&&d!==g&&y(f,d,l)}var s=i(u);a&&(s=s.concat(a(u)));for(var v=0;v<s.length;++v){var h=s[v];if(!o[h]&&!n[h]&&(!l||!l[h])){var D=c(u,h);try{r(f,h,D)}catch{}}}return f}return f}})});var S={children:!0,key:!0,ref:!0},j=console;(function(e){U(t,e);function t(){return _(this,t),W(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return M(t,[{key:"render",value:function(n){var r=n.children;return r.length>1?N("div",null," ",r," "):r[0]}},{key:"getChildContext",value:function(){var n={},r=this.context.mobxStores;if(r)for(var i in r)n[i]=r[i];for(var a in this.props)!S[a]&&a!=="suppressChangedStoreWarning"&&(n[a]=this.props[a]);return{mobxStores:n}}},{key:"componentWillReceiveProps",value:function(n){if(Object.keys(n).length!==Object.keys(this.props).length&&j.warn("MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"),!n.suppressChangedStoreWarning)for(var r in n)!S[r]&&this.props[r]!==n[r]&&j.warn("MobX Provider: Provided store '"+r+"' has changed. Please avoid replacing stores as the change might not propagate to all children")}}]),t})(b);if(!b)throw new Error("mobx-preact requires Preact to be available");export{T as o};
