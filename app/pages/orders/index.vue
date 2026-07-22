<template>
  <div>
    <PageHeader title="Orders" subtitle="Track, process and fulfill customer orders.">
      <template #actions>
        <button class="btn-secondary" :disabled="loading" @click="fetchAll">
          <Icon name="ph:arrows-clockwise" class="w-4 h-4" />
          Refresh
        </button>
        <a class="btn-secondary" :href="exportUrl(exportFilters)" target="_blank" rel="noopener">
          <Icon name="ph:export" class="w-4 h-4" />
          Export CSV
        </a>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="All Orders" :value="stats.total" icon="ph:receipt" tone="brand" />
      <StatCard label="Pending" :value="stats.by_status.Pending || 0" icon="ph:hourglass" tone="amber" />
      <StatCard label="Shipped" :value="stats.by_status.Shipped || 0" icon="ph:truck" tone="blue" />
      <StatCard label="Delivered" :value="stats.by_status.Delivered || 0" icon="ph:check-circle" tone="green" />
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

    <div v-if="loading" class="text-sm text-ink-soft py-10 text-center">Loading orders…</div>

    <div v-else class="card overflow-hidden">
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
                <NuxtLink :to="`/orders/${o.id}`" class="font-medium hover:text-brand">
                  #{{ o.order_number }}
                </NuxtLink>
              </td>
              <td>
                <p class="font-medium">{{ o.customer_name }}</p>
                <p class="text-xs text-ink-soft">{{ o.customer_email }}</p>
              </td>
              <td class="text-ink-soft">{{ new Date(o.created_at).toLocaleDateString() }}</td>
              <td class="text-right">{{ o.items_count || 0 }}</td>
              <td class="text-right font-semibold">{{ formatMoney(o.total) }}</td>
              <td><StatusChip :status="o.payment_status" /></td>
              <td><StatusChip :status="o.status" /></td>
              <td class="text-right">
                <NuxtLink :to="`/orders/${o.id}`" class="btn-ghost p-1.5" aria-label="View">
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
import { ref, reactive, computed, onMounted } from 'vue'

const { list: listOrders, stats: statsOrders, exportUrl } = useOrdersApi()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const stats = reactive({ total: 0, by_status: {}, by_payment_status: {} })

const search = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')

const formatMoney = (n) => `$${Number(n).toLocaleString('en-US')}`

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    if (q && !`${o.order_number} ${o.customer_name} ${o.customer_email}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && o.status !== statusFilter.value) return false
    if (paymentFilter.value && o.payment_status !== paymentFilter.value) return false
    return true
  })
})

const exportFilters = computed(() => ({
  search: search.value || undefined,
  status: statusFilter.value || undefined,
  payment_status: paymentFilter.value || undefined
}))

const fetchAll = async () => {
  loading.value = true
  error.value = ''
  try {
    const [ordersRes, statsRes] = await Promise.all([listOrders({ per_page: 100 }), statsOrders()])
    orders.value = ordersRes.data
    stats.total = statsRes.total
    stats.by_status = statsRes.by_status
    stats.by_payment_status = statsRes.by_payment_status
  } catch (e) {
    error.value = 'Could not load orders. Is the API running?'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>
