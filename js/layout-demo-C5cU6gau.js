import{_n as e,gn as t}from"./replaceable-B-PFC1y9.js";/* empty css              */import{$ as n,a as r,g as i}from"./store-CqvdPZxw.js";import{t as a}from"./Card-BB74FRP1.js";import{t as o}from"./DemoPage-C69OySO9.js";var s=e({name:`LayoutDemo`,setup(){let{t:e}=n(`layout`),{t:s}=n(`showcase`),{getLayoutConfig:c}=r();return()=>t(o,{title:e(`title`),description:e(`description`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[t(`div`,{class:`r-layout-playground`},[t(a,{title:s(`layoutControls`)},{default:()=>[t(i,{showDescription:!1},null)]}),t(`div`,{class:`r-layout-playground__aside`},[t(a,{title:e(`current`)},{default:()=>[t(`pre`,{class:`r-demo-code`},[t(`code`,null,[JSON.stringify(c.value,null,2)])])]}),t(a,{title:e(`extension`)},{default:()=>[t(`p`,{class:`r-layout-extension-description`},[e(`slots`)]),t(`pre`,{class:`r-demo-code`},[t(`code`,null,[`const { updateSettingState } = useSettingActions()

updateSettingState('layoutConfig', {
  mode: 'mixed',
  contentWidth: 'fixed',
})

<RLayout>
  {{
    header: () => <CustomHeader />,
    footer: () => <CustomFooter />,
  }}
</RLayout>`])])]})])])]})}});export{s as default};