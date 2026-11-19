import { useEventListener } from '@vueuse/core'
import { onScopeDispose, watch } from 'vue'
import type { Ref } from 'vue'

type Placement = 'before' | 'after'

interface DropTarget {
  path: string
  placement: Placement
}

interface DropMarker {
  tab: HTMLElement
  placement: Placement
}

interface Drag {
  wrapper: HTMLElement
  handle: HTMLButtonElement
  item: HTMLElement
  path: string
  pointer: number
  startX: number
  x: number
  y: number
  moved: boolean
  lastScrollFrame?: number
}

const withinRow = ({ y }: Drag, { top, bottom }: DOMRect) =>
  y >= top && y <= bottom

const findDropMarker = (
  { wrapper, item, x }: Drag,
  { left, right }: DOMRect,
  scrollDelta = 0,
): DropMarker | undefined => {
  const isTop = item.hasAttribute('data-menu-tag-top')
  const cursor =
    Math.min(right, Math.max(left, x)) -
    wrapper.getBoundingClientRect().left +
    scrollDelta
  const tabs = wrapper.children as HTMLCollectionOf<HTMLElement>
  let first = 0
  let last = tabs.length

  // 置顶组先于普通组。两组各自按布局中点递增，排序动画不改变中点。
  while (first < last) {
    const middle = Math.floor((first + last) / 2)
    const tab = tabs[middle]
    const before =
      tab.hasAttribute('data-menu-tag-top') === isTop
        ? cursor < tab.offsetLeft + tab.offsetWidth / 2
        : isTop

    if (before) last = middle
    else first = middle + 1
  }

  const next = tabs[first]
  const previous = tabs[first - 1]

  if (next === item || previous === item) return

  if (next && next.hasAttribute('data-menu-tag-top') === isTop)
    return { tab: next, placement: 'before' }

  if (previous && previous.hasAttribute('data-menu-tag-top') === isTop)
    return { tab: previous, placement: 'after' }
}

export function useTagReorder(
  enabled: Ref<boolean>,
  list: Ref<HTMLElement | null>,
  scroller: Ref<HTMLElement | null | undefined>,
  move: (path: string, target: DropTarget, handle: HTMLButtonElement) => void,
  announceCancellation: () => void,
) {
  let drag: Drag | undefined
  let marker: DropMarker | undefined
  let frame: number | undefined

  const mark = (target?: DropMarker) => {
    if (target?.tab === marker?.tab && target?.placement === marker?.placement)
      return

    // 临时落点由 DOM 属性绘制，避免触发整排标签的渲染和位移动画测量。
    marker?.tab.removeAttribute('data-menu-tag-drop')
    target?.tab.setAttribute('data-menu-tag-drop', target.placement)
    marker = target
  }

  const clear = () => {
    const current = drag

    drag = void 0
    mark()

    if (frame !== void 0) cancelAnimationFrame(frame)

    frame = void 0
    current?.wrapper.classList.remove('menu-tag-wrapper--dragging')
    current?.item.removeAttribute('data-menu-tag-dragged')

    if (current?.handle.hasPointerCapture(current.pointer))
      current.handle.releasePointerCapture(current.pointer)
  }

  const updateFrame = (time: number) => {
    frame = void 0
    const current = drag
    const element = scroller.value

    if (
      !current ||
      !element ||
      current.item.parentElement !== current.wrapper
    ) {
      clear()

      return
    }

    const viewport = element.getBoundingClientRect()

    if (!withinRow(current, viewport)) {
      current.lastScrollFrame = void 0
      mark()

      return
    }

    const edge = Math.min(36, viewport.width / 3)
    const pressure =
      Math.max(0, current.x - (viewport.right - edge)) -
      Math.max(0, viewport.left + edge - current.x)
    let offset = 0
    let nextOffset = 0

    if (edge > 0 && pressure !== 0) {
      const elapsed = Math.min(
        32,
        time - (current.lastScrollFrame ?? time - 16),
      )
      const distance = Math.max(
        1,
        Math.min(1, Math.abs(pressure / edge)) * elapsed * 0.65,
      )

      offset = element.scrollLeft
      const limit = element.scrollWidth - element.clientWidth

      nextOffset = Math.max(
        0,
        Math.min(limit, offset + Math.sign(pressure) * distance),
      )
    }

    const target = findDropMarker(current, viewport, nextOffset - offset)

    if (!current.item.hasAttribute('data-menu-tag-dragged')) {
      current.wrapper.classList.add('menu-tag-wrapper--dragging')
      current.item.setAttribute('data-menu-tag-dragged', '')
    }

    mark(target)

    if (nextOffset !== offset) {
      element.scrollLeft = nextOffset
      current.lastScrollFrame = time
      frame = requestAnimationFrame(updateFrame)
    } else {
      current.lastScrollFrame = void 0
    }
  }

  const cancel = () => {
    if (drag?.moved) announceCancellation()

    clear()
  }

  const start = (event: PointerEvent) => {
    if (!enabled.value || drag || !event.isPrimary || event.button !== 0) return

    const handle = event.currentTarget as HTMLButtonElement
    const item = handle.closest<HTMLElement>('[data-menu-tag-path]')
    const path = item?.dataset.menuTagPath
    const wrapper = list.value

    if (!item || !path || !wrapper || item.parentElement !== wrapper) return

    handle.setPointerCapture(event.pointerId)
    drag = {
      wrapper,
      handle,
      item,
      path,
      pointer: event.pointerId,
      startX: event.clientX,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    }
  }

  const updatePointer = (event: PointerEvent) => {
    if (drag?.pointer !== event.pointerId) return

    drag.x = event.clientX
    drag.y = event.clientY
    drag.moved ||= Math.abs(drag.x - drag.startX) >= 5

    return drag
  }

  const track = (event: PointerEvent) => {
    if (updatePointer(event)?.moved && frame === void 0)
      frame = requestAnimationFrame(updateFrame)
  }

  const drop = (event: PointerEvent) => {
    const current = updatePointer(event)

    if (!current) return

    const viewport = current.moved && scroller.value?.getBoundingClientRect()
    const target =
      viewport &&
      current.item.parentElement === current.wrapper &&
      withinRow(current, viewport)
        ? findDropMarker(current, viewport)
        : void 0
    const targetPath = target?.tab.dataset.menuTagPath

    clear()

    if (target && targetPath)
      move(
        current.path,
        { path: targetPath, placement: target.placement },
        current.handle,
      )
  }

  const cancelPointer = (event: PointerEvent) => {
    if (drag?.pointer === event.pointerId) cancel()
  }

  const moveWithKey = (event: KeyboardEvent) => {
    if (
      !enabled.value ||
      !event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.isComposing ||
      (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    )
      return

    event.preventDefault()
    const handle = event.currentTarget as HTMLButtonElement
    const item = handle.closest<HTMLElement>('[data-menu-tag-path]')
    const placement = event.key === 'ArrowLeft' ? 'before' : 'after'
    const neighbor =
      placement === 'before'
        ? item?.previousElementSibling
        : item?.nextElementSibling
    const path = item?.dataset.menuTagPath
    const target =
      neighbor instanceof HTMLElement ? neighbor.dataset.menuTagPath : void 0

    if (path && target) move(path, { path: target, placement }, handle)
  }

  useEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape' || !drag) return

      event.preventDefault()
      cancel()
    },
    { capture: true },
  )
  watch(enabled, (allowed) => {
    if (!allowed) cancel()
  })
  onScopeDispose(clear)

  return { start, track, drop, cancelPointer, moveWithKey }
}
