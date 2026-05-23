<template>
  <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none" class="w-full h-full">
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.35" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="areaPath" :fill="`url(#${gradId})`" />
    <path :d="linePath" :stroke="color" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  data: { type: Array, default: () => [] },
  color: { type: String, default: '#f59222' },
  width: { type: Number, default: 300 },
  height: { type: Number, default: 80 }
})

const uid = Math.random().toString(36).slice(2, 9)
const gradId = `spark-${uid}`

const points = computed(() => {
  if (!props.data.length) return []
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1
  return props.data.map((v, i) => {
    const x = (i / (props.data.length - 1)) * props.width
    const y = props.height - ((v - min) / range) * (props.height - 4) - 2
    return [x, y]
  })
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
)
const areaPath = computed(() => {
  if (!points.value.length) return ''
  const path = points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const last = points.value[points.value.length - 1]
  return `${path} L ${last[0]} ${props.height} L 0 ${props.height} Z`
})
</script>
