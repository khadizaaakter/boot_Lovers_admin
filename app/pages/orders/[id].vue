<template>
  <div v-if="loading" class="text-sm text-ink-soft py-20 text-center">Loading order…</div>

  <div v-else-if="order">
    <PageHeader
      :title="`Order #${order.order_number}`"
      :subtitle="`Placed on ${new Date(order.created_at).toLocaleDateString()}`"
      :breadcrumbs="[{ label: 'Orders', to: '/orders' }, { label: `#${order.order_number}` }]"
    >
      <template #actions>
        <button class="btn-secondary" @click="printOrder">
          <Icon name="ph:printer" class="w-4 h-4" />
          Print
        </button>
        <select :value="order.status" class="input w-full sm:w-auto sm:max-w-[180px]" :disabled="saving" @change="onStatus">
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 space-y-4">
        <div class="card overflow-hidden">
          <div class="px-4 sm:px-5 py-4 border-b border-black/5 flex items-center justify-between gap-2">
            <h3 class="font-display text-lg font-semibold">Items</h3>
            <span class="text-xs sm:text-sm text-ink-soft shrink-0">{{ order.items.length }} product{{ order.items.length > 1 ? 's' : '' }}</span>
          </div>
          <ul class="divide-y divide-black/5">
            <li v-for="p in order.items" :key="p.id" class="px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4">
              <img :src="p.image || placeholderImage" class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-cream shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ p.name }}</p>
                <p class="text-xs text-ink-soft">Qty: {{ p.quantity }} · {{ formatMoney(p.price) }} each</p>
              </div>
              <p class="font-semibold shrink-0">{{ formatMoney(p.total) }}</p>
            </li>
          </ul>
          <div class="px-4 sm:px-5 py-4 bg-cream-soft border-t border-black/5 space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Subtotal</span>
              <span>{{ formatMoney(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Shipping</span>
              <span>{{ formatMoney(order.shipping_fee) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Tax</span>
              <span>{{ formatMoney(order.tax) }}</span>
            </div>
            <div v-if="Number(order.discount) > 0" class="flex justify-between text-sm">
              <span class="text-ink-soft">Discount</span>
              <span>-{{ formatMoney(order.discount) }}</span>
            </div>
            <div class="flex justify-between text-base font-semibold pt-2 border-t border-black/10 mt-2">
              <span>Total</span>
              <span>{{ formatMoney(order.total) }}</span>
            </div>
          </div>
        </div>

        <div class="card p-4 sm:p-5">
          <h3 class="font-display text-lg font-semibold mb-4">Timeline</h3>
          <ul class="space-y-4">
            <li v-for="(t, i) in timeline" :key="i" class="flex gap-3">
              <div
                class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                :class="t.done ? 'bg-brand' : 'bg-gray-300'"
              ></div>
              <p class="text-sm font-medium" :class="!t.done && 'text-ink-soft'">{{ t.label }}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-4 sm:p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Customer</h3>
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-semibold">
              {{ order.customer_name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="font-medium truncate">{{ order.customer_name }}</p>
              <p class="text-xs text-ink-soft truncate">{{ order.customer_email }}</p>
            </div>
          </div>
          <a :href="`mailto:${order.customer_email}`" class="btn-secondary w-full mt-4">
            <Icon name="ph:envelope" class="w-4 h-4" />
            Contact customer
          </a>
        </div>

        <div class="card p-4 sm:p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Shipping Address</h3>
          <p class="text-sm">{{ order.shipping_address }}</p>
          <p class="text-sm">{{ order.shipping_city }}<span v-if="order.shipping_zip">, {{ order.shipping_zip }}</span></p>
          <p class="text-sm">{{ order.shipping_country }}</p>
        </div>

        <div class="card p-4 sm:p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Payment</h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-cream-soft flex items-center justify-center">
              <Icon name="ph:credit-card" class="w-5 h-5 text-ink-soft" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ order.payment_method || 'Not specified' }}</p>
              <StatusChip :status="order.payment_status" class="mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <p class="text-ink-soft">Order not found.</p>
    <NuxtLink to="/orders" class="btn-primary mt-4">Back to orders</NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const { show: showOrder, update: updateOrder } = useOrdersApi()

const order = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const placeholderImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'

const formatMoney = (n) => `$${Number(n).toLocaleString('en-US')}`

const fetchOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    order.value = await showOrder(route.params.id)
  } catch (e) {
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)

const printOrder = () => window.print()

const onStatus = async (e) => {
  if (!order.value) return
  const status = e.target.value
  saving.value = true
  error.value = ''
  try {
    order.value = await updateOrder(order.value.id, { status })
  } catch (err) {
    error.value = 'Could not update order status.'
  } finally {
    saving.value = false
  }
}

const timeline = computed(() => {
  if (!order.value) return []
  const status = order.value.status
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const idx = status === 'Cancelled' ? 0 : steps.indexOf(status)
  return steps.map((s, i) => ({ label: s, done: i <= idx }))
})
</script>
