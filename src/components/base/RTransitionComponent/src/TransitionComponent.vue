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
              v-if="getKeepAliveConfig.setupKeepAlive"
              :max="getKeepAliveConfig.maxKeepAliveLength"
              :include="getKeepAliveInclude"
              :exclude="getKeepAliveConfig.keepAliveExclude"
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
import { useKeepAliveGetters, useSettingGetters } from '@/store'
import props from './props'
import type { TransitionProps } from './types'

defineOptions({
  name: 'RTransitionComponent',
})
withDefaults(defineProps<TransitionProps>(), props)

const { getKeepAliveInclude } = useKeepAliveGetters()
const { getKeepAliveConfig } = useSettingGetters()
</script>
