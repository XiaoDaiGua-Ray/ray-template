import type JsBarcode from 'jsbarcode'

export type RBarcodeRender = 'canvas' | 'svg'

export type RBarcodeOptions = JsBarcode.Options

export type RBarcodeFormat =
  | 'CODE39'
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar'

// 使用模板字面量类型来保留字面量提示
export type RBarcodeSize = number | 'auto' | (string & {})
