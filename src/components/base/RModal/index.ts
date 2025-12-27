import type { ExtractPublicPropTypes } from 'vue'
import useModal from './src/hooks/useModal'
import type { UseModalReturn } from './src/hooks/useModal'
import RModal from './src/Modal'
import modalProps from './src/props'
import type * as RModalType from './src/types'

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>
export type { RModalType, UseModalReturn }

export { RModal, modalProps, useModal }
