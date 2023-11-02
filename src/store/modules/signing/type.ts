export interface SigningForm extends UnknownObjectKey {
  name: string
  pwd: string
}

export interface SigningCallback extends UnknownObjectKey {
  role: string
  name: string
  avatar?: string
}

export interface SigningResponse extends UnknownObjectKey {
  code: number
  data: SigningCallback
  message: string
}
