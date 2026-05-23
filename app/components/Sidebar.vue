<template>
  <!-- Backdrop on mobile -->
  <div
    v-if="open"
    class="fixed inset-0 bg-black/40 z-30 lg:hidden"
    @click="$emit('close')"
  ></div>

  <aside
    class="fixed top-0 left-0 h-screen w-[85vw] max-w-[18rem] sm:w-72 lg:w-64 bg-white border-r border-black/5 z-40 transition-transform duration-300 flex flex-col"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Brand -->
    <div class="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-black/5">
      <NuxtLink to="/" class="font-display text-2xl font-bold tracking-tight inline-flex" @click="$emit('close')">
        <span class="text-ink">Boot</span>
        <span class="text-brand">&nbsp;Lovers</span>
      </NuxtLink>
      <button
        class="lg:hidden p-2 -mr-2 rounded-lg hover:bg-black/5"
        aria-label="Close sidebar"
        @click="$emit('close')"
      >
        <Icon name="ph:x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3 py-5 space-y-6">
      <div v-for="group in groups" :key="group.title">
        <p class="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-muted">
          {{ group.title }}
        </p>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="nav-item group"
              :exact-active-class="'nav-item-active'"
              @click="$emit('close')"
            >
              <Icon :name="item.icon" class="w-5 h-5 shrink-0" />
              <span>{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand text-white"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer card -->
    <div class="p-3 border-t border-black/5">
      <div class="rounded-xl bg-cream-soft p-3 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-semibold">
          A
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold truncate">Admin User</p>
          <p class="text-xs text-ink-soft truncate">admin@bootlovers.com</p>
        </div>
        <NuxtLink to="/login" class="ml-auto text-ink-soft hover:text-brand" aria-label="Logout">
          <Icon name="ph:sign-out" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])

const groups = [
  {
    title: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: 'ph:house-simple' },
      { to: '/reports', label: 'Reports', icon: 'ph:chart-line-up' }
    ]
  },
  {
    title: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: 'ph:sneaker' },
      { to: '/categories', label: 'Categories', icon: 'ph:squares-four' },
      { to: '/inventory', label: 'Inventory', icon: 'ph:package' }
    ]
  },
  {
    title: 'Sales',
    items: [
      { to: '/orders', label: 'Orders', icon: 'ph:receipt', badge: '12' },
      { to: '/coupons', label: 'Coupons', icon: 'ph:ticket' }
    ]
  },
  {
    title: 'People',
    items: [
      { to: '/customers', label: 'Customers', icon: 'ph:users-three' },
      { to: '/reviews', label: 'Reviews', icon: 'ph:star' }
    ]
  },
  {
    title: 'System',
    items: [{ to: '/settings', label: 'Settings', icon: 'ph:gear-six' }]
  }
]
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.5rem;
  color: #4b4b4b;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.nav-item:hover {
  background-color: #faf6ef;
  color: #1a1a1a;
}
.nav-item-active {
  background: linear-gradient(90deg, #fff1e0 0%, #faf6ef 100%);
  color: #b85f08;
  font-weight: 600;
}
</style>
