<template>
  <div class="r-route-transition">
    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <Transition
          :name="transitionPropName"
          :mode="transitionMode"
          :appear="transitionAppear"
        >
          <!-- KeepAlive 必须在 Suspense 外，避免过渡将缓存容器视为同一页面并提前结束退出。 -->
          <KeepAlive
            v-if="getKeepAliveConfig.setupKeepAlive"
            :max="getKeepAliveConfig.maxKeepAliveLength"
            :include="getKeepAliveInclude"
            :exclude="getKeepAliveConfig.keepAliveExclude"
          >
            <Suspense>
              <component :is="frameFor(Component)" :key="route.fullPath">
                <component
                  :is="Component"
                  v-if="refreshingPath !== route.fullPath"
                />
              </component>
            </Suspense>
          </KeepAlive>
          <Suspense v-else>
            <Component
              :is="Component"
              v-if="refreshingPath !== route.fullPath"
              :key="route.fullPath"
            />
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue'
import type { ComponentOptions, Component as PageComponent, VNode } from 'vue'
import { RouterView } from 'vue-router'
import defaults from './transition-defaults'
import type { TransitionProps } from './transition-types'

defineOptions({
  name: 'RTransitionComponent',
})
// 缓存页面外层，以便刷新时单独卸载该地址的内容，并保留其它地址的实例。
const frames = new WeakMap<PageComponent, PageComponent>()

function frameFor(page: VNode) {
  const type = page.type as PageComponent
  let frame = frames.get(type)

  if (!frame) {
    frame = defineComponent({
      name:
        (type as ComponentOptions).name ?? (type as ComponentOptions).__name,
      setup:
        (_, { slots }) =>
        () =>
          slots.default?.()[0],
    })
    frames.set(type, frame)
  }

  return frame
}

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
