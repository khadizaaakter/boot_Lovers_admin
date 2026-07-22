<template>
  <div v-if="loading" class="text-sm text-ink-soft py-20 text-center">Loading customer…</div>

  <div v-else-if="customer">
    <PageHeader
      :title="customer.name"
      :subtitle="customer.email"
      :breadcrumbs="[{ label: 'Customers', to: '/customers' }, { label: customer.name }]"
    >
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:envelope" class="w-4 h-4" />
          Email
        </button>
        <button class="btn-primary" @click="openEditModal">
          <Icon name="ph:pencil-simple" class="w-4 h-4" />
          Edit
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card p-4 sm:p-5 lg:col-span-1 text-center">
        <img :src="avatarUrl(customer)" class="w-24 h-24 rounded-full mx-auto object-cover" />
        <h3 class="font-display text-xl font-bold mt-3">{{ customer.name }}</h3>
        <StatusChip :status="customer.status" class="mt-2" />
        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-cream-soft p-3">
            <p class="text-xs text-ink-soft">Orders</p>
            <p class="text-lg font-display font-bold">{{ customer.orders || 0 }}</p>
          </div>
          <div class="rounded-xl bg-cream-soft p-3">
            <p class="text-xs text-ink-soft">Spent</p>
            <p class="text-lg font-display font-bold">{{ formatMoney(customer.spent || 0) }}</p>
          </div>
        </div>
        <ul class="mt-5 text-sm text-left space-y-2.5">
          <li class="flex items-center gap-2 text-ink-soft">
            <Icon name="ph:envelope" class="w-4 h-4" />{{ customer.email }}
          </li>
          <li class="flex items-center gap-2 text-ink-soft">
            <Icon name="ph:phone" class="w-4 h-4" />{{ customer.phone || '—' }}
          </li>
          <li class="flex items-center gap-2 text-ink-soft">
            <Icon name="ph:map-pin" class="w-4 h-4" />{{ customer.city || '—' }}
          </li>
          <li class="flex items-center gap-2 text-ink-soft">
            <Icon name="ph:calendar-blank" class="w-4 h-4" />Joined {{ new Date(customer.created_at).toLocaleDateString() }}
          </li>
        </ul>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="card overflow-hidden">
          <div class="px-4 sm:px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">Recent Orders</h3>
            <NuxtLink to="/orders" class="text-sm text-brand hover:underline">View all</NuxtLink>
          </div>
          <div class="overflow-x-auto">
          <table class="table-base">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th class="text-right">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in custOrders" :key="o.id">
                <td>
                  <NuxtLink :to="`/orders/${encodeURIComponent(o.id)}`" class="font-medium hover:text-brand">
                    {{ o.id }}
                  </NuxtLink>
                </td>
                <td class="text-ink-soft">{{ o.date }}</td>
                <td class="text-right font-semibold">{{ formatMoney(o.total) }}</td>
                <td><StatusChip :status="o.status" /></td>
              </tr>
              <tr v-if="!custOrders.length">
                <td colspan="4" class="text-center py-8 text-ink-soft">No orders yet.</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div class="card p-4 sm:p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Notes</h3>
          <textarea rows="4" class="input" placeholder="Add a private note about this customer…"></textarea>
        </div>
      </div>
    </div>

    <Modal :open="modalOpen" title="Edit Customer" @close="modalOpen = false">
      <div class="space-y-3">
        <div v-if="formError" class="text-sm text-danger">{{ formError }}</div>
        <div>
          <label class="label">Name</label>
          <input v-model="form.name" type="text" class="input" />
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Phone (optional)</label>
            <input v-model="form.phone" type="text" class="input" />
          </div>
          <div>
            <label class="label">City (optional)</label>
            <input v-model="form.city" type="text" class="input" />
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

  <div v-else class="text-center py-20">
    <p class="text-ink-soft">Customer not found.</p>
    <NuxtLink to="/customers" class="btn-primary mt-4">Back to customers</NuxtLink>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const route = useRoute()
const { show: showCustomer, update: updateCustomer } = useCustomersApi()

const customer = ref(null)
const loading = ref(true)
const error = ref('')
const custOrders = ref([])

const modalOpen = ref(false)
const saving = ref(false)
const formError = ref('')
const form = reactive({ name: '', email: '', phone: '', city: '', status: 'Pending' })

const formatMoney = (n) => `$${n.toLocaleString('en-US')}`
const avatarUrl = (c) => c.avatar || `https://i.pravatar.cc/100?u=${encodeURIComponent(c.email)}`

const fetchCustomer = async () => {
  loading.value = true
  error.value = ''
  try {
    customer.value = await showCustomer(Number(route.params.id))
  } catch (e) {
    customer.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchCustomer)

const openEditModal = () => {
  form.name = customer.value.name
  form.email = customer.value.email
  form.phone = customer.value.phone || ''
  form.city = customer.value.city || ''
  form.status = customer.value.status
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
    customer.value = await updateCustomer(customer.value.id, { ...form })
    modalOpen.value = false
  } catch (e) {
    formError.value = e?.data?.message || e?.data?.errors?.email?.[0] || 'Could not save this customer.'
  } finally {
    saving.value = false
  }
}
</script>
