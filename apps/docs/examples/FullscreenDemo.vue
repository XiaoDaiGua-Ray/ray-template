<template>
  <DemoFrame>
    <div ref="preview" class="ray-demo fullscreen-demo">
      <NButton @click="toggleFullscreen">
        {{
          isFullscreen
            ? english
              ? 'Exit fullscreen'
              : '退出全屏'
            : english
              ? 'Enter fullscreen'
              : '元素全屏'
        }}
      </NButton>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import { useElementFullscreen } from '@ray-template/composables/useElementFullscreen'
import { NButton } from 'naive-ui'
import { useData } from 'vitepress'
import { computed, useTemplateRef } from 'vue'
import DemoFrame from './DemoFrame.vue'

const { lang } = useData()
const english = computed(() => lang.value.startsWith('en'))
const { isFullscreen, toggleFullscreen } = useElementFullscreen(
  useTemplateRef('preview'),
)
</script>

<style scoped>
.fullscreen-demo {
  display: grid;
  place-items: center;
  margin: 0;
  background: var(--vp-c-bg-soft);
}
</style>
