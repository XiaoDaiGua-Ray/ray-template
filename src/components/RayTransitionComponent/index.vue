<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition
        :name="transitionPropName"
        :mode="transitionMode"
        :appear="transitionAppear"
      >
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
</template>
<script lang="ts" setup>
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
// 带过渡动画 `RouterView` 组件
// 如果子路由需要做动画切换，则需要此组件
// 为什么必须为 `vue` 文件，因为 `tsx` 文件在解析的时候会抛出警告不好看
// 只需要像使用 `RouterView` 组件时一样使用即可, 但是不能对于子路由生效, 所以需要在子路由显示的地方替换 `RouterView` 组件
</script>
