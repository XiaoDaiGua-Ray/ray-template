<template>
  <DemoFrame>
    <div class="ray-demo">
      <RCollapseGrid
        :open="open"
        :cols="2"
        :collapsedRows="1"
        :collapseToggleText="copy.toggle"
        @update:open="(collapsed) => (open = !collapsed)"
      >
        <NGridItem v-for="field in fields" :key="field">
          <NInput
            v-model:value="filters[field]"
            :placeholder="copy.fields[field]"
            :aria-label="copy.fields[field]"
          />
        </NGridItem>
        <template #action>
          <NButton type="primary" @click="submitted = { ...filters }">{{
            copy.search
          }}</NButton>
        </template>
      </RCollapseGrid>
      <output class="ray-demo-result">{{ submitted ?? copy.hint }}</output>
    </div>
  </DemoFrame>
</template>

<script setup lang="ts">
import { RCollapseGrid } from '@ray-template/ui/collapse-grid'
import { NButton, NGridItem, NInput } from 'naive-ui'
import { useData } from 'vitepress'
import { computed, reactive, ref } from 'vue'
import DemoFrame from './DemoFrame.vue'

const fields = ['name', 'department', 'role', 'id'] as const
const filters = reactive({ name: '', department: '', role: '', id: '' })
const { lang } = useData()
const copy = computed(() =>
  lang.value.startsWith('en')
    ? {
        fields: {
          name: 'Name',
          department: 'Department',
          role: 'Role',
          id: 'ID',
        },
        toggle: ['Expand', 'Collapse'] as [string, string],
        search: 'Search',
        hint: 'Expand to show more filters.',
      }
    : {
        fields: { name: '姓名', department: '部门', role: '岗位', id: '编号' },
        toggle: ['展开', '收起'] as [string, string],
        search: '查询',
        hint: '展开后可填写更多条件',
      },
)
const open = ref(false)
const submitted = ref<typeof filters>()
</script>
