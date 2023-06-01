<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition
        :name="transitionPropName"
        :mode="transitionMode"
        :appear="transitionAppear"
      >
        <keep-alive
          v-if="setupKeepAlive"
          :max="maxKeepAliveLength"
          :include="keepAliveInclude"
          :exclude="keepAliveExclude"
        >
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component :is="Component" v-else :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
</template>
<script lang="ts" setup>
import { useKeepAlive } from '@/store'
import { APP_KEEP_ALIVE } from '@/appConfig/appConfig'

import type { PropType } from 'vue'

defineProps({
  transitionPropName: {
    type: String,
    default: 'fade',
  },
  transitionMode: {
    type: String as PropType<'default' | 'out-in' | 'in-out' | undefined>,
    default: 'out-in',
  },
  transitionAppear: {
    type: Boolean,
    default: true,
  },
})

const keepAliveStore = useKeepAlive()
const { keepAliveInclude } = storeToRefs(keepAliveStore)
const { setupKeepAlive, maxKeepAliveLength, keepAliveExclude } = APP_KEEP_ALIVE
</script>
