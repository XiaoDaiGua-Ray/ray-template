export {}

export global {
  declare interface IUnknownObjectKey {
    [propName: string]: any
  }

  declare type EventListenerOrEventListenerObject =
    | EventListener
    | EventListenerObject

  declare type ValidteValueType =
    | 'Number'
    | 'String'
    | 'Boolean'
    | 'Object'
    | 'Function'
    | 'Null'
    | 'Undefined'
    | 'Array'
    | 'Date'
    | 'Math'
    | 'RegExp'
    | 'Error'
}
