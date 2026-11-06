<template>
  <NConfigProvider :theme="dark ? darkTheme : null" :themeOverrides="overrides">
    <div
      class="r-theme-scope example-theme-scope"
      :class="dark ? 'r-template--dark' : 'r-template--light'"
      :style="tokens"
    >
      <slot />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import '@ray-template/ui/theme.css'
import { provideUiServices } from '@ray-template/ui/services'
import {
  createRayThemeStyle,
  themeStyleOverrides,
} from '@ray-template/ui/theme-presets'
import type { ThemeStyle } from '@ray-template/ui/theme-presets'
import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    dark?: boolean
    themeStyle?: ThemeStyle
    commonOverrides?: GlobalThemeOverrides['common']
  }>(),
  { dark: false, themeStyle: 'modern', commonOverrides: () => ({}) },
)
const overrides = computed<GlobalThemeOverrides>(() => {
  const preset =
    themeStyleOverrides[props.themeStyle][props.dark ? 'dark' : 'light']

  return {
    ...preset,
    common: { ...preset.common, ...props.commonOverrides },
  }
})
const tokens = computed(() =>
  createRayThemeStyle(
    {
      ...(props.dark ? darkTheme : lightTheme).common,
      ...overrides.value.common,
    },
    overrides.value,
  ),
)

// 组件行为服务与 CSS 主题分别提供；此独立宿主不依赖后台 Store。
provideUiServices({
  dark: () => props.dark,
  chartTheme: () => `ray-${props.themeStyle}`,
})
</script>

<style scoped>
.example-theme-scope {
  min-inline-size: 0;
  color: var(--r-text, CanvasText);
  background: var(--r-canvas, Canvas);
}
</style>
