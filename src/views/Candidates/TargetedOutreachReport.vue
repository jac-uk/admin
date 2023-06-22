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
        :disabled="noNins"
        @click="clear"
      >
        Clear
      </button>
      <button
        class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
        :disabled="noResults"
        @click="downloadReport"
      >
        Download Report
      </button>
    </div>
    <div class="govuk-grid-column-full">
      <form
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
          <div v-if="noResults">
            No Candidates or Applications match the given National Insurance Numbers.
            Please try again
          </div>
        </fieldset>
      </form>
    </div>
    <template
      v-if="results.length > 0"
    >
      <FullScreenButton
        ref="fullscreenButtonRef"
        class="float-right govuk-!-margin-right-4"
      />
      <div class="govuk-grid-column-full">
        <div class="overflow-table">
          <table
            class="govuk-table"
          >
            <thead class="govuk-table__head">
              <th
                v-for="(column, index) in tableColumns"
                :key="index"
                class="govuk-table__cell text-left"
              >
                {{ filters.lookup(column.title) }}
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
                  class="govuk-table__cell text-left"
                >
                  {{ filters.lookup(item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import FullScreenButton from '@/components/Page/FullScreenButton';
import * as filters from '@/filters.js';

export default {
  name: 'TargetedOutreachReport',
  components: {
    TextArea,
    ErrorSummary,
    FullScreenButton,
  },
  extends: Form,
  data() {
    return {
      filters: filters,
      nins: '',
      results: [],
      searching: false,
      noResults: false,
    };
  },
  computed: {
    noNins() {
      return this.nins.length === 0;
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
      const csv = [[...header.map(col => filters.lookup(col))]];
      this.results.map(item => {
        const returnItem = header.map(h => {
          // sanitise for commas in string which could cause separation
          return filters.lookup(`"${item[h]}"`);
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
      if (this.$store.state.ui.fullScreen){
        this.$refs['fullscreenButtonRef'].exitFullScreen();
      }
      this.results = [];
      this.nins = '';
      this.searching = false;
    },
    async search() {
      this.searching = true;
      this.noResults = false;
      const data = {
        nationalInsuranceNumbers: this.nins.split(/[\n,]/), // split on new line or comma
      };
      const returnData = await functions.httpsCallable('targetedOutreachReport')(data);
      if (returnData.data.length) {
        this.results = returnData.data;
      } else {
        this.results = [];
        this.noResults = true;
      }
      this.searching = false;
    },
  },
};
</script>
<style>
  .overflow-table {
    overflow-x: scroll;
    border: 1px black solid;
    /* width: 100%;
    word-wrap:break-word;
    table-layout: fixed; */
  }
</style>
