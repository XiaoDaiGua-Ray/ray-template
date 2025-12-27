import type ClipboardJS from 'clipboard'

export interface CopyElement extends Element, GlobalRecordable {
  $value: string
  $$clipboard: ClipboardJS | null
}
