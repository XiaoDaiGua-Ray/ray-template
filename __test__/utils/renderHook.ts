/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp, defineComponent } from 'vue'

import type { App } from 'vue'

export default function renderHook<R = any>(
  renderFC: () => R,
): [
  R,
  App<Element>,
  {
    act?: (fn: () => void) => void
  },
] {
  let result: any
  let act: ((fn: () => void) => void) | undefined
  const app = createApp(
    defineComponent({
      setup() {
        result = renderFC()

        act = (fn: () => void) => {
          fn()
        }

        return () => {}
      },
    }),
  )

  app.mount(document.createElement('div'))

  return [result, app, { act }]
}
