<template>
  <div v-if="product">
    <PageHeader
      :title="`Edit · ${product.name}`"
      :breadcrumbs="[
        { label: 'Products', to: '/products' },
        { label: product.name }
      ]"
    >
      <template #actions>
        <NuxtLink to="/products" class="btn-secondary">Cancel</NuxtLink>
        <button class="btn-primary" @click="save">
          <Icon name="ph:check" class="w-4 h-4" />
          Save Changes
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 space-y-4">
        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Basic Information</h3>
          <div>
            <label class="label">Product name</label>
            <input v-model="form.name" type="text" class="input" />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">SKU</label>
              <input v-model="form.sku" type="text" class="input" />
            </div>
            <div>
              <label class="label">Brand</label>
              <input v-model="form.brand" type="text" class="input" />
            </div>
          </div>
        </div>

        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Pricing & Stock</h3>
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Price</label>
              <input v-model.number="form.price" type="number" class="input" />
            </div>
            <div>
              <label class="label">Compare-at price</label>
              <input v-model.number="form.comparePrice" type="number" class="input" />
            </div>
            <div>
              <label class="label">Stock</label>
              <input v-model.number="form.stock" type="number" class="input" />
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h3 class="font-display text-lg font-semibold mb-3">Performance</h3>
          <div class="grid sm:grid-cols-3 gap-3">
            <div class="rounded-xl bg-cream-soft p-4">
              <p class="text-xs text-ink-soft">Total Sales</p>
              <p class="text-xl font-display font-bold">{{ product.sales }}</p>
            </div>
            <div class="rounded-xl bg-cream-soft p-4">
              <p class="text-xs text-ink-soft">Revenue</p>
              <p class="text-xl font-display font-bold">{{ formatMoney(product.sales * product.price) }}</p>
            </div>
            <div class="rounded-xl bg-cream-soft p-4">
              <p class="text-xs text-ink-soft">Rating</p>
              <p class="text-xl font-display font-bold">
                <Icon name="ph:star-fill" class="inline w-5 h-5 text-amber-500 -mt-1" />
                {{ product.rating || '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-5">
          <img :src="product.image" class="w-full aspect-square rounded-xl object-cover bg-cream" />
          <button class="btn-secondary w-full mt-3">
            <Icon name="ph:image" class="w-4 h-4" />
            Change image
          </button>
        </div>

        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Organization</h3>
          <div>
            <label class="label">Category</label>
            <select v-model="form.category" class="input">
              <option v-for="c in state.categories" :key="c.id" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Status</label>
            <select v-model="form.status" class="input">
              <option>Published</option>
              <option>Draft</option>
              <option>Out of stock</option>
            </select>
          </div>
        </div>

        <button class="btn-danger w-full" @click="onDelete">
          <Icon name="ph:trash" class="w-4 h-4" />
          Delete Product
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <p class="text-ink-soft">Product not found.</p>
    <NuxtLink to="/products" class="btn-primary mt-4">Back to products</NuxtLink>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
const route = useRoute()
const router = useRouter()
const { state, formatMoney, updateProduct, removeProduct } = useAdminData()

const product = computed(() => state.products.find((p) => p.id === Number(route.params.id)))

const form = reactive({
  name: '',
  sku: '',
  brand: '',
  price: 0,
  comparePrice: 0,
  stock: 0,
  category: '',
  status: 'Published'
})

watch(
  product,
  (p) => {
    if (p) Object.assign(form, { ...p, comparePrice: p.comparePrice || 0 })
  },
  { immediate: true }
)

const save = () => {
  if (!product.value) return
  updateProduct(product.value.id, { ...form, comparePrice: form.comparePrice || undefined })
  router.push('/products')
}
const onDelete = () => {
  if (!product.value) return
  if (confirm('Delete this product?')) {
    removeProduct(product.value.id)
    router.push('/products')
  }
}
</script>
