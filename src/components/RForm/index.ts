import RForm from './src/Form'
import formProps from './src/props'
import useForm from './src/hooks/useForm'

import type * as RFormType from './src/types'
import type { ExtractPublicPropTypes } from 'vue'
import type { UseFormReturn } from './src/hooks/useForm'

export type FormProps = ExtractPublicPropTypes<typeof formProps>
export type { RFormType, UseFormReturn }

export { RForm, formProps, useForm }
