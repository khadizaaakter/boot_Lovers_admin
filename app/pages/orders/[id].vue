<template>
  <div v-if="order">
    <PageHeader
      :title="`Order ${order.id}`"
      :subtitle="`Placed on ${order.date}`"
      :breadcrumbs="[{ label: 'Orders', to: '/orders' }, { label: order.id }]"
    >
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:printer" class="w-4 h-4" />
          Print
        </button>
        <select :value="order.status" class="input max-w-[180px]" @change="onStatus">
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 space-y-4">
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">Items</h3>
            <span class="text-sm text-ink-soft">{{ order.products.length }} product{{ order.products.length > 1 ? 's' : '' }}</span>
          </div>
          <ul class="divide-y divide-black/5">
            <li v-for="(p, i) in order.products" :key="i" class="px-5 py-4 flex items-center gap-4">
              <img :src="p.image" class="w-14 h-14 rounded-lg object-cover bg-cream" />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ p.name }}</p>
                <p class="text-xs text-ink-soft">Qty: {{ p.qty }} · {{ formatMoney(p.price) }} each</p>
              </div>
              <p class="font-semibold">{{ formatMoney(p.price * p.qty) }}</p>
            </li>
          </ul>
          <div class="px-5 py-4 bg-cream-soft border-t border-black/5 space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Subtotal</span>
              <span>{{ formatMoney(order.total - 15) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Shipping</span>
              <span>{{ formatMoney(15) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-soft">Tax</span>
              <span>$0.00</span>
            </div>
            <div class="flex justify-between text-base font-semibold pt-2 border-t border-black/10 mt-2">
              <span>Total</span>
              <span>{{ formatMoney(order.total) }}</span>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h3 class="font-display text-lg font-semibold mb-4">Timeline</h3>
          <ul class="space-y-4">
            <li v-for="(t, i) in timeline" :key="i" class="flex gap-3">
              <div
                class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                :class="t.done ? 'bg-brand' : 'bg-gray-300'"
              ></div>
              <div>
                <p class="text-sm font-medium" :class="!t.done && 'text-ink-soft'">{{ t.label }}</p>
                <p v-if="t.done" class="text-xs text-ink-soft">{{ t.at }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Customer</h3>
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-semibold">
              {{ order.customer.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="font-medium truncate">{{ order.customer }}</p>
              <p class="text-xs text-ink-soft truncate">{{ order.email }}</p>
            </div>
          </div>
          <button class="btn-secondary w-full mt-4">
            <Icon name="ph:envelope" class="w-4 h-4" />
            Contact customer
          </button>
        </div>

        <div class="card p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Shipping Address</h3>
          <p class="text-sm">{{ order.shipping.address }}</p>
          <p class="text-sm">{{ order.shipping.city }}, {{ order.shipping.zip }}</p>
          <p class="text-sm">{{ order.shipping.country }}</p>
        </div>

        <div class="card p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Payment</h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-cream-soft flex items-center justify-center">
              <Icon name="ph:credit-card" class="w-5 h-5 text-ink-soft" />
            </div>
            <div>
              <p class="text-sm font-medium">Visa ending in 4242</p>
              <StatusChip :status="order.payment" class="mt-1" />
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
import { computed } from 'vue'
const route = useRoute()
const { state, formatMoney, updateOrderStatus } = useAdminData()

const order = computed(() =>
  state.orders.find((o) => o.id === decodeURIComponent(String(route.params.id)))
)

const onStatus = (e) => {
  if (!order.value) return
  updateOrderStatus(order.value.id, e.target.value)
}

const timeline = computed(() => {
  if (!order.value) return []
  const status = order.value.status
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const idx = status === 'Cancelled' ? 0 : steps.indexOf(status)
  return steps.map((s, i) => ({
    label: s,
    done: i <= idx,
    at: i <= idx ? `${order.value.date} · ${10 + i * 2}:${30 + i * 5} AM` : ''
  }))
})
</script>
