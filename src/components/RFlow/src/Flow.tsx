import './index.scss'
import '@logicflow/core/lib/style/index.css'
import { call, completeSize } from '@/utils'
import LogicFlow from '@logicflow/core'
import { omit } from 'lodash-es'
import { useTemplateRef } from 'vue'
import props from './props'
import type { FlowGraphData, G } from './types'

// 是否首次注册插件
let isSetup = false

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
    // 需要禁用的流程图配置项
    const readonlyOptions = {
      nodeTextEdit: false,
      edgeTextEdit: false,
      textEdit: false,
    }
    // 默认流程图数据
    const defaultGraphData = {
      nodes: [],
      edges: [],
    }

    // 注册流程图插件
    const registerExtension = () => {
      if (!isSetup) {
        props.use?.filter(Boolean).forEach((curr) => LogicFlow.use(curr))

        isSetup = true
      }
    }

    // 动态根据 readonly 配置项修改流程图配置
    const updateFlowConfig = (bool: boolean) => {
      if (!logicFlowInstRef.value) {
        return
      }

      const ops = Object.entries(readonlyOptions).reduce(
        (acc, [key]) => {
          acc[key as keyof typeof acc] = !bool

          return acc
        },
        {} as typeof readonlyOptions,
      )

      // 单独处理 isSilentMode 配置项
      Object.assign(readonlyOptions, ops, {
        isSilentMode: bool,
        adjustNodePosition: !bool,
      })
      logicFlowInstRef.value.updateEditConfig(readonlyOptions)
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
      registerExtension()

      if (!flowDomRef.value) {
        return
      }

      const { options, readonly } = props

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

    watch(
      () => props.data,
      (data) => {
        if (props.watchData && data)
          logicFlowInstRef.value?.renderRawData(data as G)
      },
    )
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
