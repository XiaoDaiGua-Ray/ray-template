import{c as r,a as t,b as e,d as i,e as o,i as l,f,g as p,h as R,j as g,k as x,l as B,m as I,n as D,s as F,o as L,p as E,q as M,r as P,t as S}from"./vendor-6dafcdec.js";import{m as q}from"./utils-vendor-6e02b5fb.js";const Z=r("base-icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`,[t("svg",`
 height: 1em;
 width: 1em;
 `)]),G=r("base-close",`
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`,[e("absolute",`
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `),t("&::before",`
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `),i("disabled",[t("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),t("&:hover::before",`
 background-color: var(--n-close-color-hover);
 `),t("&:focus::before",`
 background-color: var(--n-close-color-hover);
 `),t("&:active",`
 color: var(--n-close-icon-color-pressed);
 `),t("&:active::before",`
 background-color: var(--n-close-color-pressed);
 `)]),e("disabled",`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),e("round",[t("&::before",`
 border-radius: 50%;
 `)])]),J=t([t("@keyframes loading-container-rotate",`
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `),t("@keyframes loading-layer-rotate",`
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `),t("@keyframes loading-left-spin",`
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `),t("@keyframes loading-right-spin",`
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `),r("base-loading",`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[o("transition-wrapper",`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[l()]),o("container",`
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `,[o("svg",`
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `),o("container-layer",`
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `,[o("container-layer-left",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]),o("container-layer-patch",`
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]),o("container-layer-right",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]),o("placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[l({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})])])]),K=r("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[o("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[t("+",[o("description",`
 margin-top: 8px;
 `)])]),o("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),o("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Q=r("scrollbar",`
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`,[t(">",[r("scrollbar-container",`
 width: 100%;
 overflow: scroll;
 height: 100%;
 max-height: inherit;
 scrollbar-width: none;
 `,[t("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `),t(">",[r("scrollbar-content",`
 box-sizing: border-box;
 min-width: 100%;
 `)])])]),t(">, +",[r("scrollbar-rail",`
 position: absolute;
 pointer-events: none;
 user-select: none;
 -webkit-user-select: none;
 `,[e("horizontal",`
 left: 2px;
 right: 2px;
 bottom: 4px;
 height: var(--n-scrollbar-height);
 `,[t(">",[o("scrollbar",`
 height: var(--n-scrollbar-height);
 border-radius: var(--n-scrollbar-border-radius);
 right: 0;
 `)])]),e("vertical",`
 right: 4px;
 top: 2px;
 bottom: 2px;
 width: var(--n-scrollbar-width);
 `,[t(">",[o("scrollbar",`
 width: var(--n-scrollbar-width);
 border-radius: var(--n-scrollbar-border-radius);
 bottom: 0;
 `)])]),e("disabled",[t(">",[o("scrollbar",{pointerEvents:"none"})])]),t(">",[o("scrollbar",`
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `,[f(),t("&:hover",{backgroundColor:"var(--n-scrollbar-color-hover)"})])])])])]),U=r("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[r("scrollbar",`
 max-height: var(--n-height);
 `),r("virtual-list",`
 max-height: var(--n-height);
 `),r("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[o("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),r("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),r("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),o("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),o("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),o("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),r("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),r("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[e("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),t("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),t("&:active",`
 color: var(--n-option-text-color-pressed);
 `),e("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),e("pending",[t("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),e("selected",`
 color: var(--n-option-text-color-active);
 `,[t("&::before",`
 background-color: var(--n-option-color-active);
 `),e("pending",[t("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),e("disabled",`
 cursor: not-allowed;
 `,[i("selected",`
 color: var(--n-option-text-color-disabled);
 `),e("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),o("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[p({enterScale:"0.5"})])])]),V=r("base-wave",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`),w={top:"bottom",bottom:"top",left:"right",right:"left"},n="var(--n-arrow-height) * 1.414",_=t([r("popover",`
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 position: relative;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 box-shadow: var(--n-box-shadow);
 word-break: break-word;
 `,[t(">",[r("scrollbar",`
 height: inherit;
 max-height: inherit;
 `)]),i("raw",`
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 `,[i("scrollable",[i("show-header-or-footer","padding: var(--n-padding);")])]),o("header",`
 padding: var(--n-padding);
 border-bottom: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `),o("footer",`
 padding: var(--n-padding);
 border-top: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `),e("scrollable, show-header-or-footer",[o("content",`
 padding: var(--n-padding);
 `)])]),r("popover-shared",`
 transform-origin: inherit;
 `,[r("popover-arrow-wrapper",`
 position: absolute;
 overflow: hidden;
 pointer-events: none;
 `,[r("popover-arrow",`
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 display: block;
 width: calc(${n});
 height: calc(${n});
 box-shadow: 0 0 8px 0 rgba(0, 0, 0, .12);
 transform: rotate(45deg);
 background-color: var(--n-color);
 pointer-events: all;
 `)]),t("&.popover-transition-enter-from, &.popover-transition-leave-to",`
 opacity: 0;
 transform: scale(.85);
 `),t("&.popover-transition-enter-to, &.popover-transition-leave-from",`
 transform: scale(1);
 opacity: 1;
 `),t("&.popover-transition-enter-active",`
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-out),
 transform .15s var(--n-bezier-ease-out);
 `),t("&.popover-transition-leave-active",`
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-in),
 transform .15s var(--n-bezier-ease-in);
 `)]),s("top-start",`
 top: calc(${n} / -2);
 left: calc(${c("top-start")} - var(--v-offset-left));
 `),s("top",`
 top: calc(${n} / -2);
 transform: translateX(calc(${n} / -2)) rotate(45deg);
 left: 50%;
 `),s("top-end",`
 top: calc(${n} / -2);
 right: calc(${c("top-end")} + var(--v-offset-left));
 `),s("bottom-start",`
 bottom: calc(${n} / -2);
 left: calc(${c("bottom-start")} - var(--v-offset-left));
 `),s("bottom",`
 bottom: calc(${n} / -2);
 transform: translateX(calc(${n} / -2)) rotate(45deg);
 left: 50%;
 `),s("bottom-end",`
 bottom: calc(${n} / -2);
 right: calc(${c("bottom-end")} + var(--v-offset-left));
 `),s("left-start",`
 left: calc(${n} / -2);
 top: calc(${c("left-start")} - var(--v-offset-top));
 `),s("left",`
 left: calc(${n} / -2);
 transform: translateY(calc(${n} / -2)) rotate(45deg);
 top: 50%;
 `),s("left-end",`
 left: calc(${n} / -2);
 bottom: calc(${c("left-end")} + var(--v-offset-top));
 `),s("right-start",`
 right: calc(${n} / -2);
 top: calc(${c("right-start")} - var(--v-offset-top));
 `),s("right",`
 right: calc(${n} / -2);
 transform: translateY(calc(${n} / -2)) rotate(45deg);
 top: 50%;
 `),s("right-end",`
 right: calc(${n} / -2);
 bottom: calc(${c("right-end")} + var(--v-offset-top));
 `),...q({top:["right-start","left-start"],right:["top-end","bottom-end"],bottom:["right-end","left-end"],left:["top-start","bottom-start"]},(a,b)=>{const d=["right","left"].includes(b),h=d?"width":"height";return a.map(u=>{const Y=u.split("-")[1]==="end",X=`calc((${`var(--v-target-${h}, 0px)`} - ${n}) / 2)`,A=c(u);return t(`[v-placement="${u}"] >`,[r("popover-shared",[e("center-arrow",[r("popover-arrow",`${b}: calc(max(${X}, ${A}) ${Y?"+":"-"} var(--v-offset-${d?"left":"top"}));`)])])])})})]);function c(a){return["top","bottom"].includes(a.split("-")[0])?"var(--n-arrow-offset)":"var(--n-arrow-offset-vertical)"}function s(a,b){const d=a.split("-")[0],h=["top","bottom"].includes(d)?"height: var(--n-space-arrow);":"width: var(--n-space-arrow);";return t(`[v-placement="${a}"] >`,[r("popover-shared",`
 margin-${w[d]}: var(--n-space);
 `,[e("show-arrow",`
 margin-${w[d]}: var(--n-space-arrow);
 `),e("overlap",`
 margin: 0;
 `),R("popover-arrow-wrapper",`
 right: 0;
 left: 0;
 top: 0;
 bottom: 0;
 ${d}: 100%;
 ${w[d]}: auto;
 ${h}
 `,[r("popover-arrow",b)])])])}const rr=r("tag",`
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`,[e("strong",`
 font-weight: var(--n-font-weight-strong);
 `),o("border",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `),o("icon",`
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `),o("avatar",`
 display: flex;
 margin: 0 6px 0 0;
 `),o("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),e("round",`
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `,[o("icon",`
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `),o("avatar",`
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `),e("closable",`
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]),e("icon, avatar",[e("round",`
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]),e("disabled",`
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `),e("checkable",`
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `,[i("disabled",[t("&:hover","background-color: var(--n-color-hover-checkable);",[i("checked","color: var(--n-text-color-hover-checkable);")]),t("&:active","background-color: var(--n-color-pressed-checkable);",[i("checked","color: var(--n-text-color-pressed-checkable);")])]),e("checked",`
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `,[i("disabled",[t("&:hover","background-color: var(--n-color-checked-hover);"),t("&:active","background-color: var(--n-color-checked-pressed);")])])])]),or=r("base-clear",`
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`,[t(">",[o("clear",`
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `,[t("&:hover",`
 color: var(--n-clear-color-hover)!important;
 `),t("&:active",`
 color: var(--n-clear-color-pressed)!important;
 `)]),o("placeholder",`
 display: flex;
 `),o("clear, placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[l({originalTransform:"translateX(-50%) translateY(-50%)",left:"50%",top:"50%"})])])]),er=t([r("base-selection",`
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[r("base-loading",`
 color: var(--n-loading-color);
 `),r("base-selection-tags","min-height: var(--n-height);"),o("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),o("state-border",`
 z-index: 1;
 border-color: #0000;
 `),r("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[o("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),r("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[o("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),r("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[o("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),r("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[r("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[o("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),o("render-label",`
 color: var(--n-text-color);
 `)]),i("disabled",[t("&:hover",[o("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),e("focus",[o("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),e("active",[o("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),r("base-selection-label","background-color: var(--n-color-active);"),r("base-selection-tags","background-color: var(--n-color-active);")])]),e("disabled","cursor: not-allowed;",[o("arrow",`
 color: var(--n-arrow-color-disabled);
 `),r("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[r("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),o("render-label",`
 color: var(--n-text-color-disabled);
 `)]),r("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),r("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),r("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[o("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),o("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(a=>e(`${a}-status`,[o("state-border",`border: var(--n-border-${a});`),i("disabled",[t("&:hover",[o("state-border",`
 box-shadow: var(--n-box-shadow-hover-${a});
 border: var(--n-border-hover-${a});
 `)]),e("active",[o("state-border",`
 box-shadow: var(--n-box-shadow-active-${a});
 border: var(--n-border-active-${a});
 `),r("base-selection-label",`background-color: var(--n-color-active-${a});`),r("base-selection-tags",`background-color: var(--n-color-active-${a});`)]),e("focus",[o("state-border",`
 box-shadow: var(--n-box-shadow-focus-${a});
 border: var(--n-border-focus-${a});
 `)])])]))]),r("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),r("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[t("&:last-child","padding-right: 0;"),r("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[o("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),tr=r("input",`
 max-width: 100%;
 cursor: text;
 line-height: 1.5;
 z-index: auto;
 outline: none;
 box-sizing: border-box;
 position: relative;
 display: inline-flex;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 --n-padding-vertical: calc((var(--n-height) - 1.5 * var(--n-font-size)) / 2);
`,[o("input, textarea",`
 overflow: hidden;
 flex-grow: 1;
 position: relative;
 `),o("input-el, textarea-el, input-mirror, textarea-mirror, separator, placeholder",`
 box-sizing: border-box;
 font-size: inherit;
 line-height: 1.5;
 font-family: inherit;
 border: none;
 outline: none;
 background-color: #0000;
 text-align: inherit;
 transition:
 -webkit-text-fill-color .3s var(--n-bezier),
 caret-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 `),o("input-el, textarea-el",`
 -webkit-appearance: none;
 scrollbar-width: none;
 width: 100%;
 min-width: 0;
 text-decoration-color: var(--n-text-decoration-color);
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 background-color: transparent;
 `,[t("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `),t("&::placeholder",`
 color: #0000;
 -webkit-text-fill-color: transparent !important;
 `),t("&:-webkit-autofill ~",[o("placeholder","display: none;")])]),e("round",[i("textarea","border-radius: calc(var(--n-height) / 2);")]),o("placeholder",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: hidden;
 color: var(--n-placeholder-color);
 `,[t("span",`
 width: 100%;
 display: inline-block;
 `)]),e("textarea",[o("placeholder","overflow: visible;")]),i("autosize","width: 100%;"),e("autosize",[o("textarea-el, input-el",`
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 `)]),r("input-wrapper",`
 overflow: hidden;
 display: inline-flex;
 flex-grow: 1;
 position: relative;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 `),o("input-mirror",`
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre;
 pointer-events: none;
 `),o("input-el",`
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[t("+",[o("placeholder",`
 display: flex;
 align-items: center; 
 `)])]),i("textarea",[o("placeholder","white-space: nowrap;")]),o("eye",`
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `),e("textarea","width: 100%;",[r("input-word-count",`
 position: absolute;
 right: var(--n-padding-right);
 bottom: var(--n-padding-vertical);
 `),e("resizable",[r("input-wrapper",`
 resize: vertical;
 min-height: var(--n-height);
 `)]),o("textarea-el, textarea-mirror, placeholder",`
 height: 100%;
 padding-left: 0;
 padding-right: 0;
 padding-top: var(--n-padding-vertical);
 padding-bottom: var(--n-padding-vertical);
 word-break: break-word;
 display: inline-block;
 vertical-align: bottom;
 box-sizing: border-box;
 line-height: var(--n-line-height-textarea);
 margin: 0;
 resize: none;
 white-space: pre-wrap;
 `),o("textarea-mirror",`
 width: 100%;
 pointer-events: none;
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 `)]),e("pair",[o("input-el, placeholder","text-align: center;"),o("separator",`
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 white-space: nowrap;
 `,[r("icon",`
 color: var(--n-icon-color);
 `),r("base-icon",`
 color: var(--n-icon-color);
 `)])]),e("disabled",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[o("border","border: var(--n-border-disabled);"),o("input-el, textarea-el",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 text-decoration-color: var(--n-text-color-disabled);
 `),o("placeholder","color: var(--n-placeholder-color-disabled);"),o("separator","color: var(--n-text-color-disabled);",[r("icon",`
 color: var(--n-icon-color-disabled);
 `),r("base-icon",`
 color: var(--n-icon-color-disabled);
 `)]),r("input-word-count",`
 color: var(--n-count-text-color-disabled);
 `),o("suffix, prefix","color: var(--n-text-color-disabled);",[r("icon",`
 color: var(--n-icon-color-disabled);
 `),r("internal-icon",`
 color: var(--n-icon-color-disabled);
 `)])]),i("disabled",[o("eye",`
 color: var(--n-icon-color);
 cursor: pointer;
 `,[t("&:hover",`
 color: var(--n-icon-color-hover);
 `),t("&:active",`
 color: var(--n-icon-color-pressed);
 `)]),t("&:hover",[o("state-border","border: var(--n-border-hover);")]),e("focus","background-color: var(--n-color-focus);",[o("state-border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),o("border, state-border",`
 box-sizing: border-box;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: inherit;
 border: var(--n-border);
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),o("state-border",`
 border-color: #0000;
 z-index: 1;
 `),o("prefix","margin-right: 4px;"),o("suffix",`
 margin-left: 4px;
 `),o("suffix, prefix",`
 transition: color .3s var(--n-bezier);
 flex-wrap: nowrap;
 flex-shrink: 0;
 line-height: var(--n-height);
 white-space: nowrap;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-suffix-text-color);
 `,[r("base-loading",`
 font-size: var(--n-icon-size);
 margin: 0 2px;
 color: var(--n-loading-color);
 `),r("base-clear",`
 font-size: var(--n-icon-size);
 `,[o("placeholder",[r("base-icon",`
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)])]),t(">",[r("icon",`
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]),r("base-icon",`
 font-size: var(--n-icon-size);
 `)]),r("input-word-count",`
 pointer-events: none;
 line-height: 1.5;
 font-size: .85em;
 color: var(--n-count-text-color);
 transition: color .3s var(--n-bezier);
 margin-left: 4px;
 font-variant: tabular-nums;
 `),["warning","error"].map(a=>e(`${a}-status`,[i("disabled",[r("base-loading",`
 color: var(--n-loading-color-${a})
 `),o("input-el, textarea-el",`
 caret-color: var(--n-caret-color-${a});
 `),o("state-border",`
 border: var(--n-border-${a});
 `),t("&:hover",[o("state-border",`
 border: var(--n-border-hover-${a});
 `)]),t("&:focus",`
 background-color: var(--n-color-focus-${a});
 `,[o("state-border",`
 box-shadow: var(--n-box-shadow-focus-${a});
 border: var(--n-border-focus-${a});
 `)]),e("focus",`
 background-color: var(--n-color-focus-${a});
 `,[o("state-border",`
 box-shadow: var(--n-box-shadow-focus-${a});
 border: var(--n-border-focus-${a});
 `)])])]))]),ir=r("input",[e("disabled",[o("input-el, textarea-el",`
 -webkit-text-fill-color: var(--n-text-color-disabled);
 `)])]),ar=r("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[t(">",[r("input",[t("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),t("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),r("button",[t("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[o("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),t("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[o("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),t("*",[t("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[t(">",[r("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),r("base-selection",[r("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),r("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),o("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),t("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[t(">",[r("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),r("base-selection",[r("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),r("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),o("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),nr=r("avatar",`
 width: var(--n-merged-size);
 height: var(--n-merged-size);
 color: #FFF;
 font-size: var(--n-font-size);
 display: inline-flex;
 position: relative;
 overflow: hidden;
 text-align: center;
 border: var(--n-border);
 border-radius: var(--n-border-radius);
 --n-merged-color: var(--n-color);
 background-color: var(--n-merged-color);
 transition:
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[g(t("&","--n-merged-color: var(--n-color-modal);")),x(t("&","--n-merged-color: var(--n-color-popover);")),t("img",`
 width: 100%;
 height: 100%;
 `),o("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),r("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),o("text","line-height: 1.25")]),lr=r("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[t("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),t("a",`
 color: inherit;
 text-decoration: inherit;
 `),r("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[r("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),t("&:not(:last-child)",[e("clickable",[o("link",`
 cursor: pointer;
 `,[t("&:hover",`
 background-color: var(--n-item-color-hover);
 `),t("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),o("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[t("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[r("icon",`
 color: var(--n-item-text-color-hover);
 `)]),t("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[r("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),o("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),t("&:last-child",[o("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[r("icon",`
 color: var(--n-item-text-color-active);
 `)]),o("separator",`
 display: none;
 `)])])]),sr=t([r("button",`
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[e("color",[o("border",{borderColor:"var(--n-border-color)"}),e("disabled",[o("border",{borderColor:"var(--n-border-color-disabled)"})]),i("disabled",[t("&:focus",[o("state-border",{borderColor:"var(--n-border-color-focus)"})]),t("&:hover",[o("state-border",{borderColor:"var(--n-border-color-hover)"})]),t("&:active",[o("state-border",{borderColor:"var(--n-border-color-pressed)"})]),e("pressed",[o("state-border",{borderColor:"var(--n-border-color-pressed)"})])])]),e("disabled",{backgroundColor:"var(--n-color-disabled)",color:"var(--n-text-color-disabled)"},[o("border",{border:"var(--n-border-disabled)"})]),i("disabled",[t("&:focus",{backgroundColor:"var(--n-color-focus)",color:"var(--n-text-color-focus)"},[o("state-border",{border:"var(--n-border-focus)"})]),t("&:hover",{backgroundColor:"var(--n-color-hover)",color:"var(--n-text-color-hover)"},[o("state-border",{border:"var(--n-border-hover)"})]),t("&:active",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[o("state-border",{border:"var(--n-border-pressed)"})]),e("pressed",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[o("state-border",{border:"var(--n-border-pressed)"})])]),e("loading","cursor: wait;"),r("base-wave",`
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `,[e("active",{zIndex:1,animationName:"button-wave-spread, button-wave-opacity"})]),B&&"MozBoxSizing"in document.createElement("div").style?t("&::moz-focus-inner",{border:0}):null,o("border, state-border",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `),o("border",{border:"var(--n-border)"}),o("state-border",{border:"var(--n-border)",borderColor:"#0000",zIndex:1}),o("icon",`
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `,[r("icon-slot",`
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `,[l({top:"50%",originalTransform:"translateY(-50%)"})]),I()]),o("content",`
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `,[t("~",[o("icon",{margin:"var(--n-icon-margin)",marginRight:0})])]),e("block",`
 display: flex;
 width: 100%;
 `),e("dashed",[o("border, state-border",{borderStyle:"dashed !important"})]),e("disabled",{cursor:"not-allowed",opacity:"var(--n-opacity-disabled)"})]),t("@keyframes button-wave-spread",{from:{boxShadow:"0 0 0.5px 0 var(--n-ripple-color)"},to:{boxShadow:"0 0 0.5px 4.5px var(--n-ripple-color)"}}),t("@keyframes button-wave-opacity",{from:{opacity:"var(--n-wave-opacity)"},to:{opacity:0}})]),dr=t([r("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),r("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[p(),r("input",`
 text-align: center;
 `)]),r("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[t("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),r("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[o("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),t("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),r("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[o("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),r("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[o("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[e("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),r("color-picker-preview",`
 display: flex;
 `,[o("sliders",`
 flex: 1 0 auto;
 `),o("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),o("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),o("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),r("color-picker-input",`
 display: flex;
 align-items: center;
 `,[r("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),o("mode",`
 width: 72px;
 text-align: center;
 `)]),r("color-picker-control",`
 padding: 12px;
 `),r("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[r("button","margin-left: 8px;")]),r("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[o("value",`
 white-space: nowrap;
 position: relative;
 `),o("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),e("disabled","cursor: not-allowed"),r("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[t("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),r("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[r("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[o("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),t("&:focus",`
 outline: none;
 `,[o("fill",[t("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),cr=t([r("card",`
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[D({background:"var(--n-color-modal)"}),e("hoverable",[t("&:hover","box-shadow: var(--n-box-shadow);")]),e("content-segmented",[t(">",[o("content",{paddingTop:"var(--n-padding-bottom)"})])]),e("content-soft-segmented",[t(">",[o("content",`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])]),e("footer-segmented",[t(">",[o("footer",{paddingTop:"var(--n-padding-bottom)"})])]),e("footer-soft-segmented",[t(">",[o("footer",`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),t(">",[r("card-header",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[o("main",`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),o("extra",`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),o("close",`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),o("action",`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),o("content","flex: 1; min-width: 0;"),o("content, footer",`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[t("&:first-child",{paddingTop:"var(--n-padding-bottom)"})]),o("action",`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),r("card-cover",`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[t("img",`
 display: block;
 width: 100%;
 `)]),e("bordered",`
 border: 1px solid var(--n-border-color);
 `,[t("&:target","border-color: var(--n-color-target);")]),e("action-segmented",[t(">",[o("action",[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),e("content-segmented, content-soft-segmented",[t(">",[o("content",{transition:"border-color 0.3s var(--n-bezier)"},[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),e("footer-segmented, footer-soft-segmented",[t(">",[o("footer",{transition:"border-color 0.3s var(--n-bezier)"},[t("&:not(:first-child)",{borderTop:"1px solid var(--n-border-color)"})])])]),e("embedded",`
 background-color: var(--n-color-embedded);
 `)]),g(r("card",`
 background: var(--n-color-modal);
 `,[e("embedded",`
 background-color: var(--n-color-embedded-modal);
 `)])),x(r("card",`
 background: var(--n-color-popover);
 `,[e("embedded",`
 background-color: var(--n-color-embedded-popover);
 `)]))]),br=t([r("checkbox",`
 line-height: var(--n-label-line-height);
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 --n-merged-color-table: var(--n-color-table);
 `,[t("&:hover",[r("checkbox-box",[o("border",{border:"var(--n-border-checked)"})])]),t("&:focus:not(:active)",[r("checkbox-box",[o("border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),e("inside-table",[r("checkbox-box",`
 background-color: var(--n-merged-color-table);
 `)]),e("checked",[r("checkbox-box",`
 background-color: var(--n-color-checked);
 `,[r("checkbox-icon",[t(".check-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),e("indeterminate",[r("checkbox-box",[r("checkbox-icon",[t(".check-icon",`
 opacity: 0;
 transform: scale(.5);
 `),t(".line-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),e("checked, indeterminate",[t("&:focus:not(:active)",[r("checkbox-box",[o("border",`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),r("checkbox-box",`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[o("border",{border:"var(--n-border-checked)"})])]),e("disabled",{cursor:"not-allowed"},[e("checked",[r("checkbox-box",`
 background-color: var(--n-color-disabled-checked);
 `,[o("border",{border:"var(--n-border-disabled-checked)"}),r("checkbox-icon",[t(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled-checked)"})])])]),r("checkbox-box",`
 background-color: var(--n-color-disabled);
 `,[o("border",{border:"var(--n-border-disabled)"}),r("checkbox-icon",[t(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled)"})])]),o("label",{color:"var(--n-text-color-disabled)"})]),r("checkbox-box-wrapper",`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),r("checkbox-box",`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[o("border",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),r("checkbox-icon",`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[t(".check-icon, .line-icon",`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),l({left:"1px",top:"1px"})])]),o("label",`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[t("&:empty",{display:"none"})])]),g(r("checkbox",`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),x(r("checkbox",`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),pr=r("popselect-menu",`
 box-shadow: var(--n-menu-box-shadow);
`),vr=t([r("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),r("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[p({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),z=`
 background: var(--n-item-color-hover);
 color: var(--n-item-text-color-hover);
 border: var(--n-item-border-hover);
`,k=[e("button",`
 background: var(--n-button-color-hover);
 border: var(--n-button-border-hover);
 color: var(--n-button-icon-color-hover);
 `)],gr=r("pagination",`
 display: flex;
 vertical-align: middle;
 font-size: var(--n-item-font-size);
 flex-wrap: nowrap;
`,[r("pagination-prefix",`
 display: flex;
 align-items: center;
 margin: var(--n-prefix-margin);
 `),r("pagination-suffix",`
 display: flex;
 align-items: center;
 margin: var(--n-suffix-margin);
 `),t("> *:not(:first-child)",`
 margin: var(--n-item-margin);
 `),r("select",`
 width: var(--n-select-width);
 `),t("&.transition-disabled",[r("pagination-item","transition: none!important;")]),r("pagination-quick-jumper",`
 white-space: nowrap;
 display: flex;
 color: var(--n-jumper-text-color);
 transition: color .3s var(--n-bezier);
 align-items: center;
 font-size: var(--n-jumper-font-size);
 `,[r("input",`
 margin: var(--n-input-margin);
 width: var(--n-input-width);
 `)]),r("pagination-item",`
 position: relative;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 display: flex;
 align-items: center;
 justify-content: center;
 box-sizing: border-box;
 min-width: var(--n-item-size);
 height: var(--n-item-size);
 padding: var(--n-item-padding);
 background-color: var(--n-item-color);
 color: var(--n-item-text-color);
 border-radius: var(--n-item-border-radius);
 border: var(--n-item-border);
 fill: var(--n-button-icon-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 fill .3s var(--n-bezier);
 `,[e("button",`
 background: var(--n-button-color);
 color: var(--n-button-icon-color);
 border: var(--n-button-border);
 padding: 0;
 `,[r("base-icon",`
 font-size: var(--n-button-icon-size);
 `)]),i("disabled",[e("hover",z,k),t("&:hover",z,k),t("&:active",`
 background: var(--n-item-color-pressed);
 color: var(--n-item-text-color-pressed);
 border: var(--n-item-border-pressed);
 `,[e("button",`
 background: var(--n-button-color-pressed);
 border: var(--n-button-border-pressed);
 color: var(--n-button-icon-color-pressed);
 `)]),e("active",`
 background: var(--n-item-color-active);
 color: var(--n-item-text-color-active);
 border: var(--n-item-border-active);
 `,[t("&:hover",`
 background: var(--n-item-color-active-hover);
 `)])]),e("disabled",`
 cursor: not-allowed;
 color: var(--n-item-text-color-disabled);
 `,[e("active, button",`
 background-color: var(--n-item-color-disabled);
 border: var(--n-item-border-disabled);
 `)])]),e("disabled",`
 cursor: not-allowed;
 `,[r("pagination-quick-jumper",`
 color: var(--n-jumper-text-color-disabled);
 `)]),e("simple",`
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 `,[r("pagination-quick-jumper",[r("input",`
 margin: 0;
 `)])])]),hr=r("ellipsis",{overflow:"hidden"},[i("line-clamp",`
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `),e("line-clamp",`
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `),e("cursor-pointer",`
 cursor: pointer;
 `)]),fr=r("radio",`
 line-height: var(--n-label-line-height);
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 align-items: flex-start;
 flex-wrap: nowrap;
 font-size: var(--n-font-size);
 word-break: break-word;
`,[e("checked",[o("dot",`
 background-color: var(--n-color-active);
 `)]),o("dot-wrapper",`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),r("radio-input",`
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 cursor: pointer;
 `),o("dot",`
 position: absolute;
 top: 50%;
 left: 0;
 transform: translateY(-50%);
 height: var(--n-radio-size);
 width: var(--n-radio-size);
 background: var(--n-color);
 box-shadow: var(--n-box-shadow);
 border-radius: 50%;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `,[t("&::before",`
 content: "";
 opacity: 0;
 position: absolute;
 left: 4px;
 top: 4px;
 height: calc(100% - 8px);
 width: calc(100% - 8px);
 border-radius: 50%;
 transform: scale(.8);
 background: var(--n-dot-color-active);
 transition: 
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),e("checked",{boxShadow:"var(--n-box-shadow-active)"},[t("&::before",`
 opacity: 1;
 transform: scale(1);
 `)])]),o("label",`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),i("disabled",`
 cursor: pointer;
 `,[t("&:hover",[o("dot",{boxShadow:"var(--n-box-shadow-hover)"})]),e("focus",[t("&:not(:active)",[o("dot",{boxShadow:"var(--n-box-shadow-focus)"})])])]),e("disabled",`
 cursor: not-allowed;
 `,[o("dot",{boxShadow:"var(--n-box-shadow-disabled)",backgroundColor:"var(--n-color-disabled)"},[t("&::before",{backgroundColor:"var(--n-dot-color-disabled)"}),e("checked",`
 opacity: 1;
 `)]),o("label",{color:"var(--n-text-color-disabled)"}),r("radio-input",`
 cursor: not-allowed;
 `)])]),xr=r("radio-group",`
 display: inline-block;
 font-size: var(--n-font-size);
`,[o("splitor",`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[e("checked",{backgroundColor:"var(--n-button-border-color-active)"}),e("disabled",{opacity:"var(--n-opacity-disabled)"})]),e("button-group",`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[r("radio-button",{height:"var(--n-height)",lineHeight:"var(--n-height)"}),o("splitor",{height:"var(--n-height)"})]),r("radio-button",`
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `,[r("radio-input",`
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `),o("state-border",`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),t("&:first-child",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[o("state-border",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),t("&:last-child",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[o("state-border",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),i("disabled",`
 cursor: pointer;
 `,[t("&:hover",[o("state-border",`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),i("checked",{color:"var(--n-button-text-color-hover)"})]),e("focus",[t("&:not(:active)",[o("state-border",{boxShadow:"var(--n-button-box-shadow-focus)"})])])]),e("checked",`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),e("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]),mr=r("icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`,[e("color-transition",{transition:"color .3s var(--n-bezier)"}),e("depth",{color:"var(--n-color)"},[t("svg",{opacity:"var(--n-opacity)",transition:"opacity .3s var(--n-bezier)"})]),t("svg",{height:"1em",width:"1em"})]),ur=r("dropdown-menu",`
 transform-origin: var(--v-transform-origin);
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 position: relative;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[p(),r("dropdown-option",`
 position: relative;
 `,[t("a",`
 text-decoration: none;
 color: inherit;
 outline: none;
 `,[t("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),r("dropdown-option-body",`
 display: flex;
 cursor: pointer;
 position: relative;
 height: var(--n-option-height);
 line-height: var(--n-option-height);
 font-size: var(--n-font-size);
 color: var(--n-option-text-color);
 transition: color .3s var(--n-bezier);
 `,[t("&::before",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 left: 4px;
 right: 4px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `),i("disabled",[e("pending",`
 color: var(--n-option-text-color-hover);
 `,[o("prefix, suffix",`
 color: var(--n-option-text-color-hover);
 `),t("&::before","background-color: var(--n-option-color-hover);")]),e("active",`
 color: var(--n-option-text-color-active);
 `,[o("prefix, suffix",`
 color: var(--n-option-text-color-active);
 `),t("&::before","background-color: var(--n-option-color-active);")]),e("child-active",`
 color: var(--n-option-text-color-child-active);
 `,[o("prefix, suffix",`
 color: var(--n-option-text-color-child-active);
 `)])]),e("disabled",`
 cursor: not-allowed;
 opacity: var(--n-option-opacity-disabled);
 `),e("group",`
 font-size: calc(var(--n-font-size) - 1px);
 color: var(--n-group-header-text-color);
 `,[o("prefix",`
 width: calc(var(--n-option-prefix-width) / 2);
 `,[e("show-icon",`
 width: calc(var(--n-option-icon-prefix-width) / 2);
 `)])]),o("prefix",`
 width: var(--n-option-prefix-width);
 display: flex;
 justify-content: center;
 align-items: center;
 color: var(--n-prefix-color);
 transition: color .3s var(--n-bezier);
 z-index: 1;
 `,[e("show-icon",`
 width: var(--n-option-icon-prefix-width);
 `),r("icon",`
 font-size: var(--n-option-icon-size);
 `)]),o("label",`
 white-space: nowrap;
 flex: 1;
 z-index: 1;
 `),o("suffix",`
 box-sizing: border-box;
 flex-grow: 0;
 flex-shrink: 0;
 display: flex;
 justify-content: flex-end;
 align-items: center;
 min-width: var(--n-option-suffix-width);
 padding: 0 8px;
 transition: color .3s var(--n-bezier);
 color: var(--n-suffix-color);
 z-index: 1;
 `,[e("has-submenu",`
 width: var(--n-option-icon-suffix-width);
 `),r("icon",`
 font-size: var(--n-option-icon-size);
 `)]),r("dropdown-menu","pointer-events: all;")]),r("dropdown-offset-container",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: -4px;
 bottom: -4px;
 `)]),r("dropdown-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 4px 0;
 `),r("dropdown-menu-wrapper",`
 transform-origin: var(--v-transform-origin);
 width: fit-content;
 `),t(">",[r("scrollbar",`
 height: inherit;
 max-height: inherit;
 `)]),i("scrollable",`
 padding: var(--n-padding);
 `),e("scrollable",[o("content",`
 padding: var(--n-padding);
 `)])]),y=H(),wr=t([r("data-table",`
 width: 100%;
 font-size: var(--n-font-size);
 display: flex;
 flex-direction: column;
 position: relative;
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 --n-merged-th-color-hover: var(--n-th-color-hover);
 --n-merged-td-color-hover: var(--n-td-color-hover);
 --n-merged-td-color-striped: var(--n-td-color-striped);
 `,[r("data-table-wrapper",`
 flex-grow: 1;
 display: flex;
 flex-direction: column;
 `),e("flex-height",[t(">",[r("data-table-wrapper",[t(">",[r("data-table-base-table",`
 display: flex;
 flex-direction: column;
 flex-grow: 1;
 `,[t(">",[r("data-table-base-table-body","flex-basis: 0;",[t("&:last-child","flex-grow: 1;")])])])])])])]),t(">",[r("data-table-loading-wrapper",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 justify-content: center;
 `,[p({originalTransform:"translateX(-50%) translateY(-50%)"})])]),r("data-table-expand-placeholder",`
 margin-right: 8px;
 display: inline-block;
 width: 16px;
 height: 1px;
 `),r("data-table-indent",`
 display: inline-block;
 height: 1px;
 `),r("data-table-expand-trigger",`
 display: inline-flex;
 margin-right: 8px;
 cursor: pointer;
 font-size: 16px;
 vertical-align: -0.2em;
 position: relative;
 width: 16px;
 height: 16px;
 color: var(--n-td-text-color);
 transition: color .3s var(--n-bezier);
 `,[e("expanded",[r("icon","transform: rotate(90deg);",[l({originalTransform:"rotate(90deg)"})]),r("base-icon","transform: rotate(90deg);",[l({originalTransform:"rotate(90deg)"})])]),r("base-loading",`
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[l()]),r("icon",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[l()]),r("base-icon",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[l()])]),r("data-table-thead",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-merged-th-color);
 `),r("data-table-tr",`
 box-sizing: border-box;
 background-clip: padding-box;
 transition: background-color .3s var(--n-bezier);
 `,[r("data-table-expand",`
 position: sticky;
 left: 0;
 overflow: hidden;
 margin: calc(var(--n-th-padding) * -1);
 padding: var(--n-th-padding);
 box-sizing: border-box;
 `),e("striped","background-color: var(--n-merged-td-color-striped);",[r("data-table-td","background-color: var(--n-merged-td-color-striped);")]),i("summary",[t("&:hover","background-color: var(--n-merged-td-color-hover);",[t(">",[r("data-table-td","background-color: var(--n-merged-td-color-hover);")])])])]),r("data-table-th",`
 padding: var(--n-th-padding);
 position: relative;
 text-align: start;
 box-sizing: border-box;
 background-color: var(--n-merged-th-color);
 border-color: var(--n-merged-border-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 color: var(--n-th-text-color);
 transition:
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 font-weight: var(--n-th-font-weight);
 `,[e("filterable",`
 padding-right: 36px;
 `,[e("sortable",`
 padding-right: calc(var(--n-th-padding) + 36px);
 `)]),y,e("selection",`
 padding: 0;
 text-align: center;
 line-height: 0;
 z-index: 3;
 `),o("title-wrapper",`
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 max-width: 100%;
 `,[o("title",`
 flex: 1;
 min-width: 0;
 `)]),o("ellipsis",`
 display: inline-block;
 vertical-align: bottom;
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap;
 max-width: 100%;
 `),e("hover",`
 background-color: var(--n-merged-th-color-hover);
 `),e("sortable",`
 cursor: pointer;
 `,[o("ellipsis",`
 max-width: calc(100% - 18px);
 `),t("&:hover",`
 background-color: var(--n-merged-th-color-hover);
 `)]),r("data-table-sorter",`
 height: var(--n-sorter-size);
 width: var(--n-sorter-size);
 margin-left: 4px;
 position: relative;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 vertical-align: -0.2em;
 color: var(--n-th-icon-color);
 transition: color .3s var(--n-bezier);
 `,[r("base-icon","transition: transform .3s var(--n-bezier)"),e("desc",[r("base-icon",`
 transform: rotate(0deg);
 `)]),e("asc",[r("base-icon",`
 transform: rotate(-180deg);
 `)]),e("asc, desc",`
 color: var(--n-th-icon-color-active);
 `)]),r("data-table-resize-button",`
 width: var(--n-resizable-container-size);
 position: absolute;
 top: 0;
 right: calc(var(--n-resizable-container-size) / 2);
 bottom: 0;
 cursor: col-resize;
 user-select: none;
 `,[t("&::after",`
 width: var(--n-resizable-size);
 height: 50%;
 position: absolute;
 top: 50%;
 left: calc(var(--n-resizable-container-size) / 2);
 bottom: 0;
 background-color: var(--n-merged-border-color);
 transform: translateY(-50%);
 transition: background-color .3s var(--n-bezier);
 z-index: 1;
 content: '';
 `),e("active",[t("&::after",` 
 background-color: var(--n-th-icon-color-active);
 `)]),t("&:hover::after",`
 background-color: var(--n-th-icon-color-active);
 `)]),r("data-table-filter",`
 position: absolute;
 z-index: auto;
 right: 0;
 width: 36px;
 top: 0;
 bottom: 0;
 cursor: pointer;
 display: flex;
 justify-content: center;
 align-items: center;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: var(--n-filter-size);
 color: var(--n-th-icon-color);
 `,[t("&:hover",`
 background-color: var(--n-th-button-color-hover);
 `),e("show",`
 background-color: var(--n-th-button-color-hover);
 `),e("active",`
 background-color: var(--n-th-button-color-hover);
 color: var(--n-th-icon-color-active);
 `)])]),r("data-table-td",`
 padding: var(--n-td-padding);
 text-align: start;
 box-sizing: border-box;
 border: none;
 background-color: var(--n-merged-td-color);
 color: var(--n-td-text-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `,[e("expand",[r("data-table-expand-trigger",`
 margin-right: 0;
 `)]),e("last-row",`
 border-bottom: 0 solid var(--n-merged-border-color);
 `,[t("&::after",`
 bottom: 0 !important;
 `),t("&::before",`
 bottom: 0 !important;
 `)]),e("summary",`
 background-color: var(--n-merged-th-color);
 `),e("hover",`
 background-color: var(--n-merged-td-color-hover);
 `),o("ellipsis",`
 display: inline-block;
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap;
 max-width: 100%;
 vertical-align: bottom;
 `),e("selection, expand",`
 text-align: center;
 padding: 0;
 line-height: 0;
 `),y]),r("data-table-empty",`
 box-sizing: border-box;
 padding: var(--n-empty-padding);
 flex-grow: 1;
 flex-shrink: 0;
 opacity: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: opacity .3s var(--n-bezier);
 `,[e("hide",`
 opacity: 0;
 `)]),o("pagination",`
 margin: var(--n-pagination-margin);
 display: flex;
 justify-content: flex-end;
 `),r("data-table-wrapper",`
 position: relative;
 opacity: 1;
 transition: opacity .3s var(--n-bezier), border-color .3s var(--n-bezier);
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 line-height: var(--n-line-height);
 `),e("loading",[r("data-table-wrapper",`
 opacity: var(--n-opacity-loading);
 pointer-events: none;
 `)]),e("single-column",[r("data-table-td",`
 border-bottom: 0 solid var(--n-merged-border-color);
 `,[t("&::after, &::before",`
 bottom: 0 !important;
 `)])]),i("single-line",[r("data-table-th",`
 border-right: 1px solid var(--n-merged-border-color);
 `,[e("last",`
 border-right: 0 solid var(--n-merged-border-color);
 `)]),r("data-table-td",`
 border-right: 1px solid var(--n-merged-border-color);
 `,[e("last-col",`
 border-right: 0 solid var(--n-merged-border-color);
 `)])]),e("bordered",[r("data-table-wrapper",`
 border: 1px solid var(--n-merged-border-color);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 overflow: hidden;
 `)]),r("data-table-base-table",[e("transition-disabled",[r("data-table-th",[t("&::after, &::before","transition: none;")]),r("data-table-td",[t("&::after, &::before","transition: none;")])])]),e("bottom-bordered",[r("data-table-td",[e("last-row",`
 border-bottom: 1px solid var(--n-merged-border-color);
 `)])]),r("data-table-table",`
 font-variant-numeric: tabular-nums;
 width: 100%;
 word-break: break-word;
 transition: background-color .3s var(--n-bezier);
 border-collapse: separate;
 border-spacing: 0;
 background-color: var(--n-merged-td-color);
 `),r("data-table-base-table-header",`
 border-top-left-radius: calc(var(--n-border-radius) - 1px);
 border-top-right-radius: calc(var(--n-border-radius) - 1px);
 z-index: 3;
 overflow: scroll;
 flex-shrink: 0;
 transition: border-color .3s var(--n-bezier);
 scrollbar-width: none;
 `,[t("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),r("data-table-check-extra",`
 transition: color .3s var(--n-bezier);
 color: var(--n-th-icon-color);
 position: absolute;
 font-size: 14px;
 right: -4px;
 top: 50%;
 transform: translateY(-50%);
 z-index: 1;
 `)]),r("data-table-filter-menu",[r("scrollbar",`
 max-height: 240px;
 `),o("group",`
 display: flex;
 flex-direction: column;
 padding: 12px 12px 0 12px;
 `,[r("checkbox",`
 margin-bottom: 12px;
 margin-right: 0;
 `),r("radio",`
 margin-bottom: 12px;
 margin-right: 0;
 `)]),o("action",`
 padding: var(--n-action-padding);
 display: flex;
 flex-wrap: nowrap;
 justify-content: space-evenly;
 border-top: 1px solid var(--n-action-divider-color);
 `,[r("button",[t("&:not(:last-child)",`
 margin: var(--n-action-button-margin);
 `),t("&:last-child",`
 margin-right: 0;
 `)])]),r("divider",`
 margin: 0 !important;
 `)]),g(r("data-table",`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 --n-merged-th-color-hover: var(--n-th-color-hover-modal);
 --n-merged-td-color-hover: var(--n-td-color-hover-modal);
 --n-merged-td-color-striped: var(--n-td-color-striped-modal);
 `)),x(r("data-table",`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 --n-merged-th-color-hover: var(--n-th-color-hover-popover);
 --n-merged-td-color-hover: var(--n-td-color-hover-popover);
 --n-merged-td-color-striped: var(--n-td-color-striped-popover);
 `))]);function H(){return[e("fixed-left",`
 left: 0;
 position: sticky;
 z-index: 2;
 `,[t("&::after",`
 pointer-events: none;
 content: "";
 width: 36px;
 display: inline-block;
 position: absolute;
 top: 0;
 bottom: -1px;
 transition: box-shadow .2s var(--n-bezier);
 right: -36px;
 `)]),e("fixed-right",`
 right: 0;
 position: sticky;
 z-index: 1;
 `,[t("&::before",`
 pointer-events: none;
 content: "";
 width: 36px;
 display: inline-block;
 position: absolute;
 top: 0;
 bottom: -1px;
 transition: box-shadow .2s var(--n-bezier);
 left: -36px;
 `)])]}const zr=t([r("time-picker",`
 z-index: auto;
 position: relative;
 `,[r("time-picker-icon",`
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `),e("disabled",[r("time-picker-icon",`
 color: var(--n-icon-color-disabled-override);
 `)])]),r("time-picker-panel",`
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 font-size: var(--n-item-font-size);
 border-radius: var(--n-border-radius);
 margin: 4px 0;
 min-width: 104px;
 overflow: hidden;
 background-color: var(--n-panel-color);
 box-shadow: var(--n-panel-box-shadow);
 `,[p(),r("time-picker-actions",`
 padding: var(--n-panel-action-padding);
 align-items: center;
 display: flex;
 justify-content: space-evenly;
 `),r("time-picker-cols",`
 height: calc(var(--n-item-height) * 6);
 display: flex;
 position: relative;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-panel-divider-color);
 `),r("time-picker-col",`
 flex-grow: 1;
 min-width: var(--n-item-width);
 height: calc(var(--n-item-height) * 6);
 flex-direction: column;
 transition: box-shadow .3s var(--n-bezier);
 `,[e("transition-disabled",[o("item","transition: none;",[t("&::before","transition: none;")])]),o("padding",`
 height: calc(var(--n-item-height) * 5);
 `),t("&:first-child","min-width: calc(var(--n-item-width) + 4px);",[o("item",[t("&::before","left: 4px;")])]),o("item",`
 cursor: pointer;
 height: var(--n-item-height);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 background: #0000;
 text-decoration-color: #0000;
 color: var(--n-item-text-color);
 z-index: 0;
 box-sizing: border-box;
 padding-top: 4px;
 position: relative;
 `,[t("&::before",`
 content: "";
 transition: background-color .3s var(--n-bezier);
 z-index: -1;
 position: absolute;
 left: 0;
 right: 4px;
 top: 4px;
 bottom: 0;
 border-radius: var(--n-item-border-radius);
 `),i("disabled",[t("&:hover::before",`
 background-color: var(--n-item-color-hover);
 `)]),e("active",`
 color: var(--n-item-text-color-active);
 `,[t("&::before",`
 background-color: var(--n-item-color-hover);
 `)]),e("disabled",`
 opacity: var(--n-item-opacity-disabled);
 cursor: not-allowed;
 `)]),e("invalid",[o("item",[e("active",`
 text-decoration: line-through;
 text-decoration-color: var(--n-item-text-color-active);
 `)])])])])]),kr=t([r("date-picker",`
 position: relative;
 z-index: auto;
 `,[r("date-picker-icon",`
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `),r("icon",`
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `),e("disabled",[r("date-picker-icon",`
 color: var(--n-icon-color-disabled-override);
 `),r("icon",`
 color: var(--n-icon-color-disabled-override);
 `)])]),r("date-panel",`
 width: fit-content;
 outline: none;
 margin: 4px 0;
 display: grid;
 grid-template-columns: 0fr;
 border-radius: var(--n-panel-border-radius);
 background-color: var(--n-panel-color);
 color: var(--n-panel-text-color);
 `,[p(),e("shadow",`
 box-shadow: var(--n-panel-box-shadow);
 `),r("date-panel-calendar",{padding:"var(--n-calendar-left-padding)",display:"grid",gridTemplateColumns:"1fr",gridArea:"left-calendar"},[e("end",{padding:"var(--n-calendar-right-padding)",gridArea:"right-calendar"})]),r("date-panel-month-calendar",{display:"flex",gridArea:"left-calendar"},[o("picker-col",`
 min-width: var(--n-scroll-item-width);
 height: calc(var(--n-scroll-item-height) * 6);
 user-select: none;
 -webkit-user-select: none;
 `,[t("&:first-child",`
 min-width: calc(var(--n-scroll-item-width) + 4px);
 `,[o("picker-col-item",[t("&::before","left: 4px;")])]),o("padding",`
 height: calc(var(--n-scroll-item-height) * 5)
 `)]),o("picker-col-item",`
 z-index: 0;
 cursor: pointer;
 height: var(--n-scroll-item-height);
 box-sizing: border-box;
 padding-top: 4px;
 display: flex;
 align-items: center;
 justify-content: center;
 position: relative;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background: #0000;
 color: var(--n-item-text-color);
 `,[t("&::before",`
 z-index: -1;
 content: "";
 position: absolute;
 left: 0;
 right: 4px;
 top: 4px;
 bottom: 0;
 border-radius: var(--n-scroll-item-border-radius);
 transition: 
 background-color .3s var(--n-bezier);
 `),i("disabled",[t("&:hover::before",`
 background-color: var(--n-item-color-hover);
 `),e("selected",`
 color: var(--n-item-color-active);
 `,[t("&::before","background-color: var(--n-item-color-hover);")])]),e("disabled",`
 color: var(--n-item-text-color-disabled);
 cursor: not-allowed;
 `,[e("selected",[t("&::before",`
 background-color: var(--n-item-color-disabled);
 `)])])])]),e("date",{gridTemplateAreas:`
 "left-calendar"
 "footer"
 "action"
 `}),e("daterange",{gridTemplateAreas:`
 "left-calendar divider right-calendar"
 "footer footer footer"
 "action action action"
 `}),e("datetime",{gridTemplateAreas:`
 "header"
 "left-calendar"
 "footer"
 "action"
 `}),e("datetimerange",{gridTemplateAreas:`
 "header header header"
 "left-calendar divider right-calendar"
 "footer footer footer"
 "action action action"
 `}),e("month",{gridTemplateAreas:`
 "left-calendar"
 "footer"
 "action"
 `}),r("date-panel-footer",{gridArea:"footer"}),r("date-panel-actions",{gridArea:"action"}),r("date-panel-header",{gridArea:"header"}),r("date-panel-header",`
 box-sizing: border-box;
 width: 100%;
 align-items: center;
 padding: var(--n-panel-header-padding);
 display: flex;
 justify-content: space-between;
 border-bottom: 1px solid var(--n-panel-header-divider-color);
 `,[t(">",[t("*:not(:last-child)",{marginRight:"10px"}),t("*",{flex:1,width:0}),r("time-picker",{zIndex:1})])]),r("date-panel-month",`
 box-sizing: border-box;
 display: grid;
 grid-template-columns: var(--n-calendar-title-grid-template-columns);
 align-items: center;
 justify-items: center;
 padding: var(--n-calendar-title-padding);
 height: var(--n-calendar-title-height);
 `,[o("prev, next, fast-prev, fast-next",`
 line-height: 0;
 cursor: pointer;
 width: var(--n-arrow-size);
 height: var(--n-arrow-size);
 color: var(--n-arrow-color);
 `),o("month-year",`
 user-select: none;
 -webkit-user-select: none;
 flex-grow: 1;
 position: relative;
 `,[o("text",`
 font-size: var(--n-calendar-title-font-size);
 line-height: var(--n-calendar-title-font-size);
 font-weight: var(--n-calendar-title-font-weight);
 padding: 6px 8px;
 text-align: center;
 color: var(--n-calendar-title-text-color);
 cursor: pointer;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-panel-border-radius);
 `,[e("active",`
 background-color: var(--n-calendar-title-color-hover);
 `),t("&:hover",`
 background-color: var(--n-calendar-title-color-hover);
 `)])])]),r("date-panel-weekdays",`
 display: grid;
 margin: auto;
 grid-template-columns: repeat(7, var(--n-item-cell-width));
 grid-template-rows: repeat(1, var(--n-item-cell-height));
 align-items: center;
 justify-items: center;
 margin-bottom: 4px;
 border-bottom: 1px solid var(--n-calendar-days-divider-color);
 `,[o("day",`
 user-select: none;
 -webkit-user-select: none;
 line-height: 15px;
 width: var(--n-item-size);
 text-align: center;
 font-size: var(--n-calendar-days-font-size);
 color: var(--n-item-text-color);
 `)]),r("date-panel-dates",`
 margin: auto;
 display: grid;
 grid-template-columns: repeat(7, var(--n-item-cell-width));
 grid-template-rows: repeat(6, var(--n-item-cell-height));
 align-items: center;
 justify-items: center;
 flex-wrap: wrap;
 `,[r("date-panel-date",`
 user-select: none;
 -webkit-user-select: none;
 position: relative;
 width: var(--n-item-size);
 height: var(--n-item-size);
 line-height: var(--n-item-size);
 text-align: center;
 font-size: var(--n-item-font-size);
 border-radius: var(--n-item-border-radius);
 z-index: 0;
 cursor: pointer;
 transition:
 background-color .2s var(--n-bezier),
 color .2s var(--n-bezier);
 `,[o("trigger",`
 position: absolute;
 left: calc(var(--n-item-size) / 2 - var(--n-item-cell-width) / 2);
 top: calc(var(--n-item-size) / 2 - var(--n-item-cell-height) / 2);
 width: var(--n-item-cell-width);
 height: var(--n-item-cell-height);
 `),i("disabled",[i("selected",[t("&:hover",{backgroundColor:"var(--n-item-color-hover)"})])]),e("current",[o("sup",`
 position: absolute;
 top: 2px;
 right: 2px;
 content: "";
 height: 4px;
 width: 4px;
 border-radius: 2px;
 background-color: var(--n-item-color-active);
 transition:
 background-color .2s var(--n-bezier);
 `)]),t("&::after",`
 content: "";
 z-index: -1;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 transition: background-color .3s var(--n-bezier);
 `),e("covered, start, end",[i("excluded",[t("&::before",`
 content: "";
 z-index: -2;
 position: absolute;
 left: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 right: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 top: 0;
 bottom: 0;
 background-color: var(--n-item-color-included);
 `),t("&:nth-child(7n + 1)::before",{borderTopLeftRadius:"var(--n-item-border-radius)",borderBottomLeftRadius:"var(--n-item-border-radius)"}),t("&:nth-child(7n + 7)::before",{borderTopRightRadius:"var(--n-item-border-radius)",borderBottomRightRadius:"var(--n-item-border-radius)"})])]),e("selected",{color:"var(--n-item-text-color-active)"},[t("&::after",{backgroundColor:"var(--n-item-color-active)"}),e("start",[t("&::before",{left:"50%"})]),e("end",[t("&::before",{right:"50%"})]),o("sup",{backgroundColor:"var(--n-panel-color)"})]),e("excluded",{color:"var(--n-item-text-color-disabled)"},[e("selected",[t("&::after",{backgroundColor:"var(--n-item-color-disabled)"})])]),e("disabled",{cursor:"not-allowed",color:"var(--n-item-text-color-disabled)"},[e("covered",[t("&::before",{backgroundColor:"var(--n-item-color-disabled)"})]),e("selected",[t("&::before",{backgroundColor:"var(--n-item-color-disabled)"}),t("&::after",{backgroundColor:"var(--n-item-color-disabled)"})])])])]),o("vertical-divider",`
 grid-area: divider;
 height: 100%;
 width: 1px;
 background-color: var(--n-calendar-divider-color);
 `),r("date-panel-footer",{borderTop:"1px solid var(--n-panel-action-divider-color)",padding:"var(--n-panel-extra-footer-padding)"}),r("date-panel-actions",`
 flex: 1;
 padding: var(--n-panel-action-padding);
 display: flex;
 align-items: center;
 justify-content: space-between;
 border-top: 1px solid var(--n-panel-action-divider-color);
 `,[o("prefix, suffix",`
 display: flex;
 margin-bottom: -8px;
 `),o("suffix",`
 align-self: flex-end;
 `),o("prefix",`
 flex-wrap: wrap;
 `),r("button",`
 margin-bottom: 8px;
 `,[t("&:not(:last-child)",`
 margin-right: 8px;
 `)])])]),t("[data-n-date].transition-disabled",{transition:"none !important"},[t("&::before, &::after",{transition:"none !important"})])]),yr=t([r("descriptions",{fontSize:"var(--n-font-size)"},[r("descriptions-separator",`
 display: inline-block;
 margin: 0 8px 0 2px;
 `),r("descriptions-table-wrapper",[r("descriptions-table",[r("descriptions-table-row",[r("descriptions-table-header",{padding:"var(--n-th-padding)"}),r("descriptions-table-content",{padding:"var(--n-td-padding)"})])])]),i("bordered",[r("descriptions-table-wrapper",[r("descriptions-table",[r("descriptions-table-row",[t("&:last-child",[r("descriptions-table-content",{paddingBottom:0})])])])])]),e("left-label-placement",[r("descriptions-table-content",[t("> *",{verticalAlign:"top"})])]),e("left-label-align",[t("th",{textAlign:"left"})]),e("center-label-align",[t("th",{textAlign:"center"})]),e("right-label-align",[t("th",{textAlign:"right"})]),e("bordered",[r("descriptions-table-wrapper",`
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `,[r("descriptions-table",[r("descriptions-table-row",[t("&:not(:last-child)",[r("descriptions-table-content",{borderBottom:"1px solid var(--n-merged-border-color)"}),r("descriptions-table-header",{borderBottom:"1px solid var(--n-merged-border-color)"})]),r("descriptions-table-header",`
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `,[t("&:not(:last-child)",{borderRight:"1px solid var(--n-merged-border-color)"})]),r("descriptions-table-content",[t("&:not(:last-child)",{borderRight:"1px solid var(--n-merged-border-color)"})])])])])]),r("descriptions-header",`
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `),r("descriptions-table-wrapper",`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[r("descriptions-table",`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `,[r("descriptions-table-row",`
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `,[r("descriptions-table-header",`
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),r("descriptions-table-content",`
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[o("content",`
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]),o("label",`
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]),r("descriptions-table-wrapper",`
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `),g(r("descriptions-table-wrapper",`
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)),x(r("descriptions-table-wrapper",`
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]),$r=t([r("dialog",`
 word-break: break-word;
 line-height: var(--n-line-height);
 position: relative;
 background: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 margin: auto;
 border-radius: var(--n-border-radius);
 padding: var(--n-padding);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `,[o("icon",{color:"var(--n-icon-color)"}),e("bordered",{border:"var(--n-border)"}),e("icon-top",[o("close",{margin:"var(--n-close-margin)"}),o("icon",{margin:"var(--n-icon-margin)"}),o("content",{textAlign:"center"}),o("title",{justifyContent:"center"}),o("action",{justifyContent:"center"})]),e("icon-left",[o("icon",{margin:"var(--n-icon-margin)"}),e("closable",[o("title",`
 padding-right: calc(var(--n-close-size) + 6px);
 `)])]),o("close",`
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 z-index: 1;
 `),o("content",`
 font-size: var(--n-font-size);
 margin: var(--n-content-margin);
 position: relative;
 word-break: break-word;
 `,[e("last","margin-bottom: 0;")]),o("action",`
 display: flex;
 justify-content: flex-end;
 `,[t("> *:not(:last-child)",{marginRight:"var(--n-action-space)"})]),o("icon",{fontSize:"var(--n-icon-size)",transition:"color .3s var(--n-bezier)"}),o("title",`
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),r("dialog-icon-container",{display:"flex",justifyContent:"center"})]),g(r("dialog",`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)),r("dialog",[D(`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)])]),jr=t([r("modal-container",`
 position: fixed;
 left: 0;
 top: 0;
 height: 0;
 width: 0;
 display: flex;
 `),r("modal-mask",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, .4);
 `,[f({enterDuration:".25s",leaveDuration:".25s",enterCubicBezier:"var(--n-bezier-ease-out)",leaveCubicBezier:"var(--n-bezier-ease-out)"})]),r("modal-body-wrapper",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: visible;
 `,[r("modal-scroll-content",`
 min-height: 100%;
 display: flex;
 position: relative;
 `)]),r("modal",`
 position: relative;
 align-self: center;
 color: var(--n-text-color);
 margin: auto;
 box-shadow: var(--n-box-shadow);
 `,[p({duration:".25s",enterScale:".5"})])]),Cr=r("divider",`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[i("vertical",`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[i("no-title",`
 display: flex;
 align-items: center;
 `)]),o("title",`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),e("title-position-left",[o("line",[e("left",{width:"28px"})])]),e("title-position-right",[o("line",[e("right",{width:"28px"})])]),e("dashed",[o("line",`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),e("vertical",`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),o("line",`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),i("dashed",[o("line",{backgroundColor:"var(--n-color)"})]),e("dashed",[o("line",{borderColor:"var(--n-color)"})]),e("vertical",{backgroundColor:"var(--n-color)"})]),Tr=t([r("drawer",`
 word-break: break-word;
 line-height: var(--n-line-height);
 position: absolute;
 pointer-events: all;
 box-shadow: var(--n-box-shadow);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background-color: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 `,[F(),L(),E(),M(),e("unselectable",`
 user-select: none; 
 -webkit-user-select: none;
 `),e("native-scrollbar",[r("drawer-content-wrapper",`
 overflow: auto;
 height: 100%;
 `)]),o("resize-trigger",`
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `,[e("hover",`
 background-color: var(--n-resize-trigger-color-hover);
 `)]),r("drawer-content-wrapper",`
 box-sizing: border-box;
 `),r("drawer-content",`
 height: 100%;
 display: flex;
 flex-direction: column;
 `,[e("native-scrollbar",[r("drawer-body-content-wrapper",`
 height: 100%;
 overflow: auto;
 `)]),r("drawer-body",`
 flex: 1 0 0;
 overflow: hidden;
 `),r("drawer-body-content-wrapper",`
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `),r("drawer-header",`
 font-weight: var(--n-title-font-weight);
 line-height: 1;
 font-size: var(--n-title-font-size);
 color: var(--n-title-text-color);
 padding: var(--n-header-padding);
 transition: border .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-divider-color);
 border-bottom: var(--n-header-border-bottom);
 display: flex;
 justify-content: space-between;
 align-items: center;
 `,[o("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),r("drawer-footer",`
 display: flex;
 justify-content: flex-end;
 border-top: var(--n-footer-border-top);
 transition: border .3s var(--n-bezier);
 padding: var(--n-footer-padding);
 `)]),e("right-placement",`
 top: 0;
 bottom: 0;
 right: 0;
 `,[o("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 left: 0;
 transform: translateX(-1.5px);
 cursor: ew-resize;
 `)]),e("left-placement",`
 top: 0;
 bottom: 0;
 left: 0;
 `,[o("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 right: 0;
 transform: translateX(1.5px);
 cursor: ew-resize;
 `)]),e("top-placement",`
 top: 0;
 left: 0;
 right: 0;
 `,[o("resize-trigger",`
 width: 100%;
 height: 3px;
 bottom: 0;
 left: 0;
 transform: translateY(1.5px);
 cursor: ns-resize;
 `)]),e("bottom-placement",`
 left: 0;
 bottom: 0;
 right: 0;
 `,[o("resize-trigger",`
 width: 100%;
 height: 3px;
 top: 0;
 left: 0;
 transform: translateY(-1.5px);
 cursor: ns-resize;
 `)])]),t("body",[t(">",[r("drawer-container",{position:"fixed"})])]),r("drawer-container",`
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `,[t("> *",{pointerEvents:"all"})]),r("drawer-mask",`
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[e("invisible",`
 background-color: rgba(0, 0, 0, 0)
 `),f({enterDuration:"0.2s",leaveDuration:"0.2s",enterCubicBezier:"var(--n-bezier-in)",leaveCubicBezier:"var(--n-bezier-out)"})])]),Dr=r("dynamic-tags",[r("input",{minWidth:"var(--n-input-width)"})]),Sr=r("form",[e("inline",`
 width: 100%;
 display: inline-flex;
 align-items: flex-start;
 align-content: space-around;
 `,[r("form-item",{width:"auto",marginRight:"18px"},[t("&:last-child",{marginRight:0})])])]),Yr=r("form-item",`
 display: grid;
 line-height: var(--n-line-height);
`,[r("form-item-label",`
 grid-area: label;
 align-items: center;
 line-height: 1.25;
 text-align: var(--n-label-text-align);
 font-size: var(--n-label-font-size);
 min-height: var(--n-label-height);
 padding: var(--n-label-padding);
 color: var(--n-label-text-color);
 transition: color .3s var(--n-bezier);
 box-sizing: border-box;
 font-weight: var(--n-label-font-weight);
 `,[o("asterisk",`
 white-space: nowrap;
 user-select: none;
 -webkit-user-select: none;
 color: var(--n-asterisk-color);
 transition: color .3s var(--n-bezier);
 `),o("asterisk-placeholder",`
 grid-area: mark;
 user-select: none;
 -webkit-user-select: none;
 visibility: hidden; 
 `)]),r("form-item-blank",`
 grid-area: blank;
 min-height: var(--n-blank-height);
 `),e("auto-label-width",[r("form-item-label","white-space: nowrap;")]),e("left-labelled",`
 grid-template-areas:
 "label blank"
 "label feedback";
 grid-template-columns: auto minmax(0, 1fr);
 grid-template-rows: auto 1fr;
 align-items: start;
 `,[r("form-item-label",`
 display: grid;
 grid-template-columns: 1fr auto;
 min-height: var(--n-blank-height);
 height: auto;
 box-sizing: border-box;
 flex-shrink: 0;
 flex-grow: 0;
 `,[e("reverse-columns-space",`
 grid-template-columns: auto 1fr;
 `),e("left-mark",`
 grid-template-areas:
 "mark text"
 ". text";
 `),e("right-mark",`
 grid-template-areas: 
 "text mark"
 "text .";
 `),e("right-hanging-mark",`
 grid-template-areas: 
 "text mark"
 "text .";
 `),o("text",`
 grid-area: text; 
 `),o("asterisk",`
 grid-area: mark; 
 align-self: end;
 `)])]),e("top-labelled",`
 grid-template-areas:
 "label"
 "blank"
 "feedback";
 grid-template-rows: minmax(var(--n-label-height), auto) 1fr;
 grid-template-columns: minmax(0, 100%);
 `,[e("no-label",`
 grid-template-areas:
 "blank"
 "feedback";
 grid-template-rows: 1fr;
 `),r("form-item-label",`
 display: flex;
 align-items: flex-start;
 justify-content: var(--n-label-text-align);
 `)]),r("form-item-blank",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 position: relative;
 `),r("form-item-feedback-wrapper",`
 grid-area: feedback;
 box-sizing: border-box;
 min-height: var(--n-feedback-height);
 font-size: var(--n-feedback-font-size);
 line-height: 1.25;
 transform-origin: top left;
 `,[t("&:not(:empty)",`
 padding: var(--n-feedback-padding);
 `),r("form-item-feedback",{transition:"color .3s var(--n-bezier)",color:"var(--n-feedback-text-color)"},[e("warning",{color:"var(--n-feedback-text-color-warning)"}),e("error",{color:"var(--n-feedback-text-color-error)"}),P({fromOffset:"-3px",enterDuration:".3s",leaveDuration:".2s"})])])]),Xr=r("gradient-text",`
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`),Ar=t([r("input-number-suffix",`
 display: inline-block;
 margin-right: 10px;
 `),r("input-number-prefix",`
 display: inline-block;
 margin-left: 10px;
 `)]),Rr=r("layout",`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[r("layout-scroll-container",`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),e("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),Br=r("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[e("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),e("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),Ir=r("layout-sider",`
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`,[e("bordered",[o("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),o("left-placement",[e("bordered",[o("border",`
 right: 0;
 `)])]),e("right-placement",`
 justify-content: flex-start;
 `,[e("bordered",[o("border",`
 left: 0;
 `)]),e("collapsed",[r("layout-toggle-button",[r("base-icon",`
 transform: rotate(180deg);
 `)]),r("layout-toggle-bar",[t("&:hover",[o("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),o("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),r("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[r("base-icon",`
 transform: rotate(0);
 `)]),r("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[t("&:hover",[o("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),o("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),e("collapsed",[r("layout-toggle-bar",[t("&:hover",[o("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),o("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),r("layout-toggle-button",[r("base-icon",`
 transform: rotate(0);
 `)])]),r("layout-toggle-button",`
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `,[r("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),r("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[o("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),o("bottom",`
 position: absolute;
 top: 34px;
 `),t("&:hover",[o("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),o("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),o("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),t("&:hover",[o("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),o("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),r("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),e("show-content",[r("layout-sider-scroll-container",{opacity:1})]),e("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),Fr=r("loading-bar-container",`
 z-index: 5999;
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 height: 2px;
`,[f({enterDuration:"0.3s",leaveDuration:"0.8s"}),r("loading-bar",`
 width: 100%;
 transition:
 max-width 4s linear,
 background .2s linear;
 height: var(--n-height);
 `,[e("starting",`
 background: var(--n-color-loading);
 `),e("finishing",`
 background: var(--n-color-loading);
 transition:
 max-width .2s linear,
 background .2s linear;
 `),e("error",`
 background: var(--n-color-error);
 transition:
 max-width .2s linear,
 background .2s linear;
 `)])]),$=[t("&::before","background-color: var(--n-item-color-hover);"),o("arrow",`
 color: var(--n-arrow-color-hover);
 `),o("icon",`
 color: var(--n-item-icon-color-hover);
 `),r("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[t("a",`
 color: var(--n-item-text-color-hover);
 `),o("extra",`
 color: var(--n-item-text-color-hover);
 `)])],j=[o("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),r("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[t("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),o("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],Lr=t([r("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[e("horizontal",`
 display: inline-flex;
 padding-bottom: 0;
 `,[r("submenu","margin: 0;"),r("menu-item","margin: 0;"),r("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[t("&::before","display: none;"),e("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),r("menu-item-content",[e("selected",[o("icon","color: var(--n-item-icon-color-active-horizontal);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[t("a","color: var(--n-item-text-color-active-horizontal);"),o("extra","color: var(--n-item-text-color-active-horizontal);")])]),e("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[r("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[t("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),o("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),o("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),i("disabled",[i("selected, child-active",[t("&:focus-within",j)]),e("selected",[v(null,[o("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[t("a","color: var(--n-item-text-color-active-hover-horizontal);"),o("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),e("child-active",[v(null,[o("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[t("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),o("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),v("border-bottom: 2px solid var(--n-border-color-horizontal);",j)]),r("menu-item-content-header",[t("a","color: var(--n-item-text-color-horizontal);")])])]),e("collapsed",[r("menu-item-content",[e("selected",[t("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),r("menu-item-content-header","opacity: 0;"),o("arrow","opacity: 0;"),o("icon","color: var(--n-item-icon-color-collapsed);")])]),r("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),r("menu-item-content",`
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[t("> *","z-index: 1;"),t("&::before",`
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),e("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),e("collapsed",[o("arrow","transform: rotate(0);")]),e("selected",[t("&::before","background-color: var(--n-item-color-active);"),o("arrow","color: var(--n-arrow-color-active);"),o("icon","color: var(--n-item-icon-color-active);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[t("a","color: var(--n-item-text-color-active);"),o("extra","color: var(--n-item-text-color-active);")])]),e("child-active",[r("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[t("a",`
 color: var(--n-item-text-color-child-active);
 `),o("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),o("arrow",`
 color: var(--n-arrow-color-child-active);
 `),o("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),i("disabled",[i("selected, child-active",[t("&:focus-within",$)]),e("selected",[v(null,[o("arrow","color: var(--n-arrow-color-active-hover);"),o("icon","color: var(--n-item-icon-color-active-hover);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[t("a","color: var(--n-item-text-color-active-hover);"),o("extra","color: var(--n-item-text-color-active-hover);")])])]),e("child-active",[v(null,[o("arrow","color: var(--n-arrow-color-child-active-hover);"),o("icon","color: var(--n-item-icon-color-child-active-hover);"),r("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[t("a","color: var(--n-item-text-color-child-active-hover);"),o("extra","color: var(--n-item-text-color-child-active-hover);")])])]),e("selected",[v(null,[t("&::before","background-color: var(--n-item-color-active-hover);")])]),v(null,$)]),o("icon",`
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `),o("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),r("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 color: var(--n-item-text-color);
 `,[t("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[t("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),o("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),r("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[r("menu-item-content",`
 height: var(--n-item-height);
 `),r("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[S({duration:".2s"})])]),r("menu-item-group",[r("menu-item-group-title",`
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]),r("menu-tooltip",[t("a",`
 color: inherit;
 text-decoration: none;
 `)]),r("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function v(a,b){return[e("hover",a,b),t("&:hover",a,b)]}const Er=t([r("message-wrapper",`
 margin: var(--n-margin);
 z-index: 0;
 transform-origin: top center;
 display: flex;
 `,[S({overflow:"visible",originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.85)"}})]),r("message",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 margin-bottom .3s var(--n-bezier);
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 flex-wrap: nowrap;
 overflow: hidden;
 max-width: var(--n-max-width);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-shadow: var(--n-box-shadow);
 `,[o("content",`
 display: inline-block;
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 `),o("icon",`
 position: relative;
 margin: var(--n-icon-margin);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 flex-shrink: 0;
 `,[["default","info","success","warning","error","loading"].map(a=>e(`${a}-type`,[t("> *",`
 color: var(--n-icon-color-${a});
 transition: color .3s var(--n-bezier);
 `)])),t("> *",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[l()])]),o("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 flex-shrink: 0;
 `,[t("&:hover",`
 color: var(--n-close-icon-color-hover);
 `),t("&:active",`
 color: var(--n-close-icon-color-pressed);
 `)])]),r("message-container",`
 z-index: 6000;
 position: fixed;
 height: 0;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: center;
 `,[e("top",`
 top: 12px;
 left: 0;
 right: 0;
 `),e("top-left",`
 top: 12px;
 left: 12px;
 right: 0;
 align-items: flex-start;
 `),e("top-right",`
 top: 12px;
 left: 0;
 right: 12px;
 align-items: flex-end;
 `),e("bottom",`
 bottom: 4px;
 left: 0;
 right: 0;
 justify-content: flex-end;
 `),e("bottom-left",`
 bottom: 4px;
 left: 12px;
 right: 0;
 justify-content: flex-end;
 align-items: flex-start;
 `),e("bottom-right",`
 bottom: 4px;
 left: 0;
 right: 12px;
 justify-content: flex-end;
 align-items: flex-end;
 `)])]),Mr=t([r("notification-container",`
 z-index: 4000;
 position: fixed;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: flex-end;
 `,[t(">",[r("scrollbar",`
 width: initial;
 overflow: visible;
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `,[t(">",[r("scrollbar-container",`
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `,[r("scrollbar-content",`
 padding-top: 12px;
 padding-bottom: 33px;
 `)])])])]),e("top, top-right, top-left",`
 top: 12px;
 `,[t("&.transitioning >",[r("scrollbar",[t(">",[r("scrollbar-container",`
 min-height: 100vh !important;
 `)])])])]),e("bottom, bottom-right, bottom-left",`
 bottom: 12px;
 `,[t(">",[r("scrollbar",[t(">",[r("scrollbar-container",[r("scrollbar-content",`
 padding-bottom: 12px;
 `)])])])]),r("notification-wrapper",`
 display: flex;
 align-items: flex-end;
 margin-bottom: 0;
 margin-top: 12px;
 `)]),e("top, bottom",`
 left: 50%;
 transform: translateX(-50%);
 `,[r("notification-wrapper",[t("&.notification-transition-enter-from, &.notification-transition-leave-to",`
 transform: scale(0.85);
 `),t("&.notification-transition-leave-from, &.notification-transition-enter-to",`
 transform: scale(1);
 `)])]),e("top",[r("notification-wrapper",`
 transform-origin: top center;
 `)]),e("bottom",[r("notification-wrapper",`
 transform-origin: bottom center;
 `)]),e("top-right, bottom-right",[r("notification",`
 margin-left: 28px;
 margin-right: 16px;
 `)]),e("top-left, bottom-left",[r("notification",`
 margin-left: 16px;
 margin-right: 28px;
 `)]),e("top-right",`
 right: 0;
 `,[m("top-right")]),e("top-left",`
 left: 0;
 `,[m("top-left")]),e("bottom-right",`
 right: 0;
 `,[m("bottom-right")]),e("bottom-left",`
 left: 0;
 `,[m("bottom-left")]),e("scrollable",[e("top-right",`
 top: 0;
 `),e("top-left",`
 top: 0;
 `),e("bottom-right",`
 bottom: 0;
 `),e("bottom-left",`
 bottom: 0;
 `)]),r("notification-wrapper",`
 margin-bottom: 12px;
 `,[t("&.notification-transition-enter-from, &.notification-transition-leave-to",`
 opacity: 0;
 margin-top: 0 !important;
 margin-bottom: 0 !important;
 `),t("&.notification-transition-leave-from, &.notification-transition-enter-to",`
 opacity: 1;
 `),t("&.notification-transition-leave-active",`
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-in),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `),t("&.notification-transition-enter-active",`
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-out),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `)]),r("notification",`
 background-color: var(--n-color);
 color: var(--n-text-color);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 font-family: inherit;
 font-size: var(--n-font-size);
 font-weight: 400;
 position: relative;
 display: flex;
 overflow: hidden;
 flex-shrink: 0;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 width: var(--n-width);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 box-sizing: border-box;
 opacity: 1;
 `,[o("avatar",[r("icon",{color:"var(--n-icon-color)"}),r("base-icon",{color:"var(--n-icon-color)"})]),e("show-avatar",[r("notification-main",`
 margin-left: 40px;
 width: calc(100% - 40px); 
 `)]),e("closable",[r("notification-main",[t("> *:first-child",{paddingRight:"20px"})]),o("close",`
 position: absolute;
 top: 0;
 right: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),o("avatar",`
 position: absolute;
 top: var(--n-padding-top);
 left: var(--n-padding-left);
 width: 28px;
 height: 28px;
 font-size: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("icon","transition: color .3s var(--n-bezier);")]),r("notification-main",`
 padding-top: var(--n-padding-top);
 padding-bottom: var(--n-padding-bottom);
 box-sizing: border-box;
 display: flex;
 flex-direction: column;
 margin-left: 8px;
 width: calc(100% - 8px);
 `,[r("notification-main-footer",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-top: 12px;
 `,[o("meta",`
 font-size: var(--n-meta-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `),o("action",`
 cursor: pointer;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-action-text-color);
 `)]),o("header",`
 font-weight: var(--n-title-font-weight);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-title-text-color);
 `),o("description",`
 margin-top: 8px;
 font-size: var(--n-description-font-size);
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `),o("content",`
 line-height: var(--n-line-height);
 margin: 12px 0 0 0;
 font-family: inherit;
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-text-color);
 `,[t("&:first-child",{margin:0})])])])])]);function m(a){const d=a.split("-")[1]==="left"?"calc(-100%)":"calc(100%)",h="0";return r("notification-wrapper",[t("&.notification-transition-enter-from, &.notification-transition-leave-to",`
 transform: translate(${d}, 0);
 `),t("&.notification-transition-leave-from, &.notification-transition-enter-to",`
 transform: translate(${h}, 0);
 `)])}const Pr=r("popconfirm",[o("body",`
 font-size: var(--n-font-size);
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 position: relative;
 `,[o("icon",`
 display: flex;
 font-size: var(--n-icon-size);
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 margin: 0 8px 0 0;
 `)]),o("action",`
 display: flex;
 justify-content: flex-end;
 `,[t("&:not(:first-child)","margin-top: 8px"),r("button",[t("&:not(:last-child)","margin-right: 8px;")])])]),qr=r("result",`
 color: var(--n-text-color);
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 transition:
 color .3s var(--n-bezier);
`,[r("result-icon",`
 display: flex;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `,[o("status-image",`
 font-size: var(--n-icon-size);
 width: 1em;
 height: 1em;
 `),r("base-icon",`
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]),r("result-content",{marginTop:"24px"}),r("result-footer",`
 margin-top: 24px;
 text-align: center;
 `),r("result-header",[o("title",`
 margin-top: 16px;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 text-align: center;
 color: var(--n-title-text-color);
 font-size: var(--n-title-font-size);
 `),o("description",`
 margin-top: 4px;
 text-align: center;
 font-size: var(--n-font-size);
 `)])]),Hr=t([t("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),r("spin-container",{position:"relative"},[r("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[f()])]),r("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),r("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[e("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),r("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),r("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[e("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),Or=r("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[o("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),o("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),o("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),r("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[l({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),o("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),o("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),o("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),t("&:focus",[o("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),e("round",[o("rail","border-radius: calc(var(--n-rail-height) / 2);",[o("button","border-radius: calc(var(--n-button-height) / 2);")])]),i("disabled",[i("icon",[e("rubber-band",[e("pressed",[o("rail",[o("button","max-width: var(--n-button-width-pressed);")])]),o("rail",[t("&:active",[o("button","max-width: var(--n-button-width-pressed);")])]),e("active",[e("pressed",[o("rail",[o("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),o("rail",[t("&:active",[o("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),e("active",[o("rail",[o("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),o("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[o("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[l()]),o("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),e("active",[o("rail","background-color: var(--n-rail-color-active);")]),e("loading",[o("rail",`
 cursor: wait;
 `)]),e("disabled",[o("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Nr=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[e("segment-type",[r("tabs-rail",[t("&.transition-disabled","color: red;",[r("tabs-tab",`
 transition: none;
 `)])])]),e("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),e("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),e("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),e("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),e("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[e("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 `),t("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),e("flex",[r("tabs-nav",{width:"100%"},[r("tabs-wrapper",{width:"100%"},[r("tabs-tab",{marginRight:0})])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[o("prefix, suffix",`
 display: flex;
 align-items: center;
 `),o("prefix","padding-right: 16px;"),o("suffix","padding-left: 16px;")]),e("top, bottom",[r("tabs-nav-scroll-wrapper",[t("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),t("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),e("shadow-start",[t("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),e("shadow-end",[t("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),e("left, right",[r("tabs-nav-scroll-wrapper",[t("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),t("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),e("shadow-start",[t("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),e("shadow-end",[t("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[t("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),t("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[e("disabled",{cursor:"not-allowed"}),o("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),o("label",`
 display: flex;
 align-items: center;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[t("&.transition-disabled",`
 transition: none;
 `),e("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[t("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),t("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),t("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),t("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),t("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),e("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[t("&:hover",{color:"var(--n-tab-text-color-hover)"}),e("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),e("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[e("line-type",[e("top",[o("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),e("left",[o("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),e("right",[o("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),e("bottom",[o("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),o("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),e("card-type",[o("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[e("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[o("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),i("disabled",[t("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),e("closable","padding-right: 8px;"),e("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),e("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),e("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),e("top",[e("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[e("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),e("left",[e("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[e("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),e("right",[e("card-type",[r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[e("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),e("bottom",[e("card-type",[r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[e("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),Wr=r("h",`
 font-size: var(--n-font-size);
 font-weight: var(--n-font-weight);
 margin: var(--n-margin);
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`,[t("&:first-child",{marginTop:0}),e("prefix-bar",{position:"relative",paddingLeft:"var(--n-prefix-width)"},[e("align-text",{paddingLeft:0},[t("&::before",{left:"calc(-1 * var(--n-prefix-width))"})]),t("&::before",`
 content: "";
 width: var(--n-bar-width);
 border-radius: calc(var(--n-bar-width) / 2);
 transition: background-color .3s var(--n-bezier);
 left: 0;
 top: 0;
 bottom: 0;
 position: absolute;
 `),t("&::before",{backgroundColor:"var(--n-bar-color)"})])]),Zr=r("p",`
 box-sizing: border-box;
 transition: color .3s var(--n-bezier);
 margin: var(--n-margin);
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 color: var(--n-text-color);
`,[t("&:first-child","margin-top: 0;"),t("&:last-child","margin-bottom: 0;")]),C=t("li",{transition:"color .3s var(--n-bezier)",lineHeight:"var(--n-line-height)",margin:"var(--n-li-margin)",marginBottom:0,color:"var(--n-text-color)"}),T=[t("&:first-child",`
 margin-top: 0;
 `),t("&:last-child",`
 margin-bottom: 0;
 `)],Gr=t([r("ol",{fontSize:"var(--n-font-size)",padding:"var(--n-ol-padding)"},[e("align-text",{paddingLeft:0}),C,T]),r("ul",{fontSize:"var(--n-font-size)",padding:"var(--n-ul-padding)"},[e("align-text",{paddingLeft:0}),C,T])]);export{Wr as $,mr as A,ur as B,wr as C,zr as D,kr as E,yr as F,$r as G,jr as H,Cr as I,Tr as J,Dr as K,Sr as L,Yr as M,Xr as N,Ar as O,Rr as P,Br as Q,Ir as R,Fr as S,Lr as T,Er as U,Mr as V,Pr as W,qr as X,Hr as Y,Or as Z,Nr as _,G as a,Zr as a0,Gr as a1,J as b,K as c,Q as d,U as e,V as f,_ as g,rr as h,or as i,er as j,tr as k,ir as l,ar as m,nr as n,lr as o,sr as p,dr as q,cr as r,Z as s,br as t,pr as u,vr as v,gr as w,hr as x,fr as y,xr as z};
