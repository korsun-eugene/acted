<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
  loading: boolean
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const previous = () => {
  if (props.page > 1 && !props.loading) {
    emit('update:page', props.page - 1)
  }
}

const next = () => {
  if (props.page < props.totalPages && !props.loading) {
    emit('update:page', props.page + 1)
  }
}
</script>

<template>
  <footer class="pagination">
    <span>
      Page {{ page }} of {{ totalPages }}
    </span>

    <div class="actions">
      <button
        :disabled="page <= 1 || loading"
        @click="previous"
      >
        Previous
      </button>

      <button
        :disabled="page >= totalPages || loading"
        @click="next"
      >
        Next
      </button>
    </div>
  </footer>
</template>