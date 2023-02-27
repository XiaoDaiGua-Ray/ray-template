/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-02-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 为什么要写这个文件在这儿多此一举呢:
 *   - 考虑到可能需要什么特殊操作, 所以提前写在这儿了
 *   - 可以个性化配置一些东西, 所有配置都会合并到 axios instance config 中
 *   - 当然, 你也可以直接使用 instance
 */

import request from './instance'

import type { AxiosRequestConfig } from 'axios'

const useRequest = (config: AxiosRequestConfig) => {
  const cfg = Object.assign({}, config, {})

  return request(cfg)
}

export default useRequest
