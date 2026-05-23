<template>
  <div>
    <PageHeader title="Orders" subtitle="Track, process and fulfill customer orders.">
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:export" class="w-4 h-4" />
          Export CSV
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="All Orders" :value="state.orders.length" icon="ph:receipt" tone="brand" />
      <StatCard label="Pending" :value="counts.Pending || 0" icon="ph:hourglass" tone="amber" />
      <StatCard label="Shipped" :value="counts.Shipped || 0" icon="ph:truck" tone="blue" />
      <StatCard label="Delivered" :value="counts.Delivered || 0" icon="ph:check-circle" tone="green" />
    </div>

    <div class="card p-3 sm:p-4 mb-4 filter-bar">
      <div class="filter-search">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search by order ID, customer, email…" class="input pl-9" />
      </div>
      <select v-model="statusFilter" class="input">
        <option value="">All statuses</option>
        <option>Pending</option>
        <option>Processing</option>
        <option>Shipped</option>
        <option>Delivered</option>
        <option>Cancelled</option>
      </select>
      <select v-model="paymentFilter" class="input">
        <option value="">All payments</option>
        <option>Paid</option>
        <option>Unpaid</option>
        <option>Refunded</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th class="text-right">Items</th>
              <th class="text-right">Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in filtered" :key="o.id">
              <td>
                <NuxtLink :to="`/orders/${encodeURIComponent(o.id)}`" class="font-medium hover:text-brand">
                  {{ o.id }}
                </NuxtLink>
              </td>
              <td>
                <p class="font-medium">{{ o.customer }}</p>
                <p class="text-xs text-ink-soft">{{ o.email }}</p>
              </td>
              <td class="text-ink-soft">{{ o.date }}</td>
              <td class="text-right">{{ o.items }}</td>
              <td class="text-right font-semibold">{{ formatMoney(o.total) }}</td>
              <td><StatusChip :status="o.payment" /></td>
              <td><StatusChip :status="o.status" /></td>
              <td class="text-right">
                <NuxtLink :to="`/orders/${encodeURIComponent(o.id)}`" class="btn-ghost p-1.5" aria-label="View">
                  <Icon name="ph:arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="8" class="text-center py-10 text-ink-soft">No orders match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const { state, formatMoney } = useAdminData()

const search = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')

const counts = computed(() => {
  const r = {}
  state.orders.forEach((o) => (r[o.status] = (r[o.status] || 0) + 1))
  return r
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return state.orders.filter((o) => {
    if (q && !`${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && o.status !== statusFilter.value) return false
    if (paymentFilter.value && o.payment !== paymentFilter.value) return false
    return true
  })
})
</script>
