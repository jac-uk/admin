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
      <p class="govuk-body">
        Candidates with character issues: <b>{{ applications.length }}</b>
      </p>

      <div 
        v-if="applications.length"
        class="list govuk-body"
      >
        <div
          v-for="application in applications"
          :key="application.id"
          class="list-item govuk-!-margin-bottom-6"
        >
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
              <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                {{ application.referenceNumber }} <span v-if="application.personalDetails">{{ application.personalDetails.fullName }}</span>
              </div>
            </div>
            <div class="govuk-grid-column-one-third text-right">
              <RouterLink
                :to="{name: 'exercise-show-application', params: { applicationId: application.id }}"
                class="govuk-link"
              >
                View application
              </RouterLink>
            </div>
          </div>

          <div 
            v-for="(issue, index) in application.processing.characterIssues"
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
                  :events="application.characterInformation.criminalOffenceDetails"
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
                  :events="application.characterInformation.declaredBankruptOrIVADetails"
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
                  :events="application.characterInformation.diciplinaryActionOrAskedToResignDetails"
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
                  :events="application.characterInformation.drivingDisqualificationDrinkDrugsDetails"
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
                  :events="application.characterInformation.endorsementsOrMotoringFixedPenaltiesDetails"
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
                  :events="application.characterInformation.involvedInProfessionalMisconductDetails"
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
                  :events="application.characterInformation.lateTaxReturnOrFinedDetails"
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
                  :events="application.characterInformation.nonMotoringFixedPenaltyNoticesDetails"
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
                  :events="application.characterInformation.otherCharacterIssuesDetails"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import EventRenderer from '@/components/Page/EventRenderer';

export default {
  components: {
    EventRenderer,
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
  created() {
    this.unsubscribe = firestore
      .collection('applications')
      .where('exerciseId', '==', this.exercise.id)
      .where('status', '==', 'applied')
      .where('processing.flags.characterIssues', '==', true)
      .onSnapshot((snap) => {
        const applications = [];
        snap.forEach((doc) => {
          applications.push(vuexfireSerialize(doc));
        });
        this.applications = applications;
      });
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
  },
};
</script>
