import type { Person } from '@/demo-data/people'
import type { DataTableColumns } from 'naive-ui'

export const createPeopleColumns = (
  t: (key: string) => string,
): DataTableColumns<Person> => [
  { title: t('name'), key: 'name', width: 112 },
  { title: t('email'), key: 'email', width: 228, ellipsis: { tooltip: true } },
  {
    title: t('address'),
    key: 'address',
    width: 150,
    ellipsis: { tooltip: true },
  },
  { title: t('age'), key: 'age', width: 72, align: 'right' },
  { title: t('created'), key: 'createDate', width: 128 },
  { title: 'ID', key: 'id', width: 218, ellipsis: { tooltip: true } },
]
