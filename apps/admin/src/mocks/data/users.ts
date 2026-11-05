import type { AdminUser, UserOptions } from '@/api/admin/contracts'

const departments = [
  { id: 'product', parentId: 'company' },
  { id: 'engineering', parentId: 'company' },
  { id: 'platform', parentId: 'engineering' },
  { id: 'experience', parentId: 'engineering' },
  { id: 'operations', parentId: 'company' },
]

export const initialUserOptions: UserOptions = {
  departments: [
    {
      id: 'company',
      parentId: null,
      name: 'Ray Studio',
      labelKey: 'userManagement.departments.company',
    },
    ...departments.map((item) => ({
      ...item,
      name: item.id,
      labelKey: `userManagement.departments.${item.id}`,
    })),
  ],
  roles: ['admin', 'manager', 'member'].map((value) => ({
    value,
    label: value,
    labelKey: `userManagement.roles.${value}`,
  })),
}

export const createInitialUsers = (): AdminUser[] =>
  [
    'Alex Chen',
    'Jordan Lee',
    'Casey Lin',
    'Morgan Wu',
    'Taylor Wang',
    'Avery Liu',
    'Riley Zhao',
    'Jamie Sun',
    'Robin Xu',
    'Sam Zhou',
    'Drew Huang',
    'Quinn Yang',
    'Skyler He',
    'Cameron Lu',
    'Reese Ma',
    'Parker Guo',
    'Charlie Yu',
    'Dakota Shen',
    'Emery Han',
    'Finley Luo',
    'Hayden Tang',
    'Jules Gao',
    'Kendall Song',
    'Logan Feng',
  ].map((name, index) => ({
    id: `demo-user-${index + 1}`,
    username: `user${String(index + 1).padStart(3, '0')}`,
    name,
    email: `user${index + 1}@example.com`,
    phone: '',
    departmentId: departments[index % departments.length]!.id,
    role: index === 0 ? 'admin' : index % 5 === 0 ? 'manager' : 'member',
    status: index % 6 === 5 ? 'disabled' : 'enabled',
    remark: '',
    createdAt: new Date(Date.UTC(2026, 0, index + 1, 9)).toISOString(),
  }))
