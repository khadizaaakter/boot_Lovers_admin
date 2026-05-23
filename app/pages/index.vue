<template>
  <div>
    <PageHeader
      title="Dashboard"
      subtitle="Welcome back, Admin. Here's what's happening with Boot Lovers today."
    >
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:calendar-blank" class="w-4 h-4" />
          Last 30 days
        </button>
        <button class="btn-primary">
          <Icon name="ph:download-simple" class="w-4 h-4" />
          Export
        </button>
      </template>
    </PageHeader>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Revenue" value="$48,290" icon="ph:currency-dollar" tone="brand" :delta="12.4" />
      <StatCard label="Orders" value="1,284" icon="ph:receipt" tone="blue" :delta="8.1" />
      <StatCard label="New Customers" value="318" icon="ph:user-plus" tone="green" :delta="6.3" />
      <StatCard label="Refunds" value="$642" icon="ph:arrow-u-up-left" tone="red" :delta="-2.4" />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="card p-4 sm:p-5 lg:col-span-2">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 class="font-display text-lg font-semibold">Sales Overview</h3>
            <p class="text-xs text-ink-soft">Monthly gross revenue this year</p>
          </div>
          <div class="flex gap-1 text-xs self-start sm:self-auto">
            <button class="px-2.5 py-1 rounded-md bg-brand text-white">12M</button>
            <button class="px-2.5 py-1 rounded-md hover:bg-black/5">6M</button>
            <button class="px-2.5 py-1 rounded-md hover:bg-black/5">30D</button>
            <button class="px-2.5 py-1 rounded-md hover:bg-black/5">7D</button>
          </div>
        </div>
        <BarChart :data="series.monthlySales" :labels="series.monthLabels" />
      </div>

      <div class="card p-4 sm:p-5">
        <div class="flex items-center justify-between mb-4 gap-3">
          <div class="min-w-0">
            <h3 class="font-display text-lg font-semibold">Traffic</h3>
            <p class="text-xs text-ink-soft">Visitors this week</p>
          </div>
          <span class="chip-success shrink-0">+18%</span>
        </div>
        <div class="h-40">
          <SparkLine :data="series.weeklyVisitors" color="#16a34a" />
        </div>
        <div class="grid grid-cols-7 mt-2 text-[10px] text-ink-soft text-center">
          <span v-for="l in series.weekLabels" :key="l">{{ l }}</span>
        </div>
        <div class="grid grid-cols-2 mt-5 gap-3">
          <div class="rounded-xl bg-cream-soft p-3">
            <p class="text-xs text-ink-soft">Sessions</p>
            <p class="text-lg font-display font-bold mt-0.5">7,742</p>
          </div>
          <div class="rounded-xl bg-cream-soft p-3">
            <p class="text-xs text-ink-soft">Conversion</p>
            <p class="text-lg font-display font-bold mt-0.5">3.84%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent orders -->
      <div class="card lg:col-span-2 overflow-hidden">
        <div class="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-black/5">
          <h3 class="font-display text-lg font-semibold">Recent Orders</h3>
          <NuxtLink to="/orders" class="text-sm text-brand hover:underline">View all</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="table-base">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th class="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in state.orders.slice(0, 6)" :key="o.id">
                <td>
                  <NuxtLink :to="`/orders/${encodeURIComponent(o.id)}`" class="font-medium hover:text-brand">
                    {{ o.id }}
                  </NuxtLink>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-semibold">
                      {{ o.customer.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium truncate">{{ o.customer }}</p>
                      <p class="text-xs text-ink-soft truncate">{{ o.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="font-semibold">{{ formatMoney(o.total) }}</td>
                <td><StatusChip :status="o.status" /></td>
                <td class="text-right text-ink-soft">{{ o.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top products -->
      <div class="card overflow-hidden">
        <div class="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-black/5">
          <h3 class="font-display text-lg font-semibold">Top Products</h3>
          <NuxtLink to="/products" class="text-sm text-brand hover:underline">View all</NuxtLink>
        </div>
        <ul class="divide-y divide-black/5">
          <li v-for="p in topProducts" :key="p.id" class="px-4 sm:px-5 py-3 flex items-center gap-3">
            <img :src="p.image" class="w-12 h-12 rounded-lg object-cover bg-cream shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">{{ p.name }}</p>
              <p class="text-xs text-ink-soft">{{ p.sales }} sold</p>
            </div>
            <span class="text-sm font-semibold shrink-0">{{ formatMoney(p.price) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { state, formatMoney } = useAdminData()
const series = useDashboardSeries()

const topProducts = computed(() =>
  [...state.products].sort((a, b) => b.sales - a.sales).slice(0, 5)
)
</script>
