import type { DragEvent } from '@interactjs/actions/drag/plugin'
import type { DropEvent } from '@interactjs/actions/drop/DropEvent'
import type { PointerEvent as InteractPointerEvent } from '@interactjs/pointer-events/PointerEvent'
import { useEventListener } from '@vueuse/core'
import { watch } from 'vue'
import type { Ref } from 'vue'

type Interact = typeof import('interactjs').default
type Placement = 'before' | 'after'

const TAB_SELECTOR = '[data-menu-tag-path]'
const CLOSE_SELECTOR = '.n-tag__close'
const DRAG_SLOP = 5
const TOUCH_HOLD_DELAY = 280

interface DropTarget {
  path: string
  placement: Placement
}

interface DropMarker {
  tab: HTMLElement
  placement: Placement
}

interface Press {
  down: PointerEvent
  pointer: InteractPointerEvent
  row: HTMLElement
  tab: HTMLElement
  button: HTMLButtonElement
  path: string
}

let activeTagDrags = 0
let previousDynamicDrop = false

const retainDynamicDrop = (interact: Interact) => {
  // dynamicDrop 由同一个 interact.js 实例共享，最后一次标签拖动结束时恢复。
  if (activeTagDrags === 0) {
    previousDynamicDrop = interact.dynamicDrop() === true
    interact.dynamicDrop(true)
  }

  activeTagDrags++

  return () => {
    activeTagDrags--

    if (activeTagDrags === 0) interact.dynamicDrop(previousDynamicDrop)
  }
}

