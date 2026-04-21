<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useTweaks } from '@/composables/useTweaks'
import { useTheme } from '@/composables/useTheme'
import type { Accent, Density, Layout, BgTone } from '@/composables/useTweaks'

const tweaks = useTweaks()
const { theme, toggle } = useTheme()

const accentOptions: { value: Accent; label: string }[] = [
  { value: 'brand', label: 'Brand' },
  { value: 'sky',   label: 'Sky'   },
]

const densityOptions: { value: Density; label: string }[] = [
  { value: 'compact',  label: 'Compact'  },
  { value: 'balanced', label: 'Balanced' },
  { value: 'comfy',    label: 'Comfy'    },
]

const layoutOptions: { value: Layout; label: string }[] = [
  { value: 'focus', label: 'Focus' },
  { value: 'stack', label: 'Stack' },
  { value: '3col',  label: '3-col' },
]

const bgOptions: { value: BgTone; label: string }[] = [
  { value: 'true', label: 'True' },
  { value: 'dim',  label: 'Dim'  },
  { value: 'warm', label: 'Warm' },
]

const panelLabels: { key: keyof typeof tweaks.panels; label: string }[] = [
  { key: 'mrs',       label: 'Merge Reqs'  },
  { key: 'tasks',     label: 'Tasks'       },
  { key: 'quality',   label: 'Quality'     },
  { key: 'pipelines', label: 'Pipelines'   },
  { key: 'activity',  label: 'Activity'    },
  { key: 'pins',      label: 'Pins'        },
]
</script>

<template>
  <Transition name="tweaks-slide">
    <div v-if="tweaks.open" class="tweaks">
      <!-- Header -->
      <div class="tweaks-head">
        <span>Tweaks</span>
        <button class="o-icon-btn" style="margin-left:auto;" @click="tweaks.open = false">
          <X style="width:13px; height:13px;" />
        </button>
      </div>

      <div class="tweaks-body">

        <!-- Theme -->
        <div class="tweak">
          <span class="tweak-label">Theme</span>
          <div class="tweak-row">
            <button :class="{ on: theme === 'dark' }" @click="theme !== 'dark' && toggle()">Dark</button>
            <button :class="{ on: theme === 'light' }" @click="theme !== 'light' && toggle()">Light</button>
          </div>
        </div>

        <!-- Accent -->
        <div class="tweak">
          <span class="tweak-label">Accent</span>
          <div class="tweak-row">
            <button
              v-for="opt in accentOptions"
              :key="opt.value"
              :class="{ on: tweaks.accent === opt.value }"
              @click="tweaks.accent = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>

        <!-- Density -->
        <div class="tweak">
          <span class="tweak-label">Density</span>
          <div class="tweak-row">
            <button
              v-for="opt in densityOptions"
              :key="opt.value"
              :class="{ on: tweaks.density === opt.value }"
              @click="tweaks.density = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>

        <!-- Layout -->
        <div class="tweak">
          <span class="tweak-label">Layout</span>
          <div class="tweak-row">
            <button
              v-for="opt in layoutOptions"
              :key="opt.value"
              :class="{ on: tweaks.layout === opt.value }"
              @click="tweaks.layout = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>

        <!-- Background tone -->
        <div class="tweak">
          <span class="tweak-label">Background</span>
          <div class="tweak-row">
            <button
              v-for="opt in bgOptions"
              :key="opt.value"
              :class="{ on: tweaks.bgTone === opt.value }"
              @click="tweaks.bgTone = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>

        <!-- Panels visibility -->
        <div class="tweak">
          <span class="tweak-label">Panels</span>
          <div class="tweak-toggles">
            <label v-for="p in panelLabels" :key="p.key">
              <input
                type="checkbox"
                :checked="tweaks.panels[p.key]"
                @change="tweaks.panels[p.key] = ($event.target as HTMLInputElement).checked"
              />
              <span>{{ p.label }}</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tweaks-slide-enter-active,
.tweaks-slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.tweaks-slide-enter-from,
.tweaks-slide-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
</style>
