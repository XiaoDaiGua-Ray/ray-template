import type { AppMenuOption } from '@/types'

export function findMenuRoot(
  options: AppMenuOption[],
  key: string,
): AppMenuOption | undefined {
  const contains = (option: AppMenuOption): boolean =>
    option.fullPath === key || !!option.children?.some(contains)

  return options.find((option) => option.show !== false && contains(option))
}

export function firstMenuLeaf(
  option: AppMenuOption,
): AppMenuOption | undefined {
  if (option.show === false) return

  if (!option.children?.length) return option

  for (const child of option.children) {
    const leaf = firstMenuLeaf(child)

    if (leaf) return leaf
  }
}
