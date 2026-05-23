<template>
  <div>
    <PageHeader title="Customers" subtitle="Your loyal Boot Lovers community.">
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:export" class="w-4 h-4" />
          Export
        </button>
        <button class="btn-primary">
          <Icon name="ph:plus" class="w-4 h-4" />
          Add Customer
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="Total Customers" :value="state.customers.length" icon="ph:users-three" tone="brand" />
      <StatCard label="Active" :value="counts.Active || 0" icon="ph:user-check" tone="green" />
      <StatCard label="Pending" :value="counts.Pending || 0" icon="ph:user-circle" tone="amber" />
      <StatCard label="Lifetime Value" :value="formatMoney(lifetime)" icon="ph:wallet" tone="blue" />
    </div>

    <div class="card p-4 mb-4 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-[220px]">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search by name, email, city…" class="input pl-9" />
      </div>
      <select v-model="statusFilter" class="input max-w-[180px]">
        <option value="">All statuses</option>
        <option>Active</option>
        <option>Pending</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Location</th>
              <th class="text-right">Orders</th>
              <th class="text-right">Spent</th>
              <th>Joined</th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id">
              <td>
                <div class="flex items-center gap-3">
                  <img :src="c.avatar" class="w-9 h-9 rounded-full object-cover" />
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ c.name }}</p>
                    <p class="text-xs text-ink-soft truncate">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ c.city }}</td>
              <td class="text-right">{{ c.orders }}</td>
              <td class="text-right font-semibold">{{ formatMoney(c.spent) }}</td>
              <td class="text-ink-soft">{{ c.joined }}</td>
              <td><StatusChip :status="c.status" /></td>
              <td class="text-right">
                <NuxtLink :to="`/customers/${c.id}`" class="btn-ghost p-1.5">
                  <Icon name="ph:arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </td>
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

const counts = computed(() => {
  const r = {}
  state.customers.forEach((c) => (r[c.status] = (r[c.status] || 0) + 1))
  return r
})

const lifetime = computed(() => state.customers.reduce((s, c) => s + c.spent, 0))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return state.customers.filter((c) => {
    if (q && !`${c.name} ${c.email} ${c.city}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && c.status !== statusFilter.value) return false
    return true
  })
})
</script>
