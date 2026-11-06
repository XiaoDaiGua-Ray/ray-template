# SVG icons and generation

Use this topic when adding or moving icons, or investigating icon types, symbol IDs, spritemap URLs, or hot updates.

| Question                                           | Read first                                                                                              | Follow through                                                                                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Assets, groups, and naming                         | [Maintenance guide](../../packages/icons/src/A_README.md), [SVG assets](../../packages/icons/src)       | [Public package entry points](../../packages/icons/package.json), [application adapter](../../apps/admin/src/icons) |
| Manifest, types, generation, and HMR               | [Generator](../../packages/icons/scripts/icons.mjs), [root script](../../scripts/icons.mjs)             | [Vite adapter](../../vite-helper/icons.ts), [plugin configuration](../../vite.plugin.config.ts)                     |
| Rendering, application injection, and reader usage | [RIcon](../../packages/ui/src/RIcon/index.ts), [application icon service](../../apps/admin/src/App.tsx) | [Icon demo](../../apps/admin/src/views/demo/svg-icons), [reader reference](../../apps/docs/reference/icons.md)      |

The SVG files and generator are authoritative; `pnpm icons:generate` updates [manifest.ts](../../packages/icons/src/manifest.ts). Moving a group can change full icon names. Check references in menus, route configuration, and caches, as well as production asset URLs.

Targeted verification: `pnpm harness verify icons` includes `icons:check` and the [generation](../../__test__/icons/generation.spec.ts) and [HMR](../../__test__/icons/hmr.spec.ts) regressions. Do not repeat the manifest check separately. For asset path changes, check production previews using the [browser verification rules](../README.md#browser-verification).
