<template>
  <DemoFrame>
    <div class="ray-demo">
      <RMoreDropdown trigger="click" :options="options" @select="onSelect">
        <NButton>{{ copy.more }}</NButton>
      </RMoreDropdown>
      <output class="ray-demo-result">{{ result || copy.hint }}</output>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import { RMoreDropdown } from '@ray-template/ui/more-dropdown'
import { NButton } from 'naive-ui'
import { useData } from 'vitepress'
import { computed, ref } from 'vue'
import DemoFrame from './DemoFrame.vue'

const { lang } = useData()
const copy = computed(() =>
  lang.value.startsWith('en')
    ? {
        edit: 'Edit',
        copy: 'Duplicate',
        archive: 'Archive',
        more: 'More actions',
        hint: 'Select an action.',
      }
    : {
        edit: '编辑',
        copy: '复制',
        archive: '归档',
        more: '更多操作',
        hint: '请选择一项操作',
      },
)
const options = computed(() => [
  { key: 'edit', label: copy.value.edit },
  { key: 'copy', label: copy.value.copy },
  { key: 'archive', label: copy.value.archive, disabled: true },
])
const result = ref('')
const onSelect = (key: string | number) => {
  result.value = options.value.find((option) => option.key === key)?.label ?? ''
}
</script>
