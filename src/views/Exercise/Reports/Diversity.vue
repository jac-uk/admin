<template>
  <div class="govuk-grid-row">
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Diversity
          </h2>
          <span
            v-if="diversity"
            class="govuk-body govuk-!-font-size-14"
          >
            {{ $filters.formatDate(diversity.createdAt, 'longdatetime') }}
          </span>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                :disabled="!showTabs"
                @click="exportData(activeTab)"
              >
                Export stage data
              </button>
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                :disabled="!showTabs"
                @click="exportData()"
              >
                Export all data
              </button>
              <ActionButton
                v-if="hasPermissions([
                  PERMISSIONS.exercises.permissions.canReadExercises.value,
                  PERMISSIONS.applications.permissions.canReadApplications.value,
                  PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value
                ])"
                type="primary"
                :action="refreshReport"
              >
                Refresh
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="diversity && showTabs"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.formatNumber(diversity.totalApplications) }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.lookup(exercise.typeOfExercise) }}
            </h2>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="govuk-body">
          Please refresh the report.
        </p>
      </div>
    </div>

    <!-- results -->
    <div
      v-if="diversity && showTabs"
      class="govuk-grid-column-full"
    >
      <Select
        id="tab-filter"
        v-model="activeTab"
        class="govuk-!-margin-right-2"
      >
        <option
          v-for="tab in tabs"
          :key="tab.ref"
          :value="tab.ref"
        >
          {{ tab.title }}
        </option>
      </Select>

      <h3 class="govuk-heading-m">
        {{ activeTabTitle }}
      </h3>

      <div v-if="activeTab == 'summary'">
        <div
          v-for="tab in summaryTabs"
          :key="tab.ref"
          class="govuk-!-margin-top-8"
        >
          <p class="govuk-hint">
            {{ tab.title }}
          </p>
          <table class="govuk-table table-with-border">
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
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th
                  scope="col"
                  class="govuk-table__header"
                >
                  Female
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].gender.female.change) }}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="govuk-table">
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
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th
                  scope="row"
                  class="govuk-table__header"
                >
                  Ethnic minorities
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].ethnicity.bame.change) }}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="govuk-table">
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
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Yes
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].disability.yes.change) }}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="govuk-table">
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
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  CILEx
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].professionalBackground.cilex.change) }}
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Solicitor
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].professionalBackground.solicitor.change) }}
                </td>
              </tr>
            </tbody>
          </table>

          <table
            v-if="'attendedUKStateSchool' in diversity[tab.ref]"
            class="govuk-table"
          >
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
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Attended UK state school
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                  {{ showChange(diversity[tab.ref].attendedUKStateSchool.attendedUKStateSchool.change) }}
                </td>
              </tr>
            </tbody>
          </table>
          <template v-else-if="applicationOpenDatePost01042023 && 'parentsNotAttendedUniversity' in diversity[tab.ref]">
            <table class="govuk-table">
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
                    % Change from previous
                  </th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr class="govuk-table__row">
                  <th class="govuk-table__header">
                    Parents did not attend University
                  </th>
                  <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
                    {{ showChange(diversity[tab.ref].parentsNotAttendedUniversity.parentsNotAttendedUniversity.change) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
      </div>

      <div v-else-if="diversity[activeTab]">
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
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
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
                <Stat :stat="diversity[activeTab].gender.male" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Female
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].gender.female" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].gender.female.change) }}
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].gender.declaration"
                  :report-total="diversity[activeTab].gender.total"
                  :is-declaration-total="true"
                />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric"
              />
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
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header"
              >
                Ethnic minorities
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].ethnicity.bame" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].ethnicity.bame.change) }}
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
                <Stat :stat="diversity[activeTab].ethnicity.white" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].ethnicity.declaration"
                  :report-total="diversity[activeTab].ethnicity.total"
                  :is-declaration-total="true"
                />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric"
              />
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
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Yes
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].disability.yes" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].disability.yes.change) }}
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                No
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].disability.no" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].disability.declaration"
                  :report-total="diversity[activeTab].disability.total"
                  :is-declaration-total="true"
                />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric"
              />
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
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
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
                <Stat :stat="diversity[activeTab].professionalBackground.barrister" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                CILEx
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.cilex" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].professionalBackground.cilex.change) }}
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Solicitor
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.solicitor" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].professionalBackground.solicitor.change) }}
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Other
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].professionalBackground.other" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].professionalBackground.declaration"
                  :report-total="diversity[activeTab].professionalBackground.total"
                  :is-declaration-total="true"
                />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric"
              />
            </tr>
          </tbody>
        </table>

        <table
          v-if="'attendedUKStateSchool' in diversity[activeTab]"
          class="govuk-table"
        >
          <caption class="govuk-table__caption hidden">
            Social mobility by selected stage
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
                Applications
              </th>
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Attended UK state school
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].attendedUKStateSchool.attendedUKStateSchool" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              >
                {{ showChange(diversity[activeTab].attendedUKStateSchool.attendedUKStateSchool.change) }}
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].attendedUKStateSchool.declaration"
                  :report-total="diversity[activeTab].attendedUKStateSchool.total"
                  :is-declaration-total="true"
                />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric"
              />
            </tr>
          </tbody>
        </table>

        <template v-if="!applicationOpenDatePost01042023 && 'firstGenerationUniversity' in diversity[activeTab]">
          <table class="govuk-table">
            <caption class="govuk-table__caption hidden">
              Social mobility by selected stage
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
                  Applications
                </th>
                <th
                  v-if="isNotApplied"
                  scope="col"
                  class="govuk-table__header govuk-table__header--numeric"
                >
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  First Generation University
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="diversity[activeTab].firstGenerationUniversity.firstGenerationUniversity" />
                </td>
                <td
                  v-if="isNotApplied"
                  class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
                />
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="diversity[activeTab].firstGenerationUniversity.declaration"
                    :report-total="diversity[activeTab].firstGenerationUniversity.total"
                    :is-declaration-total="true"
                  />
                </td>
                <td
                  v-if="isNotApplied"
                  class="govuk-table__cell govuk-table__cell--numeric"
                />
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else-if="applicationOpenDatePost01042023 && 'parentsNotAttendedUniversity' in diversity[activeTab]">
          <table class="govuk-table">
            <caption class="govuk-table__caption hidden">
              Social mobility by selected stage
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
                  Applications
                </th>
                <th
                  v-if="isNotApplied"
                  scope="col"
                  class="govuk-table__header govuk-table__header--numeric"
                >
                  % Change from previous
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Parents did not attend University
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat :stat="diversity[activeTab].parentsNotAttendedUniversity.parentsNotAttendedUniversity" />
                </td>
                <td
                  v-if="isNotApplied"
                  class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
                >
                  {{ showChange(diversity[activeTab].parentsNotAttendedUniversity.parentsNotAttendedUniversity.change) }}
                </td>
              </tr>
              <tr class="govuk-table__row">
                <th class="govuk-table__header">
                  Declaration total
                </th>
                <td class="govuk-table__cell govuk-table__cell--numeric">
                  <Stat
                    :stat="diversity[activeTab].parentsNotAttendedUniversity.declaration"
                    :report-total="diversity[activeTab].parentsNotAttendedUniversity.total"
                    :is-declaration-total="true"
                  />
                </td>
                <td
                  v-if="isNotApplied"
                  class="govuk-table__cell govuk-table__cell--numeric"
                />
              </tr>
            </tbody>
          </table>
        </template>

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
                EMP status
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                Applications
              </th>
              <th
                v-if="isNotApplied"
                scope="col"
                class="govuk-table__header govuk-table__header--numeric"
              >
                % Change from previous
              </th>
            </tr>
          </thead>
          <tbody
            v-if="diversity[activeTab].emp"
            class="govuk-table__body"
          >
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.applied" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied on basis of ethnicity
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.ethnicity" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                EMP applied on basis of gender
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat :stat="diversity[activeTab].emp.gender" />
              </td>
              <td
                v-if="isNotApplied"
                class="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
              />
            </tr>
            <!-- <tr class="govuk-table__row">
              <th class="govuk-table__header">
                Declaration total
              </th>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <Stat
                  :stat="diversity[activeTab].emp.declaration"
                  :report-total="diversity[activeTab].emp.total"
                />
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { onSnapshot, doc } from '@firebase/firestore';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
// import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import { downloadXLSX } from '@/export';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import Stat from '@/components/Report/Stat.vue';
import permissionMixin from '@/permissionMixin';
import { mapGetters } from 'vuex';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { availableStages } from '@/helpers/exerciseHelper';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@/helpers/constants';
import _ from 'lodash';

