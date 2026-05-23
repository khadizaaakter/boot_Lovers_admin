// Mock data store for the Boot Lovers admin panel.
// No backend — everything lives in module-level reactive state.

import { reactive, readonly } from 'vue'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  brand: string
  price: number
  comparePrice?: number
  stock: number
  status: 'Published' | 'Draft' | 'Out of stock'
  image: string
  rating: number
  sales: number
  createdAt: string
}

export interface Order {
  id: string
  customer: string
  email: string
  date: string
  total: number
  items: number
  payment: 'Paid' | 'Unpaid' | 'Refunded'
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  products: { name: string; qty: number; price: number; image: string }[]
  shipping: { address: string; city: string; country: string; zip: string }
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  city: string
  orders: number
  spent: number
  joined: string
  avatar: string
  status: 'Active' | 'Pending'
}

export interface Category {
  id: number
  name: string
  slug: string
  products: number
  parent?: string
  image: string
}

export interface Review {
  id: number
  product: string
  customer: string
  rating: number
  comment: string
  date: string
  status: 'Published' | 'Pending'
}

export interface Coupon {
  id: number
  code: string
  type: 'Percent' | 'Fixed'
  value: number
  used: number
  limit: number
  expires: string
  status: 'Active' | 'Draft' | 'Cancelled'
}

const products: Product[] = [
  {
    id: 1,
    name: 'Heritage Leather Chelsea Boot',
    sku: 'BL-CHEL-001',
    category: 'Boots',
    brand: 'Boot Lovers',
    price: 189,
    comparePrice: 230,
    stock: 42,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400',
    rating: 4.7,
    sales: 312,
    createdAt: '2026-02-12'
  },
  {
    id: 2,
    name: 'Rugged Trail Hiker',
    sku: 'BL-HIKE-204',
    category: 'Boots',
    brand: 'Boot Lovers',
    price: 215,
    stock: 18,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    rating: 4.5,
    sales: 198,
    createdAt: '2026-01-30'
  },
  {
    id: 3,
    name: 'Classic Oxford Formal',
    sku: 'BL-OXF-301',
    category: 'Formal',
    brand: 'Boot Lovers',
    price: 165,
    comparePrice: 190,
    stock: 7,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
    rating: 4.8,
    sales: 245,
    createdAt: '2026-02-04'
  },
  {
    id: 4,
    name: 'Suede Desert Boot',
    sku: 'BL-DES-410',
    category: 'Boots',
    brand: 'Boot Lovers',
    price: 145,
    stock: 0,
    status: 'Out of stock',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400',
    rating: 4.4,
    sales: 178,
    createdAt: '2026-01-18'
  },
  {
    id: 5,
    name: 'Pro Runner Sports Sneaker',
    sku: 'BL-SPT-512',
    category: 'Sports',
    brand: 'Boot Lovers',
    price: 129,
    stock: 64,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.6,
    sales: 401,
    createdAt: '2026-03-02'
  },
  {
    id: 6,
    name: 'Italian Leather Belt',
    sku: 'BL-BEL-088',
    category: 'Belts',
    brand: 'Boot Lovers',
    price: 65,
    stock: 95,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583a2?w=400',
    rating: 4.7,
    sales: 156,
    createdAt: '2026-02-20'
  },
  {
    id: 7,
    name: 'Premium Saddle Bag',
    sku: 'BL-BAG-019',
    category: 'Premium Bags',
    brand: 'Boot Lovers',
    price: 320,
    comparePrice: 380,
    stock: 11,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    rating: 4.9,
    sales: 87,
    createdAt: '2026-03-09'
  },
  {
    id: 8,
    name: 'Winter Snow Boot',
    sku: 'BL-WIN-722',
    category: 'Boots',
    brand: 'Boot Lovers',
    price: 235,
    stock: 24,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    rating: 0,
    sales: 0,
    createdAt: '2026-05-12'
  }
]

