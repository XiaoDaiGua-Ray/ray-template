<template>
  <div class="ray-admin-example-frame">
    <iframe
      class="ray-admin-example"
      :src="src"
      :title="title"
      :height="height ?? 490"
      loading="lazy"
    />
  </div>
  <p>
    <a :href="src" target="_blank" rel="noopener">{{
      lang.startsWith('en')
        ? 'Run this example in a new tab'
        : '在新标签页运行此示例'
    }}</a>
  </p>
</template>

<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  path: string
  title: string
  layout?: boolean
  height?: number
  focus?: string
}>()
const { isDark, lang } = useData()
const adminBase = withBase('/').replace(/[^/]+\/$/, '')
const src = computed(() => {
  const query = new URLSearchParams({
    theme: isDark.value ? 'dark' : 'light',
    lang: lang.value.startsWith('en') ? 'en' : 'zh-CN',
  })

  if (props.layout) query.set('layout', '1')

  if (props.focus) query.set('focus', props.focus)

  const server = import.meta.env.DEV
    ? import.meta.env.VITE_RAY_EXAMPLE_ORIGIN || 'http://127.0.0.1:9527'
    : ''

  return `${server}${adminBase}example.html?${query}#${props.path}`
})
</script>
