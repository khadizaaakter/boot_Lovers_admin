<template>
  <div class="min-h-screen bg-[#f7f6f3] flex">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <TopBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-3 sm:p-6 lg:p-8">
        <slot />
      </main>
      <footer class="px-4 sm:px-6 py-4 text-center text-[11px] sm:text-xs text-ink-soft border-t border-black/5 bg-white/50">
        &copy; {{ new Date().getFullYear() }} Boot Lovers Admin. Crafted with care.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const sidebarOpen = ref(false)
</script>
