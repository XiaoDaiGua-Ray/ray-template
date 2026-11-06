import{v as e,y as t}from"./runtime-core.esm-bundler-CcpTTixp.js";/* empty css              */import{Dn as n,O as r,f as i}from"./directives-toLJ0LRh.js";import{t as a}from"./Card-DWNnI9T1.js";import{t as o}from"./DemoPage-J1LbYfsu.js";var s=t({name:`LayoutDemo`,setup(){let{t}=n(`layout`),{t:s}=n(`showcase`),{getLayoutConfig:c}=i();return()=>e(o,{title:t(`title`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[e(`div`,{class:`r-layout-playground`},[e(a,{title:s(`layoutControls`)},{default:()=>[e(r,{showDescription:!1},null)]}),e(`div`,{class:`r-layout-playground__aside`},[e(a,{title:t(`current`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[JSON.stringify(c.value,null,2)])])]}),e(a,{title:t(`extension`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[`const { updateSettingState } = useSettingActions()

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