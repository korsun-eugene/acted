
<script setup lang="ts">

const emit = defineEmits<{
  imported: []
}>()

import type { ImportResult } from '/shared/types/partner'

const file = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const result = ref<ImportResult | null>(null)

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
  error.value = ''
  result.value = null
}

async function upload() {
  if (!file.value || loading.value) return

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const formData = new FormData()
    formData.append('file', file.value)

    result.value = await $fetch<ImportResult>(
      '/api/partners/import',
      {
        method: 'POST',
        body: formData,
      },
    )

    emit('imported')
  } catch (err) {
    error.value = 'Import failed. Check the file and try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="import-panel">
    <h2>Import partners</h2>

    <input
      type="file"
      accept=".xlsx"
      :disabled="loading"
      @change="onFileChange"
    >

    <button
      :disabled="!file || loading"
      @click="upload"
    >
      {{ loading ? 'Importing...' : 'Import Excel' }}
    </button>

    <p v-if="error" role="alert">
      {{ error }}
    </p>

    <div v-if="result" role="status">
      <p>Imported: {{ result.imported }}</p>
      <p>Updated: {{ result.updated }}</p>
      <p>Skipped: {{ result.skipped }}</p>
    </div>
  </section>
</template>


<style scoped>
.import-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  margin-bottom: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
}

.import-panel h2 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
  font-weight: 600;
}

.import-panel input[type="file"] {
  width: 100%;
  padding: 12px;
  color: #475569;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
}

.import-panel input[type="file"]:hover {
  border-color: #2563eb;
}

.import-panel input[type="file"]::file-selector-button {
  padding: 8px 14px;
  margin-right: 16px;
  color: #1e293b;
  background: #e2e8f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.import-panel button {
  align-self: flex-start;
  min-width: 150px;
  padding: 11px 20px;
  color: #ffffff;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.import-panel button:hover:not(:disabled) {
  background: #1d4ed8;
}

.import-panel button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.import-panel [role="alert"] {
  padding: 12px 16px;
  margin: 0;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.import-panel [role="status"] {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.import-panel [role="status"] p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .import-panel {
    padding: 16px;
  }

  .import-panel button {
    width: 100%;
  }

  .import-panel [role="status"] {
    flex-direction: column;
  }
}
</style>