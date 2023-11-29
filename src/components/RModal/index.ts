import RModal from './src/Modal'
import modalProps from './src/props'

import type { ExtractPublicPropTypes } from 'vue'

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>

export { RModal, modalProps }