export default {
  name: 'Diversity',
  components: {
    Select,
    Stat,
    ActionButton,
  },
  mixins: [permissionMixin],
  data() {
    return {
      diversity: null,
      unsubscribe: null,
      activeTab: '',
    };
  },
  computed: {
    ...mapGetters({
      applicationOpenDatePost01042023: 'exerciseDocument/applicationOpenDatePost01042023',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isProcessingVersion2() {
      return this.exercise._processingVersion >= 2;
    },
    availableStages() {
      return availableStages(this.exercise);
    },
    tabs() {
      // exclude shortlisted tab
      const stages = this.availableStages.filter(stage => ![EXERCISE_STAGE.SHORTLISTED, EXERCISE_STAGE.SELECTION, EXERCISE_STAGE.SCC].includes(stage));
      const tabs = stages.map((stage) => {
        const tab = {};
        tab.ref = stage;
        switch (stage) {
        case EXERCISE_STAGE.SHORTLISTING:
        case EXERCISE_STAGE.REVIEW:
          tab.ref = EXERCISE_STAGE.APPLIED;
          tab.title = 'Applied';
          break;
        case EXERCISE_STAGE.SELECTION:
          tab.title = 'Shortlisted';
          break;
        case EXERCISE_STAGE.RECOMMENDATION:
          tab.title = 'Recommended to JO';
          break;
        default:
          tab.title = this.$filters.lookup(stage);
        }
        return tab;
      });
      tabs.push({
        ref: 'summary',
        title: 'Summary',
      });

      // add additional tabs based on shortlisting methods
      return [tabs[0], ...this.additionalTabs, ...tabs.slice(1)];
    },
    additionalTabs() {
      const shortlistingMethods = this.exercise.shortlistingMethods;
      const tabs = [];
      // qt
      if (shortlistingMethods.some(method => ['situational-judgement-qualifying-test', 'critical-analysis-qualifying-test'].includes(method))) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.QUALIFYING_TEST_PASSED : APPLICATION_STATUS.PASSED_FIRST_TEST;
        tabs.push({ ref, title: this.$filters.lookup(ref) });
      }
      // scenario test
      if (shortlistingMethods.includes('scenario-test-qualifying-test')) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.SCENARIO_TEST_PASSED : APPLICATION_STATUS.PASSED_SCENARIO_TEST;
        tabs.push({ ref, title: this.$filters.lookup(ref) });
      }
      // sift
      if (shortlistingMethods.some(method => ['name-blind-paper-sift', 'paper-sift'].includes(method))) {
        const ref = this.isProcessingVersion2 ? APPLICATION_STATUS.SIFT_PASSED : APPLICATION_STATUS.PASSED_SIFT;
        tabs.push({ ref, title: this.$filters.lookup(ref) });
      }

      // passed SD
      if (this.isProcessingVersion2) {
        tabs.push({ ref: APPLICATION_STATUS.SELECTION_DAY_PASSED, title: 'Passed SD' });
      } else {
        tabs.push({ ref: APPLICATION_STATUS.PASSED_SELECTION, title: 'Passed SD' });
      }

      return tabs;
    },
    summaryTabs() {
      return this.tabs.filter((_, index) => index > 0 && index < this.tabs.length - 1);
    },
    showTabs() {
      return this.diversity && this.tabs?.length && this.diversity?.[this.tabs[0].ref];  // check if report data is available
    },
    activeTabTitle() {
      for (let i = 0, len = this.tabs.length; i < len; ++i) {
        if (this.tabs[i].ref === this.activeTab) {
          return this.tabs[i].title;
        }
      }
      return '';
    },
    isNotApplied() {
      return this.activeTab !== 'applied';
    },
  },
  watch: {
    tabs: {
      immediate: true,
      handler() {
        if (this.tabs.length && !this.activeTab && this.activeTab !== this.tabs[0].ref) {
          this.activeTab = this.tabs[0].ref;
        }
      },
    },
  },
  created() {
    if (this.$route.hash && this.$route.hash.slice(1)) {
      this.activeTab = this.$route.hash.slice(1);
    }

    this.unsubscribe = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/diversity`),
      (snap) => {
        if (snap.exists) {
          this.diversity = vuexfireSerialize(snap);
        }
      });
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    showChange(value) {
      if (value > 0) {
        return `+${this.$filters.formatNumber(value, 2)}%`;
      }
      return `${this.$filters.formatNumber(value || 0, 2)}%`;
    },
    async refreshReport() {
      try {
        return await httpsCallable(functions, 'generateDiversityReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        return;
      }
    },
    gatherReportData() {
      const data = [];
      const merges = [];

      const states = this.tabs.filter((tab) => tab.ref !== 'summary');
      data.push([
        'Exercise:',
        'Progression of Target Groups, percentage calculated by declared information',
        ...this.generateEmptyCells(2 * states.length + 1),
      ]);
      merges.push(`B1:${this.getAlphabet(2 * states.length + 3)}1`);
      data.push([
        this.exercise.name,
        'Characteristic by stage',
        ...this.generateEmptyCells(states.length + 1),
        'Difference between stages',
        ...this.generateEmptyCells(states.length - 1),
      ]);
      merges.push(`B2:${this.getAlphabet(2 + states.length)}2`, `${this.getAlphabet(4 + states.length)}2:${this.getAlphabet(3 + 2 * states.length)}2`);
      data.push([
        'Characteristic',
        `Assigned Commissioner: ${this.getAssignedCommissionerNames()}`,
        ...states.map((state) => `Post-${state.title}`),
        'Eligible Pool',
        ...states.reduce((acc, cur, index) => {
          if (index) {
            acc.push(`From post-${states[index - 1].title} to post-${cur.title}`);
          }
          return acc;
        }, []),
        `Overall: from post-${states[0].title} to post-${states[states.length - 1].title}`,
      ]);
      data.push([
        'All candidates',
        this.exercise.name,
        ...states.map((state) => this.diversity[state.ref].totalApplications),
        ...this.generateEmptyCells(states.length + 1, 'n/a'),
      ]);
      data.push([
        ...this.generateEmptyCells(states.length + 2),
        ...this.generateEmptyCells(states.length + 1, 'n/a'),
      ]);
      merges.push('A4:A5');

      const fields = [
        {
          name: 'Gender: Female',
          key: 'gender.female',
        },
        {
          name: 'Ethnicity: Ethnic minority',
          key: 'ethnicity.bame',
        },
        {
          name: 'Disability: Disabled',
          key: 'disability.yes',
        },
        {
          name: 'Profession: CILEX',
          key: 'professionalBackground.cilex',
        },
        {
          name: 'Profession: Solicitors',
          key: 'professionalBackground.solicitor',
        },
        {
          name: 'Social Mobility: Attended UK state school',
          key: 'attendedUKStateSchool.attendedUKStateSchool',
        },
        {
          name: 'Social Mobility: Parents did not attend University',
          key: 'parentsNotAttendedUniversity.parentsNotAttendedUniversity',
        },
      ];

      const primaryBackground = {
        fill: {
          theme: 4,
          tint: 0.4,
        },
      };
      const secondaryBackground = {
        fill: {
          theme: 4,
          tint: 0.6,
        },
      };
      const styles = {
        row: {
          1: {
            bold: true,
          },
          2: {
            bold: true,
          },
          3: {
            bold: true,
          },
        },
        column: {
          'A': {
            bold: true,
            verticalAlignment: 'top',
          },
        },
        cell: {
          'A3': {
            ...primaryBackground,
          },
          'B1': {
            horizontalAlignment: 'center',
            ...primaryBackground,
          },
          'B2': {
            horizontalAlignment: 'center',
            ...primaryBackground,
          },
          'B3': {
            horizontalAlignment: 'center',
          },
          [`${this.getAlphabet(4 + states.length)}2`]: {
            horizontalAlignment: 'center',
            ...primaryBackground,
          },
        },
        range: {
          [`A1:${this.getAlphabet(2 * states.length + 3)}1`]: {
            border: true,
          },
          [`A2:${this.getAlphabet(2 * states.length + 3)}2`]: {
            border: true,
          },
          [`A3:${this.getAlphabet(2 * states.length + 3)}3`]: {
            border: true,
          },
          [`A4:${this.getAlphabet(2 * states.length + 3)}4`]: {
            border: true,
          },
          [`A5:${this.getAlphabet(2 * states.length + 3)}5`]: {
            border: true,
          },
          [`A7:${this.getAlphabet(2 * states.length + 3)}7`]: {
            border: true,
          },
          [`A8:${this.getAlphabet(2 * states.length + 3)}8`]: {
            border: true,
          },
          [`A10:${this.getAlphabet(2 * states.length + 3)}10`]: {
            border: true,
          },
          [`A11:${this.getAlphabet(2 * states.length + 3)}11`]: {
            border: true,
          },
          [`A13:${this.getAlphabet(2 * states.length + 3)}13`]: {
            border: true,
          },
          [`A14:${this.getAlphabet(2 * states.length + 3)}14`]: {
            border: true,
          },
          [`A16:${this.getAlphabet(2 * states.length + 3)}16`]: {
            border: true,
          },
          [`A17:${this.getAlphabet(2 * states.length + 3)}17`]: {
            border: true,
          },
          [`A19:${this.getAlphabet(2 * states.length + 3)}19`]: {
            border: true,
          },
          [`A20:${this.getAlphabet(2 * states.length + 3)}20`]: {
            border: true,
          },
          [`A22:${this.getAlphabet(2 * states.length + 3)}22`]: {
            border: true,
          },
          [`A23:${this.getAlphabet(2 * states.length + 3)}23`]: {
            border: true,
          },
          [`A25:${this.getAlphabet(2 * states.length + 3)}25`]: {
            border: true,
          },
          [`A26:${this.getAlphabet(2 * states.length + 3)}26`]: {
            border: true,
          },
          [`A28:${this.getAlphabet(2 * states.length + 3)}28`]: {
            border: true,
          },
          'A4:A5': {
            ...secondaryBackground,
          },
          'A7:A8': {
            ...secondaryBackground,
          },
          'A10:A11': {
            ...secondaryBackground,
          },
          'A13:A14': {
            ...secondaryBackground,
          },
          'A16:A17': {
            ...secondaryBackground,
          },
          'A19:A20': {
            ...secondaryBackground,
          },
          'A22:A23': {
            ...secondaryBackground,
          },
          'A25:A26': {
            ...secondaryBackground,
          },
          'A28:A28': {
            ...secondaryBackground,
          },
          [`C3:${this.getAlphabet(states.length + 2)}3`]: {
            ...primaryBackground,
          },
          [`${this.getAlphabet(states.length + 4)}3:${this.getAlphabet(2 * states.length + 3)}3`]: {
            ...primaryBackground,
          },
          [`C3:${this.getAlphabet(2 * states.length + 3)}28`]: {
            horizontalAlignment: 'center',
          },
        },
      };
      let rowIndex = 6;
      fields.forEach((field) => {
        data.push([
          ...this.generateEmptyCells(2 * states.length + 3),
        ]);
        data.push([
          field.name,
          this.exercise.name,
          ...states.map((state) => `${this.$filters.formatNumber(_.get(this.diversity[state.ref], `${field.key}.percent`) || 0, 2)}% (${_.get(this.diversity[state.ref], `${field.key}.total`)})`),
          ...this.generateEmptyCells(1),
          ...states.reduce((acc, cur, index) => {
            if (index) {
              acc.push(`${this.showChange(_.get(this.diversity[cur.ref], `${field.key}.change`))}`);
              if (index === states.length - 1) {
                acc.push(`${this.showChange(_.get(this.diversity[cur.ref], `${field.key}.overallChange`))}`);
              }
            }
            return acc;
          }, []),
        ]);
        data.push([
          ...this.generateEmptyCells(states.length + 2),
          ...this.generateEmptyCells(states.length + 1, 'n/a'),
        ]);
        merges.push(`A${rowIndex + 1}:A${rowIndex + 2}`);
        styles.cell[`A${rowIndex + 1}`] = {
          verticalAlignment: 'top',
        };
        rowIndex += 3;
      });
      data.push([
        ...this.generateEmptyCells(2 * states.length + 3),
      ]);
      data.push([
        'Disability comparison statistics',
        ...this.generateEmptyCells(2 * states.length + 2),
      ]);
      merges.push(`B${rowIndex + 1}:${this.getAlphabet(2 * states.length + 3)}${rowIndex + 1}`);

      return {
        data,
        styles,
        freezePanes: [],
        merges,
      };
    },
    exportData(stage) {
      let title = 'Diversity Report';
      if (stage) {
        title = `${title} - ${stage}`;
      }
      const { data, styles, freezePanes, merges } = this.gatherReportData(stage);
      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
          styles,
          freezePanes,
          merges,
        }
      );
    },
    getAssignedCommissionerNames() {
      const res = [];
      const commissioners = this.$store.getters['services/getCommissioners']();
      this.exercise.assignedCommissioner.forEach((commissioner) => {
        const assignedCommissioner = commissioners.find((c) => c.email === commissioner.name);
        if (assignedCommissioner) {
          res.push(assignedCommissioner.name);
        }
      });
      return res.join(', ');
    },
    getAlphabet(number) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[number - 1];
    },
    generateEmptyCells(number, content = '') {
      return new Array(number).fill(content);
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-table__header, .govuk-table__cell {
    vertical-align: middle;
}
</style>
