<template>
  <div>
    <h2 class="govuk-heading-l">
      Qualifying tests
    </h2>
    <Table
      data-key="id"
      :data="qualifyingTests"
      :page-size="50"
      :columns="[
        { title: 'Title', sort: 'title', default: true },
        { title: 'Type' },
        { title: 'Status' },
      ]"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            class="govuk-link"
            :to="{ name: getViewName(row), params: { qualifyingTestId: row.id } }"
          >
            {{ row.title | showAlternative(row.id) }}
          </RouterLink>
          <span
            v-if="row.mode"
            class="govuk-tag govuk-tag--grey govuk-!-margin-left-1"
          >{{ row.mode | lookup }}</span>
          <br>
          <span class="govuk-body-s">{{ row.startDate | formatDate('longdatetime') }}</span>
        </TableCell>
        <TableCell>
          {{ row.type | lookup }}
        </TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
      </template>
    </Table>

    <button
      v-if="exercise.exercisePhoneNumber && exercise.emailSignatureName"
      class="govuk-button govuk-!-margin-right-3"
      @click="btnCreate"
    >
      Create New
    </button>
    <div v-else>
      <Banner
        :message="warningMessage"
        status="warning"
      />
    </div>
  </div>
</template>

<script>
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';
import { QUALIFYING_TEST } from '@/helpers/constants';
import Banner from '@/components/Page/Banner';

export default {
  components: {
    Table,
    Banner,
    TableCell,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    warningMessage() {
      let msg = 'Please add';
      if (!this.exercise.exercisePhoneNumber) {
        msg = `${msg} an exercise phone number`;
      }
      if (!this.exercise.exercisePhoneNumber && !this.exercise.emailSignatureName) {
        msg = `${msg} and`;
      }
      if (!this.exercise.emailSignatureName) {
        msg = `${msg} an email signature name`;
      }
      msg = `${msg} before creating a qualifying test`;
      return msg;
    },
    qualifyingTests() {
      const qtList = this.$store.state.qualifyingTest.records;
      return qtList;
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  methods: {
    btnCreate() {
      this.$router.push({ name: 'qualifying-test-new' });
    },
    getViewName(qualifyingTest) {
      if (
        qualifyingTest.status === QUALIFYING_TEST.STATUS.CREATED
        || qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED
      ) {
        return 'qualifying-test-review';
      } else {
        return 'qualifying-test-view';
      }
    },
    getTableData(params) {
      this.$store.dispatch(
        'qualifyingTest/bindQTs',
        {
          exerciseId: this.exerciseId,
          ...params,
        }
      );
    },
  },
};
</script>

<style scoped>
  .separator {
    height: 100px;
  }
</style>
