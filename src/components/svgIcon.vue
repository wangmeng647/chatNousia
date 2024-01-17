<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IconifyIcon } from '@iconify/vue'

interface Props {
  icon: string | IconifyIcon
}

defineProps<Props>()
</script>

<template>
  <Icon :icon="icon" />
</template>
