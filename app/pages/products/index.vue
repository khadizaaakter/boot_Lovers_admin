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

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <!-- Filters -->
    <div class="card p-3 sm:p-4 mb-4 filter-bar">
      <div class="filter-search">
        <Icon
          name="ph:magnifying-glass"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search products by name or SKU…"
          class="input pl-9"
        />
      </div>
      <select v-model="categoryFilter" class="input">
        <option value="">All categories</option>
        <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
          {{ c.name }}
        </option>
      </select>
      <select v-model="statusFilter" class="input">
        <option value="">All statuses</option>
        <option value="1">Published</option>
        <option value="0">Draft</option>
      </select>
      <button class="btn-ghost w-full sm:w-auto" @click="resetFilters">
        <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4" />
        Reset
      </button>
    </div>

    <div v-if="loading" class="text-sm text-ink-soft py-10 text-center">
      Loading products…
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden">
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
            <tr v-for="p in filtered" :key="p.product_id">
              <td><input type="checkbox" /></td>
              <td>
                <div class="flex items-center gap-3">
                  <img
                    v-if="p.thumbnail"
                    :src="imageUrl(p.thumbnail)"
                    class="w-11 h-11 rounded-lg object-cover bg-cream"
                  />
                  <div
                    v-else
                    class="w-11 h-11 rounded-lg bg-cream flex items-center justify-center shrink-0"
                  >
                    <Icon name="ph:image" class="w-5 h-5 text-ink-soft" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ p.name }}</p>
                  </div>
                </div>
              </td>
              <td class="text-ink-soft">{{ p.sku }}</td>
              <td>{{ categoryName(p.category_id) }}</td>
              <td class="text-right">
                <span class="font-semibold">{{ formatMoney(p.price) }}</span>
                <span v-if="p.discount_price" class="block text-xs text-ink-soft">
                  Discount: {{ formatMoney(p.discount_price) }}
                </span>
              </td>
              <td class="text-right">
                <span
                  :class="
                    p.stock === 0
                      ? 'text-danger font-semibold'
                      : p.stock < 10
                      ? 'text-warning font-semibold'
                      : ''
                  "
                >
                  {{ p.stock }}
                </span>
              </td>
              <td>
                <StatusChip
                  :status="p.status ? 'Active' : 'Draft'"
                  :label="p.status ? 'Published' : 'Draft'"
                />
              </td>
              <td class="text-right">
                <div class="inline-flex items-center gap-1">
                  <NuxtLink
                    :to="`/products/${p.product_id}`"
                    class="btn-ghost p-1.5"
                    aria-label="Edit"
                  >
                    <Icon name="ph:pencil-simple" class="w-4 h-4" />
                  </NuxtLink>
                  <button class="btn-ghost p-1.5" aria-label="View">
                    <Icon name="ph:eye" class="w-4 h-4" />
                  </button>
                  <button
                    class="btn-ghost p-1.5 text-danger"
                    aria-label="Delete"
                    @click="onDelete(p)"
                  >
                    <Icon name="ph:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="8" class="text-center py-10 text-ink-soft">
                No products match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-black/5"
      >
        <p class="text-xs text-ink-soft text-center sm:text-left">
          Showing <span class="font-semibold">{{ filtered.length }}</span> of
          {{ products.length }} products
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const { list: listProducts, remove, imageUrl } = useProductsApi();
const { list: listCategories } = useCategoriesApi();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref("");

const search = ref("");
const categoryFilter = ref("");
const statusFilter = ref("");

const formatMoney = (n) => `$${Number(n).toLocaleString("en-US")}`;

const categoryName = (id) =>
  categories.value.find((c) => c.category_id === id)?.name || "—";

const fetchAll = async () => {
  loading.value = true;
  error.value = "";
  try {
    const [productList, categoryList] = await Promise.all([
      listProducts(),
      listCategories(),
    ]);
    products.value = productList;
    categories.value = categoryList;
  } catch (e) {
    error.value = "Could not load products. Is the API running?";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAll);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return products.value.filter((p) => {
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) return false;
    if (categoryFilter.value && p.category_id !== categoryFilter.value) return false;
    if (statusFilter.value !== "" && Number(p.status) !== Number(statusFilter.value))
      return false;
    return true;
  });
});

const resetFilters = () => {
  search.value = "";
  categoryFilter.value = "";
  statusFilter.value = "";
};

const onDelete = async (p) => {
  if (!confirm(`Delete "${p.name}"?`)) return;
  try {
    await remove(p.product_id);
    await fetchAll();
  } catch (e) {
    error.value = "Could not delete this product.";
  }
};
</script>
