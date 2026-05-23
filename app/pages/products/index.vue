<template>
  <div>
    <PageHeader
      title="Products"
      subtitle="Manage your full catalog of boots, sneakers, formal shoes and accessories."
    >
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:upload-simple" class="w-4 h-4" />
          Import
        </button>
        <NuxtLink to="/products/new" class="btn-primary">
          <Icon name="ph:plus" class="w-4 h-4" />
          Add Product
        </NuxtLink>
      </template>
    </PageHeader>

    <!-- Filters -->
    <div class="card p-3 sm:p-4 mb-4 filter-bar">
      <div class="filter-search">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search products by name or SKU…" class="input pl-9" />
      </div>
      <select v-model="categoryFilter" class="input">
        <option value="">All categories</option>
        <option v-for="c in state.categories" :key="c.id" :value="c.name">{{ c.name }}</option>
      </select>
      <select v-model="statusFilter" class="input">
        <option value="">All statuses</option>
        <option>Published</option>
        <option>Draft</option>
        <option>Out of stock</option>
      </select>
      <button class="btn-ghost w-full sm:w-auto" @click="resetFilters">
        <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4" />
        Reset
      </button>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th class="w-10"><input type="checkbox" /></th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th class="text-right">Price</th>
              <th class="text-right">Stock</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id">
              <td><input type="checkbox" /></td>
              <td>
                <div class="flex items-center gap-3">
                  <img :src="p.image" class="w-11 h-11 rounded-lg object-cover bg-cream" />
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ p.name }}</p>
                    <p class="text-xs text-ink-soft">
                      <Icon name="ph:star-fill" class="inline w-3 h-3 text-amber-500" />
                      {{ p.rating || '—' }} · {{ p.sales }} sold
                    </p>
                  </div>
                </div>
              </td>
              <td class="text-ink-soft">{{ p.sku }}</td>
              <td>{{ p.category }}</td>
              <td class="text-right">
                <span class="font-semibold">{{ formatMoney(p.price) }}</span>
                <span v-if="p.comparePrice" class="block text-xs text-ink-soft line-through">
                  {{ formatMoney(p.comparePrice) }}
                </span>
              </td>
              <td class="text-right">
                <span :class="p.stock === 0 ? 'text-danger font-semibold' : p.stock < 10 ? 'text-warning font-semibold' : ''">
                  {{ p.stock }}
                </span>
              </td>
              <td><StatusChip :status="p.status" /></td>
              <td class="text-right">
                <div class="inline-flex items-center gap-1">
                  <NuxtLink :to="`/products/${p.id}`" class="btn-ghost p-1.5" aria-label="Edit">
                    <Icon name="ph:pencil-simple" class="w-4 h-4" />
                  </NuxtLink>
                  <button class="btn-ghost p-1.5" aria-label="View">
                    <Icon name="ph:eye" class="w-4 h-4" />
                  </button>
                  <button class="btn-ghost p-1.5 text-danger" aria-label="Delete" @click="onDelete(p.id)">
                    <Icon name="ph:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="8" class="text-center py-10 text-ink-soft">No products match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-black/5">
        <p class="text-xs text-ink-soft text-center sm:text-left">
          Showing <span class="font-semibold">{{ filtered.length }}</span> of {{ state.products.length }} products
        </p>
        <div class="flex items-center justify-center sm:justify-end gap-1">
          <button class="btn-ghost p-1.5"><Icon name="ph:caret-left" class="w-4 h-4" /></button>
          <button class="px-3 py-1 rounded-md bg-brand text-white text-xs">1</button>
          <button class="px-3 py-1 rounded-md hover:bg-black/5 text-xs">2</button>
          <button class="px-3 py-1 rounded-md hover:bg-black/5 text-xs">3</button>
          <button class="btn-ghost p-1.5"><Icon name="ph:caret-right" class="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { state, formatMoney, removeProduct } = useAdminData()
const search = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return state.products.filter((p) => {
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) return false
    if (categoryFilter.value && p.category !== categoryFilter.value) return false
    if (statusFilter.value && p.status !== statusFilter.value) return false
    return true
  })
})

const resetFilters = () => {
  search.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
}

const onDelete = (id) => {
  if (confirm('Delete this product?')) removeProduct(id)
}
</script>
