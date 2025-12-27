import type { ExtractPublicPropTypes } from 'vue'
import RForm from './src/Form'
import useForm from './src/hooks/useForm'
import type { UseFormReturn } from './src/hooks/useForm'
import formProps from './src/props'
import type * as RFormType from './src/types'

export type FormProps = ExtractPublicPropTypes<typeof formProps>
export type { RFormType, UseFormReturn }

export { RForm, formProps, useForm }
