import type { Recordable } from '@/types'

export interface SigningForm extends GlobalRecordable {
  name: string
  pwd: string
}

export interface SigningCallback extends Recordable {
  id?: string
  username?: string
  role: string
  name: string
  avatar?: string
}

export interface SigningResponse extends Recordable {
  code: number
  data: SigningCallback
  message: string
}
