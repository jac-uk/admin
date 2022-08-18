<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1
        class="govuk-heading-xl govuk-!-margin-bottom-6"
      >
        Targeted Outreach Report
      </h1>
    </div>
    <div class="govuk-grid-column-one-third govuk-!-text-align-right">
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3 moj-button-menu__item moj-page-header-actions__action"
        :disabled="noData"
        @click="clear"
      >
        Clear
      </button>
      <button
        class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
        :disabled="results.length === 0"
        @click="downloadReport"
      >
        Download Report
      </button>
    </div>
    <div class="govuk-grid-column-full">
      <form
        v-if="!ninSubmitted"
        class="govuk-form-group"
        @submit.prevent="search"
      >
        <fieldset
          class="govuk-fieldset"
          role="group"
        >
          <ErrorSummary :errors="errors" />
          <TextArea
            id="body"
            v-model="nins"
            class="govuk-!-margin-top-7"
            label="Add One National Insurance Number per line"
            :value="nins"
            required
          />
          <button
            class="govuk-button"
            :disabled="noNins || searching"
          >
            Generate
          </button>
          <div v-if="searching">
            Please wait while we create your report ...
          </div>
        </fieldset>
      </form>
      <table
        v-if="!!results"
        class="govuk-table"
      >
        <thead class="govuk-table__head">
          <th
            v-for="(column, index) in tableColumns"
            :key="index"
          >
            {{ column.title }}
          </th>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="(row, idx) in results"
            :key="idx"
            class="govuk-table__row"
          >
            <td
              v-for="(item, indexItem) in row"
              :key="indexItem"
              class="govuk-table__cell text-right"
            >
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';

export default {
  components: {
    TextArea,
    ErrorSummary,
  },
  extends: Form,
  data() {
    return {
      nins: '',
      results: [],
      searching: false,
    };
  },
  computed: {
    noNins() {
      return this.nins.length === 0;
    },
    noData() {
      return this.nins.length === 0;
    },
    ninSubmitted() {
      return this.results.length > 0;
    },
    tableColumns() {
      let returnValue = [];

      if (this.results.length > 0) {
        returnValue = Object.keys(this.results[0]).map(key => {
          return { title: key };
        });
      }
      return returnValue;
    },
  },
  methods: {
    downloadReport() {
      const header = Object.keys(this.tableColumns).map(col => this.tableColumns[col].title);
      const csv = [[...header]];
      this.results.map(item => {
        const returnItem = header.map(h => {
          return item[h];
        });
        csv.push(returnItem);
      });
      const csvContent = `data:text/csv;charset=utf-8,${
        csv.map(e => e.join(',')).join('\n')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'targeted_outreach_report.csv');
      document.body.appendChild(link);
      link.click();
    },
    clear() {
      this.results = [];
      this.nins = '';
      this.searching = false;
    },
    async search() {
      this.searching = true;
      const data = {
        nationalInsuranceNumbers: this.nins.split(/[\n,]/), // split on new line or comma
      };
      const returnData = await functions.httpsCallable('targetedOutreachReport')(data);
      this.results = returnData.data;
    },
  },
};
</script>
