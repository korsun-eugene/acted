<script setup lang="ts">
import type { PartnersResponse } from '/shared/types/partner'

const searchInput = ref('')
const search = ref('')
const page = ref(1)

const { data, status, error, refresh } = await useFetch<PartnersResponse>(
  '/api/partners',
  {
    query: { search, page },
    watch: [search, page],
  },
)

let debounce: ReturnType<typeof setTimeout> | undefined

watch(searchInput, (value) => {
  clearTimeout(debounce)

  debounce = setTimeout(() => {
    search.value = value
    page.value = 1
  }, 300)
})

onBeforeUnmount(() => {
  clearTimeout(debounce)
})

const loading = computed(() => status.value === 'pending')
</script>

<template>
  <main class="container">
    <header>
      <div class="eyebrow">PARTNER MANAGEMENT</div>

      <h1>Partner Directory</h1>

      <PartnerImport @imported="refresh" />

      <p>Browse partner organizations and their eligibility status.</p>
    </header>

    <section class="panel">
      <PartnersToolbar
        v-model="searchInput"
        :total="data?.pagination.total ?? 0"
      />

      <div
        v-if="error"
        class="notice error"
        role="alert"
      >
        Could not load partners.

        <button @click="refresh()">
          Try again
        </button>
      </div>

      <div
        v-else-if="loading"
        class="notice"
        role="status"
      >
        Loading partners…
      </div>

      <div
        v-else-if="!data?.items.length"
        class="notice"
      >
        No partners found.
      </div>

      <PartnersTable
        v-else
        :partners="data.items"
      />

      <PartnersPagination
        v-if="data && data.pagination.totalPages > 0"
        :page="data.pagination.page"
        :total-pages="data.pagination.totalPages"
        :loading="loading"
        @update:page="page = $event"
      />
    </section>
  </main>
</template>