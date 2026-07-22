<template>
  <div>
    <PageHeader title="Inventory" subtitle="Stock levels at a glance across every SKU.">
      <template #actions>
        <button class="btn-secondary" :disabled="loading" @click="fetchAll">
          <Icon name="ph:arrows-clockwise" class="w-4 h-4" />
          Refresh
        </button>
        <button class="btn-primary" @click="openMovementModal(null)">
          <Icon name="ph:plus" class="w-4 h-4" />
          Stock Entry
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <StatCard label="Total Units" :value="totalUnits.toLocaleString()" icon="ph:package" tone="brand" />
      <StatCard label="In Stock" :value="counts.inStock" icon="ph:check-circle" tone="green" />
      <StatCard label="Low Stock" :value="counts.low" icon="ph:warning" tone="amber" />
      <StatCard label="Out of Stock" :value="counts.out" icon="ph:x-circle" tone="red" />
    </div>

    <div class="card p-3 sm:p-4 mb-4 filter-bar">
      <div class="filter-search">
        <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input v-model="search" type="text" placeholder="Search SKU or product…" class="input pl-9" />
      </div>
      <select v-model="filter" class="input">
        <option value="">All stock levels</option>
        <option value="instock">In stock</option>
        <option value="low">Low stock</option>
        <option value="out">Out of stock</option>
      </select>
    </div>

    <div v-if="loading" class="text-sm text-ink-soft py-10 text-center">Loading inventory…</div>

    <div v-else class="card overflow-hidden mb-6">
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
            <tr v-for="p in filtered" :key="p.product_id">
              <td>
                <div class="flex items-center gap-3">
                  <img
                    v-if="p.thumbnail"
                    :src="imageUrl(p.thumbnail)"
                    class="w-10 h-10 rounded-lg object-cover bg-cream"
                  />
                  <div v-else class="w-10 h-10 rounded-lg bg-cream flex items-center justify-center shrink-0">
                    <Icon name="ph:image" class="w-4 h-4 text-ink-soft" />
                  </div>
                  <p class="font-medium truncate">{{ p.name }}</p>
                </div>
              </td>
              <td class="text-ink-soft">{{ p.sku }}</td>
              <td>{{ categoryName(p.category_id) }}</td>
              <td class="text-right font-semibold">{{ p.stock }}</td>
              <td class="w-48">
                <div class="h-1.5 rounded-full bg-black/5 overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="stockTone(p)"
                    :style="{ width: Math.min(100, (p.stock / Math.max(p.low_stock_threshold * 4, 1)) * 100) + '%' }"
                  ></div>
                </div>
              </td>
              <td>
                <StatusChip :status="stockStatus(p)" :label="stockLabel(p)" />
              </td>
              <td class="text-right">
                <button class="btn-ghost p-1.5" aria-label="Add stock entry" @click="openMovementModal(p)">
                  <Icon name="ph:plus" class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="7" class="text-center py-10 text-ink-soft">No products match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="px-4 sm:px-5 py-3 border-b border-black/5">
        <h3 class="font-display text-lg font-semibold">Recent Stock Movements</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Reason</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Stock (before → after)</th>
              <th>Reference</th>
              <th>Date</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in movements" :key="m.inventory_id">
              <td class="font-medium">{{ m.product?.name || '—' }}</td>
              <td>
                <StatusChip
                  :status="m.type === 'in' ? 'InStock' : 'OutOfStock'"
                  :label="m.type === 'in' ? 'Stock in' : 'Stock out'"
                />
              </td>
              <td class="capitalize text-ink-soft">{{ m.reason }}</td>
              <td class="text-right font-semibold">{{ m.quantity }}</td>
              <td class="text-right text-ink-soft">{{ m.stock_before }} → {{ m.stock_after }}</td>
              <td class="text-ink-soft">{{ m.reference_no || '—' }}</td>
              <td class="text-ink-soft">{{ new Date(m.created_at).toLocaleDateString() }}</td>
              <td class="text-right">
                <button class="btn-ghost p-1.5 text-danger" aria-label="Delete" @click="onDeleteMovement(m)">
                  <Icon name="ph:trash" class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!movements.length">
              <td colspan="8" class="text-center py-10 text-ink-soft">No stock movements yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalOpen" title="Add Stock Entry" @close="modalOpen = false">
      <div class="space-y-3">
        <div v-if="formError" class="text-sm text-danger">{{ formError }}</div>
        <div>
          <label class="label">Product</label>
          <select v-model="form.product_id" class="input" :disabled="!!selectedProduct">
            <option value="" disabled>Select a product</option>
            <option v-for="p in products" :key="p.product_id" :value="p.product_id">
              {{ p.name }} ({{ p.sku }})
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Type</label>
            <select v-model="form.type" class="input">
              <option value="in">Stock in</option>
              <option value="out">Stock out</option>
            </select>
          </div>
          <div>
            <label class="label">Quantity</label>
            <input v-model.number="form.quantity" type="number" min="1" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Reason</label>
          <select v-model="form.reason" class="input">
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="return">Return</option>
            <option value="damage">Damage</option>
            <option value="correction">Correction</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>
        <div>
          <label class="label">Reference no. (optional)</label>
          <input v-model="form.reference_no" type="text" class="input" placeholder="PO-1024" />
        </div>
        <div>
          <label class="label">Note (optional)</label>
          <textarea v-model="form.note" rows="3" class="input"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="modalOpen = false">Cancel</button>
        <button class="btn-primary" :disabled="saving" @click="saveMovement">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const { list: listProducts, imageUrl } = useProductsApi()
