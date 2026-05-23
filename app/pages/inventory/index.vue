<template>
  <div>
    <PageHeader title="Inventory" subtitle="Stock levels at a glance across every SKU.">
      <template #actions>
        <button class="btn-secondary">
          <Icon name="ph:export" class="w-4 h-4" />
          Export
        </button>
        <button class="btn-primary">
          <Icon name="ph:arrows-clockwise" class="w-4 h-4" />
          Sync stock
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="Total Units" :value="totalUnits.toLocaleString()" icon="ph:package" tone="brand" />
      <StatCard label="In Stock" :value="counts.inStock" icon="ph:check-circle" tone="green" />
      <StatCard label="Low Stock" :value="counts.low" icon="ph:warning" tone="amber" />
      <StatCard label="Out of Stock" :value="counts.out" icon="ph:x-circle" tone="red" />
    </div>

    <div class="card p-4 mb-4 flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-[220px]">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search SKU or product…" class="input pl-9" />
      </div>
      <select v-model="filter" class="input max-w-[200px]">
        <option value="">All stock levels</option>
        <option value="instock">In stock</option>
        <option value="low">Low stock (&lt; 10)</option>
        <option value="out">Out of stock</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th class="text-right">In stock</th>
              <th>Stock level</th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id">
              <td>
                <div class="flex items-center gap-3">
                  <img :src="p.image" class="w-10 h-10 rounded-lg object-cover bg-cream" />
                  <p class="font-medium truncate">{{ p.name }}</p>
                </div>
              </td>
              <td class="text-ink-soft">{{ p.sku }}</td>
              <td>{{ p.category }}</td>
              <td class="text-right font-semibold">{{ p.stock }}</td>
              <td class="w-48">
                <div class="h-1.5 rounded-full bg-black/5 overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="p.stock === 0 ? 'bg-danger' : p.stock < 10 ? 'bg-warning' : 'bg-success'"
                    :style="{ width: Math.min(100, (p.stock / 100) * 100) + '%' }"
                  ></div>
                </div>
              </td>
              <td>
                <StatusChip
                  :status="p.stock === 0 ? 'OutOfStock' : p.stock < 10 ? 'LowStock' : 'InStock'"
                  :label="p.stock === 0 ? 'Out of stock' : p.stock < 10 ? 'Low' : 'In stock'"
                />
              </td>
              <td class="text-right">
                <button class="btn-ghost p-1.5"><Icon name="ph:plus" class="w-4 h-4" /></button>
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
const { state } = useAdminData()

const search = ref('')
const filter = ref('')

const totalUnits = computed(() => state.products.reduce((s, p) => s + p.stock, 0))
const counts = computed(() => ({
  inStock: state.products.filter((p) => p.stock >= 10).length,
  low: state.products.filter((p) => p.stock > 0 && p.stock < 10).length,
  out: state.products.filter((p) => p.stock === 0).length
}))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return state.products.filter((p) => {
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) return false
    if (filter.value === 'instock' && p.stock < 10) return false
    if (filter.value === 'low' && (p.stock === 0 || p.stock >= 10)) return false
    if (filter.value === 'out' && p.stock !== 0) return false
    return true
  })
})
</script>
