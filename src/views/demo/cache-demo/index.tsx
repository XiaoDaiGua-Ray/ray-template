/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-01-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import {
  NButton,
  NCard,
  NFlex,
  NInput,
  NInputGroup,
  NInputGroupLabel,
} from 'naive-ui'

import { getStorage, setStorage, removeStorage, hasStorage } from '@/utils'

export default defineComponent({
  name: 'CacheDemo',
  setup() {
    const nameValue = ref('Ray')
    const currentPrefix = ref('ray:')

    return {
      nameValue,
      currentPrefix,
    }
  },
  render() {
    return (
      <NCard title="cache 工具包示例">
        {{
          default: () => (
            <NFlex vertical>
              <h3>点击 setStorage 按钮，设置缓存示例</h3>
              <NInputGroup>
                <NInputGroupLabel>设置缓存内容</NInputGroupLabel>
                <NInput
                  v-model:value={this.nameValue}
                  placeholder="请输入姓名"
                />
              </NInputGroup>
              <NInputGroup>
                <NInputGroupLabel>设置前缀</NInputGroupLabel>
                <NInput
                  v-model:value={this.currentPrefix}
                  placeholder="请输入前缀"
                />
              </NInputGroup>
            </NFlex>
          ),
          action: () => (
            <NFlex>
              <NButton
                onClick={() => {
                  setStorage('name', this.nameValue, 'sessionStorage', {
                    prefix: true,
                    prefixKey: this.currentPrefix,
                  })

                  window.$message.success('设置成功')
                }}
              >
                setStorage
              </NButton>
              <NButton
                onClick={() => {
                  const name = getStorage('name', 'sessionStorage', {
                    prefix: true,
                    prefixKey: this.currentPrefix,
                  })

                  window.$message.success(`获取到的姓名为：${name}`)
                }}
              >
                getStorage
              </NButton>
              <NButton
                onClick={() => {
                  removeStorage('name', 'sessionStorage', {
                    prefix: true,
                    prefixKey: this.currentPrefix,
                  })

                  window.$message.success('删除成功')
                }}
              >
                removeStorage
              </NButton>
              <NButton
                onClick={() => {
                  const cacheKey = hasStorage('name', 'sessionStorage', {
                    prefix: true,
                    prefixKey: this.currentPrefix,
                  })

                  window.$message.success(`是否存在：${cacheKey}`)
                }}
              >
                hasStorage
              </NButton>
            </NFlex>
          ),
        }}
      </NCard>
    )
  },
})
