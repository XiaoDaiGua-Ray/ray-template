<template>
  <div class="ray-demo" :lang="locale ?? 'zh-CN'">
    <div class="ray-demo-fields">
      <div>
        <label :for="firstId">{{ copy.first }}</label>
        <input
          :id="firstId"
          v-model.trim="first"
          class="ray-demo-input"
          inputmode="decimal"
          :aria-describedby="hintId"
          :aria-invalid="!isDecimal(first)"
        />
      </div>
      <div>
        <label :for="secondId">{{ copy.second }}</label>
        <input
          :id="secondId"
          v-model.trim="second"
          class="ray-demo-input"
          inputmode="decimal"
          :aria-describedby="hintId"
          :aria-invalid="!isDecimal(second)"
        />
      </div>
    </div>
    <p :id="hintId" class="ray-demo-hint">{{ copy.hint }}</p>
    <output class="ray-demo-result" :for="`${firstId} ${secondId}`">
      <span v-if="result">
        {{ copy.fixed }}：<code>{{ result.fixed }}</code>
        <br />
        {{ copy.native }}：<code>{{ result.native }}</code>
        <br />
        <code>isCurrency: {{ result.isFixed }} / {{ result.isNative }}</code>
      </span>
      <span v-else>{{ copy.invalid }}</span>
    </output>
  </div>
</template>

<script setup lang="ts">
import { add, isCurrency } from '@ray-template/utils/precision'
import { computed, ref, useId } from 'vue'

const props = defineProps<{ locale?: 'zh-CN' | 'en' }>()
const copy = computed(() =>
  props.locale === 'en'
    ? {
        first: 'First number',
        second: 'Second number',
        fixed: 'Fixed precision',
        native: 'JavaScript addition',
        hint: 'Enter up to 7 integer digits and 8 decimal places per number.',
        invalid: 'Enter two valid decimal numbers.',
      }
    : {
        first: '第一个数',
        second: '第二个数',
        fixed: '定点运算',
        native: 'JavaScript 加法',
        hint: '每个数最多输入 7 位整数和 8 位小数。',
        invalid: '请输入两个有效的十进制数。',
      },
)
const first = ref('0.1')
const second = ref('0.2')
const firstId = useId()
const secondId = useId()
const hintId = useId()
const isDecimal = (value: string) =>
  /^[+-]?(?:\d{1,7}(?:\.\d{0,8})?|\.\d{1,8})$/.test(value)
const result = computed(() => {
  if (!isDecimal(first.value) || !isDecimal(second.value)) return

  const fixed = add(first.value, second.value)
  const native = Number(first.value) + Number(second.value)

  return {
    fixed: fixed.toString(),
    native,
    isFixed: isCurrency(fixed),
    isNative: isCurrency(native),
  }
})
</script>
