<script setup lang="ts">
const props = defineProps<{
  total: number
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="toolbar">
    <label for="search">
      Search partners
    </label>

    <input
      id="search"
      v-model="model"
      type="search"
      placeholder="Search by partner name…"
      autocomplete="off"
    />

    <span
      class="count"
      aria-live="polite"
    >
      {{ props.total }} partners
    </span>
  </div>
</template>