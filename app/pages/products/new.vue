<template>
  <div>
    <PageHeader
      title="Add Product"
      :breadcrumbs="[{ label: 'Products', to: '/products' }, { label: 'Add Product' }]"
    >
      <template #actions>
        <NuxtLink to="/products" class="btn-secondary">Cancel</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save">
          <Icon name="ph:check" class="w-4 h-4" />
          {{ saving ? "Saving…" : "Save Product" }}
        </button>
      </template>
    </PageHeader>

    <div v-if="formError" class="card p-4 mb-4 text-sm text-danger">
      {{ formError }}
    </div>

    <form class="grid grid-cols-1 lg:grid-cols-3 gap-4" @submit.prevent="save">
      <div class="lg:col-span-2 space-y-4">
        <div class="card p-4 sm:p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Basic Information</h3>
          <div>
            <label class="label">Product name</label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              placeholder="Heritage Leather Chelsea Boot"
              @input="syncSlug"
            />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Slug</label>
              <input v-model="form.slug" type="text" class="input" placeholder="heritage-leather-chelsea-boot" />
            </div>
            <div>
              <label class="label">SKU</label>
              <input v-model="form.sku" type="text" class="input" placeholder="BL-XXX-000" />
            </div>
          </div>
          <div>
            <label class="label">Short description</label>
            <input
              v-model="form.short_description"
              type="text"
              class="input"
              placeholder="A quick one-liner for listings"
            />
          </div>
          <div>
            <label class="label">Description</label>
            <textarea
              v-model="form.description"
              rows="5"
              class="input"
              placeholder="Tell the story of this product…"
            ></textarea>
          </div>
        </div>

        <div class="card p-4 sm:p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Pricing & Inventory</h3>
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Price</label>
              <input v-model.number="form.price" type="number" class="input" placeholder="0.00" />
            </div>
            <div>
              <label class="label">Discount price</label>
              <input v-model.number="form.discount_price" type="number" class="input" placeholder="Optional" />
            </div>
            <div>
              <label class="label">Stock</label>
              <input v-model.number="form.stock" type="number" class="input" placeholder="0" />
            </div>
          </div>
        </div>

        <div class="card p-4 sm:p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Thumbnail</h3>
          <input type="file" accept="image/*" class="input" @change="onThumbnailChange" />
          <img
            v-if="thumbnailPreview"
            :src="thumbnailPreview"
            class="w-32 h-32 object-cover rounded-lg"
          />
        </div>

        <div class="card p-4 sm:p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Gallery images</h3>
          <input type="file" accept="image/*" multiple class="input" @change="onImagesChange" />
          <div v-if="imagePreviews.length" class="flex flex-wrap gap-3">
            <img
              v-for="(src, i) in imagePreviews"
              :key="i"
              :src="src"
              class="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-4 sm:p-5 space-y-4">
          <h3 class="font-display text-lg font-semibold">Organization</h3>
          <div>
            <label class="label">Category</label>
            <select v-model="form.category_id" class="input" :disabled="loadingCategories">
              <option value="" disabled>
                {{ loadingCategories ? "Loading categories…" : "Select a category" }}
              </option>
              <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">Status</label>
            <select v-model="form.status" class="input">
              <option :value="true">Published</option>
              <option :value="false">Draft</option>
            </select>
          </div>
          <div>
            <label class="label">Sort order</label>
            <input v-model.number="form.sort_order" type="number" class="input" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";

const router = useRouter();
const { list: listCategories } = useCategoriesApi();
const { create } = useProductsApi();

const categories = ref([]);
const loadingCategories = ref(true);
const saving = ref(false);
const formError = ref("");
const thumbnailPreview = ref("");
const imagePreviews = ref([]);

const form = reactive({
  category_id: "",
  name: "",
  slug: "",
  sku: "",
  short_description: "",
  description: "",
  price: 0,
  discount_price: 0,
  stock: 0,
  thumbnail: null,
  status: true,
  sort_order: 0,
  images: [],
});

onMounted(async () => {
  try {
    categories.value = await listCategories();
  } catch (e) {
    formError.value = "Could not load categories. Is the API running?";
  } finally {
    loadingCategories.value = false;
  }
});

const syncSlug = () => {
  form.slug = form.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const onThumbnailChange = (e) => {
  const file = e.target.files?.[0] || null;
  form.thumbnail = file;
  thumbnailPreview.value = file ? URL.createObjectURL(file) : "";
};

const onImagesChange = (e) => {
  const files = Array.from(e.target.files || []);
  form.images = files;
  imagePreviews.value = files.map((f) => URL.createObjectURL(f));
};

const save = async () => {
  if (!form.name || !form.slug || !form.sku || !form.category_id) {
    formError.value = "Name, slug, SKU and category are required.";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    await create({ ...form });
    router.push("/products");
  } catch (e) {
    formError.value = e?.data?.message || "Could not save this product.";
  } finally {
    saving.value = false;
  }
};
</script>
