export interface EllipsisBindingValue {
  /**
   * @description
   * 省略行数。
   */
  line: number
  /**
   * @description
   * 省略方式。
   *
   * line: 多行省略
   * block: 单行省略
   */
  type: 'line' | 'block'
  /**
   * @description
   * 宽度。
   */
  width: string | number
  /**
   *
   * @description
   * 是否需要注入 title 属性。
   */
  popoverText?: boolean
}
