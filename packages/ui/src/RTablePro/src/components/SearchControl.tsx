import {
  NCascader,
  NDatePicker,
  NInput,
  NInputNumber,
  NSelect,
  NTimePicker,
  NTreeSelect,
} from 'naive-ui'
import { useTableLocale } from '../locale'
import type {
  TableProSearchFieldConfig,
  TableProSearchValue,
  TableProSearchValues,
} from '../types'
import SearchSelect from './SearchSelect'

export default function SearchControl({
  field,
  values,
  inputId,
  labelId,
  setValue,
}: {
  field: TableProSearchFieldConfig
  values: TableProSearchValues
  inputId: string
  labelId: string
  setValue: (value: TableProSearchValue | null) => void
}) {
  const { t } = useTableLocale()
  const value = values[field.key] ?? null
  const common = {
    clearable: true,
    placeholder: field.placeholder,
    'aria-labelledby': labelId,
  }
  const inputProps = { id: inputId, 'aria-labelledby': labelId }

  switch (field.type) {
    case 'custom':
      return <>{field.render({ value, setValue, values, inputId, labelId })}</>
    case 'text':
      return (
        <NInput
          {...common}
          {...field.fieldProps}
          inputProps={{ ...field.fieldProps?.inputProps, ...inputProps }}
          value={(value as string | null) ?? ''}
          onUpdateValue={setValue}
        />
      )
    case 'number':
      return (
        <NInputNumber
          {...common}
          {...field.fieldProps}
          inputProps={{ ...field.fieldProps?.inputProps, ...inputProps }}
          value={value as number | null}
          onUpdateValue={setValue}
        />
      )
    case 'boolean':
      return (
        <NSelect
          {...common}
          {...field.fieldProps}
          inputProps={{ ...field.fieldProps?.inputProps, ...inputProps }}
          options={[
            { label: t('searchYes'), value: 1 },
            { label: t('searchNo'), value: 0 },
          ]}
          value={value == null ? null : Number(value)}
          onUpdateValue={(value: number | null) =>
            setValue(value == null ? null : value === 1)
          }
        />
      )
    case 'select':
      return (
        <SearchSelect
          key={JSON.stringify(field.dependsOn?.map((key) => values[key]))}
          field={field}
          values={values}
          inputId={inputId}
          labelId={labelId}
          setValue={setValue}
        />
      )
    case 'date':
    case 'dateRange':
      return (
        <NDatePicker
          {...common}
          {...field.fieldProps}
          type={field.type === 'date' ? 'date' : 'daterange'}
          valueFormat="yyyy-MM-dd"
          formattedValue={value as string | [string, string] | null}
          onUpdateFormattedValue={setValue}
        />
      )
    case 'datetime':
    case 'datetimeRange':
      return (
        <NDatePicker
          {...common}
          {...field.fieldProps}
          type={field.type === 'datetime' ? 'datetime' : 'datetimerange'}
          value={value as number | [number, number] | null}
          onUpdateValue={setValue}
        />
      )
    case 'time':
      return (
        <NTimePicker
          {...common}
          {...field.fieldProps}
          valueFormat="HH:mm:ss"
          formattedValue={value as string | null}
          onUpdateFormattedValue={setValue}
        />
      )
    case 'cascader':
      return (
        <NCascader
          {...common}
          {...field.fieldProps}
          multiple={field.multiple}
          value={value as string | number | (string | number)[] | null}
          onUpdateValue={setValue}
        />
      )
    case 'treeSelect':
      return (
        <NTreeSelect
          {...common}
          {...field.fieldProps}
          multiple={field.multiple}
          value={value as string | number | (string | number)[] | null}
          onUpdateValue={setValue}
        />
      )
    default:
      return field.options ? (
        <NSelect
          {...common}
          inputProps={inputProps}
          options={field.options}
          value={value as string | number | null}
          onUpdateValue={setValue}
        />
      ) : (
        <NInput
          {...common}
          inputProps={inputProps}
          value={(value as string | null) ?? ''}
          onUpdateValue={setValue}
        />
      )
  }
}
