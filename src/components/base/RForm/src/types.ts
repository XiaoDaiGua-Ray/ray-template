import type { FormInst, FormItemRule, FormRules } from 'naive-ui'

export type RFormInst = FormInst

type FormValidateParameters = Parameters<FormInst['validate']>

export type FormValidateCallback = FormValidateParameters[0]

export type ShouldRuleBeApplied = FormValidateParameters[1]

export interface RFormRules {
  [itemValidatePath: string]: FormItemRule | Array<FormItemRule> | FormRules
}
