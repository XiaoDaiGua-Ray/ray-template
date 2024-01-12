/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { RModal } from '@/components'
import { NButton, NCard, NSpace } from 'naive-ui'

export default defineComponent({
  name: 'ModalDemo',
  setup() {
    const state = reactive({
      modal1: false,
      modal2: false,
      modal3: false,
    })

    return {
      ...toRefs(state),
    }
  },
  render() {
    return (
      <NSpace vertical>
        <NCard title="props">
          <NSpace vertical>
            <h3>
              memoryPosition: 是否记住上一次被拖拽的位置，如果设置为
              true，那么下一次打开的时候会自动定位到上一次的位置。
            </h3>
            <h3>fullscreen: 全屏模态框。</h3>
            <h3>dad: 启用拖拽，当配置为 false 时，会禁用拖拽效果。</h3>
          </NSpace>
        </NCard>
        <RModal
          v-model:show={this.modal1}
          title="全屏模态框"
          fullscreen
          preset="card"
        >
          我是全屏模态框，并且会自动启用滚动条。
        </RModal>
        <RModal
          v-model:show={this.modal2}
          preset="card"
          title="可拖拽卡片模态框"
          dad
        >
          <p>我可以被拖拽</p>
        </RModal>
        <RModal
          v-model:show={this.modal3}
          preset="dialog"
          title="可拖拽卡片模态框"
          dad
        >
          <p>我可以被拖拽</p>
        </RModal>
        <NCard title="可拖拽模态框">
          <NButton onClick={() => (this.modal2 = true)}>卡片模态框</NButton>
          <NButton onClick={() => (this.modal3 = true)}>对话框模态框</NButton>
        </NCard>
        <NCard title="全屏模态框">
          <NSpace vertical>
            <h4>
              全屏模态框需要同时设置：fullscreen 为 true，并且 preset 为 card
              时才会生效。
            </h4>
            <NButton onClick={() => (this.modal1 = true)}>打开</NButton>
          </NSpace>
        </NCard>
        <NCard title="手动设置宽度">
          <h4>
            width（--r-modal-width）: 当 preset 不为 dialog 或者 card
            的时候，你可能用得上。
          </h4>
          <h4>
            dialogWidth（--r-modal-dialog-width）: 当 preset 为
            dialog，你可能用得上。
          </h4>
          <h4>
            cardWidth（--r-modal-card-width）: 当 preset 为 card，你可能用得上。
          </h4>
          <h4>
            所有的宽度配置属性都会注入一个对应的 `css variable`，有时候会用上。
          </h4>
        </NCard>
      </NSpace>
    )
  },
})
