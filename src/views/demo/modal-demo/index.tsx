import { RModal } from '@/components'
import { NButton, NCard, NFlex } from 'naive-ui'

import { useModal } from '@/components'

export default defineComponent({
  name: 'ModalDemo',
  setup() {
    const state = reactive({
      modal1: false,
      modal2: false,
      modal3: false,
    })
    const { create } = useModal()

    const createCardModal = () => {
      create({
        title: '卡片模态框',
        draggable: true,
        preset: 'card',
        content: () => (
          <div style="height: 3000px;">我可以被拖拽的全屏card模态框</div>
        ),
        fullscreen: true,
      })
    }

    const createDialogModal = () => {
      create({
        title: '模态框',
        content: '内容',
        preset: 'dialog',
        draggable: true,
      })
    }

    return {
      ...toRefs(state),
      createCardModal,
      createDialogModal,
    }
  },
  render() {
    const { createCardModal, createDialogModal } = this

    return (
      <NFlex vertical>
        <NCard title="props">
          <NFlex vertical>
            <h3>fullscreen: 全屏模态框。</h3>
          </NFlex>
        </NCard>
        <RModal
          v-model:show={this.modal1}
          title="全屏模态框"
          fullscreen
          preset="card"
        >
          <div style="height: 3000px;">我可以被拖拽的全屏card模态框</div>
        </RModal>
        <RModal
          v-model:show={this.modal2}
          preset="card"
          title="可拖拽卡片模态框"
          draggable
        >
          <p>我可以被拖拽</p>
        </RModal>
        <RModal
          v-model:show={this.modal3}
          preset="dialog"
          title="可拖拽卡片模态框"
          draggable
        >
          <p>我可以被拖拽</p>
        </RModal>
        <NCard title="可拖拽模态框">
          <NButton onClick={() => (this.modal2 = true)}>卡片模态框</NButton>
          <NButton onClick={() => (this.modal3 = true)}>对话框模态框</NButton>
        </NCard>
        <NCard title="全屏模态框">
          <NFlex vertical>
            <h4>
              全屏模态框需要同时设置：fullscreen 为 true，并且 preset 为 card
              时才会生效。
            </h4>
            <NButton onClick={() => (this.modal1 = true)}>打开</NButton>
          </NFlex>
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
        <NCard title="重写 useModal">
          <NButton onClick={createCardModal.bind(this)}>创建卡片模态框</NButton>
          <NButton onClick={createDialogModal.bind(this)}>
            创建对话框模态框
          </NButton>
        </NCard>
      </NFlex>
    )
  },
})
