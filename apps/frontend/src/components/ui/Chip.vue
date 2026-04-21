<script setup lang="ts">
type Variant = 'sky' | 'lime' | 'amber' | 'red' | 'violet' | 'default'

const props = withDefaults(defineProps<{
  variant?: Variant
  dot?: boolean
}>(), {
  variant: 'default',
  dot: true,
})
</script>

<template>
  <span :class="['o-chip', variant !== 'default' && `o-chip-${variant}`]">
    <span v-if="dot" class="dot" />
    <slot />
  </span>
</template>
