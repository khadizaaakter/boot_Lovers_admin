<template>
  <span :class="chipClass">
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="dotClass"
    ></span>
    {{ label || status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  status: String,
  label: String
})

const map = {
  active: { chip: 'chip-success', dot: 'bg-green-500' },
  published: { chip: 'chip-success', dot: 'bg-green-500' },
  paid: { chip: 'chip-success', dot: 'bg-green-500' },
  delivered: { chip: 'chip-success', dot: 'bg-green-500' },
  shipped: { chip: 'chip-info', dot: 'bg-sky-500' },
  processing: { chip: 'chip-info', dot: 'bg-sky-500' },
  pending: { chip: 'chip-warning', dot: 'bg-amber-500' },
  draft: { chip: 'chip-muted', dot: 'bg-gray-400' },
  unpaid: { chip: 'chip-warning', dot: 'bg-amber-500' },
  refunded: { chip: 'chip-muted', dot: 'bg-gray-400' },
  cancelled: { chip: 'chip-danger', dot: 'bg-red-500' },
  outofstock: { chip: 'chip-danger', dot: 'bg-red-500' },
  lowstock: { chip: 'chip-warning', dot: 'bg-amber-500' },
  instock: { chip: 'chip-success', dot: 'bg-green-500' }
}

const key = computed(() => (props.status || '').toLowerCase().replace(/\s+/g, ''))
const chipClass = computed(() => map[key.value]?.chip || 'chip-muted')
const dotClass = computed(() => map[key.value]?.dot || 'bg-gray-400')
</script>
