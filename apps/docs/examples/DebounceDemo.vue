<template>
  <DemoFrame>
    <div class="ray-demo">
      <NButton v-debounce="{ wait: 500, func: increment }">
        连续点击 / Click repeatedly
      </NButton>
      <output class="ray-demo-result">执行次数 / Calls: {{ calls }}</output>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import debounce from '@ray-template/directives/debounce'
import { NButton } from 'naive-ui'
import { ref } from 'vue'
import DemoFrame from './DemoFrame.vue'

const vDebounce = debounce()
const calls = ref(0)
const increment = () => {
  calls.value += 1
}
</script>
