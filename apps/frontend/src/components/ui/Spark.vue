<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  seed?: number
  bars?: number
  color?: string
}>(), {
  seed: 42,
  bars: 18,
  color: 'var(--sky)',
})

/* Deterministic sinusoidal generator — same output for same seed */
const heights = computed(() => {
  const out: number[] = []
  for (let i = 0; i < props.bars; i++) {
    const v = 50 + 42 * Math.sin(i * 0.65 + props.seed * 0.37)
            + 18 * Math.sin(i * 1.3 + props.seed * 0.19)
    out.push(Math.max(8, Math.min(100, v)))
  }
  return out
})
</script>

<template>
  <span class="o-spark" aria-hidden="true">
    <span
      v-for="(h, i) in heights"
      :key="i"
      :style="{ height: `${h}%`, background: color }"
    />
  </span>
</template>
