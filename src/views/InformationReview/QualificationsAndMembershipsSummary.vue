<template>
  <div>
    <!-- qualifications -->
    <div
      class="govuk-!-margin-bottom-6"
    >
      <h2 class="govuk-heading-l">
        Qualifications
      </h2>
      <div>
        <div>
          <dl
            v-for="(item, index) in application.qualifications"
            :key="item.name"
          >
            <button
              v-if="editable"
              class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
              @click="removeQualification(index)"
            >
              Remove
            </button>
            <div
              class="govuk-summary-list govuk-!-margin-bottom-5"
            >
              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key widerColumn">
                  Qualification
                </dt>
                <dd class="govuk-summary-list__value">
                  <InformationReviewRenderer
                    :data="application.qualifications[index].type"
                    field="qualifications"
                    extension="type"
                    :index="index"
                    :edit="editable"
                    :options="['advocate-scotland', 'barrister', 'CILEx', 'solicitor']"
                    type="selection"
                    @changeField="changeQualificationOrMembership"
                  />
                </dd>
              </div>

              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key widerColumn">
                  Location
                </dt>
                <dd class="govuk-summary-list__value">
                  <InformationReviewRenderer
                    :data="application.qualifications[index].location"
                    field="qualifications"
                    extension="location"
                    :index="index"
                    :edit="editable"
                    :options="['england-wales', 'northern-ireland', 'scotland']"
                    type="selection"
                    @changeField="changeQualificationOrMembership"
                  />
                </dd>
              </div>

              <div
                v-if="item.date || editable"
                class="govuk-summary-list__row"
              >
                <dt
                  v-if="item.type === 'barrister'"
                  class="govuk-summary-list__key widerColumn"
                >
                  Date completed pupillage
                </dt>
                <dt
                  v-else
                  class="govuk-summary-list__key widerColumn"
                >
                  Date qualified
                </dt>
                <dd class="govuk-summary-list__value">
                  <InformationReviewRenderer
                    :data="application.qualifications[index].date"
                    field="qualifications"
                    extension="date"
                    :index="index"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </dd>
              </div> 

              <template>
                <div
                  v-if="item.type === 'barrister' || ((item.qualificationNotComplete && item.details) || editable)"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key widerColumn">
                    Has not completed pupillage
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <InformationReviewRenderer
                      :data="application.qualifications[index].qualificationNotComplete"
                      field="qualifications"
                      extension="qualificationNotComplete"
                      :index="index"
                      :edit="editable"
                      :options="[true, false]"
                      type="selection"
                      @changeField="changeQualificationOrMembership"
                    />
                  </dd>
                </div>

                <div
                  v-if="item.type === 'barrister' && (item.qualificationNotComplete === true)"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key widerColumn">
                    Did not complete pupillage notes
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <InformationReviewRenderer
                      :data="application.qualifications[index].details"
                      field="qualifications"
                      extension="details"
                      :index="index"
                      :edit="editable"
                      @changeField="changeQualificationOrMembership"
                    />
                  </dd>
                </div>
              </template>
            </div>
          </dl>
        </div>
      </div>
      <div
        class="govuk-body"
      >
        <div
          v-if="!applicationHasQualifications"
        >
          No answers provided
        </div>
        <button
          v-if="editable"
          style="display: inline-block;"
          class="print-none govuk-button govuk-!-margin-bottom-0 float-right"
          @click="addQualification"
        >
          Add
        </button>
      </div>
    </div>

    <!-- applied shedules -->
    <div>
      <dl
        v-if="exercise.schedule2Apply"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div
          v-if="exercise.appliedSchedule == 'schedule-2-3'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Are you applying under Schedule 2(3)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.applyingUnderSchedule2Three"
              field="applyingUnderSchedule2Three"
              :edit="editable"
              :options="[true, false]"
              type="selection"
              @changeField="changeQualificationOrMembership"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="sheduleApplies"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <dt
          class="govuk-summary-list__key widerColumn"
        >
          Explain how you've gained experience in law.
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li v-if="exercise.appliedSchedule=='schedule-2-3'">
              <InformationReviewRenderer
                :data="application.experienceUnderSchedule2Three"
                field="experienceUnderSchedule2Three"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
            </li>
            <li v-if="exercise.appliedSchedule=='schedule-2-d'">
              <InformationReviewRenderer
                :data="application.experienceUnderSchedule2D"
                field="experienceUnderSchedule2D"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
            </li>
          </ul>
        </dd>
      </dl>
    </div>

    <!-- memberships -->
    <div
      v-if="hasRelevantMemberships"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Memberships
      </h2>
      <div>
        <dl
          v-if="application.memberships"
          class="govuk-summary-list govuk-!-margin-bottom-8"
        >
          <div
            v-for="(membership, key) in exercise.memberships"
            :key="key"
            class="govuk-summary-list__row"
          >
            <div v-if="fieldContains(application.memberships, membership) || editable">
              <dt class="govuk-summary-list__key widerColumn">
                {{ membership }}
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.memberships }}
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="hasMemberships ? application.memberships[membership].date : null"
                  field="memberships"
                  extension="date"
                  :index="membership.value"
                  :edit="editable"
                  type="date"
                  @changeField="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Membership Number
                </h5>
                <InformationReviewRenderer
                  :data="hasMemberships ? application.memberships[membership.value].number : null"
                  field="memberships"
                  extension="number"
                  :index="membership.value"
                  :edit="editable"
                  @changeField="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="hasMemberships ? application.memberships[membership.value].information : null"
                  field="memberships"
                  extension="information"
                  :index="membership.value"
                  :edit="editable"
                  @changeField="changeQualificationOrMembership"
                />
              </dd>
            </div>
          </div>
        </dl>
        <dl
          v-else
          class="govuk-body"
        >
          No answers provided
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

