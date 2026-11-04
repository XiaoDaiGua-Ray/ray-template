<template>
  <DemoFrame>
    <div ref="preview" class="ray-demo fullscreen-demo">
      <NButton @click="toggleFullscreen">
        {{
          isFullscreen
            ? '退出全屏 / Exit full screen'
            : '元素全屏 / Full screen'
        }}
      </NButton>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import { useElementFullscreen } from '@ray-template/composables/useElementFullscreen'
import { NButton } from 'naive-ui'
import { useTemplateRef } from 'vue'
import DemoFrame from './DemoFrame.vue'

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
