interface NavigationItem<T> {
  fullPath?: string
  show?: boolean
  children?: T[]
}

export function findMenuRoot<T extends NavigationItem<T>>(
  options: T[],
  key: string,
): T | undefined {
  const contains = (option: T): boolean =>
    option.fullPath === key || !!option.children?.some(contains)

  return options.find((option) => option.show !== false && contains(option))
}

export function firstMenuLeaf<T extends NavigationItem<T>>(
  option: T,
): T | undefined {
  if (option.show === false) return

  if (!option.children?.length) return option

  for (const child of option.children) {
    const leaf = firstMenuLeaf(child)

    if (leaf) return leaf
  }
}
