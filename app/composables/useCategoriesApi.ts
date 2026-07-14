export interface ApiCategory {
  category_id: number
  name: string
  slug: string
  image: string | null
  status: boolean
  sort_order: number
}

export interface CategoryPayload {
  name: string
  slug: string
  status: boolean
  sortOrder: number
  image?: File | null
}

export const useCategoriesApi = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiBase}/admin/categories`

  const imageUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^https?:\/\//.test(path)) return path
    return `${config.public.apiBase.replace(/\/api\/?$/, '')}/storage/${path}`
  }

  const toFormData = (payload: Partial<CategoryPayload>) => {
    const form = new FormData()
    if (payload.name !== undefined) form.append('name', payload.name)
    if (payload.slug !== undefined) form.append('slug', payload.slug)
    if (payload.status !== undefined) form.append('status', payload.status ? '1' : '0')
    if (payload.sortOrder !== undefined) form.append('sort_order', String(payload.sortOrder))
    if (payload.image) form.append('image', payload.image)
    return form
  }

  const list = () => $fetch<ApiCategory[]>(base)

  const create = (payload: CategoryPayload) =>
    $fetch<ApiCategory>(base, { method: 'POST', body: toFormData(payload) })

  const update = (id: number, payload: Partial<CategoryPayload>) => {
    const form = toFormData(payload)
    form.append('_method', 'PUT')
    return $fetch<ApiCategory>(`${base}/${id}`, { method: 'POST', body: form })
  }

  const remove = (id: number) => $fetch(`${base}/${id}`, { method: 'DELETE' })

  return { list, create, update, remove, imageUrl }
}