const orders: Order[] = [
  {
    id: '#BL-10421',
    customer: 'Ayesha Rahman',
    email: 'ayesha@example.com',
    date: '2026-05-22',
    total: 354,
    items: 2,
    payment: 'Paid',
    status: 'Processing',
    products: [
      { name: 'Heritage Leather Chelsea Boot', qty: 1, price: 189, image: products[0].image },
      { name: 'Italian Leather Belt', qty: 1, price: 65, image: products[5].image }
    ],
    shipping: { address: '24 Gulshan Avenue', city: 'Dhaka', country: 'Bangladesh', zip: '1212' }
  },
  {
    id: '#BL-10420',
    customer: 'Marcus Lee',
    email: 'marcus.lee@example.com',
    date: '2026-05-22',
    total: 215,
    items: 1,
    payment: 'Paid',
    status: 'Shipped',
    products: [{ name: 'Rugged Trail Hiker', qty: 1, price: 215, image: products[1].image }],
    shipping: { address: '88 King St', city: 'Toronto', country: 'Canada', zip: 'M5V 1J5' }
  },
  {
    id: '#BL-10419',
    customer: 'Sofía Martín',
    email: 'sofia.m@example.com',
    date: '2026-05-21',
    total: 485,
    items: 2,
    payment: 'Paid',
    status: 'Delivered',
    products: [
      { name: 'Premium Saddle Bag', qty: 1, price: 320, image: products[6].image },
      { name: 'Classic Oxford Formal', qty: 1, price: 165, image: products[2].image }
    ],
    shipping: { address: 'Calle Mayor 14', city: 'Madrid', country: 'Spain', zip: '28013' }
  },
  {
    id: '#BL-10418',
    customer: 'Tanvir Hasan',
    email: 'tanvir.h@example.com',
    date: '2026-05-21',
    total: 129,
    items: 1,
    payment: 'Unpaid',
    status: 'Pending',
    products: [{ name: 'Pro Runner Sports Sneaker', qty: 1, price: 129, image: products[4].image }],
    shipping: { address: '57 Banani Road', city: 'Dhaka', country: 'Bangladesh', zip: '1213' }
  },
  {
    id: '#BL-10417',
    customer: 'Olivia Bennett',
    email: 'olivia.b@example.com',
    date: '2026-05-20',
    total: 165,
    items: 1,
    payment: 'Paid',
    status: 'Delivered',
    products: [{ name: 'Classic Oxford Formal', qty: 1, price: 165, image: products[2].image }],
    shipping: { address: '12 Baker St', city: 'London', country: 'UK', zip: 'NW1 6XE' }
  },
  {
    id: '#BL-10416',
    customer: 'Rakib Mia',
    email: 'rakib@example.com',
    date: '2026-05-20',
    total: 64,
    items: 1,
    payment: 'Refunded',
    status: 'Cancelled',
    products: [{ name: 'Italian Leather Belt', qty: 1, price: 65, image: products[5].image }],
    shipping: { address: '301 New Market', city: 'Chittagong', country: 'Bangladesh', zip: '4000' }
  },
  {
    id: '#BL-10415',
    customer: 'Hiroshi Tanaka',
    email: 'hiroshi.t@example.com',
    date: '2026-05-19',
    total: 320,
    items: 1,
    payment: 'Paid',
    status: 'Shipped',
    products: [{ name: 'Premium Saddle Bag', qty: 1, price: 320, image: products[6].image }],
    shipping: { address: '4 Chiyoda', city: 'Tokyo', country: 'Japan', zip: '100-0001' }
  },
  {
    id: '#BL-10414',
    customer: 'Emma Carter',
    email: 'emma.c@example.com',
    date: '2026-05-18',
    total: 189,
    items: 1,
    payment: 'Paid',
    status: 'Delivered',
    products: [{ name: 'Heritage Leather Chelsea Boot', qty: 1, price: 189, image: products[0].image }],
    shipping: { address: '99 Queen St', city: 'Sydney', country: 'Australia', zip: '2000' }
  }
]

const customers: Customer[] = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    email: 'ayesha@example.com',
    phone: '+8801711-223344',
    city: 'Dhaka, BD',
    orders: 14,
    spent: 2841,
    joined: '2025-08-10',
    avatar: 'https://i.pravatar.cc/100?img=47',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Marcus Lee',
    email: 'marcus.lee@example.com',
    phone: '+1 416 555 0192',
    city: 'Toronto, CA',
    orders: 9,
    spent: 1755,
    joined: '2025-09-04',
    avatar: 'https://i.pravatar.cc/100?img=12',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Sofía Martín',
    email: 'sofia.m@example.com',
    phone: '+34 600 123 456',
    city: 'Madrid, ES',
    orders: 22,
    spent: 5128,
    joined: '2025-04-22',
    avatar: 'https://i.pravatar.cc/100?img=32',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Tanvir Hasan',
    email: 'tanvir.h@example.com',
    phone: '+8801511-998877',
    city: 'Dhaka, BD',
    orders: 3,
    spent: 412,
    joined: '2026-02-18',
    avatar: 'https://i.pravatar.cc/100?img=15',
    status: 'Pending'
  },
  {
    id: 5,
    name: 'Olivia Bennett',
    email: 'olivia.b@example.com',
    phone: '+44 7700 900123',
    city: 'London, UK',
    orders: 11,
    spent: 2204,
    joined: '2025-11-30',
    avatar: 'https://i.pravatar.cc/100?img=48',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Rakib Mia',
    email: 'rakib@example.com',
    phone: '+8801911-654321',
    city: 'Chittagong, BD',
    orders: 1,
    spent: 64,
    joined: '2026-05-04',
    avatar: 'https://i.pravatar.cc/100?img=8',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Hiroshi Tanaka',
    email: 'hiroshi.t@example.com',
    phone: '+81 90 1234 5678',
    city: 'Tokyo, JP',
    orders: 7,
    spent: 1980,
    joined: '2025-06-12',
    avatar: 'https://i.pravatar.cc/100?img=11',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Emma Carter',
    email: 'emma.c@example.com',
    phone: '+61 4 1234 5678',
    city: 'Sydney, AU',
    orders: 5,
    spent: 945,
    joined: '2025-12-08',
    avatar: 'https://i.pravatar.cc/100?img=44',
    status: 'Active'
  }
]

