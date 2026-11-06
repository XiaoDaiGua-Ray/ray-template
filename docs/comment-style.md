# Comment style

These conventions apply to TypeScript, JavaScript, TSX/JSX, scripts, and configuration in this repository. Follow them when adding or editing comments; do not mechanically annotate self-explanatory code. They adapt the user's requested common style to Ray Template's component and module boundaries.

## Component and file descriptions

- Do not add multi-line introductory comments at the top of a file, before `defineComponent`, or before a function-component declaration. Put component responsibilities, inheritance, usage, and examples in the corresponding README. Place non-obvious constraints next to the affected code.
- Do not move a file introduction in front of the first function, constant, or exported object. A comment must describe the actual contract of the adjacent declaration; changing its location does not justify keeping an unrelated file overview.
- Keep one contract description per declaration. Do not stack consecutive JSDoc blocks for the same declaration.

## Function and method contracts

Use multi-line JSDoc when parameters, resource ownership, side effects, asynchronous ownership, or failure semantics need explanation. Parameters and return values must match the actual signature and implementation.

1. Put `/**` and ` */` on separate lines. Begin each interior line with ` *` and align the block with its declaration.
2. Start with a blank comment line containing only ` *`. Use the same blank line between sections; do not leave trailing spaces.
3. Order tags as `@param` → `@description` → `@returns` → `@throws`. Include only necessary sections.
4. List actual parameter names and meanings in signature order. Keep consecutive `@param` entries together; omit the section when there are no parameters.
5. Put `@description` on its own line and start its text on the next line. Do not repeat a summary before the tags.
6. Do not add `@returns` for `void`, `Promise<void>`, or constructors. Describe side effects in the description. `@throws` covers only exceptions or Promise rejections observable by callers.

```ts
/**
 *
 * @param wait 页面恢复前的等待时间，单位为毫秒
 *
 * @description
 * 重新挂载当前页面；恢复计时器由 Store 持有，避免随页面卸载而取消。
 */
const reload = (wait = 800) => {
  // 实现省略。
}
```

Put complete public-hook examples in READMEs and runnable demo pages rather than lengthy tutorials before functions. Do not mechanically remove historical `@example` blocks during unrelated work. When changing a contract, check that its existing examples remain accurate.

## Declaration and implementation notes

- Use single-line JSDoc, such as `/** 说明 */`, for short descriptions of module constants, variables, class fields, and type properties. Do not add tags.
- When a class, interface, or type needs an overall description, use multi-line JSDoc with an initial blank comment line. Put the description after a standalone `@description` tag. Do not invent parameters or return values.
- Use `//` inside functions for branches, local variables, ordering, and rationale. Prefix each line of a multi-line implementation note with `//`; do not use a function-contract block.
- Write code comments in Chinese to explain non-obvious reasons and constraints, retaining technical identifiers. Avoid line-by-line narration, author chatter, obsolete claims, and guarantees unsupported by the implementation.

```ts
/** 内容区恢复前的默认等待时间，单位为毫秒 */
const RELOAD_DELAY = 800

const update = () => {
  // 页面可能已被替换，执行时再读取当前布局实例。
  const layout = contentRef.value
}
```

Preserve required syntax for licenses, attribution, generated markers, and tool directives, such as `// @ts-expect-error`, `/// <reference ... />`, and `/* @__PURE__ */`. Use `{/* 说明 */}` in JSX children and valid comment delimiters for HTML and CSS.

Before delivery, check placement, duplicate blocks, parameter names, tag order, and factual accuracy. These conventions do not replace applicable ESLint, Prettier, type, or browser checks.
