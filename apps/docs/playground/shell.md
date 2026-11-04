---
layout: page
navbar: false
sidebar: false
footer: false
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ShellDemo = defineClientComponent(() => import('../examples/ShellDemo.vue'))
</script>

<ShellDemo />