const categories: Category[] = [
  { id: 1, name: 'Boots', slug: 'boots', products: 42, image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=200' },
  { id: 2, name: 'Formal', slug: 'formal', products: 18, image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200' },
  { id: 3, name: 'Sports', slug: 'sports', products: 27, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
  { id: 4, name: 'Belts', slug: 'belts', products: 14, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583a2?w=200' },
  { id: 5, name: 'Premium Bags', slug: 'bags', products: 9, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200' },
  { id: 6, name: 'Accessories', slug: 'accessories', products: 21, image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=200' }
]

const reviews: Review[] = [
  { id: 1, product: 'Heritage Leather Chelsea Boot', customer: 'Sofía Martín', rating: 5, comment: 'Absolutely worth every penny. The leather feels premium and breaks in beautifully.', date: '2026-05-21', status: 'Published' },
  { id: 2, product: 'Rugged Trail Hiker', customer: 'Marcus Lee', rating: 4, comment: 'Great grip and comfort on long hikes. Slightly snug at the toe.', date: '2026-05-20', status: 'Published' },
  { id: 3, product: 'Classic Oxford Formal', customer: 'Olivia Bennett', rating: 5, comment: 'Perfect for the office. Got compliments on day one.', date: '2026-05-19', status: 'Published' },
  { id: 4, product: 'Pro Runner Sports Sneaker', customer: 'Tanvir Hasan', rating: 3, comment: 'Looks good but sole wore down faster than I expected.', date: '2026-05-18', status: 'Pending' },
  { id: 5, product: 'Premium Saddle Bag', customer: 'Hiroshi Tanaka', rating: 5, comment: 'Stunning craftsmanship. Worth the premium price.', date: '2026-05-17', status: 'Published' }
]

const coupons: Coupon[] = [
  { id: 1, code: 'WELCOME10', type: 'Percent', value: 10, used: 124, limit: 500, expires: '2026-12-31', status: 'Active' },
  { id: 2, code: 'BOOT25', type: 'Percent', value: 25, used: 58, limit: 100, expires: '2026-06-30', status: 'Active' },
  { id: 3, code: 'FREESHIP', type: 'Fixed', value: 15, used: 412, limit: 1000, expires: '2026-08-15', status: 'Active' },
  { id: 4, code: 'SUMMER50', type: 'Fixed', value: 50, used: 0, limit: 200, expires: '2026-09-01', status: 'Draft' },
  { id: 5, code: 'OLDPROMO', type: 'Percent', value: 15, used: 89, limit: 100, expires: '2026-03-31', status: 'Cancelled' }
]

const state = reactive({
  products,
  orders,
  customers,
  categories,
  reviews,
  coupons
})

export const useAdminData = () => ({
  state: readonly(state) as typeof state,
  raw: state,
  formatMoney: (n: number) => `$${n.toLocaleString('en-US')}`,
  addProduct: (p: Omit<Product, 'id'>) => {
    const id = Math.max(...state.products.map((x) => x.id)) + 1
    state.products.unshift({ ...p, id } as Product)
    return id
  },
  updateProduct: (id: number, patch: Partial<Product>) => {
    const i = state.products.findIndex((p) => p.id === id)
    if (i !== -1) state.products[i] = { ...state.products[i], ...patch }
  },
  removeProduct: (id: number) => {
    const i = state.products.findIndex((p) => p.id === id)
    if (i !== -1) state.products.splice(i, 1)
  },
  updateOrderStatus: (id: string, status: Order['status']) => {
    const o = state.orders.find((x) => x.id === id)
    if (o) o.status = status
  }
})

// Convenience seed data for dashboard charts.
export const useDashboardSeries = () => ({
  monthlySales: [3200, 4100, 3800, 5200, 4800, 6100, 6800, 5900, 7200, 8400, 7900, 9200],
  monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weeklyVisitors: [820, 940, 1100, 870, 1320, 1480, 1210],
  weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  revenueSpark: [12, 18, 15, 22, 28, 24, 30, 34, 32, 38, 42, 48],
  ordersSpark: [42, 38, 51, 46, 55, 62, 58, 68, 72, 70, 78, 85],
  customersSpark: [120, 138, 152, 165, 178, 192, 210, 224, 238, 252, 270, 288],
  refundsSpark: [4, 6, 3, 5, 2, 4, 3, 2, 5, 3, 4, 2]
})
