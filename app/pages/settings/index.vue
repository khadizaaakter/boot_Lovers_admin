<template>
  <div>
    <PageHeader title="Settings" subtitle="Configure your store, account and preferences." />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <aside class="lg:col-span-1">
        <nav class="card p-2 flex lg:flex-col gap-1 overflow-x-auto -mx-1 px-1 lg:overflow-visible lg:mx-0">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="flex items-center gap-2 lg:gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left whitespace-nowrap shrink-0 lg:w-full"
            :class="active === t.id ? 'bg-cream-soft text-brand-700 font-semibold' : 'hover:bg-cream-soft text-ink-soft'"
            @click="active = t.id"
          >
            <Icon :name="t.icon" class="w-4 h-4" />
            {{ t.label }}
          </button>
        </nav>
      </aside>

      <section class="lg:col-span-3 space-y-4 min-w-0">
        <!-- Store -->
        <div v-if="active === 'store'" class="card p-4 sm:p-6 space-y-5">
          <h3 class="font-display text-xl font-semibold">Store Information</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Store name</label>
              <input type="text" class="input" value="Boot Lovers" />
            </div>
            <div>
              <label class="label">Support email</label>
              <input type="email" class="input" value="support@bootlovers.com" />
            </div>
            <div>
              <label class="label">Currency</label>
              <select class="input">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>BDT (৳)</option>
              </select>
            </div>
            <div>
              <label class="label">Timezone</label>
              <select class="input">
                <option>Asia/Dhaka (UTC+6)</option>
                <option>Europe/London (UTC+0)</option>
                <option>America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="label">Store address</label>
            <textarea rows="3" class="input">Plot 24, Banani, Dhaka 1213, Bangladesh</textarea>
          </div>
          <div class="flex justify-end">
            <button class="btn-primary">Save changes</button>
          </div>
        </div>

        <!-- Profile -->
        <div v-if="active === 'profile'" class="card p-4 sm:p-6 space-y-5">
          <h3 class="font-display text-xl font-semibold">Your Profile</h3>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-brand text-white text-2xl font-display font-bold flex items-center justify-center">A</div>
            <div>
              <button class="btn-secondary">Upload photo</button>
              <p class="text-xs text-ink-soft mt-1">JPG or PNG, up to 2MB.</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">First name</label>
              <input type="text" class="input" value="Admin" />
            </div>
            <div>
              <label class="label">Last name</label>
              <input type="text" class="input" value="User" />
            </div>
            <div>
              <label class="label">Email</label>
              <input type="email" class="input" value="admin@bootlovers.com" />
            </div>
            <div>
              <label class="label">Phone</label>
              <input type="tel" class="input" />
            </div>
          </div>
          <div class="flex justify-end">
            <button class="btn-primary">Save changes</button>
          </div>
        </div>

        <!-- Payments -->
        <div v-if="active === 'payments'" class="card p-4 sm:p-6 space-y-5">
          <h3 class="font-display text-xl font-semibold">Payment Methods</h3>
          <div v-for="m in methods" :key="m.name" class="flex items-center justify-between gap-3 p-4 rounded-xl border border-black/10">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg bg-cream-soft flex items-center justify-center shrink-0">
                <Icon :name="m.icon" class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="font-medium truncate">{{ m.name }}</p>
                <p class="text-xs text-ink-soft truncate">{{ m.desc }}</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" :checked="m.enabled" class="sr-only peer" />
              <div class="w-10 h-5 bg-black/10 peer-checked:bg-brand rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>

        <!-- Shipping -->
        <div v-if="active === 'shipping'" class="card p-4 sm:p-6 space-y-5">
          <h3 class="font-display text-xl font-semibold">Shipping Zones</h3>
          <div v-for="z in zones" :key="z.name" class="p-4 rounded-xl border border-black/10 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium truncate">{{ z.name }}</p>
              <p class="text-xs text-ink-soft">{{ z.regions }}</p>
            </div>
            <p class="font-semibold shrink-0">{{ z.rate }}</p>
          </div>
          <button class="btn-secondary"><Icon name="ph:plus" class="w-4 h-4" />Add zone</button>
        </div>

        <!-- Notifications -->
        <div v-if="active === 'notifications'" class="card p-4 sm:p-6 space-y-3">
          <h3 class="font-display text-xl font-semibold">Notifications</h3>
          <div v-for="n in notifs" :key="n.label" class="flex items-center justify-between py-2">
            <div>
              <p class="font-medium text-sm">{{ n.label }}</p>
              <p class="text-xs text-ink-soft">{{ n.desc }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="n.on" class="sr-only peer" />
              <div class="w-10 h-5 bg-black/10 peer-checked:bg-brand rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>

        <!-- Security -->
        <div v-if="active === 'security'" class="card p-4 sm:p-6 space-y-5">
          <h3 class="font-display text-xl font-semibold">Security</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Current password</label>
              <input type="password" class="input" />
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label">New password</label>
              <input type="password" class="input" />
            </div>
            <div>
              <label class="label">Confirm new password</label>
              <input type="password" class="input" />
            </div>
          </div>
          <div class="flex justify-end">
            <button class="btn-primary">Update password</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const active = ref('store')

const tabs = [
  { id: 'store', label: 'Store', icon: 'ph:storefront' },
  { id: 'profile', label: 'Profile', icon: 'ph:user' },
  { id: 'payments', label: 'Payments', icon: 'ph:credit-card' },
  { id: 'shipping', label: 'Shipping', icon: 'ph:truck' },
  { id: 'notifications', label: 'Notifications', icon: 'ph:bell' },
  { id: 'security', label: 'Security', icon: 'ph:lock' }
]

const methods = [
  { name: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: 'ph:credit-card', enabled: true },
  { name: 'Stripe', desc: 'Direct card processing', icon: 'ph:lightning', enabled: true },
  { name: 'PayPal', desc: 'PayPal Express checkout', icon: 'ph:wallet', enabled: false },
  { name: 'Cash on Delivery', desc: 'For domestic orders', icon: 'ph:money', enabled: true }
]

const zones = [
  { name: 'Bangladesh', regions: 'Dhaka, Chittagong, all districts', rate: '৳120' },
  { name: 'South Asia', regions: 'India, Pakistan, Sri Lanka, Nepal', rate: '$18' },
  { name: 'International', regions: 'Worldwide express', rate: '$35' }
]

const notifs = [
  { label: 'New orders', desc: 'Get notified when a new order is placed', on: true },
  { label: 'Order status updates', desc: 'When orders move to shipped or delivered', on: true },
  { label: 'Low stock alerts', desc: 'When a product stock drops below 10', on: true },
  { label: 'New customer signups', desc: 'When someone creates an account', on: false },
  { label: 'Weekly summary email', desc: 'Every Monday morning', on: true }
]
</script>
