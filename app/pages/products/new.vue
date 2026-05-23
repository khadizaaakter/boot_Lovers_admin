<template>
  <div>
    <PageHeader
      title="Add Product"
      :breadcrumbs="[{ label: 'Products', to: '/products' }, { label: 'Add Product' }]"
    >
      <template #actions>
        <NuxtLink to="/products" class="btn-secondary">Cancel</NuxtLink>
        <button class="btn-primary" @click="save">
          <Icon name="ph:check" class="w-4 h-4" />
          Save Product
        </button>
      </template>
    </PageHeader>

    <form class="grid grid-cols-1 lg:grid-cols-3 gap-4" @submit.prevent="save">
      <div class="lg:col-span-2 space-y-4">
        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Basic Information</h3>
          <div>
            <label class="label">Product name</label>
            <input v-model="form.name" type="text" class="input" placeholder="e.g. Heritage Leather Chelsea Boot" />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">SKU</label>
              <input v-model="form.sku" type="text" class="input" placeholder="BL-XXX-000" />
            </div>
            <div>
              <label class="label">Brand</label>
              <input v-model="form.brand" type="text" class="input" placeholder="Boot Lovers" />
            </div>
          </div>
          <div>
            <label class="label">Description</label>
            <textarea v-model="form.description" rows="5" class="input" placeholder="Tell the story of this product…"></textarea>
          </div>
        </div>

        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Pricing & Inventory</h3>
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Price</label>
              <input v-model.number="form.price" type="number" class="input" placeholder="0.00" />
            </div>
            <div>
              <label class="label">Compare-at price</label>
              <input v-model.number="form.comparePrice" type="number" class="input" placeholder="Optional" />
            </div>
            <div>
              <label class="label">Stock</label>
              <input v-model.number="form.stock" type="number" class="input" placeholder="0" />
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Sizes</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="s in sizes"
                  :key="s"
                  class="px-3 py-1.5 rounded-lg border border-black/10 text-sm cursor-pointer hover:bg-cream-soft"
                >
                  <input type="checkbox" :value="s" v-model="form.sizes" class="mr-1.5" />
                  {{ s }}
                </label>
              </div>
            </div>
            <div>
              <label class="label">Colors</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="c in colors"
                  :key="c.name"
                  class="px-3 py-1.5 rounded-lg border border-black/10 text-sm cursor-pointer hover:bg-cream-soft inline-flex items-center gap-2"
                >
                  <input type="checkbox" :value="c.name" v-model="form.colors" />
                  <span class="w-3.5 h-3.5 rounded-full inline-block border border-black/10" :style="{ backgroundColor: c.hex }"></span>
                  {{ c.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Media</h3>
          <div class="border-2 border-dashed border-black/10 rounded-xl p-8 text-center hover:border-brand transition-colors cursor-pointer">
            <Icon name="ph:cloud-arrow-up" class="w-10 h-10 mx-auto text-ink-soft" />
            <p class="text-sm mt-2">Drag & drop images here, or <span class="text-brand font-medium">browse</span></p>
            <p class="text-xs text-ink-soft mt-1">PNG, JPG up to 5MB · Recommended 1200x1200</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
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
          <div>
            <label class="label">Tags</label>
            <input type="text" class="input" placeholder="leather, premium, handmade" />
          </div>
        </div>

        <div class="card p-5 space-y-3">
          <h3 class="font-display text-lg font-semibold">SEO</h3>
          <div>
            <label class="label">Meta title</label>
            <input type="text" class="input" />
          </div>
          <div>
            <label class="label">Meta description</label>
            <textarea rows="3" class="input"></textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const router = useRouter()
const { state, addProduct } = useAdminData()

const sizes = ['38', '39', '40', '41', '42', '43', '44', '45']
const colors = [
  { name: 'Tan', hex: '#c19a6b' },
  { name: 'Brown', hex: '#5c3a21' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Cream', hex: '#f5efe6' },
  { name: 'Navy', hex: '#1f2a44' }
]

const form = reactive({
  name: '',
  sku: '',
  brand: 'Boot Lovers',
  description: '',
  price: 0,
  comparePrice: 0,
  stock: 0,
  sizes: [],
  colors: [],
  category: 'Boots',
  status: 'Draft'
})

const save = () => {
  if (!form.name) {
    alert('Please enter a product name.')
    return
  }
  addProduct({
    name: form.name,
    sku: form.sku || `BL-NEW-${Date.now().toString().slice(-4)}`,
    brand: form.brand,
    price: form.price,
    comparePrice: form.comparePrice || undefined,
    stock: form.stock,
    category: form.category,
    status: form.stock === 0 ? 'Out of stock' : form.status,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    rating: 0,
    sales: 0,
    createdAt: new Date().toISOString().slice(0, 10)
  })
  router.push('/products')
}
</script>
