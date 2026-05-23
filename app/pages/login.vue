<template>
  <div class="grid md:grid-cols-2 gap-0 w-full max-w-5xl bg-white rounded-3xl shadow-soft overflow-hidden">
    <!-- Visual side -->
    <div class="relative hidden md:block bg-gradient-to-br from-brand-50 via-cream to-brand-100 p-10">
      <div class="font-display text-3xl font-bold">
        <span class="text-ink">Boot</span>
        <span class="text-brand">&nbsp;Lovers</span>
      </div>
      <p class="mt-2 text-sm text-ink-soft">Admin Panel</p>

      <div class="absolute inset-x-10 bottom-10">
        <h2 class="font-display text-3xl font-bold leading-tight">
          Run your shoe<br />business with care.
        </h2>
        <p class="text-ink-soft text-sm mt-3 max-w-xs">
          Manage products, orders and customers — all from one beautifully crafted dashboard.
        </p>
      </div>

      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-72 h-72 object-cover rounded-full shadow-soft border-8 border-white"
      />
    </div>

    <!-- Form side -->
    <div class="p-8 sm:p-12 flex flex-col justify-center">
      <h1 class="font-display text-3xl font-bold">Welcome back</h1>
      <p class="text-sm text-ink-soft mt-1">Sign in to manage your store.</p>

      <form class="mt-8 space-y-4" @submit.prevent="signIn">
        <div>
          <label class="label">Email</label>
          <input
            v-model="email"
            type="email"
            class="input"
            placeholder="admin@bootlovers.com"
            required
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="label !mb-0">Password</label>
            <a href="#" class="text-xs text-brand hover:underline">Forgot password?</a>
          </div>
          <input
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            required
          />
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" class="rounded text-brand focus:ring-brand" />
          <span class="text-ink-soft">Keep me signed in</span>
        </label>
        <button type="submit" class="btn-primary w-full !py-3">
          <Icon name="ph:sign-in" class="w-4 h-4" />
          Sign in
        </button>
      </form>

      <p class="text-xs text-ink-soft mt-8 text-center">
        Protected by Boot Lovers · {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({ layout: 'auth' })

const email = ref('admin@bootlovers.com')
const password = ref('')
const router = useRouter()

const signIn = () => router.push('/')
</script>
