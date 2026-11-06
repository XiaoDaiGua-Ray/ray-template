## Purpose

This directory contains components closely coupled to the template:

- app: Components bound to template data.
- provider: Components that provide template services through injection.

## Pages and providers

- `AppPageHeader` standardizes the eyebrow, main title, description, and right-side actions. Pages retain their own body layouts; do not wrap business content here.
- `AppShareLink` defaults to a compact entry point. The dashboard uses `variant="cards"` for named link cards while preserving the login page's space constraints.
- `AppAvatar` reads the avatar and name from the signing store and retains Naive UI size, shape and object-fit props. `avatarSize` remains an optional legacy size override. Its button remains keyboard focusable.
- `AppGlobalSpin` binds visibility to runtime state and merges caller theme overrides over its default opacity. It forwards the remaining Spin props and slots.
- `AppLockScreen` and its lock/unlock views share bilingual rules and copy. Clock updates align to minute boundaries, pause while the document is hidden, and release their timer on unmount.
- `AppNaiveGlobalProvider` supplies Naive UI context and `window.$message`, `$notification`, `$dialog`, and `$loadingBar`. Discrete notification instances initialize and dispose with the provider and track theme/locale changes. Use them only while the provider is mounted.
- `AppWatermarkProvider` provides the global watermark entry point; `useWatermark` controls visibility and content. Change the provider's mount location to limit its coverage.
- `AppRequestCancelerProvider` cancels old requests before route updates. Default layout content mounts it; custom content slots must retain the required cancellation behavior.

Keep component introductions in documents like this one rather than large blocks before declarations. Follow the [shared comment style](../../../../docs/comment-style.md) for comment placement and formatting.
