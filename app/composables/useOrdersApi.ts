export interface ApiOrderItem {
  id: number
  order_id: number
  product_id: number | null
  name: string
  image: string | null
  price: number
  quantity: number
  total: number
}

export interface ApiOrder {
  id: number
  order_number: string
  user_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  payment_status: 'Paid' | 'Unpaid' | 'Refunded'
  payment_method: string | null
  subtotal: number
  shipping_fee: number
  tax: number
  discount: number
  total: number
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_zip: string | null
  notes: string | null
  items_count?: number
  items?: ApiOrderItem[]
  created_at: string
}

export interface OrderFilters {
  search?: string
  status?: string
  payment_status?: string
  per_page?: number
}

export interface OrderUpdatePayload {
  status?: ApiOrder['status']
  payment_status?: ApiOrder['payment_status']
  payment_method?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  shipping_city?: string
  shipping_country?: string
  shipping_zip?: string
  notes?: string
}

export interface OrderStats {
  total: number
  by_status: Record<string, number>
  by_payment_status: Record<string, number>
}

export const useOrdersApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiBase}/admin/orders`

  const list = (filters: OrderFilters = {}) =>
    $fetch<{ data: ApiOrder[]; current_page: number; last_page: number; total: number }>(base, {
      query: filters
    })

  const stats = () => $fetch<OrderStats>(`${base}/stats`)

  const show = (id: number | string) => $fetch<ApiOrder>(`${base}/${id}`)

  const update = (id: number | string, payload: OrderUpdatePayload) =>
    $fetch<ApiOrder>(`${base}/${id}`, { method: 'PUT', body: payload })

  const remove = (id: number | string) => $fetch(`${base}/${id}`, { method: 'DELETE' })

  const exportUrl = (filters: OrderFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value))
    })
    const qs = params.toString()
    return `${base}/export${qs ? `?${qs}` : ''}`
  }

  return { list, stats, show, update, remove, exportUrl }
}
