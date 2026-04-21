<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Bell, SlidersHorizontal, ChevronRight, Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import { useTweaks } from '@/composables/useTweaks'

const route = useRoute()
const { theme, toggle } = useTheme()
const tweaks = useTweaks()

const crumbs: Record<string, string[]> = {
  '/dashboard': ['orbit', 'Overview'],
  '/gists':     ['orbit', 'Snippets'],
}

const segments = crumbs[route.path] ?? ['orbit', route.path.replace('/', '')]
</script>

<template>
  <header
    style="height:56px; display:flex; align-items:center; gap:12px; padding:0 24px; border-bottom:1px solid var(--oborder); position:sticky; top:0; background:var(--bg); z-index:10; flex-shrink:0;"
  >
    <!-- Breadcrumbs -->
    <nav style="display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:13px;" class="mono">
      <template v-for="(seg, i) in segments" :key="seg">
        <span :style="{ color: i === segments.length - 1 ? 'var(--text)' : 'var(--text-faint)' }">{{ seg }}</span>
        <ChevronRight v-if="i < segments.length - 1" style="width:12px; height:12px; color:var(--text-faint);" />
      </template>
    </nav>

    <!-- Command palette placeholder -->
    <div
      style="margin-left:auto; display:flex; align-items:center; gap:8px; padding:6px 10px; background:var(--bg-1); border:1px solid var(--oborder); border-radius:6px; min-width:240px; font-size:12.5px; color:var(--text-mute); cursor:text;"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <span>Rechercher…</span>
      <kbd class="mono" style="margin-left:auto; font-size:10.5px; padding:1px 5px; background:var(--bg-2); border:1px solid var(--oborder); border-radius:3px; color:var(--text-dim);">⌘K</kbd>
    </div>

    <!-- Actions cluster -->
    <div style="display:flex; gap:6px;">
      <button class="o-icon-btn" :title="theme === 'dark' ? 'Mode clair' : 'Mode sombre'" @click="toggle">
        <Sun v-if="theme === 'dark'" style="width:14px; height:14px;" />
        <Moon v-else style="width:14px; height:14px;" />
      </button>
      <button class="o-icon-btn" title="Notifications">
        <Bell style="width:14px; height:14px;" />
      </button>
      <button
        class="o-icon-btn"
        :style="{ color: tweaks.open ? 'var(--brand)' : undefined }"
        title="Tweaks"
        @click="tweaks.open = !tweaks.open"
      >
        <SlidersHorizontal style="width:14px; height:14px;" />
      </button>
    </div>
  </header>
</template>
