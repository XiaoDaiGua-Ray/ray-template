import RModal from './src/Modal'
import modalProps from './src/props'
import useModal from './src/hooks/useModal'

import type * as RModalType from './src/types'
import type { ExtractPublicPropTypes } from 'vue'
import type { UseModalReturn } from './src/hooks/useModal'

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>
export type { RModalType, UseModalReturn }

export { RModal, modalProps, useModal }
