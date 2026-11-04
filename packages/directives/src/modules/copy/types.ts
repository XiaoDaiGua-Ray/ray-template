import type ClipboardJS from 'clipboard'

export interface CopyElement extends Element {
  $value: string
  $$clipboard: ClipboardJS | null
}
