<template>
  <div class="r-route-transition">
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
import { RouterView } from 'vue-router'
import defaults from './transition-defaults'
import type { TransitionProps } from './transition-types'

defineOptions({
  name: 'RTransitionComponent',
})
withDefaults(
  defineProps<
    TransitionProps & {
      getKeepAliveConfig: {
        setupKeepAlive: boolean
        maxKeepAliveLength: number
        keepAliveExclude: string[]
      }
      getKeepAliveInclude: string[]
    }
  >(),
  defaults,
)
</script>
