const h=[],a=/^on[^a-z]/,E=t=>a.test(t),R=Object.assign,c=Array.isArray,z=t=>typeof t=="function",i=t=>typeof t=="string",S=t=>typeof t=="symbol",l=t=>t!==null&&typeof t=="object";let f;const T=()=>f||(f=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function y(t){if(c(t)){const s={};for(let n=0;n<t.length;n++){const o=t[n],e=i(o)?d(o):y(o);if(e)for(const r in e)s[r]=e[r]}return s}else if(i(t)||l(t))return t}const g=/;(?![^(]*\))/g,p=/:([^]+)/,m=/\/\*[^]*?\*\//g;function d(t){const s={};return t.replace(m,"").split(g).forEach(n=>{if(n){const o=n.split(p);o.length>1&&(s[o[0].trim()]=o[1].trim())}}),s}function b(t){let s="";if(i(t))s=t;else if(c(t))for(let n=0;n<t.length;n++){const o=b(t[n]);o&&(s+=o+" ")}else if(l(t))for(const n in t)t[n]&&(s+=n+" ");return s.trim()}export{h as E,i as a,c as b,z as c,l as d,R as e,y as f,T as g,E as h,S as i,b as n};