<template>
  <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 sm:gap-4 mb-5 sm:mb-6">
    <div class="flex-1 min-w-0">
      <nav v-if="breadcrumbs?.length" class="text-xs text-ink-soft mb-1 flex items-center gap-1.5 flex-wrap">
        <template v-for="(b, i) in breadcrumbs" :key="b.label">
          <NuxtLink v-if="b.to" :to="b.to" class="hover:text-brand">{{ b.label }}</NuxtLink>
          <span v-else class="truncate max-w-[60vw]">{{ b.label }}</span>
          <Icon v-if="i < breadcrumbs.length - 1" name="ph:caret-right" class="w-3 h-3" />
        </template>
      </nav>
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-display font-bold leading-tight">{{ title }}</h1>
      <p v-if="subtitle" class="text-xs sm:text-sm text-ink-soft mt-1">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  breadcrumbs: Array
})
</script>
