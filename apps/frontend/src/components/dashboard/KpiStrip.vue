<script setup lang="ts">
import Spark from '@/components/ui/Spark.vue'

const props = defineProps<{
  stats: {
    mrsOuvertes: number
    mrsPipelinesKo: number
    ticketsActifs: number
    ticketsEnCours: number
    mepsActives: number
    mepsEnCours: number
    alertesSonar: number
    totalSonar: number
  }
  loading: boolean
}>()
</script>

<template>
  <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--gap);">

    <!-- Open MRs -->
    <div class="o-kpi">
      <span class="o-kpi-label">Open MRs</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:8px;">
        <span v-if="loading" style="display:block; width:40px; height:26px; background:var(--bg-2); border-radius:3px; animation:pulse 1.5s infinite;" />
        <span v-else class="o-kpi-value">{{ stats.mrsOuvertes }}</span>
        <Spark :seed="stats.mrsOuvertes * 7 + 1" style="width:80px;" />
      </div>
      <span class="o-kpi-sub">{{ stats.mrsPipelinesKo }} pipeline{{ stats.mrsPipelinesKo !== 1 ? 's' : '' }} KO</span>
    </div>

    <!-- Running pipes -->
    <div class="o-kpi">
      <span class="o-kpi-label">Running pipes</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:8px;">
        <span v-if="loading" style="display:block; width:40px; height:26px; background:var(--bg-2); border-radius:3px; animation:pulse 1.5s infinite;" />
        <span v-else class="o-kpi-value">{{ stats.mrsPipelinesKo }}</span>
        <Spark :seed="stats.mrsPipelinesKo * 13 + 3" style="width:80px;" />
      </div>
      <span class="o-kpi-sub">en cours ou bloqués</span>
    </div>

    <!-- Quality gate -->
    <div class="o-kpi">
      <span class="o-kpi-label">Quality gate</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:8px;">
        <span v-if="loading" style="display:block; width:40px; height:26px; background:var(--bg-2); border-radius:3px; animation:pulse 1.5s infinite;" />
        <span v-else class="o-kpi-value" :style="{ color: stats.alertesSonar > 0 ? 'var(--amber)' : 'var(--lime)' }">
          {{ stats.alertesSonar > 0 ? 'WARN' : 'OK' }}
        </span>
        <Spark :seed="stats.alertesSonar * 11 + 5" color="var(--amber)" style="width:80px;" />
      </div>
      <span class="o-kpi-sub">{{ stats.alertesSonar }}/{{ stats.totalSonar }} projet{{ stats.totalSonar !== 1 ? 's' : '' }} en alerte</span>
    </div>

    <!-- My tasks -->
    <div class="o-kpi">
      <span class="o-kpi-label">My tasks</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:8px;">
        <span v-if="loading" style="display:block; width:40px; height:26px; background:var(--bg-2); border-radius:3px; animation:pulse 1.5s infinite;" />
        <span v-else class="o-kpi-value">{{ stats.ticketsActifs }}</span>
        <Spark :seed="stats.ticketsActifs * 9 + 2" style="width:80px;" />
      </div>
      <span class="o-kpi-sub">{{ stats.ticketsEnCours }} en cours</span>
    </div>

  </div>
</template>
