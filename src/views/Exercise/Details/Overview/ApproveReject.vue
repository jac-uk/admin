<template>
  <div class="background-light-grey govuk-!-padding-left-4 govuk-!-padding-top-4 govuk-!-padding-bottom-4 govuk-!-margin-bottom-4">
    <div class="govuk-warning-text govuk-!-margin-0">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This exercise is waiting for your approval.
      </strong>

      <div class="govuk-!-padding-left-8">
        <p>Please verify the content of the exercise and Approve or Reject.</p>

        <!--@TODO-->
        <div class="govuk-inset-text">
          It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.
          <button @click="test()">
            test
          </button>
        </div>

        <div>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-button--warning govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="reject"
          >
            Reject
          </button>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-!-margin-bottom-0"
            @click="approve"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApprovalFromAdvertType, exerciseAdvertTypes } from '@/helpers/exerciseHelper';
import { mapState } from 'vuex';
import _has from 'lodash/has.js';
import _get from 'lodash/get.js';

// @TODO: UNDO THE CHANGES IN DOCUMENT.JS !!!!

export default {
  name: 'ApproveReject',
  mixins: [permissionMixin],
  emits: ['reject'],
  data() {
    return {
      vacancyFields: [
        '_applicationContent',
        '_applicationVersion',
        'aboutTheRole',
        'aboutTheRoleWelsh',
        'additionalWorkingPreferences',
        'advertType',
        'applicationCloseDate',
        'applicationOpenDate',
        'appliedSchedule',
        'appointmentType',
        'aSCApply',
        'assessmentMethods',
        'assessmentOptions',
        'authorisations',
        'characterChecks',
        'contactIndependentAssessors',
        'criticalAnalysisTestDate',
        'criticalAnalysisTestEndTime',
        'criticalAnalysisTestStartTime',
        'downloads',
        'estimatedLaunchDate',
        'exerciseMailbox',
        'exercisePhoneNumber',
        'feePaidFee',
        'finalOutcome',
        'futureStart',
        'immediateStart',
        'independentAssessmentsReturnDate',
        'inviteOnly',
        'isCourtOrTribunal',
        'isSPTWOffered',
        'jurisdiction',
        'jurisdictionQuestion',
        'jurisdictionQuestionAnswers',
        'jurisdictionQuestionType',
        'location',
        'locationQuestion',
        'locationQuestionAnswers',
        'locationQuestionType',
        'memberships',
        'name',
        'noSalaryDetails',
        'otherJurisdiction',
        'otherLOS',
        'otherMemberships',
        'otherQualifications',
        'otherRetirement',
        'otherShortlistingMethod',
        'otherYears',
        'pjeDays',
        'postQualificationExperience',
        'previousJudicialExperienceApply',
        'qualifications',
        'reasonableLengthService',
        'referenceNumber',
        'retirementAge',
        'roleSummary',
        'roleSummaryWelsh',
        'salary',
        'salaryGrouping',
        'scenarioTestDate',
        'scenarioTestEndTime',
        'scenarioTestStartTime',
        'schedule2Apply',
        'selectionCriteria',
        'selectionDays',
        'selectionExerciseManagerFullName',
        'shortlistingMethods',
        'siftStartDate',
        'siftEndDate',
        'nameBlindSiftStartDate',
        'nameBlindSiftEndDate',
        'shortlistingOutcomeDate',
        'situationalJudgementTestDate',
        'situationalJudgementTestEndTime',
        'situationalJudgementTestStartTime',
        'state',
        'subscriberAlertsUrl',
        'typeOfExercise',
        'uploadedCandidateAssessmentFormTemplate',
        'uploadedIndependentAssessorTemplate',
        'uploadedJobDescriptionTemplate',
        'uploadedTermsAndConditionsTemplate',
        'welshPosts',
        'welshRequirement',
        'welshRequirementType',
        'yesSalaryDetails',
      ],
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      //return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
      return this.$store.state.exerciseDocument.record.id;
    },
    isReadyForApprovalFromAdvertType() {
      return isReadyForApprovalFromAdvertType(this.exercise);
    },
    exerciseWasPreviouslyApproved() {
      //const isPreviouslyApproved = '_approval' in dataAfter && 'approved' in dataAfter._approval && dataAfter._approval.approved;
      //return ('_approval' in this.exercise) && ('approved' in this.exercise._approval) && (this.exercise._approval.approved);
      return _has(this.exercise, '_approval.approved.date');
    },
    vacancy() {
      return this.$store.getters['vacancy/data']();
    },
  },
  mounted() {

    // @TODO: IGNORE state and _ fields

    this.$store.dispatch('vacancy/bind', this.exerciseId).then(() => {
      // Can remove the concole logs but not the parent!
      console.log('vacancy:');
      console.log(this.vacancy);

      console.log('exercise:');
      console.log(this.exercise);

      // @TODO: Use a watch to monitor the changes, if need be
      // const differences = this.getDifferencesKeys(this.vacancy, this.exercise);

      // const differences = this.compareKeys(this.vacancy, this.exercise, this.vacancyFields);
      // console.log(differences);

      // console.log('DIFFERENCES:');
      // console.log(differences);

      //this.getChanges();

      const differences = this.getDeepObjectDifferences(this.vacancy, this.exercise, ['state']);
      console.log('DIFFERENCES:');
      console.log(differences);
    });

    // @TODO: TESTING
    //this.getChanges();
  },
  methods: {
    async approve() {
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'approved',
      });
    },
    reject() {
      this.$emit('reject');
    },

    // @TODO: REMOVE!!!
    test() {
      console.log(`this.exerciseWasPreviouslyApproved: ${this.exerciseWasPreviouslyApproved}`);
      console.log('this.exercise._approval:');
      console.log(this.exercise._approval);
      console.log('this.exercise._approval.approved:');
      console.log(this.exercise._approval.approved);

    },
    getChanges() {
      const vacancy = {
        testMatch1: 'tester',
        testMatch2: {
          a: 1,
          b: 2,
        },
        testMatch3: {
          a: 1,
          b: [1, 2, 3],
        },
        testMisMatch1: 'tester',
        testMisMatch2: {
          a: 1,
          b: 2,
        },
        testMisMatch3: {
          a: 1,
          b: [1, 2, 3],
        },
        testMissing1: 'tester',
      };

      const exercise = {
        testMatch1: 'tester',
        testMatch2: {
          a: 1,
          b: 2,
        },
        testMatch3: {
          a: 1,
          b: [1, 2, 3],
        },
        testMisMatch1: 'tester1',
        testMisMatch2: {
          a: 1,
          b: 3,
        },
        testMisMatch3: {
          a: 1,
          b: [1, 2],
        },
        testMissing2: 'testertoon',
      };

      // const differences = this.getDeepObjectDifferences(vacancy, exercise);
      // console.log('DIFFERENCES:');
      // console.log(differences);

    },

    getDeepObjectDifferences(obj1, obj2, keysToIgnore) {
      const differences = [];

      this.compareObjects(obj1, obj2, [], differences, keysToIgnore);
      return differences;
    },

    compareObjects(obj1, obj2, path = [], differences = [], keysToIgnore = []) {
      for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
          const newPath = [...path, key];

          if (keysToIgnore.includes(key) || key.charAt(0) === '_') {
            // If the key is in the keysToIgnore array or begins with an underscaore, skip the comparison
            continue;
          }

          if (this.isObject(obj1[key]) && this.isObject(obj2[key])) {
            this.compareObjects(obj1[key], obj2[key], newPath, differences, keysToIgnore);
          } else if (!this.isEqual(obj1[key], obj2[key])) {
            // If the values are different, store the top-level key in the differences array
            differences.push(newPath[0]);
          }
        }
      }
    },
    isEqual(value1, value2) {
      if (typeof value1 !== typeof value2) return false;
      if (typeof value1 === 'object') {
        // Use JSON.stringify to handle nested arrays and objects
        return JSON.stringify(value1) === JSON.stringify(value2);
      }
      return value1 === value2;
    },
    isObject(input) {
      return typeof input === 'object' &&
        !Array.isArray(input) &&
        input !== null;
    },
  },
};
</script>
