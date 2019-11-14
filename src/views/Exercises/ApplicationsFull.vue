<template>
  <div>
    <div>
      <input
        id="search-bar"
        class="govuk-input govuk-input--width-10 govuk-!-margin-right-2"
      >
      <Button class="govuk-button govuk-!-margin-right-2">
        Apply filter
      </Button>
      <Button class="govuk-button govuk-!-margin-right-2">
        Update status
      </Button>
      <Button class="govuk-button govuk-!-margin-right-2">
        bulk email
      </Button>
    </div>

    <table class="govuk-table">
      <caption class="govuk-table__caption">
        Applicants Full Details
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            <div class="govuk-checkboxes govuk-checkboxes--small">
              <div class="govuk-checkboxes__item">
                <input
                  id="organisation"
                  class="govuk-checkboxes__input"
                  name="organisation"
                  type="checkbox"
                  value="hmrc"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="organisation"
                />
              </div>
            </div>
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Applicant Ref
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Email
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Status
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Last Update
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Flags (Character, Eligibility etc)
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Last JAC Update
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Last actionee
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Action
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          />
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="applicant in applicants"
          :key="applicant.name"
          class="govuk-table__row"
        >
          <td class="govuk-table__cell">
            <div class="govuk-checkboxes govuk-checkboxes--small">
              <div class="govuk-checkboxes__item">
                <input
                  id="organisation"
                  class="govuk-checkboxes__input"
                  name="organisation"
                  type="checkbox"
                  value="hmrc"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="organisation"
                />
              </div>
            </div>
          </td>
          <th
            scope="row"
            class="govuk-table__header"
          >
            {{ applicant.ref }}
          </th>
          <td class="govuk-table__cell">
            {{ applicant.name }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.email }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.status }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.lastUpdate }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.flags }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.lastJACUpdate }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.lastActionee }}
          </td>
          <td class="govuk-table__cell">
            <Button class="govuk-button govuk-!-margin-bottom-2">
              Send email
            </Button>
          </td>
          <td class="govuk-table__cell">
            {{ applicant.notes }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="govuk-grid-column-full">
      <div
        class="govuk-grid-column-one-half"
        style="float:left"
      >
        <fieldset class="govuk-fieldset">
          <button class="govuk-button govuk-button--secondary govuk-!-margin-right-2">
            Apply Filter view
          </button>
          <button class="govuk-button govuk-button--secondary">
            clear filters
          </button>
          <div class="govuk-checkboxes govuk-checkboxes--small">
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                status
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                flag
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                actionee
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                Last JAC update
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                Last applicant update
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div
        class="govuk-grid-column-one-half update-status"
        style="float:right"
      >
        <fieldset class="govuk-fieldset">
          <button class="govuk-button govuk-button--secondary govuk-!-margin-right-2 govuk-!-margin-top-2">
            Update status
          </button>
          <ul class="govuk-list">
            <li>Proceed to next stage</li>
            <li>Passed shortlisting</li>
            <li>Failed shortlisting</li>
            <li>Passed selection day</li>
            <li>Failed selection day</li>
            <li>Withdrawn</li>
            <li>Rejected on character</li>
            <li>Rejected as ineligible</li>
            <li>Recomended for appointment - s87</li>
            <li>Recommended for future appointment - s94</li>
            <li>Record to Judicial Office</li>
          </ul>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applicants: [
        { ref: '001',
          name: 'Lauren 1',
          email: 'email@1.com',
          status: 'pending',
          lastUpdate: '25/10/2019',
          flags: 'Eligibility',
          lastJACUpdate: '05/11/2019',
          lastActionee: 'Jeremy',
          notes: 'Has never been a judge.',
        },
        { ref: '002',
          name: 'Lauren 2',
          email: 'email@2.com',
          status: 'pending',
          notes: 'Had accessibility requirements.',
        },
        { ref: '003',
          name: 'Lauren 3',
          email: 'email@3.com',
          status: 'pending',
          notes: 'Needs to reschedule role play.',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
  .update-status {
    border-style: solid;
    border-width: medium;
    border-color: black;
  }
  .govuk-checkboxes__input {
    border-style: solid;
    border-width: medium;
    border-color: black;
  }
</style>
