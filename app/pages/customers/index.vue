<template>
  <div>
    <PageHeader title="Customers" subtitle="Your loyal Boot Lovers community.">
      <template #actions>
        <button class="btn-secondary" :disabled="loading" @click="fetchAll">
          <Icon name="ph:arrows-clockwise" class="w-4 h-4" />
          Refresh
        </button>
        <button class="btn-primary" @click="openCreateModal">
          <Icon name="ph:plus" class="w-4 h-4" />
          Add Customer
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="Total Customers" :value="customers.length" icon="ph:users-three" tone="brand" />
      <StatCard label="Active" :value="counts.Active || 0" icon="ph:user-check" tone="green" />
      <StatCard label="Pending" :value="counts.Pending || 0" icon="ph:user-circle" tone="amber" />
      <StatCard label="Lifetime Value" :value="formatMoney(lifetime)" icon="ph:wallet" tone="blue" />
    </div>

    <div class="card p-3 sm:p-4 mb-4 filter-bar">
      <div class="filter-search">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search by name, email, city…" class="input pl-9" />
      </div>
      <select v-model="statusFilter" class="input">
        <option value="">All statuses</option>
        <option>Active</option>
        <option>Pending</option>
      </select>
    </div>

    <div v-if="loading" class="text-sm text-ink-soft py-10 text-center">Loading customers…</div>

    <div v-else class="card overflow-hidden">
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
                  <img :src="avatarUrl(c)" class="w-9 h-9 rounded-full object-cover" />
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ c.name }}</p>
                    <p class="text-xs text-ink-soft truncate">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ c.city || '—' }}</td>
              <td class="text-right">{{ c.orders || 0 }}</td>
              <td class="text-right font-semibold">{{ formatMoney(c.spent || 0) }}</td>
              <td class="text-ink-soft">{{ new Date(c.created_at).toLocaleDateString() }}</td>
              <td><StatusChip :status="c.status" /></td>
              <td class="text-right">
                <NuxtLink :to="`/customers/${c.id}`" class="btn-ghost p-1.5">
                  <Icon name="ph:arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="7" class="text-center py-10 text-ink-soft">No customers match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalOpen" title="Add Customer" @close="modalOpen = false">
      <div class="space-y-3">
        <div v-if="formError" class="text-sm text-danger">{{ formError }}</div>
        <div>
          <label class="label">Name</label>
          <input v-model="form.name" type="text" class="input" placeholder="Jane Doe" />
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" placeholder="jane@example.com" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Phone (optional)</label>
            <input v-model="form.phone" type="text" class="input" />
          </div>
          <div>
            <label class="label">City (optional)</label>
            <input v-model="form.city" type="text" class="input" placeholder="Dhaka, BD" />
          </div>
        </div>
        <div>
          <label class="label">Status</label>
          <select v-model="form.status" class="input">
            <option>Pending</option>
            <option>Active</option>
          </select>
        </div>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="modalOpen = false">Cancel</button>
        <button class="btn-primary" :disabled="saving" @click="saveCustomer">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const { list: listCustomers, create: createCustomer } = useCustomersApi()

const customers = ref([])
const loading = ref(true)
const error = ref('')

const search = ref('')
const statusFilter = ref('')

const modalOpen = ref(false)
const saving = ref(false)
const formError = ref('')
const form = reactive({ name: '', email: '', phone: '', city: '', status: 'Pending' })

const formatMoney = (n) => `$${n.toLocaleString('en-US')}`
const avatarUrl = (c) => c.avatar || `https://i.pravatar.cc/100?u=${encodeURIComponent(c.email)}`

const counts = computed(() => {
  const r = {}
  customers.value.forEach((c) => (r[c.status] = (r[c.status] || 0) + 1))
  return r
})

const lifetime = computed(() => customers.value.reduce((s, c) => s + (c.spent || 0), 0))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return customers.value.filter((c) => {
    if (q && !`${c.name} ${c.email} ${c.city || ''}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && c.status !== statusFilter.value) return false
    return true
  })
})

const fetchAll = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await listCustomers({ per_page: 100 })
    customers.value = res.data
  } catch (e) {
    error.value = 'Could not load customers. Is the API running?'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

const openCreateModal = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.city = ''
  form.status = 'Pending'
  formError.value = ''
  modalOpen.value = true
}

const saveCustomer = async () => {
  if (!form.name || !form.email) {
    formError.value = 'Name and email are required.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    await createCustomer({ ...form })
    modalOpen.value = false
    await fetchAll()
  } catch (e) {
    formError.value = e?.data?.message || e?.data?.errors?.email?.[0] || 'Could not save this customer.'
  } finally {
    saving.value = false
  }
}
</script>
