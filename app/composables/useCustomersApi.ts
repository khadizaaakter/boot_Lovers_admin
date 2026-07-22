export interface ApiCustomer {
  id: number
  name: string
  email: string
  phone: string | null
  city: string | null
  avatar: string | null
  status: 'Active' | 'Pending'
  created_at: string
}

export interface CustomerPayload {
  name: string
  email: string
  phone?: string
  city?: string
  avatar?: string
  status?: 'Active' | 'Pending'
  password?: string
}

export interface CustomerFilters {
  search?: string
  status?: string
  per_page?: number
}

export const useCustomersApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiBase}/admin/customers`

  const list = (filters: CustomerFilters = {}) =>
    $fetch<{ data: ApiCustomer[]; current_page: number; last_page: number; total: number }>(base, {
      query: filters
    })

  const create = (payload: CustomerPayload) =>
    $fetch<ApiCustomer>(base, { method: 'POST', body: payload })

  const show = (id: number) => $fetch<ApiCustomer>(`${base}/${id}`)

  const update = (id: number, payload: Partial<CustomerPayload>) =>
    $fetch<ApiCustomer>(`${base}/${id}`, { method: 'PUT', body: payload })

  const remove = (id: number) => $fetch(`${base}/${id}`, { method: 'DELETE' })

  return { list, create, show, update, remove }
}
