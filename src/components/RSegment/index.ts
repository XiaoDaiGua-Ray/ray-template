import type { ExtractPublicPropTypes } from 'vue'
import segmentProps from './src/props'
import RSegment from './src/Segment'
import type { RSegmentOptions } from './src/types'

export type SegmentProps = ExtractPublicPropTypes<typeof segmentProps>
export type { RSegmentOptions }

export { RSegment, segmentProps }
