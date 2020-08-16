<template>
  <div>
    [ Qualifying Test | Responses | {{ $route.params.status }} ]
    <h2 class="govuk-heading-m">
      Qualifying Test Responses: {{ $route.params.id }}
    </h2>
    <div>
      <Table 
        data-key="id"
        :data="getPaginated"
        :columns="[
          { title: 'Reference number' },
          { title: 'Name' },
          { title: 'Status' },
        ]"
      >
        <template #row="{row}">
          <TableCell>
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink> 
          </TableCell>
          <TableCell>
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink> 
          </TableCell>
          <TableCell>{{ row.status | lookup }}</TableCell>
        </template>
      </Table>   
    </div>
  </div>
</template>

<script>
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 

export default {
  components: {
    Table,
    TableCell,
  },
  computed: {
    getPaginated() {
      return [];
    },
  },
};
</script>
