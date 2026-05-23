<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-soft w-full max-w-md max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
          <div class="px-4 sm:px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">{{ title }}</h3>
            <button class="btn-ghost p-1.5" @click="$emit('close')" aria-label="Close">
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
          </div>
          <div class="p-4 sm:p-5 overflow-y-auto">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-4 sm:px-5 py-3 border-t border-black/5 bg-cream-soft flex justify-end gap-2">
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
