<template>
  <div>
    <PageHeader
      title="Categories"
      subtitle="Organize products into shoppable collections."
    >
      <template #actions>
        <button class="btn-primary" @click="openCreate">
          <Icon name="ph:plus" class="w-4 h-4" />
          New Category
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="card p-4 mb-4 text-sm text-danger">
      {{ error }}
    </div>

    <div v-if="loading" class="text-sm text-ink-soft py-10 text-center">
      Loading categories…
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in categories"
        :key="c.category_id"
        class="card overflow-hidden group"
      >
        <div class="aspect-[16/9] bg-cream overflow-hidden">
          <img
            v-if="imageUrl(c.image)"
            :src="imageUrl(c.image)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-display text-lg font-semibold">{{ c.name }}</h3>
              <p class="text-xs text-ink-soft">/{{ c.slug }}</p>
            </div>
            <StatusChip
              :status="c.status ? 'Active' : 'Draft'"
              :label="c.status ? 'Active' : 'Inactive'"
            />
          </div>
          <div class="flex gap-2 mt-4">
            <button class="btn-secondary flex-1" @click="openEdit(c)">
              <Icon name="ph:pencil-simple" class="w-4 h-4" />
              Edit
            </button>
            <button class="btn-ghost p-2 text-danger" @click="onDelete(c)">
              <Icon name="ph:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <p v-if="!categories.length" class="col-span-full text-center py-10 text-ink-soft">
        No categories yet.
      </p>
    </div>

    <Modal
      :open="modal"
      :title="editing ? 'Edit Category' : 'New Category'"
      @close="closeModal"
    >
      <div class="space-y-3">
        <div v-if="formError" class="text-sm text-danger">{{ formError }}</div>
        <div>
          <label class="label">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="Sneakers"
            @input="syncSlug"
          />
        </div>
        <div>
          <label class="label">Slug</label>
          <input v-model="form.slug" type="text" class="input" placeholder="sneakers" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Sort order</label>
            <input v-model.number="form.sortOrder" type="number" class="input" />
          </div>
          <div>
            <label class="label">Status</label>
            <select v-model="form.status" class="input">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">Image</label>
          <input type="file" accept="image/*" class="input" @change="onFileChange" />
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="mt-2 w-full aspect-[16/9] object-cover rounded-lg"
          />
        </div>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="closeModal">Cancel</button>
        <button class="btn-primary" :disabled="saving" @click="save">
          {{ saving ? "Saving…" : editing ? "Save Changes" : "Create" }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const { list, create, update, remove, imageUrl } = useCategoriesApi();

const categories = ref([]);
const loading = ref(true);
const error = ref("");

const modal = ref(false);
const editing = ref(null);
const saving = ref(false);
const formError = ref("");
const previewUrl = ref("");

const form = reactive({ name: "", slug: "", status: true, sortOrder: 0, image: null });

const fetchCategories = async () => {
  loading.value = true;
  error.value = "";
  try {
    categories.value = await list();
  } catch (e) {
    error.value = "Could not load categories. Is the API running?";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);

const resetForm = () => {
  form.name = "";
  form.slug = "";
  form.status = true;
  form.sortOrder = 0;
  form.image = null;
  formError.value = "";
  previewUrl.value = "";
};

const openCreate = () => {
  editing.value = null;
  resetForm();
  modal.value = true;
};

const openEdit = (c) => {
  editing.value = c;
  form.name = c.name;
  form.slug = c.slug;
  form.status = !!c.status;
  form.sortOrder = c.sort_order;
  form.image = null;
  formError.value = "";
  previewUrl.value = imageUrl(c.image);
  modal.value = true;
};

const closeModal = () => {
  modal.value = false;
  resetForm();
};

const syncSlug = () => {
  if (editing.value) return;
  form.slug = form.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const onFileChange = (e) => {
  const file = e.target.files?.[0] || null;
  form.image = file;
  previewUrl.value = file
    ? URL.createObjectURL(file)
    : editing.value
    ? imageUrl(editing.value.image)
    : "";
};

const save = async () => {
  if (!form.name || !form.slug) {
    formError.value = "Name and slug are required.";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    if (editing.value) {
      await update(editing.value.category_id, {
        name: form.name,
        slug: form.slug,
        status: form.status,
        sortOrder: form.sortOrder,
        image: form.image,
      });
    } else {
      await create({
        name: form.name,
        slug: form.slug,
        status: form.status,
        sortOrder: form.sortOrder,
        image: form.image,
      });
    }
    closeModal();
    await fetchCategories();
  } catch (e) {
    formError.value = e?.data?.message || "Could not save this category.";
  } finally {
    saving.value = false;
  }
};

const onDelete = async (c) => {
  if (!confirm(`Delete "${c.name}"?`)) return;
  try {
    await remove(c.category_id);
    await fetchCategories();
  } catch (e) {
    error.value = "Could not delete this category.";
  }
};
</script>
