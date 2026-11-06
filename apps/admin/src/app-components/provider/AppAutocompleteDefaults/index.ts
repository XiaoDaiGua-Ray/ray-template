const controls =
  'input:not([type="hidden"],[type="checkbox"],[type="radio"],[type="button"],[type="submit"],[type="file"],[type="reset"]), textarea, select'

/**
 *
 * @param root 需要补齐自动完成默认值的 DOM 根节点
 *
 * @description
 * 首次扫描根节点，随后仅扫描新增子树；尊重控件显式配置和表单的 autocomplete="on"。
 *
 * @returns 停止 MutationObserver 的清理函数，由调用方在卸载时调用
 */
export function installAutocompleteDefaults(root: HTMLElement) {
  const apply = (element: Element) => {
    if (element.hasAttribute('autocomplete')) return

    const form = (element as HTMLInputElement).form

    if (form?.getAttribute('autocomplete') === 'on') return

    element.setAttribute('autocomplete', 'off')
  }

  const applyToTree = (node: Node) => {
    if (!(node instanceof Element)) return

    if (node.matches(controls)) apply(node)

    node.querySelectorAll(controls).forEach(apply)
  }

  applyToTree(root)
  // 只检查新增子树，同时覆盖 Teleport 到 body 的搜索框、弹窗和下拉面板。
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) mutation.addedNodes.forEach(applyToTree)
  })

  observer.observe(root, { childList: true, subtree: true })

  return () => observer.disconnect()
}