const { list: listCategories } = useCategoriesApi()
const { list: listMovements, create: createMovement, remove: removeMovement } = useInventoryApi()

const products = ref([])
const categories = ref([])
const movements = ref([])
const loading = ref(true)
const error = ref('')

const search = ref('')
const filter = ref('')

const modalOpen = ref(false)
const selectedProduct = ref(null)
const saving = ref(false)
const formError = ref('')
const form = reactive({
  product_id: '',
  type: 'in',
  reason: 'purchase',
  quantity: 1,
  reference_no: '',
  note: ''
})

const categoryName = (id) => categories.value.find((c) => c.category_id === id)?.name || '—'

const stockStatus = (p) => (p.stock <= 0 ? 'OutOfStock' : p.stock <= p.low_stock_threshold ? 'LowStock' : 'InStock')
const stockLabel = (p) => (p.stock <= 0 ? 'Out of stock' : p.stock <= p.low_stock_threshold ? 'Low' : 'In stock')
const stockTone = (p) => (p.stock <= 0 ? 'bg-danger' : p.stock <= p.low_stock_threshold ? 'bg-warning' : 'bg-success')

const totalUnits = computed(() => products.value.reduce((s, p) => s + p.stock, 0))
const counts = computed(() => ({
  inStock: products.value.filter((p) => p.stock > p.low_stock_threshold).length,
  low: products.value.filter((p) => p.stock > 0 && p.stock <= p.low_stock_threshold).length,
  out: products.value.filter((p) => p.stock <= 0).length
}))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return products.value.filter((p) => {
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) return false
    if (filter.value === 'instock' && !(p.stock > p.low_stock_threshold)) return false
    if (filter.value === 'low' && !(p.stock > 0 && p.stock <= p.low_stock_threshold)) return false
    if (filter.value === 'out' && p.stock > 0) return false
    return true
  })
})

const fetchAll = async () => {
  loading.value = true
  error.value = ''
  try {
    const [productList, categoryList, movementList] = await Promise.all([
      listProducts(),
      listCategories(),
      listMovements({ per_page: 20 })
    ])
    products.value = productList
    categories.value = categoryList
    movements.value = movementList.data
  } catch (e) {
    error.value = 'Could not load inventory. Is the API running?'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

const openMovementModal = (product) => {
  selectedProduct.value = product
  form.product_id = product ? product.product_id : ''
  form.type = 'in'
  form.reason = 'purchase'
  form.quantity = 1
  form.reference_no = ''
  form.note = ''
  formError.value = ''
  modalOpen.value = true
}

const saveMovement = async () => {
  if (!form.product_id || !form.quantity || form.quantity < 1) {
    formError.value = 'Product and a valid quantity are required.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    await createMovement({ ...form })
    modalOpen.value = false
    await fetchAll()
  } catch (e) {
    formError.value = e?.data?.message || e?.data?.errors?.quantity?.[0] || 'Could not save this stock entry.'
  } finally {
    saving.value = false
  }
}

const onDeleteMovement = async (m) => {
  if (!confirm('Delete this movement and revert the stock change?')) return
  try {
    await removeMovement(m.inventory_id)
    await fetchAll()
  } catch (e) {
    error.value = 'Could not delete this movement.'
  }
}
</script>
