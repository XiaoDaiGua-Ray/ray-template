<template>
  <component
    :is="deferred ? 'details' : 'div'"
    :class="deferred ? 'details custom-block' : undefined"
    @toggle="openExample"
  >
    <summary v-if="deferred">
      {{ lang.startsWith('en') ? 'Run example' : '运行示例' }}
    </summary>
    <div v-if="!deferred || started" class="ray-admin-example-frame">
      <iframe
        class="ray-admin-example"
        :src="src"
        :title="title"
        :height="height ?? 490"
        loading="lazy"
      />
    </div>
    <p>
      <a :href="src" target="_blank" rel="noopener">{{ newTabText }}</a>
    </p>
  </component>
</template>

<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, ref } from 'vue'

const props = defineProps<{
  path: string
  title: string
  layout?: boolean
  height?: number
  focus?: string
  deferred?: boolean
}>()
const { isDark, lang } = useData()
const started = ref(false)
const newTabText = computed(() =>
  lang.value.startsWith('en')
    ? 'Run this example in a new tab'
    : '在新标签页运行此示例',
)
const openExample = (event: Event) => {
  if ((event.currentTarget as HTMLDetailsElement).open) started.value = true
}
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
