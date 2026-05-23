<template>
  <div class="w-full">
    <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none" class="w-full" :style="{ height: height + 'px' }">
      <line
        v-for="g in 4"
        :key="g"
        :x1="0"
        :x2="width"
        :y1="(height / 4) * g"
        :y2="(height / 4) * g"
        stroke="#00000010"
        stroke-dasharray="3 4"
      />
      <g v-for="(d, i) in data" :key="i">
        <rect
          :x="i * step + step * 0.2"
          :y="height - bar(d)"
          :width="step * 0.6"
          :height="bar(d)"
          :fill="color"
          rx="4"
        />
      </g>
    </svg>
    <div v-if="labels?.length" class="flex justify-between mt-2 text-[10px] text-ink-soft px-1">
      <span v-for="l in labels" :key="l">{{ l }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  data: { type: Array, default: () => [] },
  labels: { type: Array, default: () => [] },
  color: { type: String, default: '#f59222' },
  width: { type: Number, default: 600 },
  height: { type: Number, default: 200 }
})

const step = computed(() => props.width / (props.data.length || 1))
const max = computed(() => Math.max(...props.data, 1))
const bar = (v) => (v / max.value) * (props.height - 10)
</script>
