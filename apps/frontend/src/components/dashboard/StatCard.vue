<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  description: string
  icon: Component
  loading?: boolean
}>()
</script>

<template>
  <div class="rounded-lg border bg-card p-6">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
      <component :is="icon" class="h-4 w-4 text-muted-foreground" />
    </div>
    <div v-if="loading" class="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
    <div v-else class="text-2xl font-bold tracking-tight">{{ value }}</div>
    <p class="text-xs text-muted-foreground mt-1">{{ description }}</p>
  </div>
</template>
