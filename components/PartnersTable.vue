<script setup lang="ts">
import type { Partner } from '/shared/types/partner'

defineProps<{
  partners: Partner[]
}>()
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Partner Code</th>
          <th>Partner Name</th>
          <th>Partner Type</th>
          <th>Oblast</th>
          <th>Eligibility Status</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="partner in partners"
          :key="partner.id"
        >
          <td class="code">
            {{ partner.code }}
          </td>

          <td class="name">
            {{ partner.name }}
          </td>

          <td>
            {{ partner.type ?? '—' }}
          </td>

          <td>
            {{ partner.oblast ?? '—' }}
          </td>

          <td>
            <span class="status">
              {{ partner.eligibilityStatus ?? '—' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>