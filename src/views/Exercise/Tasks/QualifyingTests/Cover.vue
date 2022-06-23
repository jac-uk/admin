<template>
  <div>
    <h2 class="govuk-heading-l">
      {{ tieBreakers ? 'Equal merit tie-breakers' : 'Qualifying tests' }}
    </h2>
    <Table
      data-key="id"
      :data="qualifyingTests"
      :page-size="50"
      :columns="tableColumns"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
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
        <TableCell :title="tableColumns[1].title">
          {{ row.type | lookup }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.status | lookup }}
        </TableCell>
      </template>
    </Table>

    <button
      v-if="exercise.exercisePhoneNumber && exercise.emailSignatureName"
      class="govuk-button govuk-!-margin-right-3"
      @click="btnCreate"
    >
      Create New
    </button>
    <button
      v-if="exercise.exercisePhoneNumber && exercise.emailSignatureName"
      class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
      @click="btnCreateFromClipboard"
    >
      Create New from Clipboard
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
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';

export default {
  components: {
    Table,
    Banner,
    TableCell,
  },
  props: {
    tieBreakers: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      tableColumns: [
        { title: 'Title', sort: 'title', default: true },
        { title: 'Type' },
        { title: 'Status' },
      ],
    };
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
      msg = `${msg} before creating `;
      msg += this.tieBreakers ? 'an equal merit tie-breaker' : 'a qualifying test';
      return msg;
    },
    qualifyingTests() {
      const qtList = this.$store.state.qualifyingTest.records;
      // For the Tie-breakers page we want to show tests where isTieBreaker == true
      // For the Qualifying Tests page we want to show tests where isTieBreaker == false
      // To support old records though, on the Qualifying Tests page we also need to show tests where the
      // isTieBreaker field is absent
      // Note: We filter on this here (instead of in the store function) because the firebase SDK does not
      // allow the where() function to query on the absense of a field
      return qtList.filter(row => {
        return this.tieBreakers == (row.isTieBreaker == true); // to cater for the isTieBreaker field being absent
      });
    },
    exerciseId() {
      return this.$route.params.id;
    },
    routeNamePrefix() {
      return this.tieBreakers ? 'equal-merit-tie-breaker' : 'qualifying-test';
    },
  },
  methods: {
    btnCreate() {
      this.$router.push({ name: `${this.routeNamePrefix}-new` });
    },
    btnCreateFromClipboard() {
      this.$router.push({ name: 'qualifying-test-new-from-clipboard' });
    },
    getViewName(qualifyingTest) {
      if (
        qualifyingTest.status === QUALIFYING_TEST.STATUS.CREATED ||
        qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED
      ) {
        return `${this.routeNamePrefix}-review`;
      } else {
        return `${this.routeNamePrefix}-view`;
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
