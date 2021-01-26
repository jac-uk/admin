<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">
        Character Issues
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
      <!-- // TODO Include count for character issues across whole exercise. Then display here.
       <p class="govuk-body">
        Candidates with character issues: <b>{{ applications.length }}</b>
      </p>
      -->
      <Table
        data-key="id"
        :data="applications"
        :columns="tableColumns"
        :search="['personalDetails.fullName']"
        :page-size="10"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                  {{ row.referenceNumber }} <span v-if="row.personalDetails">{{ row.personalDetails.fullName }}</span>
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' } }"
                  class="govuk-link print-none"
                >
                  View application
                </RouterLink>
              </div>
            </div>
            <div
              v-for="(issue, index) in row.processing.characterIssues"
              :key="index"
              class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
            >
              <hr
                class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                :class="{'govuk-!-margin-left-3 govuk-!-margin-right-3': index}"
              >
              <div class="govuk-grid-column-two-thirds">
                <div
                  v-if="issue.type == 'criminalOffences'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has been cautioned or convicted of a criminal offence
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.criminalOffenceDetails"
                  />
                </div>

                <div
                  v-else-if="issue.type == 'declaredBankruptOrIVA'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has been declared bankrupt or entered into an Individual Voluntary Agreement (IVA)
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.declaredBankruptOrIVADetails"
                  />
                </div>

                <div
                  v-else-if="issue.type == 'diciplinaryActionOrAskedToResign'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has been subject to complaints or disciplinary action, or been asked to resign from a position
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.diciplinaryActionOrAskedToResignDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'drivingDisqualificationDrinkDrugs'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has been disqualified from driving, or convicted for driving under the influence of drink or drugs
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.drivingDisqualificationDrinkDrugsDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'endorsementsOrMotoringFixedPenalties'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has endorsements on their licence, or received any motoring fixed-penalty notices in the last 4 years
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.endorsementsOrMotoringFixedPenaltiesDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'involvedInProfessionalMisconduct'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has been, or is currently, subject to professional misconduct, negligence, wrongful dismissal, discrimination or harassment proceedings
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.involvedInProfessionalMisconductDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'lateTaxReturnOrFined'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has filed late tax returns or been fined by HMRC
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.lateTaxReturnOrFinedDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'nonMotoringFixedPenaltyNotices'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has received a non-motoring penalty notice in the last 4 years
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.nonMotoringFixedPenaltyNoticesDetails"
                  />
                </div>
                <div
                  v-else-if="issue.type == 'otherCharacterIssues'"
                  class="issue"
                >
                  <p class="govuk-body">
                    Candidate has declared other issues we should know about
                  </p>
                  <EventRenderer
                    :events="row.characterInformation.otherCharacterIssuesDetails"
                  />
                </div>
                <div
                  v-else
                  class="issue"
                >
                  <span class="govuk-!-font-weight-bold">{{ issue.type | lookup }}:</span> {{ issue.summary }}
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
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

export default {
  components: {
    Table,
    TableCell,
    EventRenderer,
  },
  data () {
    return {
      applications: [],
      refreshingReport: false,
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate', sort: 'personalDetails.fullName', default: true },
      ],
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
        .where('processing.flags.characterIssues', '==', true);
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
