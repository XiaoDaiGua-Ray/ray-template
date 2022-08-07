<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transform" mode="out-in" appear>
      <keep-alive include="Layout">
        <component :is="Component" :key="route" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script lang="ts" setup>
// 带过渡动画 RouterView 组件
// 如果子路由需要做动画切换，则需要此组件
// 为什么必须为 vue 文件，因为 tsx 文件在解析的时候会抛出警告不好看
</script>
