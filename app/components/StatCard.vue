<template>
  <div class="card p-3 sm:p-5 flex items-start gap-3 sm:gap-4">
    <div
      class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
      :class="iconWrapClass"
    >
      <Icon :name="icon" class="w-4 h-4 sm:w-5 sm:h-5" :class="iconClass" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-ink-soft truncate">
        {{ label }}
      </p>
      <p class="text-lg sm:text-2xl font-display font-bold mt-0.5 sm:mt-1 truncate">{{ value }}</p>
      <p v-if="delta !== undefined" class="text-[10px] sm:text-xs mt-1 flex items-center gap-1 flex-wrap">
        <Icon
          :name="delta >= 0 ? 'ph:trend-up' : 'ph:trend-down'"
          class="w-3 h-3 sm:w-3.5 sm:h-3.5"
          :class="delta >= 0 ? 'text-green-600' : 'text-red-600'"
        />
        <span :class="delta >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
          {{ delta >= 0 ? '+' : '' }}{{ delta }}%
        </span>
        <span class="text-ink-soft hidden sm:inline">vs last month</span>
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