import {
  hasRelevantMemberships,
  isNonLegal
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  data() {
    return {
      dataDefault: {
        type: null,
        location: null,
        date: new Date(),
        qualificationNotComplete: null,
        details: null,
      },
      hasMemberships: !!this.application.memberships,
    };
  },
  computed: {
    applicationHasQualifications() {
      return this.application.qualifications.length > 0;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    hasRelevantMemberships() {
      return hasRelevantMemberships(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    otherMemberships() {
      if (Array.isArray(this.exercise.otherMemberships)) {
        return this.exercise.otherMemberships.filter(membership => this.exercise.memberships.includes(membership.value));
      }
      return null;
    },
    sheduleApplies(){
      return (this.exercise.appliedSchedule == 'schedule-2-3' && this.application.applyingUnderSchedule2Three) ||
        (this.exercise.appliedSchedule == 'schedule-2-d' && this.application.applyingUnderSchedule2d);
    },
  },
  methods: {
    fieldContains(field, item) {
      if (field && item) {
        if (field === item) {
          return true;
        }
        if (Array.isArray(field) && field.includes(item)) {
          return true;
        }
      }
      return false;
    },
    showMembershipOption(ref) {
      return this.exercise.memberships.indexOf(ref) >= 0;
    },
    addQualification() {
      let objChanged = this.application.qualifications || [];

      if (objChanged.length){
        objChanged = [...objChanged, this.dataDefault];
      } else {
        objChanged = [this.dataDefault];
      } 

      this.$store.dispatch('application/update', { data: { qualifications: objChanged }, id: this.applicationId });

    },
    removeQualification(index) {
      let objChanged = this.application.qualifications || [];

      if (objChanged.length > 0){
        objChanged.splice(index, 1);
      } else {
        objChanged = [];
      } 

      this.$store.dispatch('application/update', { data: { qualifications: objChanged }, id: this.applicationId });

    },
    changeQualificationOrMembership(obj) {

      let objChanged = this.application[obj.field] || {};

      if (obj.change && obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!objChanged[obj.index]) {
          objChanged = {
            [obj.index]: {},
          };
        }
        objChanged[obj.index][obj.extension] = obj.change;
      } else if (obj.change && obj.hasOwnProperty('index')) { //direct field
        objChanged[obj.index] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE
        if (objChanged.length > 0){
          objChanged.splice(obj.index, 1);
        } else {
          objChanged = [];
        } 
      } else {
        objChanged = obj;
      }
      const updatedApplication = { ...this.application, ...objChanged };

      this.$store.dispatch('application/update', { data: updatedApplication, id: this.applicationId });

    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
