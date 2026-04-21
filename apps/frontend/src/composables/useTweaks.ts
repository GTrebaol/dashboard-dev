import { reactive, watchEffect } from 'vue'

export type Accent  = 'brand' | 'sky'
export type Density = 'compact' | 'balanced' | 'comfy'
export type Layout  = 'focus' | 'stack' | '3col'
export type BgTone  = 'true' | 'dim' | 'warm'

export interface PanelVisibility {
  mrs:       boolean
  tasks:     boolean
  quality:   boolean
  pipelines: boolean
  activity:  boolean
  pins:      boolean
}

interface TweaksState {
  open:    boolean
  accent:  Accent
  density: Density
  layout:  Layout
  bgTone:  BgTone
  panels:  PanelVisibility
}

function load(): Partial<TweaksState> {
  try { return JSON.parse(localStorage.getItem('orbit-tweaks') ?? '{}') } catch { return {} }
}

const saved = load()

export const tweaks = reactive<TweaksState>({
  open:    false,
  accent:  saved.accent  ?? 'brand',
  density: saved.density ?? 'balanced',
  layout:  saved.layout  ?? 'focus',
  bgTone:  saved.bgTone  ?? 'true',
  panels:  {
    mrs: true, tasks: true, quality: true,
    pipelines: true, activity: true, pins: true,
    ...saved.panels,
  },
})

watchEffect(() => {
  const el = document.documentElement

  /* accent */
  if (tweaks.accent === 'sky') el.dataset.accent = 'sky'
  else delete el.dataset.accent

  /* density */
  if (tweaks.density !== 'balanced') el.dataset.density = tweaks.density
  else delete el.dataset.density

  /* bg tone */
  if (tweaks.bgTone !== 'true') el.dataset.bg = tweaks.bgTone
  else delete el.dataset.bg

  /* persist (exclude open state) */
  const { open: _open, ...toSave } = tweaks
  localStorage.setItem('orbit-tweaks', JSON.stringify(toSave))
})

export function useTweaks() {
  return tweaks
}
