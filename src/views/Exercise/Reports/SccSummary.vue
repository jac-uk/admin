<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            SCC Summary
          </h2>
        </div>
        <div class="moj-page-header-actions__actions float-right">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <ActionButton
                v-if="
                  hasPermissions([
                    PERMISSIONS.exercises.permissions.canReadExercises.value,
                    PERMISSIONS.applications.permissions.canReadApplications.value,
                    PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
                  ])
                "
                :action="downloadSccSummaryReport"
              >
                Download SCC Summary
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="govuk-grid-column-full"
    >
      <LoadingMessage />
    </div>
    <div
      v-else-if="exerciseReportSccSummary"
      class="govuk-grid-column-full"
    >
      <dl class="govuk-summary-list">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number of vacancies
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.numberOfVacancies }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number of candidates proposed for Recommendation
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="numberOfCandidatesProposedForRecommendation"
              v-model="sccSummaryForm.numberOfCandidatesProposedForRecommendation"
              type="number"
              @update:model-value="saveSccSummary('numberOfCandidatesProposedForRecommendation', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Vacancies by jurisdiction/chamber
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="vacanciesByJurisdictionChamber"
              v-model="sccSummaryForm.vacanciesByJurisdictionChamber"
              type="number"
              @update:model-value="saveSccSummary('vacanciesByJurisdictionChamber', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Location details
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.locationDetails }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            VR (includes details of SPTW)
          </dt>
          <dd class="govuk-summary-list__value">
            Annex
            <TextField
              id="vr"
              v-model="sccSummaryForm.vr"
              type="text"
              @update:model-value="saveSccSummary('vr', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Launch
          </dt>
          <dd class="govuk-summary-list__value">
            {{ $filters.formatDate(sccSummaryForm.launch, 'long') }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Closed
          </dt>
          <dd class="govuk-summary-list__value">
            {{ $filters.formatDate(sccSummaryForm.closed, 'long') }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number of applications
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.numberOfApplications }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number of withdrawals
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.numberOfWithdrawals }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number removed on eligibility/ASC
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.numberOfRemovedOnEligibilityOrASC }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number shortlisted
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.numberOfShortlisted }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Method of shortlisting
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.shortlistingMethod }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Dates of shortlisting
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="shortlistingDates"
              v-model="sccSummaryForm.shortlistingDates"
              type="text"
              @update:model-value="saveSccSummary('shortlistingDates', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Statutory consultee(s)
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="statutoryConsultees"
              v-model="sccSummaryForm.statutoryConsultees"
              type="text"
              @update:model-value="saveSccSummary('statutoryConsultees', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Selection day tools
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.selectionDayTools }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Number of A-C candidates
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="numberOfACandidates"
              v-model="sccSummaryForm.numberOfACandidates"
              type="number"
              @update:model-value="saveSccSummary('numberOfACandidates', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Dates of selection days
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sccSummaryForm.datesOfSelectionDays }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Date s.94 list Created
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="dateS94ListCreated"
              v-model="sccSummaryForm.dateS94ListCreated"
              type="text"
              @update:model-value="saveSccSummary('dateS94ListCreated', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Candidates Remaining on s.94 list
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="candidatesRemainingOnS94List"
              v-model="sccSummaryForm.candidatesRemainingOnS94List"
              type="number"
              @update:model-value="saveSccSummary('candidatesRemainingOnS94List', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            &nbsp;
          </dt>
          <dd class="govuk-summary-list__value">
            &nbsp;
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Character Checks undertaken
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="characterChecksUndertaken"
              v-model="sccSummaryForm.characterChecksUndertaken"
              type="text"
              @update:model-value="saveSccSummary('characterChecksUndertaken', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Character issues
          </dt>
          <dd class="govuk-summary-list__value">
            <TextField
              id="characterIssues"
              v-model="sccSummaryForm.characterIssues"
              type="text"
              @update:model-value="saveSccSummary('characterIssues', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Matters requiring a decision
          </dt>
          <dd class="govuk-summary-list__value">
            Annex
            <TextField
              id="mattersRequiringADecision"
              v-model="sccSummaryForm.mattersRequiringADecision"
              type="text"
              @update:model-value="saveSccSummary('mattersRequiringADecision', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Previously declared, within guidance
          </dt>
          <dd class="govuk-summary-list__value">
            Annex
            <TextField
              id="previouslyDeclaredWithinGuidance"
              v-model="sccSummaryForm.previouslyDeclaredWithinGuidance"
              type="text"
              @update:model-value="saveSccSummary('previouslyDeclaredWithinGuidance', $event)"
            />
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            High scoring D candidates
          </dt>
          <dd class="govuk-summary-list__value">
            Annex
            <TextField
              id="highScoringDCandidates"
              v-model="sccSummaryForm.highScoringDCandidates"
              type="text"
              @update:model-value="saveSccSummary('highScoringDCandidates', $event)"
            />
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, watchEffect, ref } from 'vue';
import store from '@/store';
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import { downloadBase64File } from '@/helpers/file';
import { hasPermissions } from '@/services/permissionService';
import PERMISSIONS from '@/permissions';

const exerciseReportSccSummary = computed(() => store.state.exerciseReportSccSummary.record || {});
const exercise = computed(() => store.state.exerciseDocument.record || {});
const isLoading = ref(false);

const sccSummaryForm = reactive({});

onMounted(async () => {
  isLoading.value = true;
  await getData();
  store.dispatch('exerciseReportSccSummary/bind', exercise.value.id);
  isLoading.value = false;
});

onBeforeUnmount(() => {
  store.dispatch('exerciseReportSccSummary/unbind');
});

const saveSccSummary = async (field, value) => {
  await store.dispatch('exerciseReportSccSummary/update', { exerciseId: exercise.value.id, data: { [field]: value } });
};

const getData = async () => {
  const result = await httpsCallable(functions, 'generateSccSummaryReport')({ exerciseId: exercise.value.id });
  return result;
};

const downloadSccSummaryReport = async () => {
  if (!exercise.value.referenceNumber) {
    console.error('No reference number available');
    return false;
  }
  try {
    const result = await httpsCallable(
      functions,
      'exportSccSummaryReport'
    )({
      exerciseId: exercise.value.id,
      format: 'googledoc',
    });

    if (!result.data) {
      console.error('No data received from the function');
      return false;
    }

    downloadBase64File(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      result.data,
      `${exercise.value.referenceNumber}_SCC Summary Report.docx`
    );

    return true;
  } catch (error) {
    console.error('Error downloading SCC Summary Report:', error);
    return false;
  }
};

watchEffect(() => {
  if (exerciseReportSccSummary.value) {
    Object.assign(sccSummaryForm, exerciseReportSccSummary.value);
  }
});

</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