export function useTagReorder(
  enabled: Ref<boolean>,
  list: Ref<HTMLElement | null>,
  scroller: Ref<HTMLElement | null | undefined>,
  move: (path: string, target: DropTarget, button: HTMLButtonElement) => void,
  announceCancellation: () => void,
) {
  let press: Press | undefined
  let drag: { restoreDropMode: () => void; release?: PointerEvent } | undefined
  let marker: DropMarker | undefined
  let frame: number | undefined
  let suppressPointerClick = false

  const mark = (target?: DropMarker) => {
    if (target?.tab === marker?.tab && target?.placement === marker?.placement)
      return

    marker?.tab.removeAttribute('data-menu-tag-drop')
    target?.tab.setAttribute('data-menu-tag-drop', target.placement)
    marker = target
  }

  const finish = () => {
    press?.row.classList.remove('menu-tag-wrapper--dragging')
    press?.tab.removeAttribute('data-menu-tag-dragged')
    mark()

    if (frame !== void 0) cancelAnimationFrame(frame)

    frame = void 0
    drag?.restoreDropMode()
    drag = void 0
    press = void 0
  }

  const cancel = () => {
    if (drag) {
      press?.pointer.interaction.stop()
      announceCancellation()
    }

    finish()
  }

  const refreshDrop = () => {
    if (!drag || frame !== void 0) return

    frame = requestAnimationFrame(() => {
      frame = void 0
      // 跳过同坐标的优化，让滚动后的落区重新参与检测。
      press?.pointer.interaction.move({ skipModifiers: 1 })
    })
  }

  const start = ({ pointer, tab }: Press) => {
    pointer.interaction.start({ name: 'drag' }, pointer.interactable, tab)
  }

  const startWithPointer = (event: PointerEvent) => {
    const current = press

    if (
      !current ||
      drag ||
      event.pointerId !== current.down.pointerId ||
      event.pointerType === 'touch'
    )
      return

    const x = Math.abs(event.clientX - current.down.clientX)
    const y = Math.abs(event.clientY - current.down.clientY)

    if (Math.max(x, y) >= DRAG_SLOP) start(current)
  }

  const trackTouch = (event: TouchEvent) => {
    const current = press

    if (current?.down.pointerType !== 'touch') return

    if (!event.cancelable || event.touches.length !== 1) {
      cancel()

      return
    }

    if (!drag) {
      const touch = event.touches[0]
      const x = Math.abs(touch.clientX - current.down.clientX)
      const y = Math.abs(touch.clientY - current.down.clientY)

      if (Math.max(x, y) < DRAG_SLOP) return

      if (
        event.timeStamp - current.down.timeStamp < TOUCH_HOLD_DELAY ||
        y > x
      ) {
        finish()

        return
      }

      start(current)
    }

    // 普通滑动保持原生滚动，长按启动拖动后才接管触摸。
    if (drag) event.preventDefault()
  }

  const bind = (
    interact: Interact,
    row: HTMLElement,
    viewport: HTMLElement,
  ) => {
    const zoneRect = (element: Element) => {
      const visible = interact.getElementRect(viewport)
      const origin = interact.getElementRect(row)?.left

      if (!visible || origin === void 0)
        return { left: 0, right: 0, top: 0, bottom: 0 }

      const previous = element.previousElementSibling
      const next = element.nextElementSibling

      // 落区延伸到两侧相邻标签的边缘，使标签间的插入线也可以落下。
      return {
        left:
          previous instanceof HTMLElement
            ? Math.max(
                visible.left,
                origin + previous.offsetLeft + previous.offsetWidth,
              )
            : visible.left,
        right:
          next instanceof HTMLElement
            ? Math.min(visible.right, origin + next.offsetLeft)
            : visible.right,
        top: visible.top,
        bottom: visible.bottom,
      }
    }

    const placementAt = (
      event: DropEvent,
      x: number,
    ): DropMarker | undefined => {
      const { target: tab, relatedTarget: source } = event

      if (!(tab instanceof HTMLElement)) return

      const middle =
        row.getBoundingClientRect().left + tab.offsetLeft + tab.offsetWidth / 2
      const placement = x < middle ? 'before' : 'after'
      const neighbor =
        placement === 'before'
          ? tab.previousElementSibling
          : tab.nextElementSibling

      if (neighbor !== source) return { tab, placement }
    }

    const interactable = interact(TAB_SELECTOR, { context: row })
      .styleCursor(false)
      .preventDefault('never')
      .rectChecker(zoneRect)
      .draggable({
        manualStart: true,
        ignoreFrom: CLOSE_SELECTOR,
        autoScroll: { container: viewport, margin: 36, speed: 450 },
        listeners: {
          start: () => {
            if (!press) return

            drag = { restoreDropMode: retainDynamicDrop(interact) }
            suppressPointerClick = true
            row.classList.add('menu-tag-wrapper--dragging')
            press.tab.setAttribute('data-menu-tag-dragged', '')
            refreshDrop()
          },
          end: finish,
        },
      })
      .dropzone({
        accept: ({ draggableElement }) =>
          draggableElement.parentElement === row,
        overlap: 'pointer',
        checker: (
          event: DragEvent,
          _native,
          over,
          _zone,
          target,
          _from,
          source,
        ) => {
          if (
            !drag ||
            target.hasAttribute('data-menu-tag-top') !==
              source.hasAttribute('data-menu-tag-top')
          )
            return false

          if (event.type !== 'dragend') return over

          const released = drag.release

          if (!released) return false

          if (
            released.clientX === event.clientX &&
            released.clientY === event.clientY
          )
            return over

          // 1.10.28 的 dragend 坐标取自上一条 dragmove。松手坐标可能已变化。
          const rect = zoneRect(target)

          return (
            released.pageX > rect.left &&
            released.pageX < rect.right &&
            released.pageY > rect.top &&
            released.pageY < rect.bottom
          )
        },
        ondropmove: (event: DropEvent) =>
          mark(placementAt(event, event.dragEvent.clientX)),
        ondragleave: () => mark(),
        ondrop: (event: DropEvent) => {
          const released = drag?.release

          if (!press || !released) return

          const marker = placementAt(event, released.clientX)
          const path = marker?.tab.dataset.menuTagPath

          if (marker && path)
            move(
              press.path,
              { path, placement: marker.placement },
              press.button,
            )
        },
      })
      .pointerEvents({ ignoreFrom: CLOSE_SELECTOR })
      .on('down', (pointer: InteractPointerEvent) => {
        const event = pointer.originalEvent
        const tab = pointer.currentTarget

        if (
          press ||
          !(event instanceof PointerEvent) ||
          !event.isPrimary ||
          event.button !== 0 ||
          !(tab instanceof HTMLElement) ||
          tab.parentElement !== row
        )
          return

        const path = tab.dataset.menuTagPath
        const button = tab.querySelector<HTMLButtonElement>('.menu-tag__tab')

        if (path && button)
          press = { down: event, pointer, row, tab, button, path }
      })

    return () => {
      cancel()
      interactable.unset()
    }
  }

  watch(
    [enabled, list, scroller],
    ([allowed, row, viewport], _, onCleanup) => {
      if (!allowed || !row || !viewport) return

      let disposed = false
      let unbind: (() => void) | undefined

      onCleanup(() => {
        disposed = true
        unbind?.()
      })
      void import('interactjs').then(({ default: interact }) => {
        if (!disposed) unbind = bind(interact, row, viewport)
      })
    },
    { immediate: true, flush: 'post' },
  )

  useEventListener('pointermove', startWithPointer, {
    capture: true,
    passive: true,
  })
  useEventListener(
    'pointerup',
    (event) => {
      if (press?.down.pointerId !== event.pointerId) return

      if (drag) drag.release = event
      else finish()
    },
    { capture: true },
  )
  useEventListener(
    'pointercancel',
    (event) => {
      if (press?.down.pointerId === event.pointerId) cancel()
    },
    { capture: true },
  )
  useEventListener(list, 'touchmove', trackTouch, { passive: false })
  useEventListener(scroller, 'scroll', refreshDrop, { passive: true })
  useEventListener(list, 'pointerdown', (event) => {
    if (!drag && event.isPrimary && event.button === 0)
      suppressPointerClick = false
  })
  useEventListener(
    list,
    'click',
    (event) => {
      if (!suppressPointerClick || event.detail === 0) return

      suppressPointerClick = false
      event.preventDefault()
      event.stopPropagation()
    },
    { capture: true },
  )
  useEventListener(
    list,
    'contextmenu',
    (event) => {
      if (press?.down.pointerType !== 'touch') return

      event.preventDefault()
      event.stopPropagation()
    },
    { capture: true },
  )
  useEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape' || !press) return

      event.preventDefault()
      cancel()
    },
    { capture: true },
  )

  return (event: KeyboardEvent) => {
    if (
      !enabled.value ||
      drag ||
      !event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.isComposing ||
      (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    )
      return

    const button = event.target

    if (
      !(button instanceof HTMLButtonElement) ||
      !button.classList.contains('menu-tag__tab')
    )
      return

    event.preventDefault()
    const item = button.closest<HTMLElement>(TAB_SELECTOR)
    const placement = event.key === 'ArrowLeft' ? 'before' : 'after'
    const neighbor =
      placement === 'before'
        ? item?.previousElementSibling
        : item?.nextElementSibling
    const path = item?.dataset.menuTagPath
    const target =
      neighbor instanceof HTMLElement ? neighbor.dataset.menuTagPath : void 0

    if (path && target) move(path, { path: target, placement }, button)
  }
}
