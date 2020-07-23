<template>
  <div>
    <div class="govuk-grid-row">
      <h1 class="govuk-heading-l">
        Agency
      </h1>

      <div class="govuk-inset-text govuk-!-margin-bottom-7">
        <p class="govuk-body">
          More information is available in the Excel files.
        </p>
      </div>

      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      >
        <div
          class="govuk-grid-column-full"
        >
          <h3 class="govuk-heading-m govuk-!-margin-top-4">
            {{ activeTabDetails.header || activeTabDetails.title }}
          </h3>

          <template
            v-if="activeTab === 'acro'"
          >
            <table class="govuk-table">
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of Birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Place of Birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    National Insurance Number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in agencyReport.acro.candidates"
                  :key="candidate.userId"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.dateOfBirth | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.placeOfBirth }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.nationalInsuranceNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'sra'"
          >
            <table
              v-if="agencyReport.sra.count"
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Admission to the roll
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Registration number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in agencyReport.sra.candidates"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.date | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.membershipNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'bsb'"
          >
            <table
              v-if="agencyReport.bsb.count"
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Called to the Bar
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Registration number
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in agencyReport.bsb.candidates"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.date | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.membershipNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'jcio'"
          >
            <table
              v-if="agencyReport.jcio.count"
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Judicial Office
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Judicial posts
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in agencyReport.jcio.candidates"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.judicialOffice | toYesNo }}
                  </td>
                  <td class="govuk-table__cell">
                    <ul class="govuk-list govuk-!-margin-bottom-0">
                      <li
                        v-for="(item, index) in candidate.experience"
                        :key="index"
                      >
                        {{ item.jobTitle }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'hmrc'"
          >
            <table
              v-if="agencyReport.hmrc.count"
              class="govuk-table"
            >
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    Date of birth
                  </th>
                  <th
                    scope="col"
                    class="govuk-table__header"
                  >
                    VAT registration number(s)
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr
                  v-for="candidate in agencyReport.hmrc.candidates"
                  :key="candidate.id"
                  class="govuk-table__row"
                >
                  <td class="govuk-table__cell">
                    {{ candidate.fullName }}
                  </td>
                  <td class="govuk-table__cell">
                    {{ candidate.dateOfBirth | formatDate('long') }}
                  </td>
                  <td class="govuk-table__cell">
                    <ul
                      class="govuk-list govuk-!-margin-bottom-0"
                    >
                      <li
                        v-for="(item, index) in candidate.VATNumbers"
                        :key="index"
                      >
                        {{ item.VATNumber }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template
            v-if="activeTab === 'other'"
          >
            <div
              v-for="agency in agencyReport.other"
              :key="agency.name"
            >
              <template
                v-if="agency.count"
              >
                <h3 class="govuk-heading-s govuk-!-margin-top-4">
                  {{ agency.name }}
                </h3>

                <table class="govuk-table">
                  <thead class="govuk-table__head">
                    <tr class="govuk-table__row">
                      <th
                        scope="col"
                        class="govuk-table__header"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        class="govuk-table__header"
                      >
                        Date of membership
                      </th>
                      <th
                        scope="col"
                        class="govuk-table__header"
                      >
                        Membership number
                      </th>
                    </tr>
                  </thead>
                  <tbody class="govuk-table__body">
                    <template
                      v-if="agencyReport.hmrc.count"
                    >
                      <tr
                        v-for="candidate in agency.candidates"
                        :key="candidate.id"
                        class="govuk-table__row"
                      >
                        <td class="govuk-table__cell">
                          {{ candidate.fullName }}
                        </td>
                        <td class="govuk-table__cell">
                          {{ candidate.date | formatDate('long') }}
                        </td>
                        <td class="govuk-table__cell">
                          {{ candidate.membershipNumber }}
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </template>
            </div>
          </template>
          <button
            :disabled="true"
            class="govuk-button"
          >
            Export Data
          </button>
        </div>
      </TabsList>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TabsList from '@/components/Page/TabsList';

export default {
  components: {
    TabsList,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'acro',
          title: 'ACRO',
        },
        {
          ref: 'sra',
          title: 'SRA',
          header: 'Solicitor Regulation Authority',
        },
        {
          ref: 'bsb',
          title: 'BSB',
          header: 'Bar Standard Board',
        },
        {
          ref: 'jcio',
          title: 'JCIO',
          header: 'Judicial Conduct Investigations Office',
        },
        {
          ref: 'hmrc',
          title: 'HMRC',
        },
        {
          ref: 'other',
          title: 'Other',
        },
      ],
      activeTab: 'acro',
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    ...mapGetters('applications', [
      'agencyReport',
    ]),
    activeTabDetails() {
      const activeTab = this.tabs.find((tab) => tab.ref === this.activeTab );
      return activeTab;
    },
  },
  created() {
    this.$store.dispatch('applications/bind', {
      exerciseId: this.exercise.id,
      status: 'applied',
      characterChecks: true,
    });
  },
};
</script>
