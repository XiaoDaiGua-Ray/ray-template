import{Cn as e,t,wn as n}from"./Card-DevreQc-.js";/* empty css              */import{a as r,pt as i,v as a}from"./store-BEr0Jliy.js";import{t as o}from"./DemoPage-DaOCfg4x.js";var s=n({name:`LayoutDemo`,setup(){let{t:n}=i(`layout`),{t:s}=i(`showcase`),{getLayoutConfig:c}=r();return()=>e(o,{title:n(`title`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[e(`div`,{class:`r-layout-playground`},[e(t,{title:s(`layoutControls`)},{default:()=>[e(a,{showDescription:!1},null)]}),e(`div`,{class:`r-layout-playground__aside`},[e(t,{title:n(`current`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[JSON.stringify(c.value,null,2)])])]}),e(t,{title:n(`extension`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[`const { updateSettingState } = useSettingActions()

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