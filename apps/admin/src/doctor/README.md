# Application doctor

This small application-owned module reports development configuration mistakes. It does not initialize the application, enforce routing policy, or own a workspace package.

`main.ts` calls `runAppDoctor()` only under `__DEV__`, after a successful mount and removal of the startup splash. Both standalone and Wujie mounts use the same call. Configuration findings and unexpected diagnostic failures are reported as doctor warnings; they do not reject bootstrap or trigger the startup-failure UI. Each mount may inspect the current configuration; the doctor holds no timers, listeners, or cross-mount state.

## Retained check

Locale configuration still needs a consistency check: TypeScript constrains permitted locale strings, but an array can omit or duplicate an option, and separately maintained language/Day.js maps can disagree. `getLocaleConfigIssues` inspects a supplied snapshot without mutation or logging. It checks:

- Unique language options and membership of the application default/fallback locales.
- Matching language-option and Day.js mapping keys in both directions.
- Membership of the default Day.js locale in the mapping values.

The check does not prove that translation resources or Day.js locale modules have been loaded. Resource imports and operational startup failures remain owned by their existing setup functions. It does not inspect user data, persistent preferences, network connectivity, or routes.

The historical `__ray-template` / `setupRayTemplateCore` entry was internal to `main.ts`, with no package export or other caller. It was removed rather than kept as a misleading initialization alias. Its root-path requirement had already been removed; no business home route is required.

## Verification

Focused regression tests live in `__test__/app/doctor.spec.ts`; the existing `layout` and `ui` Harness scopes include them. This module is separate from the repository's Node/pnpm environment doctor at `scripts/doctor.mjs` (`pnpm env:check`).
