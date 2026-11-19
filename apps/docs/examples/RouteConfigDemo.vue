<template>
  <div class="ray-demo ray-demo-fields">
    <div>
      <label :for="id">{{
        english ? 'Route configuration' : '路由配置'
      }}</label>
      <textarea
        :id="id"
        v-model="source"
        rows="8"
        spellcheck="false"
        :aria-invalid="result.invalid"
      />
      <output class="ray-demo-result">{{ result.message }}</output>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createRouteContract } from '@ray-template/routing'
import { useData } from 'vitepress'
import { computed, ref, useId } from 'vue'

const { lang } = useData()
const english = computed(() => lang.value.startsWith('en'))
const load = async () => ({})
const { parseRouteConfig } = createRouteContract({
  layout: load,
  managementPath: '/route-management',
  findRouteView: (view) =>
    view === 'overview' ? { name: 'Overview', load } : void 0,
  findRouteViewId: (candidate) => (candidate === load ? 'overview' : void 0),
})
const id = useId()
const source = ref(
  JSON.stringify(
    {
      version: 1,
      routes: [
        {
          path: '/overview',
          component: 'overview',
          name: 'Overview',
          meta: {},
        },
      ],
    },
    null,
    2,
  ),
)
const result = computed(() => {
  try {
    const { routes } = parseRouteConfig(source.value)

    return {
      invalid: false,
      message: `${english.value ? 'Valid routes' : '有效路由'}: ${routes.length}`,
    }
  } catch (error) {
    return {
      invalid: true,
      message: error instanceof Error ? error.message : String(error),
    }
  }
})
</script>

<style scoped>
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  resize: vertical;
}
</style>
