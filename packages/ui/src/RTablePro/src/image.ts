import { useDomToImage } from '@ray-template/composables/useDomToImage'
import { inlineTableSvgUses } from './image-svg'
import type { TableProImageOptions } from './types'

/**
 *
 * @param target 当前表格根节点
 *
 * @description
 * 创建不参与页面交互的临时快照，固定可视尺寸并将滚动、sticky 位置转换为静态位移。
 * 先集中读取原节点，再写入快照与校准固定列；不修改原表格的滚动或样式。
 *
 * @returns 快照节点及幂等清理方法
 * @throws 节点未连接或没有可见尺寸时抛错
 */
export function createTableImageSnapshot(target: HTMLElement) {
  const view = target.ownerDocument.defaultView
  const width = target.offsetWidth
  const height = target.offsetHeight

  if (!view || !target.isConnected || width <= 0 || height <= 0)
    throw new Error('[TablePro] The table has no visible capture area.')

  const embedded = 'iframe, object, embed, audio, video'

  if (target.matches(embedded) || target.querySelector(embedded))
    throw new Error(
      '[TablePro] Embedded media cannot be copied into a table snapshot.',
    )

  const clone = target.cloneNode(true) as HTMLElement
  const originals = [target, ...target.querySelectorAll('*')]
  const copies = [clone, ...clone.querySelectorAll('*')]
  const rootRect = target.getBoundingClientRect()
  const rootStyle = view.getComputedStyle(target)
  const formOwner = `r-table-image-${crypto.randomUUID()}`
  const scrolls: { clone: HTMLElement; left: number; top: number }[] = []
  const sticky: {
    clone: HTMLElement
    left: number
    top: number
    transform: string
  }[] = []
  const transforms = new Map<Element, string>()

  for (const [index, original] of originals.entries()) {
    const copy = copies[index]

    if (copy.localName === 'script') {
      copy.remove()
      continue
    }

    for (const name of copy.getAttributeNames()) {
      if (/^on/i.test(name)) copy.removeAttribute(name)
    }

    if (original instanceof HTMLElement && copy instanceof HTMLElement) {
      const style = view.getComputedStyle(original)

      transforms.set(copy, style.transform === 'none' ? '' : style.transform)

      // 临时控件不参与真实表单或单选分组，也不触发自动聚焦。
      copy.removeAttribute('autofocus')

      if ('form' in copy) {
        copy.setAttribute('form', formOwner)
        copy.removeAttribute('name')
      }

      if (original.scrollLeft || original.scrollTop)
        scrolls.push({
          clone: copy,
          left: original.scrollLeft,
          top: original.scrollTop,
        })

      if (style.position === 'sticky') {
        const rect = original.getBoundingClientRect()

        sticky.push({
          clone: copy,
          left: rect.left - rootRect.left,
          top: rect.top - rootRect.top,
          transform: style.transform,
        })
      }
    }

    if (
      original instanceof HTMLInputElement &&
      copy instanceof HTMLInputElement
    ) {
      if (original.type !== 'file') {
        copy.value =
          original.type === 'password'
            ? '•'.repeat(original.value.length)
            : original.value
        copy.defaultValue = copy.value
      }

      copy.checked = original.checked
      copy.defaultChecked = original.checked
      copy.indeterminate = original.indeterminate
    } else if (
      original instanceof HTMLTextAreaElement &&
      copy instanceof HTMLTextAreaElement
    ) {
      copy.value = original.value
      copy.defaultValue = original.value
    } else if (
      original instanceof HTMLOptionElement &&
      copy instanceof HTMLOptionElement
    ) {
      copy.selected = original.selected
      copy.defaultSelected = original.selected
    } else if (
      original instanceof HTMLCanvasElement &&
      copy instanceof HTMLCanvasElement
    ) {
      const context = copy.getContext('2d')

      if (!context) throw new Error('[TablePro] Canvas capture is unavailable.')

      context.drawImage(original, 0, 0)
    }
  }

  // 快照仍放在原父级下，保留作用域样式与主题变量，但固定定位不参与布局或交互。
  for (const name of Array.from(rootStyle)) {
    if (name.startsWith('--'))
      clone.style.setProperty(name, rootStyle.getPropertyValue(name))
  }

  Object.assign(clone.style, {
    position: 'fixed',
    left: '0',
    top: '-100000px',
    margin: '0',
    width: `${width}px`,
    height: `${height}px`,
    boxSizing: 'border-box',
    pointerEvents: 'none',
    transform: 'none',
  })
  clone.inert = true
  clone.setAttribute('aria-hidden', 'true')
  clone.setAttribute('data-r-table-image-snapshot', '')

  for (const { clone: scroller, left, top } of scrolls) {
    scroller.style.overflow = 'hidden'

    for (const child of Array.from(scroller.children)) {
      if (child instanceof HTMLElement)
        child.style.transform = `translate(${-left}px, ${-top}px) ${transforms.get(child) ?? ''}`
    }
  }

  for (const item of sticky) {
    Object.assign(item.clone.style, { position: 'relative', inset: 'auto' })
  }

  const dispose = () => clone.remove()

  try {
    target.parentElement!.append(clone)
    const cloneRect = clone.getBoundingClientRect()
    const corrections = sticky.map((item) => {
      const rect = item.clone.getBoundingClientRect()

      return {
        element: item.clone,
        x: item.left - (rect.left - cloneRect.left),
        y: item.top - (rect.top - cloneRect.top),
        transform:
          item.clone.style.transform ||
          (item.transform === 'none' ? '' : item.transform),
      }
    })

    const byElement = new Map(corrections.map((item) => [item.element, item]))

    for (const { element, x, y, transform } of corrections) {
      let parent = element.parentElement

      while (parent && !byElement.has(parent)) parent = parent.parentElement

      const inherited = parent ? byElement.get(parent) : void 0

      // 嵌套 sticky 已随父节点移动，只补齐尚未校正的位移。
      element.style.transform = `translate(${x - (inherited?.x ?? 0)}px, ${y - (inherited?.y ?? 0)}px) ${transform}`
    }

    return { element: clone, dispose }
  } catch (error) {
    dispose()
    throw error
  }
}

