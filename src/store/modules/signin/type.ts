export interface SigninForm extends IUnknownObjectKey {
  name: string
  pwd: string
}

export interface SigninCallback extends IUnknownObjectKey {
  role: string
  name: string
  avatar?: string
}

export interface SigninResponse extends IUnknownObjectKey {
  code: number
  data: SigninCallback
  message: string
}
