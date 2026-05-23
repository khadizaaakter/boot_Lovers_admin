<template>
  <div>
    <PageHeader title="Coupons" subtitle="Discount codes and promotions.">
      <template #actions>
        <button class="btn-primary" @click="modal = true">
          <Icon name="ph:plus" class="w-4 h-4" />
          New Coupon
        </button>
      </template>
    </PageHeader>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th class="text-right">Value</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in state.coupons" :key="c.id">
              <td>
                <code class="bg-cream-soft px-2.5 py-1 rounded-md font-mono text-xs font-semibold">
                  {{ c.code }}
                </code>
              </td>
              <td>{{ c.type }}</td>
              <td class="text-right font-semibold">
                {{ c.type === 'Percent' ? `${c.value}%` : `$${c.value}` }}
              </td>
              <td class="w-56">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                    <div class="h-full bg-brand rounded-full" :style="{ width: ((c.used / c.limit) * 100) + '%' }"></div>
                  </div>
                  <span class="text-xs text-ink-soft tabular-nums">{{ c.used }}/{{ c.limit }}</span>
                </div>
              </td>
              <td class="text-ink-soft">{{ c.expires }}</td>
              <td><StatusChip :status="c.status" /></td>
              <td class="text-right">
                <button class="btn-ghost p-1.5"><Icon name="ph:pencil-simple" class="w-4 h-4" /></button>
                <button class="btn-ghost p-1.5 text-danger"><Icon name="ph:trash" class="w-4 h-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modal" title="New Coupon" @close="modal = false">
      <div class="space-y-3">
        <div>
          <label class="label">Code</label>
          <input v-model="newCp.code" type="text" class="input" placeholder="e.g. SUMMER20" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Type</label>
            <select v-model="newCp.type" class="input">
              <option>Percent</option>
              <option>Fixed</option>
            </select>
          </div>
          <div>
            <label class="label">Value</label>
            <input v-model.number="newCp.value" type="number" class="input" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Usage limit</label>
            <input v-model.number="newCp.limit" type="number" class="input" />
          </div>
          <div>
            <label class="label">Expires</label>
            <input v-model="newCp.expires" type="date" class="input" />
          </div>
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
const newCp = reactive({ code: '', type: 'Percent', value: 10, limit: 100, expires: '' })

const add = () => {
  if (!newCp.code) return
  state.coupons.unshift({
    id: Math.max(...state.coupons.map((c) => c.id)) + 1,
    code: newCp.code.toUpperCase(),
    type: newCp.type,
    value: newCp.value,
    used: 0,
    limit: newCp.limit,
    expires: newCp.expires || '2026-12-31',
    status: 'Active'
  })
  modal.value = false
  newCp.code = ''
}
</script>
