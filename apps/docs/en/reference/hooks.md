# Hooks

Import public template hooks from `@/hooks`. The hooks tied to components, `useForm`, `useModal`, `useChart`, and `useFlow`, come from `@/components` and are documented with each component. Import `useRequest` from `@/axios`.

| Task                                                         | Reference                                     |
| ------------------------------------------------------------ | --------------------------------------------- |
| Build menus, navigate, manage tabs, or add menu badges       | [Navigation and menus](./hooks/navigation)    |
| Maximize, reload, or scroll the content area                 | [Layout and scrolling](./hooks/layout)        |
| Set themes, language, or watermarks                          | [Themes and localization](./hooks/appearance) |
| Implement pagination or context menus                        | [Component interactions](./hooks/interaction) |
| Observe viewport size, fill the viewport, or work with dates | [Viewport and dates](./hooks/browser)         |
| Capture or print DOM content                                 | [Capture and printing](./hooks/output)        |

Create hooks that subscribe, listen, or register cleanup during `setup()` or within an active Vue effect scope. Capture, print, and fullscreen actions should run after DOM mount or on user interaction. `BasicTarget` accepts elements, refs, or getters. [Vue and DOM targets](./utils/browser#vue-目标解析)

`@/hooks/web/useI18n`, `@/hooks/web/useVueRouter`, and `@/hooks/web/usePagination` remain as compatibility imports. Use `@/hooks` in new application code. [Hook implementation and test index](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/README.md)
