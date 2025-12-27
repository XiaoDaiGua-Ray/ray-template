import type { ExtractPublicPropTypes } from 'vue'
import RFlow from './src/Flow'
import { useFlow } from './src/hooks'
import flowProps from './src/props'

export type FlowProps = ExtractPublicPropTypes<typeof flowProps>

export { RFlow, flowProps, useFlow }
