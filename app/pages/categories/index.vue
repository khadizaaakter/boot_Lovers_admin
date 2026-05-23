<template>
  <div>
    <PageHeader title="Categories" subtitle="Organize products into shoppable collections.">
      <template #actions>
        <button class="btn-primary" @click="modal = true">
          <Icon name="ph:plus" class="w-4 h-4" />
          New Category
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="c in state.categories" :key="c.id" class="card overflow-hidden group">
        <div class="aspect-[16/9] bg-cream overflow-hidden">
          <img :src="c.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-display text-lg font-semibold">{{ c.name }}</h3>
              <p class="text-xs text-ink-soft">/{{ c.slug }}</p>
            </div>
            <span class="chip-info">{{ c.products }} items</span>
          </div>
          <div class="flex gap-2 mt-4">
            <button class="btn-secondary flex-1">
              <Icon name="ph:pencil-simple" class="w-4 h-4" />
              Edit
            </button>
            <button class="btn-ghost p-2 text-danger">
              <Icon name="ph:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal :open="modal" title="New Category" @close="modal = false">
      <div class="space-y-3">
        <div>
          <label class="label">Name</label>
          <input v-model="newCat.name" type="text" class="input" placeholder="e.g. Sneakers" />
        </div>
        <div>
          <label class="label">Slug</label>
          <input v-model="newCat.slug" type="text" class="input" placeholder="sneakers" />
        </div>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="modal = false">Cancel</button>
        <button class="btn-primary" @click="add">Create</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const { state } = useAdminData()
const modal = ref(false)
const newCat = reactive({ name: '', slug: '' })

const add = () => {
  if (!newCat.name) return
  state.categories.push({
    id: Math.max(...state.categories.map((c) => c.id)) + 1,
    name: newCat.name,
    slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-'),
    products: 0,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'
  })
  newCat.name = ''
  newCat.slug = ''
  modal.value = false
}
</script>
