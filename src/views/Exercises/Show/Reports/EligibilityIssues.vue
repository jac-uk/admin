<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">
        Eligibility Issues
      </h1>
    </div>
    <div class="govuk-grid-column-one-third text-right">
      <button
        class="govuk-button govuk-button--secondary"
        @click="refreshReport"
      >
        <span
          v-if="refreshingReport"
          class="spinner-border spinner-border-sm"
        /> Refresh
      </button>
    </div>

    <div class="govuk-grid-column-full">
      <!-- // TODO Include count for issues across whole exercise. Then display here.
      <p class="govuk-body">
        Candidates with eligibility issues: <b>{{ applications.length }}</b>
      </p>
      -->
      <Table
        data-key="id"
        :data="applications"
        :columns="[
          { title: 'Candidate', sort: 'personalDetails.fullName', default: true },
        ]"
        :search="['personalDetails.fullName']"
        :page-size="10"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell>
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                  {{ row.referenceNumber }} <span v-if="row.personalDetails">{{ row.personalDetails.fullName }}</span>
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' }}"
                  class="govuk-link print-none"
                >
                  View application
                </RouterLink>
              </div>
            </div>

            <div
              v-for="(issue, index) in row.processing.eligibilityIssues"
              :key="index"
              class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
            >
              <hr
                class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                :class="{'govuk-!-margin-left-3 govuk-!-margin-right-3': index}"
              >
              <div class="govuk-grid-column-two-thirds">
                <div class="issue">
                  <span class="govuk-!-font-weight-bold">{{ issue.type | lookup }}:</span> {{ issue.summary }}
                </div>
                <div
                  v-if="issue.type == 'rls-issue'"
                  class="relevant-info"
                >
                  <span class="govuk-!-font-weight-bold">Date of birth:</span> {{ row.personalDetails.dateOfBirth | formatDate }}<br>
                  <span
                    v-if="row.canGiveReasonableLOS"
                    class="govuk-!-font-weight-bold"
                  >Candidate comments:</span> {{ row.cantGiveReasonableLOSDetails }}
                </div>
                <div
                  v-if="issue.comments"
                  class="jac-comments"
                >
                  <span class="govuk-!-font-weight-bold">JAC / Panel comments:</span> {{ issue.comments }}
                </div>
              </div>
              <div class="govuk-grid-column-one-third">
                <select
                  class="govuk-select"
                >
                  <option value="" />
                  <option value="proceed">
                    Proceed
                  </option>
                  <option value="reject">
                    Reject
                  </option>
                  <option value="reject-non-declaration">
                    Reject Non-Declaration
                  </option>
                  <option value="discuss">
                    Discuss
                  </option>
                </select>
              </div>
            </div>
          </TableCell>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';
import tableQuery from '@/helpers/tableQuery';

export default {
  components: {
    Table,
    TableCell,
  },
  data () {
    return {
      applications: [],
      refreshingReport: false,
      unsubscribe: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('flagApplicationIssuesForExercise')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    getTableData(params) {
      let firestoreRef = firestore
        .collection('applications')
        .where('exerciseId', '==', this.exercise.id)
        .where('status', '==', 'applied')
        .where('processing.flags.eligibilityIssues', '==', true);
      firestoreRef = tableQuery(this.applications, firestoreRef, params);
      this.unsubscribe = firestoreRef
        .onSnapshot((snap) => {
          const applications = [];
          snap.forEach((doc) => {
            applications.push(vuexfireSerialize(doc));
          });
          this.applications = applications;
        });
    },
  },
};
</script>
