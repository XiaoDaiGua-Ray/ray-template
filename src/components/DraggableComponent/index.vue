<script setup lang="ts">
import type { MaybeComputedRef } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)

const { x, y, style } = useDraggable(el as MaybeComputedRef<HTMLElement>, {
  initialValue: { x: 630, y: 14 },
})
</script>

<template>
  <div ref="el" class="draggable-component" :style="style">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
</template>

<style lang="scss" scope>
.draggable-component {
  position: fixed;
  padding: 8px 16px;
  border: 1px solid rgba(156, 163, 175, 0.3);
  cursor: move;
  z-index: 10;
}
</style>
