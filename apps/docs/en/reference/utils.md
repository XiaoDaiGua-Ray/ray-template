# Utilities {#工具函数}

`@/utils` aggregates public template utilities. Application initialization and lower-level code can use focused entries such as `@/utils/core`, `@/utils/cache`, and `@/utils/files` to avoid importing unrelated dependencies. Legacy `basic.ts` and `c/` remain forwarding entries.

| Topic                                            | APIs                                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [Core, dates, and numbers](./utils/core)         | Type checks, PromiseLike, random identifiers, error handling, object updates, date ranges, and fixed-point arithmetic |
| [Storage and legacy encryption](./utils/storage) | Local and Session Storage, prefixes, and legacy AES JSON                                                              |
| [Vue and browser utilities](./utils/browser)     | Ref and DOM unwrapping, styles, queries, downloads, capture, printing, and menu positioning                           |

Run downloads and printing in the browser. Create reactive DOM utilities in a Vue scope. Storage and file API generics provide types. Validate data when it crosses a trust boundary.

[Public exports](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/index.ts) · [Implementation and regression index](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/README.md)
