<template>
  <header
    class="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur border-b border-black/5 flex items-center px-4 sm:px-6 gap-3"
  >
    <button
      class="lg:hidden p-2 rounded-lg hover:bg-black/5"
      aria-label="Open sidebar"
      @click="$emit('toggle-sidebar')"
    >
      <Icon name="ph:list" class="w-5 h-5" />
    </button>

    <div class="hidden sm:flex items-center gap-2 flex-1 max-w-md">
      <div class="relative w-full">
        <Icon
          name="ph:magnifying-glass"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
        />
        <input
          type="text"
          placeholder="Search products, orders, customers…"
          class="input pl-9"
        />
      </div>
    </div>

    <div class="ml-auto flex items-center gap-1 sm:gap-2">
      <button class="btn-ghost p-2" aria-label="Help">
        <Icon name="ph:question" class="w-5 h-5" />
      </button>
      <button class="btn-ghost p-2 relative" aria-label="Notifications">
        <Icon name="ph:bell" class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand"></span>
      </button>
      <button class="btn-ghost p-2" aria-label="Messages">
        <Icon name="ph:chat-circle" class="w-5 h-5" />
      </button>
      <div class="w-px h-6 bg-black/10 mx-1 hidden sm:block"></div>
      <button class="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-black/5">
        <div
          class="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm"
        >
          A
        </div>
        <div class="hidden md:block text-left leading-tight">
          <p class="text-sm font-semibold">Admin</p>
          <p class="text-[11px] text-ink-soft">Super Admin</p>
        </div>
        <Icon name="ph:caret-down" class="w-4 h-4 text-ink-soft hidden md:block" />
      </button>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-sidebar'])
</script>
