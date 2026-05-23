<template>
  <div>
    <PageHeader title="Reports" subtitle="Sales trends, traffic and conversion at a glance.">
      <template #actions>
        <select class="input max-w-[180px]">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
        </select>
        <button class="btn-primary">
          <Icon name="ph:download-simple" class="w-4 h-4" />
          Download PDF
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="card p-5">
        <p class="text-xs text-ink-soft">Revenue</p>
        <p class="text-2xl font-display font-bold mt-1">$48,290</p>
        <div class="h-12 mt-3"><SparkLine :data="series.revenueSpark" color="#f59222" /></div>
      </div>
      <div class="card p-5">
        <p class="text-xs text-ink-soft">Orders</p>
        <p class="text-2xl font-display font-bold mt-1">1,284</p>
        <div class="h-12 mt-3"><SparkLine :data="series.ordersSpark" color="#0ea5e9" /></div>
      </div>
      <div class="card p-5">
        <p class="text-xs text-ink-soft">Customers</p>
        <p class="text-2xl font-display font-bold mt-1">2,892</p>
        <div class="h-12 mt-3"><SparkLine :data="series.customersSpark" color="#16a34a" /></div>
      </div>
      <div class="card p-5">
        <p class="text-xs text-ink-soft">Refunds</p>
        <p class="text-2xl font-display font-bold mt-1">$642</p>
        <div class="h-12 mt-3"><SparkLine :data="series.refundsSpark" color="#dc2626" /></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="card p-5">
        <h3 class="font-display text-lg font-semibold mb-1">Monthly Revenue</h3>
        <p class="text-xs text-ink-soft mb-4">Compared to previous year</p>
        <BarChart :data="series.monthlySales" :labels="series.monthLabels" />
      </div>
      <div class="card p-5">
        <h3 class="font-display text-lg font-semibold mb-1">Sales by Category</h3>
        <p class="text-xs text-ink-soft mb-4">Share of revenue this month</p>
        <div class="space-y-3">
          <div v-for="c in categoryShare" :key="c.name">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ c.name }}</span>
              <span class="text-ink-soft">{{ c.percent }}%</span>
            </div>
            <div class="h-2 rounded-full bg-black/5 overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{ width: c.percent + '%', backgroundColor: c.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="font-display text-lg font-semibold mb-3">Top Performing Products</h3>
      <table class="table-base">
        <thead>
          <tr>
            <th>Product</th>
            <th class="text-right">Units sold</th>
            <th class="text-right">Revenue</th>
            <th class="text-right">Avg. rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in top" :key="p.id">
            <td>
              <div class="flex items-center gap-3">
                <img :src="p.image" class="w-9 h-9 rounded-lg object-cover bg-cream" />
                <p class="font-medium">{{ p.name }}</p>
              </div>
            </td>
            <td class="text-right">{{ p.sales }}</td>
            <td class="text-right font-semibold">{{ formatMoney(p.sales * p.price) }}</td>
            <td class="text-right">
              <Icon name="ph:star-fill" class="inline w-3.5 h-3.5 text-amber-500" />
              {{ p.rating || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const { state, formatMoney } = useAdminData()
const series = useDashboardSeries()

const top = computed(() => [...state.products].sort((a, b) => b.sales - a.sales).slice(0, 6))

const categoryShare = computed(() => {
  const colors = ['#f59222', '#0ea5e9', '#16a34a', '#a855f7', '#f43f5e', '#eab308']
  const totals = {}
  state.products.forEach((p) => {
    totals[p.category] = (totals[p.category] || 0) + p.sales * p.price
  })
  const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1
  return Object.entries(totals).map(([name, v], i) => ({
    name,
    percent: Math.round((v / total) * 100),
    color: colors[i % colors.length]
  }))
})
</script>
