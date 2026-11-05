import{vn as e,yn as t}from"./Close-D8ap5Wyu.js";/* empty css              */import{Pn as n,rn as r,u as i,w as a}from"./directives-jkwfeMNs.js";import{t as o}from"./DemoPage-CMRMo_Jz.js";var s=t({name:`LayoutDemo`,setup(){let{t}=r(`layout`),{t:s}=r(`showcase`),{getLayoutConfig:c}=i();return()=>e(o,{title:t(`title`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[e(`div`,{class:`r-layout-playground`},[e(n,{title:s(`layoutControls`)},{default:()=>[e(a,{showDescription:!1},null)]}),e(`div`,{class:`r-layout-playground__aside`},[e(n,{title:t(`current`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[JSON.stringify(c.value,null,2)])])]}),e(n,{title:t(`extension`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[`const { updateSettingState } = useSettingActions()

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