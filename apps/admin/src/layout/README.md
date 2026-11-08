# Layout and customization

`RLayout` retains the existing Vue 3 + TSX structure, route permissions, menu conversion, and page caching. Preview configuration immediately at `/layout-demo` or the “布局” (Layout) tab in the top settings drawer.

## Navigation and content

- `side`: Complete sidebar menu.
- `top`: Complete top navigation; Naive UI handles horizontal overflow and submenus.
- `mixed`: First-level top navigation with visible children of the active group in the sidebar. Single-page menus do not occupy sidebar space.
- `right`: Complete sidebar menu to the right of the content.
- `split`: A fixed full-width top bar, with only the active group's children on the left. When the fixed top bar is disabled, top navigation scrolls with content.
- At ≤768px, use the complete-menu drawer without overwriting saved desktop mode. Selecting a drawer item closes it automatically.
- Sidebar/drawer logos remain fixed above the menu; scrolling begins at the menu region. The native-scrollbar option affects only the menu list.
- Content supports fluid fill or centered fixed width, maximum widths of 640–2560px, spacing of 0–48px, and fixed or scrolling headers/footers. Tab and copyright visibility retain existing settings.
- Maximized content shares Pinia state with pages and tab menus. The exit button floats at the top right. On narrow screens the shell reserves no space for it. Click it or press Esc to restore the layout.
- Content loading uses the visible scrolling viewport. Remounting shows the indicator immediately; brief manual loading waits 120ms. Fixed headers, tabs, and footers are not covered by the overlay.
- “外观 → 页面切换动画” (Appearance → Page transition) retains previous options and adds upward fade-in and leftward slide-in. Only content animates; reduced-motion system settings use immediate transitions.

Interactions draw on [Vben layout preferences](https://doc.vben.pro/en/guide/essentials/settings.html), reusing existing Naive UI components without a second layout framework.

## Configuration and extension

```tsx
import { useSettingActions } from '@/store'

const { updateSettingState } = useSettingActions()
updateSettingState('layoutConfig', {
  mode: 'mixed',
  contentWidth: 'fixed',
  contentMaxWidth: 1200,
  contentPadding: 16,
})
```

Configuration belongs to the `setting` store and retains its persistence key. Historical caches receive defaults and normalized ranges without clearing user preferences. `src/store/modules/setting/constant.ts` owns defaults. Restoring the default layout resets only `layoutConfig`.

The settings drawer keeps its five layout previews in one row, scrolling horizontally if needed. Bottom controls export layout, appearance, menu, watermark, and general preferences as `ray-template-preferences.json`, or import the same format. Files must pass version/field validation before applying in the current browser; no reload is required. Login, lock-screen, route configuration, and page-cache data are excluded.

Use named slots to replace regions:

```tsx
<RLayout>
  {{
    header: () => <CustomHeader />,
    sidebar: () => <CustomSidebar />,
    tabs: () => <CustomTabs />,
    footer: () => <CustomFooter />,
    default: () => <CustomContent />,
  }}
</RLayout>
```

Replaced slots honor the current mode and visibility settings: top-navigation mode has no sidebar; disabled tabs/copyright do not render their regions. Custom content must handle request cancellation and routed content. Without replacement, the default providers and route cache remain active.

Layout scroll references remain `LAYOUT_CONTENT_REF` for content and `LAYOUT_SIDER_REF` for the sidebar. `useContentScroll` / `useSiderScroll` read the current reference when invoked, supporting mode changes and remounts.

## Style ownership

`index.scss` owns the shell, content scrolling, and maximization. Top navigation, menus, tabs, and loading-state styles stay with their components. The settings drawer and layout lab share `LayoutSettings` and `LayoutSettings.scss`. Thumbnails within square option cards indicate navigation placement; text below explains menu behavior. Card groups reserve space for keyboard focus outlines, and `aria-pressed` represents selection.
