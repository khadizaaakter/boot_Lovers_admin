<template>
  <div class="card p-5 flex items-start gap-4">
    <div
      class="w-11 h-11 rounded-xl flex items-center justify-center"
      :class="iconWrapClass"
    >
      <Icon :name="icon" class="w-5 h-5" :class="iconClass" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-xs font-medium uppercase tracking-wider text-ink-soft">
        {{ label }}
      </p>
      <p class="text-2xl font-display font-bold mt-1">{{ value }}</p>
      <p v-if="delta !== undefined" class="text-xs mt-1 flex items-center gap-1">
        <Icon
          :name="delta >= 0 ? 'ph:trend-up' : 'ph:trend-down'"
          class="w-3.5 h-3.5"
          :class="delta >= 0 ? 'text-green-600' : 'text-red-600'"
        />
        <span :class="delta >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
          {{ delta >= 0 ? '+' : '' }}{{ delta }}%
        </span>
        <span class="text-ink-soft">vs last month</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  delta: Number,
  tone: { type: String, default: 'brand' }
})

const tones = {
  brand: { wrap: 'bg-brand-50', icon: 'text-brand-600' },
  green: { wrap: 'bg-green-50', icon: 'text-green-600' },
  blue: { wrap: 'bg-sky-50', icon: 'text-sky-600' },
  purple: { wrap: 'bg-purple-50', icon: 'text-purple-600' },
  amber: { wrap: 'bg-amber-50', icon: 'text-amber-600' },
  red: { wrap: 'bg-red-50', icon: 'text-red-600' }
}

const iconWrapClass = computed(() => tones[props.tone]?.wrap || tones.brand.wrap)
const iconClass = computed(() => tones[props.tone]?.icon || tones.brand.icon)
</script>
