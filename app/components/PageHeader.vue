<template>
  <div class="flex flex-wrap items-end gap-4 mb-6">
    <div class="flex-1 min-w-0">
      <nav v-if="breadcrumbs?.length" class="text-xs text-ink-soft mb-1 flex items-center gap-1.5">
        <template v-for="(b, i) in breadcrumbs" :key="b.label">
          <NuxtLink v-if="b.to" :to="b.to" class="hover:text-brand">{{ b.label }}</NuxtLink>
          <span v-else>{{ b.label }}</span>
          <Icon v-if="i < breadcrumbs.length - 1" name="ph:caret-right" class="w-3 h-3" />
        </template>
      </nav>
      <h1 class="text-2xl sm:text-3xl font-display font-bold">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-ink-soft mt-1">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
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
