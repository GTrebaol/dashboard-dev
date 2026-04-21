<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import TweaksPanel from './TweaksPanel.vue'
</script>

<template>
  <div
    style="display:grid; grid-template-columns:232px 1fr; min-height:100vh; background:var(--bg);"
  >
    <AppSidebar />
    <div style="min-width:0; display:flex; flex-direction:column;">
      <AppHeader />
      <main style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:var(--gap);">
        <RouterView />
      </main>
    </div>
  </div>
  <TweaksPanel />
</template>
