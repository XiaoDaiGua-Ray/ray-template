<template>
  <div>
    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <Transition
          :name="transitionPropName"
          :mode="transitionMode"
          :appear="transitionAppear"
        >
          <Suspense>
            <KeepAlive
              v-if="setupKeepAlive"
              :max="maxKeepAliveLength"
              :include="getKeepAliveInclude"
              :exclude="keepAliveExclude"
            >
              <Component :is="Component" :key="route.fullPath" />
            </KeepAlive>
            <Component :is="Component" v-else :key="route.fullPath" />
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>
<script lang="ts" setup>
import { useKeepAliveGetters } from '@/store'
import { APP_KEEP_ALIVE } from '@/app-config'
import props from './props'

import type { TransitionProps } from './types'

/**
 *
 * 使用宏编译模式时，可以使用 defineOptions 声明组件选项
 * 常用方法即是声明该组件的 name inheritAttrs 等属性
 */
defineOptions({
  name: 'RTransitionComponent',
})
withDefaults(defineProps<TransitionProps>(), props)

const { getKeepAliveInclude } = useKeepAliveGetters()
const { setupKeepAlive, maxKeepAliveLength, keepAliveExclude } = APP_KEEP_ALIVE
</script>
