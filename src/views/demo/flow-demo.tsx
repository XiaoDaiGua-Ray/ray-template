import { RFlow, RForm } from '@/components'

import { useFlow } from '@/components'

import type { FlowGraphData } from '@/components'
import { NCard, NFlex, NFormItemGridItem, NGrid, NSwitch } from 'naive-ui'

export default defineComponent({
  name: 'RFlowDemo',
  setup() {
    const [register, { getFlowInstance }] = useFlow()
    const flowDataRef = ref<FlowGraphData>()
    const settingRef = ref({
      readonly: false,
    })

    const getInst = () => {
      console.log(getFlowInstance())

      window.$message.info('获取实例成功，请在 console 中查看')
    }

    setTimeout(() => {
      flowDataRef.value = {
        // 节点
        nodes: [
          {
            id: '21',
            type: 'rect',
            x: 300,
            y: 100,
            text: 'rect node',
          },
          {
            id: '50',
            type: 'circle',
            x: 500,
            y: 100,
            text: 'circle node',
          },
        ],
        // 边
        edges: [
          {
            id: '21',
            type: 'polyline',
            sourceNodeId: '50',
            targetNodeId: '21',
          },
        ],
      }
    }, 1000)

    onMounted(() => {
      getInst()
    })

    return {
      register,
      flowDataRef,
      settingRef,
    }
  },
  render() {
    const { register, flowDataRef, settingRef } = this

    return (
      <NFlex vertical>
        <NCard>
          <RForm>
            <NGrid xGap={4} yGap={18} cols={4}>
              <NFormItemGridItem label="禁用流程图">
                <NSwitch v-model:value={settingRef.readonly} />
              </NFormItemGridItem>
            </NGrid>
          </RForm>
        </NCard>
        <NCard>
          <RFlow
            height={500}
            onRegister={register}
            data={flowDataRef}
            readonly={settingRef.readonly}
          />
        </NCard>
      </NFlex>
    )
  },
})
