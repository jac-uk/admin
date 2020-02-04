<template>
  <div>
    <div class="govuk-grid-row">
      <h1 class="govuk-heading-l">
        Diversity Report
      </h1>
      <div class="govuk-grid-column-full">
        <table class="govuk-table table-with-border">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Exercise title
              </th>
              <th
                scope="col"
                class="govuk-table__header"
              >
                Type
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                Total applications
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">
                {{ exercise.referenceNumber }} {{ exercise.name }}
              </td>
              <td class="govuk-table__cell">
                {{ exercise.typeOfExercise | lookup }}
              </td>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                {{ applications.length }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <div class="govuk-form-group govuk-grid-column-one-quarter govuk-!-padding-left-0">
        <select class="govuk-select govuk-!-margin-top-6 govuk-!-margin-left-1">
          <option>Team Checks</option>
          <option value="e-and-d-post-application">
            E&D Post Application
          </option>
          <option value="e-and-d-post-sift-shortlisting">
            E&D Post Sift/Shortlisting
          </option>
          <option value="e-and-d-post-selection-day">
            E&D Post Selection Day
          </option>
          <option value="selection-team-check">
            Selection Team Check
          </option>
          <option value="statistician-check">
            Statistician Check
          </option>
        </select>
      </div>

      <div class="govuk-grid-row">
        <DateInput
          id="team-checks-date"
          v-model="teamChecksDate"
          label="Filter by date"
        />
      </div> -->

      <div class="govuk-grid-column-full">
        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption">
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
                Post application
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Male
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.gender.male" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Female
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.gender.female" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Gender Neutral
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.gender.genderNeutral" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.gender.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.gender.other" />
              </td>
            </tr>            
          </tbody>
        </table>

        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption">
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
                Post application
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                BAME
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.ethnicity.bame" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                White
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.ethnicity.white" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.ethnicity.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.ethnicity.other" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption">
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
                Post application
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Yes
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.disability.yes" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                No
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.disability.no" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.disability.preferNotToSay" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption">
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
                Post application
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Barrister
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.professionalBackground.barrister" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                CILEx
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.professionalBackground.cilex" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Solicitor
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.professionalBackground.solicitor" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Prefer not to say
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.professionalBackground.preferNotToSay" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.professionalBackground.other" />
              </td>
            </tr>            
          </tbody>
        </table>

        <table class="govuk-table table-with-border">
          <caption class="govuk-table__caption">
            Social mobility by exercise stage
          </caption>
          <thead class="govuk-table__head">
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
                Post application
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Attended UK state school
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.socialMobility.attendedUKStateSchool" />
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                First generation to attend University
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity.postApplication.socialMobility.firstGenerationUniversity" />
              </td>
            </tr>
          </tbody>
        </table>         

        <button
          :disabled="true"
          class="govuk-button"
        >
          Export Data
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Stat from '@/components/Report/Stat';

export default {
  components: {
    Stat,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },    
    applications() {
      return this.$store.state.applications.records;
    },    
    diversity() {
      return this.$store.getters['applications/diversity'];
    },
  },
  created() {
    this.$store.dispatch('applications/bind', this.exercise.id);
  },
  destroyed() {
    // this.$store.dispatch('applications/unbind');
  },  
};
</script>

<style lang="scss" scoped>

.table-with-border {
  td, th {
   border-style: solid;
   border-width: 2px;
   border-color: black;
   padding-left: 6px;
   padding-right: 6px;
  }
  .govuk-table__header--numeric,
  .govuk-table__cell--numeric {
    padding-right: 6px;
  }
}

</style>
