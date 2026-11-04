<template>
  <RouteTransition
    v-bind="$props"
    :getKeepAliveConfig="getKeepAliveConfig"
    :getKeepAliveInclude="getKeepAliveInclude"
  />
</template>
<script lang="ts" setup>
import { useKeepAliveGetters, useSettingGetters } from '@/store'
import { RouteTransition } from '@ray-template/admin-shell'
import defaults from './props'
import type { TransitionProps } from './types'

defineOptions({ name: 'RTransitionComponent' })
withDefaults(defineProps<TransitionProps>(), defaults)
const { getKeepAliveInclude } = useKeepAliveGetters()
const { getKeepAliveConfig } = useSettingGetters()
</script>
