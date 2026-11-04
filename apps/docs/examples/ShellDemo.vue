<template>
  <NConfigProvider :theme="dark ? darkTheme : undefined">
    <div
      class="shell-demo"
      :class="{ 'r-template--dark': dark }"
      :lang="locale"
    >
      <AdminShell :layout="layout" :groupedSidebar="true" showTabs showFooter>
        <template #header>
          <div class="shell-bar">
            <strong>Ray Admin</strong>
            <NButton size="small" @click="dark = !dark">{{
              dark ? copy.light : copy.dark
            }}</NButton>
          </div>
          <ShellTopNavigation
            v-if="['top', 'mixed', 'split'].includes(layout.mode)"
            :items="menu"
            :active="active"
            :grouped="layout.mode !== 'top'"
            :label="copy.navigation"
            :select="(item) => navigate(item.fullPath)"
          />
        </template>
        <template #sidebar>
          <NLayoutSider :width="132" bordered>
            <NMenu :options="menu" :value="active" @update:value="navigate" />
          </NLayoutSider>
        </template>
        <template #tabs>
          <div class="shell-bar">
            <ShellTab
              v-for="item in pages"
              :key="item.path"
              :label="item.label"
              :active="active === item.path"
              :select="() => navigate(item.path)"
            />
          </div>
        </template>
        <h2>{{ title }}</h2>
        <LayoutSettings
          :layout="layout"
          :defaults="defaults"
          :translate="translate"
          :update="updateLayout"
        />
        <template #footer>
          <div class="shell-bar">{{ copy.footer }}</div>
        </template>
      </AdminShell>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import '@ray-template/ui/theme.css'
import {
  AdminShell,
  LayoutSettings,
  ShellTab,
  ShellTopNavigation,
} from '@ray-template/admin-shell'
import type { LayoutConfig } from '@ray-template/admin-shell'
import {
  darkTheme,
  NButton,
  NConfigProvider,
  NLayoutSider,
  NMenu,
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const props = withDefaults(defineProps<{ locale?: 'zh-CN' | 'en' }>(), {
  locale: 'zh-CN',
})
const copy = computed(() =>
  props.locale === 'en'
    ? {
        dashboard: 'Dashboard',
        reports: 'Reports',
        navigation: 'Navigation',
        light: 'Light theme',
        dark: 'Dark theme',
        footer: 'Layout preview',
        settings: 'Layout',
        side: 'Left',
        top: 'Top',
        mixed: 'Mixed',
        right: 'Right',
        split: 'Split',
        contentWidth: 'Content width',
        fluid: 'Fluid',
        fixed: 'Fixed',
        maxWidth: 'Maximum width',
        padding: 'Padding',
        fixedHeader: 'Fixed header',
        fixedFooter: 'Fixed footer',
        reset: 'Reset layout',
      }
    : {
        dashboard: '工作台',
        reports: '报表',
        navigation: '导航',
        light: '浅色主题',
        dark: '深色主题',
        footer: '布局预览',
        settings: '布局',
        side: '侧边导航',
        top: '顶部导航',
        mixed: '混合导航',
        right: '右侧导航',
        split: '通栏分组',
        contentWidth: '内容宽度',
        fluid: '流式铺满',
        fixed: '定宽居中',
        maxWidth: '最大宽度',
        padding: '内容间距',
        fixedHeader: '固定顶栏',
        fixedFooter: '固定页脚',
        reset: '恢复默认布局',
      },
)
const translate = (key: string) =>
  copy.value[(key === 'tab' ? 'settings' : key) as keyof typeof copy.value] ??
  key
const defaults: LayoutConfig = {
  mode: 'side',
  contentWidth: 'fluid',
  contentMaxWidth: 1200,
  contentPadding: 16,
  fixedHeader: true,
  fixedFooter: true,
}
const layout = ref({ ...defaults })
const updateLayout = (patch: Partial<LayoutConfig>) => {
  layout.value = { ...layout.value, ...patch }
}
const dark = ref(false)
const pages = computed(() => [
  { path: '/', label: copy.value.dashboard },
  { path: '/reports', label: copy.value.reports },
])
const router = createRouter({
  history: createMemoryHistory(),
  routes: pages.value.map(({ path }) => ({
    path,
    component: { render: () => null },
  })),
})
const active = computed(() => router.currentRoute.value.path)
const title = computed(
  () => pages.value.find(({ path }) => path === active.value)?.label,
)
const menu = computed(() =>
  pages.value.map(({ path, label }) => ({
    key: path,
    label,
    path,
    fullPath: path,
    name: path,
    meta: {},
  })),
)
const navigate = (path: string) => {
  void router.push(path)
}

onMounted(() => navigate('/'))
</script>

<style scoped>
.shell-demo {
  --html-height: 100dvh;
  --html-width: 100vw;
  --r-theme-primary-color: #3b63d9;
  color: var(--r-text);
}

.shell-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--r-surface);
  border-block-end: 1px solid var(--r-line);
}
</style>
