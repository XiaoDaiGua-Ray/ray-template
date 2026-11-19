<template>
  <DemoFrame>
    <div class="ray-demo">
      <NButton v-debounce="{ wait: 500, func: increment }">
        {{ english ? 'Click repeatedly' : '连续点击' }}
      </NButton>
      <output class="ray-demo-result">
        {{ english ? 'Calls' : '执行次数' }}: {{ calls }}
      </output>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import debounce from '@ray-template/directives/debounce'
import { NButton } from 'naive-ui'
import { useData } from 'vitepress'
import { computed, ref } from 'vue'
import DemoFrame from './DemoFrame.vue'

const { lang } = useData()
const english = computed(() => lang.value.startsWith('en'))
const vDebounce = debounce()
const calls = ref(0)
const increment = () => {
  calls.value += 1
}
</script>
