import type { Ref } from 'vue'

export interface RIframeInst {
  iframe: Ref<HTMLIFrameElement>
}

export type Lazy = 'lazy' | 'eager' | undefined
