export interface ApiInventory {
  inventory_id: number
  product_id: number
  type: 'in' | 'out'
  reason: 'purchase' | 'sale' | 'return' | 'damage' | 'correction' | 'adjustment'
  quantity: number
  stock_before: number
  stock_after: number
  reference_no: string | null
  note: string | null
  user_id: number | null
  created_at: string
  product?: { product_id: number; name: string; sku: string; thumbnail: string | null }
  user?: { id: number; name: string }
}

export interface InventoryPayload {
  product_id: number | string
  type: 'in' | 'out'
  reason: ApiInventory['reason']
  quantity: number
  reference_no?: string
  note?: string
}

export interface InventoryFilters {
  product_id?: number | string
  type?: string
  reason?: string
  date_from?: string
  date_to?: string
  per_page?: number
}

export interface InventorySummary {
  total_products: number
  total_stock: number
  stock_value: number
  low_stock_count: number
  out_of_stock_count: number
}

export const useInventoryApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiBase}/admin/inventories`

  const list = (filters: InventoryFilters = {}) =>
    $fetch<{ data: ApiInventory[]; current_page: number; last_page: number; total: number }>(base, {
      query: filters
    })

  const create = (payload: InventoryPayload) =>
    $fetch<ApiInventory>(base, { method: 'POST', body: payload })

  const show = (id: number) => $fetch<ApiInventory>(`${base}/${id}`)

  const remove = (id: number) => $fetch(`${base}/${id}`, { method: 'DELETE' })

  const lowStock = () =>
    $fetch<{ product_id: number; name: string; sku: string; thumbnail: string | null; stock: number; low_stock_threshold: number }[]>(
      `${base}/low-stock`
    )

  const summary = () => $fetch<InventorySummary>(`${base}/summary`)

  return { list, create, show, remove, lowStock, summary }
}
