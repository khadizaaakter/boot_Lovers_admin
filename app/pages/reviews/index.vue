<template>
  <div>
    <PageHeader title="Reviews" subtitle="What customers are saying about Boot Lovers." />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="card p-5">
        <p class="text-xs uppercase tracking-wider text-ink-soft">Average rating</p>
        <p class="text-4xl font-display font-bold mt-1">{{ avg.toFixed(1) }}</p>
        <div class="flex gap-0.5 mt-1">
          <Icon
            v-for="i in 5"
            :key="i"
            :name="i <= Math.round(avg) ? 'ph:star-fill' : 'ph:star'"
            class="w-4 h-4 text-amber-500"
          />
        </div>
        <p class="text-xs text-ink-soft mt-2">Based on {{ state.reviews.length }} reviews</p>
      </div>
      <div class="card p-5 md:col-span-2">
        <p class="text-xs uppercase tracking-wider text-ink-soft mb-3">Rating breakdown</p>
        <div v-for="r in 5" :key="r" class="flex items-center gap-3 mb-1.5">
          <span class="text-xs w-6">{{ 6 - r }} ★</span>
          <div class="flex-1 h-2 rounded-full bg-black/5 overflow-hidden">
            <div
              class="h-full bg-amber-500 rounded-full"
              :style="{ width: ((breakdown[6 - r] || 0) / state.reviews.length * 100) + '%' }"
            ></div>
          </div>
          <span class="text-xs w-8 text-right text-ink-soft">{{ breakdown[6 - r] || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-black/5 flex items-center justify-between">
        <h3 class="font-display text-lg font-semibold">All Reviews</h3>
        <select v-model="statusFilter" class="input max-w-[180px]">
          <option value="">All statuses</option>
          <option>Published</option>
          <option>Pending</option>
        </select>
      </div>
      <ul class="divide-y divide-black/5">
        <li v-for="r in filtered" :key="r.id" class="px-5 py-5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-medium">{{ r.customer }}</p>
                <span class="text-xs text-ink-soft">·</span>
                <p class="text-xs text-ink-soft">{{ r.date }}</p>
              </div>
              <div class="flex gap-0.5 mt-1">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  :name="i <= r.rating ? 'ph:star-fill' : 'ph:star'"
                  class="w-3.5 h-3.5 text-amber-500"
                />
              </div>
              <p class="text-sm mt-2 leading-relaxed">"{{ r.comment }}"</p>
              <p class="text-xs text-brand mt-2">{{ r.product }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <StatusChip :status="r.status" />
              <div class="flex gap-1">
                <button class="btn-ghost p-1.5"><Icon name="ph:check" class="w-4 h-4 text-success" /></button>
                <button class="btn-ghost p-1.5"><Icon name="ph:trash" class="w-4 h-4 text-danger" /></button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const { state } = useAdminData()
const statusFilter = ref('')

const avg = computed(() =>
  state.reviews.reduce((s, r) => s + r.rating, 0) / (state.reviews.length || 1)
)

const breakdown = computed(() => {
  const m = {}
  state.reviews.forEach((r) => (m[r.rating] = (m[r.rating] || 0) + 1))
  return m
})

const filtered = computed(() =>
  statusFilter.value ? state.reviews.filter((r) => r.status === statusFilter.value) : state.reviews
)
</script>
