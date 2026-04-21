<script setup lang="ts">
import { ref } from 'vue'
import { GripVertical } from 'lucide-vue-next'

const props = defineProps<{ panelId: string }>()
const emit = defineEmits<{ swap: [from: string, to: string] }>()

const isDragging = ref(false)
const isOver = ref(false)

function onDragStart(e: DragEvent) {
  isDragging.value = true
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', props.panelId)
}

function onDragEnd() {
  isDragging.value = false
  isOver.value = false
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  isOver.value = true
}

function onDragLeave(e: DragEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) {
    isOver.value = false
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isOver.value = false
  const fromId = e.dataTransfer?.getData('text/plain') ?? ''
  if (fromId && fromId !== props.panelId) {
    emit('swap', fromId, props.panelId)
  }
}
</script>

<template>
  <div
    class="panel-wrap"
    :class="{ 'is-dragging': isDragging, 'is-over': isOver }"
    :draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="panel-handle" title="Déplacer">
      <GripVertical style="width:13px; height:13px;" />
    </div>
    <div style="flex:1; min-width:0;">
      <slot />
    </div>
  </div>
</template>
