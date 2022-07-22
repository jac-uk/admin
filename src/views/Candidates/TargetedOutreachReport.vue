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
            <div v-if="searching">Please wait while we create your report ...</div>
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
              v-for="row in results"
              :key="row.id"
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
// import { functions } from '@/firebase';
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
      const data = this.nins.split('\n');
      console.log('nins: ', data);
      // this.results = await functions.httpsCallable('targetedOutreachReport')(data);
      setTimeout(() => {
        this.results = [
          {
            NINumber: 'QQ123456C',
            name: 'Chamhcam chamchamf',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'jPAMmilUYmqPHwqQfQc3 - CC Test for  EMZ',
            stage: undefined,
            status: 'applied',
            id: 'JbDpQ6415N9qdDfhF6xV',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Richard Collumbell',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'RYKmnjp88wbymS4rGRYk - Specialist Civil Circuit Judge',
            stage: undefined,
            status: 'applied',
            id: '07l6prxjQ8fIWZa1JlQC',
          },
          {
            NINumber: 'QQ123456C',
            name: 'L Loback',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'wdpALbyICL7ZxxN5AQt8 - Warren Legal',
            stage: undefined,
            status: 'draft',
            id: 'bsPwW0TyOh39WcjAxIOL',
          },
          {
            NINumber: 'QQ123456C',
            name: 'L Loback',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'v8EVXGlXDY8z7csNL23U - New Exercise 16 November',
            stage: undefined,
            status: 'draft',
            id: '1W9ra1CmVtMJwRLfK6tS',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Elliot Koh',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'I2m97WFb9n7SfOix5lDh - RTF test on ASC Section - Elliot Koh',
            stage: undefined,
            status: 'draft',
            id: '14hlxbCh2IA4tdTTedXA',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Will Smith',
            gender: 'male',
            ethnicity: 'white',
            disability: null,
            solicitor: null,
            exercise: 'LjElx4vSQmDNzkoxbXeG - Can we create an exercise',
            stage: 'selected',
            status: 'applied',
            id: 'CECBPnVgufu3FIVUfIMU',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Elliot Koh',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'z36nAaK6Mh1CUpdOwAh6 - ASC Text Format Test - Elliot',
            stage: undefined,
            status: 'draft',
            id: 'hcAfdVdVMS7ERG51tZba',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Elliot Koh',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: "RCkoowkVDra4sPuaFSRi - Arti's Exercise",
            stage: 'shortlisted',
            status: 'applied',
            id: '92vJP2iCsAiMk7d48ZHr',
          },
          {
            NINumber: 'QQ123456C',
            name: 'Elliot Koh',
            gender: undefined,
            ethnicity: undefined,
            disability: undefined,
            solicitor: null,
            exercise: 'Uy7BO2GG7Sh3Wb1pkpGN - Character Issues (Export all data) Test - E.Koh',
            stage: 'selected',
            status: 'applied',
            id: 'fbd3IEg8EZ9gnrapuYLs',
          },
        ];
      }, 2000);
    },
  },
};
</script>
