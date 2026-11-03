import{_n as e,gn as t}from"./replaceable-DW6s2lkT.js";/* empty css              */import{K as n,i as r,p as i}from"./index-rJvBcjbC.js";import{t as a}from"./Card-D38P0NK6.js";import{t as o}from"./DemoPage-C9W0vUGi.js";var s=e({name:`LayoutDemo`,setup(){let{t:e}=n(`layout`),{t:s}=n(`showcase`),{getLayoutConfig:c}=r();return()=>t(o,{title:e(`title`),description:e(`description`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[t(`div`,{class:`r-layout-playground`},[t(a,{title:s(`layoutControls`)},{default:()=>[t(i,{showDescription:!1},null)]}),t(`div`,{class:`r-layout-playground__aside`},[t(a,{title:e(`current`)},{default:()=>[t(`pre`,{class:`r-demo-code`},[t(`code`,null,[JSON.stringify(c.value,null,2)])])]}),t(a,{title:e(`extension`)},{default:()=>[t(`p`,{class:`r-layout-extension-description`},[e(`slots`)]),t(`pre`,{class:`r-demo-code`},[t(`code`,null,[`const { updateSettingState } = useSettingActions()

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