export interface ApiProduct {
  product_id: number
  category_id: number
  name: string
  slug: string
  sku: string
  short_description: string | null
  description: string | null
  price: number
  discount_price: number | null
  stock: number
  low_stock_threshold: number
  thumbnail: string | null
  status: boolean
  sort_order: number
}

export interface ProductPayload {
  category_id: number | string
  name: string
  slug: string
  sku: string
  short_description?: string
  description?: string
  price: number
  discount_price?: number
  stock?: number
  thumbnail?: File | null
  status: boolean
  sort_order?: number
  images?: File[]
}

export const useProductsApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiBase}/admin/products`

  const imageUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^https?:\/\//.test(path)) return path
    return `${config.public.apiBase.replace(/\/api\/?$/, '')}/storage/${path}`
  }

  const toFormData = (payload: Partial<ProductPayload>) => {
    const form = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (key === 'images') {
        (value as File[]).forEach((image, i) => form.append(`images[${i}]`, image))
      } else if (key === 'status') {
        form.append('status', value ? '1' : '0')
      } else {
        form.append(key, value as string | Blob)
      }
    })
    return form
  }

  const list = () => $fetch<ApiProduct[]>(base)

  const create = (payload: ProductPayload) =>
    $fetch<ApiProduct>(base, { method: 'POST', body: toFormData(payload) })

  const update = (id: number, payload: Partial<ProductPayload>) => {
    const form = toFormData(payload)
    form.append('_method', 'PUT')
    return $fetch<ApiProduct>(`${base}/${id}`, { method: 'POST', body: form })
  }

  const remove = (id: number) => $fetch(`${base}/${id}`, { method: 'DELETE' })

  return { list, create, update, remove, imageUrl }
}
