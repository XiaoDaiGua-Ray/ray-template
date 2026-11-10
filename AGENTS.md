# Ray Template

A Vue 3 + TSX admin template with an admin application, a documentation site, and shared packages.

- To locate an implementation, choose a topic from the [task index](llms.txt) or `pnpm harness context <scope>`. Consult the [architecture map](docs/architecture.md) for changes that cross module boundaries.
- Check `git status` first and preserve existing changes. Trace callers and existing data contracts before changing routing, persistence, requests, or shared components.
- Prefer feature entry points for runtime imports. Follow the [runtime import boundaries](harness/README.md#runtime-import-boundaries) when adding exports or changing what loads at startup or on demand.
- For complex tasks, the lead agent may choose to use subagents under the [delegation guidelines](harness/README.md#using-subagents-when-useful), when the host supports them and current permissions allow it. Delegation needs no separate approval. The lead agent owns integration and final verification.
- Write agent guidance and internal engineering documentation in English. Preserve the intended languages of product copy and reader-facing documentation.
- Follow the [comment style](docs/comment-style.md) when adding or editing comments. Maintain both Chinese and English product copy. For visible behavior changes, use [browser verification](harness/README.md#browser-verification) only for affected pages, actions, and dimensions.
- For custom CSS, follow the [style contract](docs/ui-design.md#custom-css-contract): consume semantic theme tokens and the shell's runtime layout variables so style, color mode, primary color, and layout preferences keep working. Keep provider ownership and scoped overrides explicit.
- Select relevant tests or `pnpm harness verify <scope>` using the [verification scope](harness/README.md#choosing-the-verification-scope). Small changes do not default to full checks or a UI/UX sweep. Use full checks for integration risk, releases, or an explicit request. Pages builds and publishes on main independently of full verification. Within one task, rerun only checks affected by subsequent changes. Report what was and was not verified.
- Establish engineering facts from current source, manifests, and the lockfile. Keep sensitive data out of source, prompts, and evidence. Commits, pushes, and deployments require user authorization.
