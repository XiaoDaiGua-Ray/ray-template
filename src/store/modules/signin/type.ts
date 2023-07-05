export interface SigninForm extends UnknownObjectKey {
  name: string
  pwd: string
}

export interface SigninCallback extends UnknownObjectKey {
  role: string
  name: string
  avatar?: string
}

export interface SigninResponse extends UnknownObjectKey {
  code: number
  data: SigninCallback
  message: string
}
