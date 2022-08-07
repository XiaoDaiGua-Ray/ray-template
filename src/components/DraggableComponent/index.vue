<script setup lang="ts">
const el = ref<HTMLElement | null>(null)

const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 140 },
})
</script>

<template>
  <div class="draggable-component" ref="el" :style="style">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
</template>

<style lang="scss" scope>
.draggable-component {
  position: fixed;
  padding: 8px 16px;
  border: 1px solid rgba(156, 163, 175, 0.3);
  cursor: move;
}
</style>
