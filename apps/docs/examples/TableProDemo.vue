<template>
  <NConfigProvider :theme="dark ? darkTheme : undefined">
    <div
      class="ray-demo table-demo"
      :class="{ 'r-template--dark': dark }"
      :lang="locale"
    >
      <fieldset>
        <legend>{{ copy.source }}</legend>
        <div class="ray-demo-options">
          <label :for="`${id}-local`">
            <input
              :id="`${id}-local`"
              v-model="source"
              type="radio"
              :name="id"
              value="local"
            />
            {{ copy.local }}
          </label>
          <label :for="`${id}-remote`">
            <input
              :id="`${id}-remote`"
              v-model="source"
              type="radio"
              :name="id"
              value="remote"
            />
            {{ copy.remote }}
          </label>
          <label :for="`${id}-virtual`">
            <input :id="`${id}-virtual`" v-model="virtual" type="checkbox" />
            {{ copy.virtual }}
          </label>
        </div>
      </fieldset>
      <NButton v-if="source === 'remote'" size="small" @click="failRequest">
        {{ copy.fail }}
      </NButton>
      <p v-if="source === 'remote'" role="status">
        {{ copy.cancelled }} {{ cancelled }}
      </p>
      <RTablePro
        :key="source"
        ref="table"
        :columns="columns"
        :data="source === 'local' ? rows : []"
        :request="source === 'remote' ? request : undefined"
        :virtualScroll="virtual"
        :search="[{ key: 'name', label: copy.name }]"
        columnStateKey="docs-demo"
        autoHeight
      />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import '@ray-template/ui/theme.css'
import { provideUiServices } from '@ray-template/ui/services'
import { RTablePro } from '@ray-template/ui/table-pro'
import type { TableProInst, TableProRequest } from '@ray-template/ui/table-pro'
import { createStorage } from '@ray-template/utils/storage'
import { darkTheme, NButton, NConfigProvider } from 'naive-ui'
import { computed, ref, shallowRef, useId } from 'vue'

const props = withDefaults(
  defineProps<{ dark?: boolean; locale?: 'zh-CN' | 'en' }>(),
  { locale: 'zh-CN' },
)
const copy = computed(() =>
  props.locale === 'en'
    ? {
        source: 'Data source',
        local: 'Local',
        remote: 'Simulated request',
        virtual: 'Virtual scroll',
        fail: 'Simulate a request failure',
        cancelled: 'Cancelled requests:',
        name: 'Name',
        score: 'Score',
        entry: 'Member',
      }
    : {
        source: '数据来源',
        local: '本地数据',
        remote: '模拟远端查询',
        virtual: '虚拟滚动',
        fail: '模拟请求失败',
        cancelled: '已取消请求：',
        name: '姓名',
        score: '分数',
        entry: '成员',
      },
)
const id = useId()
const source = ref<'local' | 'remote'>('local')
const virtual = ref(false)
const cancelled = ref(0)
const table = shallowRef<TableProInst>()
const values = new Map<string, string>()

provideUiServices({
  locale: () => props.locale,
  dark: () => props.dark,
  columnStorage: createStorage({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value)
    },
    removeItem: (key) => {
      values.delete(key)
    },
  }),
})
const rows = computed(() =>
  Array.from({ length: 96 }, (_, index) => ({
    id: index + 1,
    name: `${copy.value.entry} ${index + 1}`,
    score: 60 + (index % 41),
  })),
)
const columns = computed(() => [
  { title: 'ID', key: 'id', width: 64 },
  { title: copy.value.name, key: 'name' },
  { title: copy.value.score, key: 'score', width: 76 },
])
let failNext = false
const request: TableProRequest = (
  { page = 1, pageSize = 10, name },
  signal,
) => {
  const shouldFail = failNext

  failNext = false

  return new Promise((resolve, reject) => {
    signal.throwIfAborted()
    const onAbort = () => {
      clearTimeout(timer)
      cancelled.value += 1
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)

      if (shouldFail) {
        reject(new Error('Simulated request failure'))

        return
      }

      const matching = rows.value.filter((row) =>
        row.name.includes(String(name ?? '')),
      )

      resolve({
        data: matching.slice((page - 1) * pageSize, page * pageSize),
        total: matching.length,
      })
    }, 650)

    signal.addEventListener('abort', onAbort, { once: true })
  })
}
const failRequest = () => {
  failNext = true
  void table.value?.reload()
}
</script>

<style scoped>
.table-demo {
  --r-table-height: 460px;
}

.table-demo :deep(.n-data-table-table) {
  display: table;
  margin: 0;
  overflow: visible;
}

.table-demo :deep(.n-data-table-tr) {
  background: transparent;
  border: 0;
}
</style>
