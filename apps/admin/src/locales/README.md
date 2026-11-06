## Internationalization entry point

### Purpose

- This entry point owns internationalization for the project.
- It includes the wrapped useI18n API, locale-resource entry points, and helpers.
- Extend and use locale configuration according to the established format.

### lang resource entry points

The project includes English and Chinese resources. Add languages using the same format. Each resource file identifies a locale; JSON resources are imported automatically.

#### Format

Locale resources use JSON to work with `@intlify/unplugin-vue-i18n/vite`.

#### Adding a locale

- Add the resource file, named after the locale.
- Configure its entry point using `combineI18nMessages` for automatic merging.
- Keep locale names globally unique.

### Helpers

- `getAppLocalMessages` returns all application locales. It depends on LOCAL_OPTIONS keys, which must correspond one-to-one with `src/locales/lang/xxx.ts` entries.
- `naiveLocales` returns matching `naive-ui` locale resources.
- `getAppDefaultLanguage` returns the application's current default locale.

### useI18n

The application wraps `i18n`. Use that wrapper rather than the library's unwrapped `useI18n`.

- It supports `t` and `value` outside setup.
- Its behavior otherwise follows the official API.
