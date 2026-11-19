# Layout and state {#应用布局与状态}

<script setup>
import { withBase } from 'vitepress'
</script>

Open the layout playground or the **Layout** tab in the top bar's Preferences drawer to switch navigation and workspace settings. Desktop modes are side (`side`), top (`top`), mixed (`mixed`), right (`right`), and split (`split`). Mixed mode puts first-level navigation at the top and displays only the active group's children in the sidebar. At widths of 768 px or less, navigation uses a drawer and preserves desktop preferences.

## Live layout playground {#在线布局实验}

Try a different navigation position, pin the header, or change content width. The preview uses Ray Admin's layout and settings components with its own menus and state.

<iframe :src="withBase('/en/playground/shell.html')" title="Ray Admin interactive layout preview" loading="lazy" style="width: 100%; height: 650px; border: 1px solid var(--vp-c-divider); border-radius: 12px;" />

::: details View example source
<<< @/examples/ShellDemo.vue
:::

Press Tab to focus menu items and Enter or Space to expand a group or open a page. Use Up and Down in the sidebar and Left and Right in the top menu. In submenus from the collapsed sidebar or top menu, use the arrow keys to select, Enter to open, and Esc to close.

## Configure the workspace {#配置工作区}

```ts
import { useSettingActions } from '@/store'

const { updateSettingState } = useSettingActions()

updateSettingState('layoutConfig', {
  mode: 'mixed',
  contentWidth: 'fixed',
  contentMaxWidth: 1200,
  contentPadding: 24,
})
```

Maximum width ranges from 640 to 2560 px, and padding ranges from 0 to 48 px. The header and footer can stay fixed or scroll with the content. The settings drawer defaults to Comfortable (24 px) and also offers Compact and Centered Reading presets. These presets adjust content width and padding while retaining navigation and fixed-bar settings. The preset area shows the active preset and actual spacing. Manual settings outside the presets show as custom spacing. Existing browser preferences carry forward. Restoring layout defaults applies the new default spacing and resets only `layoutConfig`. Older settings receive defaults for any missing fields.

Content maximization uses `useMaximize`. Close Preferences to see the result. At narrow widths, the exit button floats in the upper-right corner, leaving the content area free. Click the button or press Esc to restore the layout. A refresh resets maximization.

In Appearance, toggle breadcrumbs, tabs, and the footer together. Choose the page transition under **Window and motion**. Enter transitions take 240 ms and exit transitions take 190 ms, with small changes in position and scale. The outgoing page completes its transition before the incoming page enters. A reduced-motion system preference switches pages immediately. Restoring Appearance defaults preserves the current light or dark mode. The watermark panel offers Spaced, Compact, and Horizontal presets, a local preview, and shortcuts to fill in the app title or account nickname. You can adjust the style with the full-page watermark off. Presets preserve text and visibility. Reset buttons affect only the section they belong to.

Under **Preferences → Appearance → Interface display**, enable pill-shaped page tabs to change the tab shape. It defaults to off. The setting survives refresh and is included when exporting or importing preferences.

### Page tabs and breadcrumbs {#页面标签与面包屑}

- Right-click a tab or open its actions menu to move it to the front or protect it. Moving a tab to the front places it at the left edge. Undoing this moves it to the start of the regular tab group. Protected tabs show a pin next to the title, hide the close button, and are protected from individual and bulk closing.
- Drag a tab, or focus it and use Shift + Left or Shift + Right to reorder it. While dragging, a preview follows the pointer and an insertion line marks the drop location. On touch screens, swipe the tab bar to scroll, or hold a tab and drag to reorder. Tabs promoted to the front and regular tabs reorder within their own groups. Order, promotion, and protection survive refresh within the current session.
- Breadcrumbs use the menu icons, including grouped SVG names and image VNodes on code-defined routes. The fallback is an outlined window icon. Narrow screens show the current path item and its icon.

**Preferences → Appearance → Interface display** has five independent switches, all on by default. Turning off tab protection or promotion pauses the effect and retains tab markers. Re-enabling the switch restores the effect. Turning off breadcrumb icons also hides the placeholder. You can turn the placeholder off on its own.

## Menu icons {#菜单图标}

The expanded sidebar, mobile drawer, and top navigation use 20 px icons by default. The collapsed sidebar uses 22 px icons so entries remain identifiable from the glyph. Outline icons react to menu state and light or dark mode. In **Preferences → Menu**, change the icon size or collapsed icon size to apply it immediately. Compact and Comfortable presets adjust width, indentation, and icon size. You can also change collapse behavior, toggle the sidebar, scroll it to the top, or refresh the menu. Layouts without a desktop sidebar disable the sidebar quick actions and retain the configured sizes.

## Replace layout regions {#替换布局区域}

`RLayout` exposes `header`, `sidebar`, `tabs`, `footer`, and `default` slots. Layout mode and visibility settings still apply. For example, the top navigation mode omits the sidebar region. Supply route caching and request cancellation as needed when replacing the `default` content.

## Where state lives {#状态放在哪里}

| State                                                    | Entry point                               | After refresh                                            |
| -------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Loading, mobile drawer, content maximization, and reload | `useRuntimeGetters` / `useRuntimeActions` | New runtime state.                                       |
| Layout, theme, language, and other preferences           | `useSettingGetters` / `useSettingActions` | Restores cached preferences and fills missing defaults.  |
| Lock screen                                              | Lock Screen Store                         | Retains the legacy boolean format and syncs across tabs. |

The General panel uses `updateLocale` to keep the UI, component library, and date locale in sync. It also exposes refresh, scroll to top, and cache management. You can adjust the cache limit, and the UI explains the policy. Clearing the cache releases inactive page instances and keeps the current one. Later visits recreate instances according to the cache settings. Refreshing the current page remounts it, so unsaved inputs can be lost. Restoring General defaults resets the dynamic title and cache settings while retaining language, recent pages, and favorites.

Place shared state by responsibility in `apps/admin/src/store/modules` and expose it through store hooks. Choose persisted fields with `pick` or `omit`. Check legacy keys and serialized formats before changing them.

[Layout and slots](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/layout/README.md) · [State and persistence](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/README.md)

[Setting Store](../reference/store/setting) · [Runtime Store](../reference/store/runtime) · [Layout hooks](../reference/hooks/layout)

## Recent pages and favorites {#最近访问和收藏}

Press Ctrl or Command + K on desktop to open search. Search by page name and click a star to add a favorite. With an empty query, it shows favorites and recent pages. Use the arrow keys, Enter, or Tab to operate it. Entries are scoped to the session user ID and restored on refresh. Clearing history keeps favorites. You can also clear the current account's recent pages after confirmation in **Preferences → General**. The cache stores only menu paths. Display resolves them against the current menus, permissions, and translations. On mobile, use the top bar's search button. The navigation drawer has a Close button. A width change preserves the desktop sidebar's collapse preference.

When content should fill the workspace, reuse `--layout-content-height`, `RTablePro autoHeight`, and `--r-table-height`, or Naive UI's `NCard contentScrollable` or `NScrollbar`. Give the parent a definite height. Flex and grid children can use `min-block-size: 0` before hosting internal scrolling. The User Management page scrolls the left and right panels independently on desktop. At narrow widths, the page scrolls vertically, the organization tree has a height limit, and the table retains its own horizontal scrolling.
