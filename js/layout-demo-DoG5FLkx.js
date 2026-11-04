import{Cn as e,t,wn as n}from"./Card-B_oozRxS.js";/* empty css              */import{Vt as r,a as i,b as a}from"./store-DP5ZqOPA.js";import{t as o}from"./DemoPage-CJFmBY0O.js";var s=n({name:`LayoutDemo`,setup(){let{t:n}=r(`layout`),{t:s}=r(`showcase`),{getLayoutConfig:c}=i();return()=>e(o,{title:n(`title`),eyebrow:s(`layoutEyebrow`),meta:s(`livePreferences`)},{default:()=>[e(`div`,{class:`r-layout-playground`},[e(t,{title:s(`layoutControls`)},{default:()=>[e(a,{showDescription:!1},null)]}),e(`div`,{class:`r-layout-playground__aside`},[e(t,{title:n(`current`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[JSON.stringify(c.value,null,2)])])]}),e(t,{title:n(`extension`)},{default:()=>[e(`pre`,{class:`r-demo-code`},[e(`code`,null,[`const { updateSettingState } = useSettingActions()

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