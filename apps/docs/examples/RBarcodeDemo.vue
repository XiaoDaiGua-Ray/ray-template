<template>
  <div class="ray-demo" :lang="locale ?? 'zh-CN'">
    <div class="ray-demo-fields">
      <div>
        <label :for="textId">{{ copy.text }}</label>
        <input
          :id="textId"
          v-model="text"
          class="ray-demo-input"
          maxlength="24"
          :inputmode="format === 'EAN13' ? 'numeric' : 'text'"
          :aria-describedby="hintId"
          :aria-invalid="Boolean(text && failed)"
        />
      </div>
      <fieldset>
        <legend>{{ copy.format }}</legend>
        <div class="ray-demo-options ray-demo-native-options">
          <label
            v-for="item in formats"
            :key="item"
            :for="`${formatName}-${item}`"
          >
            <input
              :id="`${formatName}-${item}`"
              v-model="format"
              type="radio"
              :name="formatName"
              :value="item"
            />
            {{ item }}
          </label>
        </div>
      </fieldset>
    </div>
    <p :id="hintId" class="ray-demo-hint" aria-live="polite">
      {{ !text ? copy.empty : failed ? copy.invalid : '' }}
      {{ format === 'EAN13' ? copy.ean : '' }}
    </p>
    <div
      v-if="text"
      v-show="!failed"
      class="ray-demo-barcode"
      role="img"
      :aria-label="`${format}: ${text}`"
    >
      <RBarcode
        :text="text"
        :format="format"
        :options="options"
        barcodeRender="svg"
        @success="failed = false"
        @error="failed = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RBarcode } from '@ray-template/ui/barcode'
import { computed, ref, useId } from 'vue'

const props = defineProps<{ locale?: 'zh-CN' | 'en' }>()
const copy = computed(() =>
  props.locale === 'en'
    ? {
        text: 'Barcode text',
        format: 'Format',
        empty: 'Enter text to generate a barcode.',
        invalid: 'This text is invalid for the selected format.',
        ean: 'Try 590123412345: EAN-13 takes 12 digits or 13 with a valid check digit.',
      }
    : {
        text: '条码文本',
        format: '条码制式',
        empty: '输入文本后生成条码。',
        invalid: '这段文本不符合当前制式。',
        ean: '可试试 590123412345：EAN-13 接受 12 位数字，或附带正确校验位的 13 位数字。',
      },
)
const textId = useId()
const hintId = useId()
const formatName = useId()
const formats = ['CODE128', 'CODE39', 'EAN13'] as const
const format = ref<(typeof formats)[number]>('CODE128')
const text = ref('RAY-2026')
const failed = ref(false)
const options = {
  width: 1.5,
  height: 52,
  background: '#fff',
  lineColor: '#111',
}
</script>