/**
 *
 * @param target 当前表格根节点，只截取该节点的可视盒
 * @param options PNG 渲染配置，调用时按需加载现有渲染库
 * @param signal 组件拥有的取消信号
 *
 * @description
 * 在第一次异步等待之前请求剪贴板写入，向 ClipboardItem 提供延迟 PNG，保留浏览器用户激活。
 * 取消时拒绝尚未就绪的图片并清理快照；浏览器已经接受的数据写入无法撤销。
 *
 * @throws API 不可用、权限被拒绝、生成失败或尚未就绪时取消会使 Promise 拒绝
 */
export async function copyTableImage(
  target: HTMLElement,
  options: TableProImageOptions = {},
  signal?: AbortSignal,
) {
  if (
    typeof ClipboardItem === 'undefined' ||
    typeof navigator === 'undefined' ||
    typeof navigator.clipboard?.write !== 'function' ||
    globalThis.isSecureContext === false
  )
    throw new DOMException(
      'PNG clipboard writing is unavailable.',
      'NotSupportedError',
    )

  const controller = new AbortController()
  const representation = Promise.withResolvers<Blob>()
  const signals = [signal, options.fetchRequestInit?.signal].filter(
    (value): value is AbortSignal => !!value,
  )
  let snapshot: ReturnType<typeof createTableImageSnapshot> | undefined
  let captureTimer: ReturnType<typeof setTimeout> | undefined
  let active = true
  const cancel = () => {
    clearTimeout(captureTimer)
    controller.abort()
    representation.reject(
      new DOMException('Table image copy was cancelled.', 'AbortError'),
    )
    snapshot?.dispose()
  }

  if (signals.some((current) => current.aborted))
    throw new DOMException('Table image copy was cancelled.', 'AbortError')

  for (const current of signals)
    current.addEventListener('abort', cancel, { once: true })

  // 浏览器可能在消费表示数据之前拒绝写入，仍需接住对应图片 Promise 的拒绝。
  void representation.promise.catch(() => {})

  try {
    const writing = navigator.clipboard.write([
      new ClipboardItem({ 'image/png': representation.promise }),
    ])
    const result = writing.catch((error: unknown) => {
      active = false
      clearTimeout(captureTimer)
      controller.abort()
      representation.reject(error)
      snapshot?.dispose()
      throw error
    })

    // 写入请求已在点击调用栈内发出，再让出当前任务供忙碌状态绘制，然后开始克隆与按需加载。
    const capture = async () => {
      if (!active || controller.signal.aborted) return

      try {
        snapshot = createTableImageSnapshot(target)
        await inlineTableSvgUses(snapshot.element, controller.signal)

        if (!active || controller.signal.aborted) return

        const { create } = useDomToImage(snapshot.element, {
          pixelRatio: Math.min(globalThis.devicePixelRatio || 1, 2),
          ...options,
          fetchRequestInit: {
            ...options.fetchRequestInit,
            signal: controller.signal,
          },
          style: {
            position: 'static',
            inset: 'auto',
            margin: '0',
            transform: 'none',
            ...options.style,
          },
          imageType: 'blob',
          type: 'image/png',
        })
        const blob = await create('blob')

        if (!active || controller.signal.aborted) return

        if (!blob || blob.type !== 'image/png' || !blob.size)
          throw new Error(
            '[TablePro] The PNG renderer returned an empty image.',
          )

        representation.resolve(blob)
      } catch (error) {
        controller.abort()
        representation.reject(error)
      } finally {
        snapshot?.dispose()
      }
    }

    captureTimer = setTimeout(() => {
      void capture()
    }, 0)

    await result
  } catch (error) {
    representation.reject(error)

    if (signals.some((current) => current.aborted))
      throw new DOMException('Table image copy was cancelled.', 'AbortError')

    throw error
  } finally {
    active = false
    clearTimeout(captureTimer)

    for (const current of signals) current.removeEventListener('abort', cancel)

    snapshot?.dispose()
  }
}
