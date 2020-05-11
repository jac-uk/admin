<template>
  <div
    v-if="diversity"
  >
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Diversity
          </h2>
        </div>
        <div
          class="moj-page-header-actions__actions" 
          style="float: right;"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                @click="refreshReport"
              >
                <span
                  v-if="refreshingReport"
                  class="spinner-border spinner-border-sm"
                /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ diversity.totalApplications }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ exercise.typeOfExercise | lookup }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- tabs section
    <div class="govuk-grid-column-full">
      <div
        class="govuk-tabs"
        data-module="govuk-tabs"
      >
        <h2 class="govuk-tabs__title">
          Contents
        </h2>
        <ul class="govuk-tabs__list">
          <li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a
              class="govuk-tabs__tab"
              href="#applied"
            >Applied</a>
          </li>
          <li class="govuk-tabs__list-item">
            <a
              class="govuk-tabs__tab"
              href="#shortlisted"
            >Shortlisted</a>
          </li>
          <li class="govuk-tabs__list-item">
            <a
              class="govuk-tabs__tab"
              href="#selected"
            >Selected</a>
          </li>
          <li class="govuk-tabs__list-item">
            <a
              class="govuk-tabs__tab"
              href="#recommended"
            >Recommended</a>
          </li>
          <li class="govuk-tabs__list-item">
            <a
              class="govuk-tabs__tab"
              href="#handover"
            >Handover</a>
          </li>
        </ul>
      </div>
    </div>--->

    <!-- results -->
    <div class="govuk-grid-column-full">
      <table class="govuk-table table-with-border">
        <caption class="govuk-table__caption hidden">
          Gender by exercise stage
        </caption>
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Gender
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Applications
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Male
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.gender.male" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Female
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.gender.female" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Gender Neutral
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.gender.genderNeutral" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Prefer not to say
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.gender.preferNotToSay" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Other
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.gender.other" />
            </td>
          </tr>            
        </tbody>
      </table>

      <table class="govuk-table">
        <caption class="govuk-table__caption hidden">
          Ethnicity by exercise stage
        </caption>
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Ethnicity
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Applications
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th
              scope="row"
              class="govuk-table__header"
            >
              BAME
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.ethnicity.bame" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="row" 
              class="govuk-table__header"
            >
              White
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.ethnicity.white" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="row" 
              class="govuk-table__header"
            >
              Prefer not to say
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.ethnicity.preferNotToSay" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th
              scope="row"
              class="govuk-table__header"
            >
              Other
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.ethnicity.other" />
            </td>
          </tr>
        </tbody>
      </table>

      <table class="govuk-table">
        <caption class="govuk-table__caption hidden">
          Disability by exercise stage
        </caption>
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Disability
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Applications
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Yes
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.disability.yes" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              No
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.disability.no" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Prefer not to say
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.disability.preferNotToSay" />
            </td>
          </tr>
        </tbody>
      </table>

      <table class="govuk-table">
        <caption class="govuk-table__caption hidden">
          Professional background by exercise stage
        </caption>
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Professional background
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Applications
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th
              scope="row" 
              class="govuk-table__header"
            >
              Barrister
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.professionalBackground.barrister" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              CILEx
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.professionalBackground.cilex" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Solicitor
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.professionalBackground.solicitor" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Prefer not to say
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.professionalBackground.preferNotToSay" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Other
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.professionalBackground.other" />
            </td>
          </tr>            
        </tbody>
      </table> 

      <table class="govuk-table">
        <caption class="govuk-table__caption hidden">
          Social mobility by selected stage
        </caption>
        <thead class="govuk-table__header">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Social mobility
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Applications
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th 
              scope="row"
              class="govuk-table__header"
            >
              Attended UK state school
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.socialMobility.attendedUKStateSchool" />
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th 
              scope="row" 
              class="govuk-table__header"
            >
              First generation to attend University
            </th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              <Stat :stat="diversity.applied.socialMobility.firstGenerationUniversity" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import Stat from '@/components/Report/Stat';
import { firestore, functions } from '@/firebase';

export default {
  components: {
    // Stat,
  },
  data() {
    return {
      diversity: null,
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
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/diversity`)
      .onSnapshot((snap) => {
        this.diversity = snap.data();
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
      await functions.httpsCallable('generateDiversityReport')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
  },
};
</script>

<style lang="scss" scoped>

.panel {
    background: govuk-colour("light-grey");
    padding: 20px;
}

.govuk-table__header, .govuk-table__cell {
    vertical-align: middle;
}
.govuk-table__header, .govuk-table__cell {
    vertical-align: middle;
}

.hidden {
    display: none;
}

.govuk-tabs__panel {
    border: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

</style>
