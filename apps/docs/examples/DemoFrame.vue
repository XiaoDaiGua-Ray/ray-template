<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :themeOverrides="themeOverrides"
    :locale="locale === 'zh-CN' ? zhCN : undefined"
    :dateLocale="locale === 'zh-CN' ? dateZhCN : undefined"
  >
    <div
      class="vp-raw r-theme-scope"
      :class="isDark ? 'r-template--dark' : 'r-template--light'"
      :style="shellStyle"
      :lang="locale"
    >
      <slot />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import '@ray-template/ui/theme.css'
import {
  createRayThemeStyle,
  rayThemeOverrides,
} from '@ray-template/ui/theme-presets'
import {
  darkTheme,
  dateZhCN,
  lightTheme,
  NConfigProvider,
  zhCN,
} from 'naive-ui'
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{ dark?: boolean; locale?: 'zh-CN' | 'en' }>()
const { isDark: docsDark, lang } = useData()
const isDark = computed(() => props.dark ?? docsDark.value)
const locale = computed(
  () => props.locale ?? (lang.value.startsWith('en') ? 'en' : 'zh-CN'),
)
const themeOverrides = computed(
  () => rayThemeOverrides[isDark.value ? 'dark' : 'light'],
)
const shellStyle = computed(() =>
  createRayThemeStyle(
    {
      ...(isDark.value ? darkTheme : lightTheme).common,
      ...themeOverrides.value.common,
    },
    themeOverrides.value,
  ),
)
</script>
