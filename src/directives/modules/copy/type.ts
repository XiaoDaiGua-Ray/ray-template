import type ClipboardJS from 'clipboard'

export interface CopyElement extends Element, UnknownObjectKey {
  $value: string
  $$clipboard: ClipboardJS | null
}
