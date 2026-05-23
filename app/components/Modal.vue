<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-2xl shadow-soft w-full max-w-md overflow-hidden">
          <div class="px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">{{ title }}</h3>
            <button class="btn-ghost p-1.5" @click="$emit('close')" aria-label="Close">
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
          </div>
          <div class="p-5">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-5 py-3 border-t border-black/5 bg-cream-soft flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ open: Boolean, title: String })
defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
