import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  unref,
  watch,
} from 'vue'
import './index.scss'
import '@logicflow/core/lib/style/index.css'
import LogicFlow from '@logicflow/core'
import { completeSize } from '@ray-template/composables/element'
import { call } from '@ray-template/composables/vue'
import { omit } from 'lodash-es'
import { useTemplateRef } from 'vue'
import props from './props'
import type { FlowGraphData, G } from './types'

export default defineComponent({
  name: 'RFlow',
  props,
  setup(props) {
    // 流程图 dom 实例
    const flowDomRef = useTemplateRef<HTMLElement>('flowDomRef')
    // css 变量
    const cssVars = computed(() => {
      const { width, height } = props
      const cssVar = {
        '--r-flow-width': completeSize(width),
        '--r-flow-height': completeSize(height),
      }

      return cssVar
    })
    // 流程图实例
    const logicFlowInstRef = shallowRef<LogicFlow>()
    let editableConfig: ReturnType<LogicFlow['getEditConfig']> | undefined
    let keyboardDisabled = false
    // 默认流程图数据
    const defaultGraphData = {
      nodes: [],
      edges: [],
    }

    /**
     *
     * @param bool 是否启用只读模式
     *
     * @description
     * 进入只读前保存实例的交互配置，退出时恢复，避免覆盖调用方禁用的编辑项或快捷键。
     */
    const updateFlowConfig = (bool: boolean) => {
      const instance = logicFlowInstRef.value

      if (!instance) return

      if (bool) {
        editableConfig = instance.getEditConfig()
        keyboardDisabled = instance.keyboard.disabled
        instance.updateEditConfig({ isSilentMode: true })
      } else if (editableConfig) {
        instance.updateEditConfig(editableConfig)

        if (keyboardDisabled) instance.keyboard.disable()

        editableConfig = void 0
      }
    }

    /**
     *
     * @param graphData 流程图数据
     *
     * @description
     * 初始化流程图。
     *
     * 会自动忽略 container 属性，即使是配置了。
     */
    const setupFlowRender = (graphData?: FlowGraphData) => {
      if (!flowDomRef.value) {
        return
      }

      const { options, readonly } = props

      // LogicFlow 按 pluginName 去重；后挂载实例仍需注册自己的插件。
      props.use
        ?.filter(Boolean)
        .forEach((extension) => LogicFlow.use(extension))

      // 初始化流程图实例
      logicFlowInstRef.value = new LogicFlow({
        container: unref(flowDomRef.value),
        ...omit(options, 'container'),
      })

      // 渲染
      logicFlowInstRef.value.render((graphData || defaultGraphData) as G)
      // 是否处于只读模式，如果是只读模式，则覆盖 options 配置项为 readonlyOptions
      updateFlowConfig(readonly)
    }

    watch([() => props.data, () => props.watchData], ([data, enabled]) => {
      if (enabled)
        logicFlowInstRef.value?.renderRawData((data ?? defaultGraphData) as G)
    })
    watch(() => props.readonly, updateFlowConfig)

    onMounted(() => {
      setupFlowRender(props.data)

      const { onRegister } = props

      if (onRegister && logicFlowInstRef.value) {
        call(onRegister, logicFlowInstRef.value)
      }
    })

    onBeforeUnmount(() => logicFlowInstRef.value?.destroy())

    return {
      flowDomRef,
      cssVars,
    }
  },
  render() {
    const { cssVars } = this

    return <div class="r-flow" style={[cssVars]} ref="flowDomRef"></div>
  },
})
