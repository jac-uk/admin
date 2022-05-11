<template>
  <div>
    <!-- qualifications -->
    <div>
      <h2
        class="govuk-heading-l govuk-!-margin-top-6"
      >
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
              @click="openModal(index)"
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
                  class="govuk-summary-list__key widerColumn"
                >
                  {{ item.type === 'barrister' ? 'Date completed pupillage' : 'Date qualified' }}
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
                  v-if="item.type === 'barrister' && ((item.qualificationNotComplete && item.details) || editable)"
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
      <Modal
        ref="removeModal"
      >
        <ModalInner
          @closed="closeModal"
          @confirmed="removeQualification"
        />
      </Modal>
    </div>

    <!-- applied schedules -->
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

        <div
          v-if="exercise.appliedSchedule == 'schedule-2-d'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Are you applying under Schedule 2(d)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.applyingUnderSchedule2d"
              field="applyingUnderSchedule2d"
              :edit="editable"
              :options="[true, false]"
              type="selection"
              @changeField="changeQualificationOrMembership"
            />
          </dd>
        </div>

        <div
          v-if="exercise.appliedSchedule == 'schedule-2-d'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Are you applying under Schedule 2(d)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.applyingUnderSchedule2d"
              field="applyingUnderSchedule2d"
              :edit="editable"
              :options="[true, false]"
              type="selection"
              @changeField="changeQualificationOrMembership"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="scheduleApplies"
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
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';

import {
  hasRelevantMemberships,
  isNonLegal
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
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
        date: null,
        qualificationNotComplete: null,
        details: null,
      },
      hasMemberships: !!this.application.memberships,
      currentIndex: null,
    };
  },
  computed: {
    applicationHasQualifications() {
      return this.application.qualifications && Object.values(this.application.qualifications).length > 0;
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
    scheduleApplies(){
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
      let changedObj = this.application.qualifications || [];

      if (changedObj.length){
        changedObj = [...changedObj, this.dataDefault];
      } else {
        changedObj = [this.dataDefault];
      }

      this.$emit('updateApplication', { qualifications: changedObj });

    },
    removeQualification() {

      let changedObj = this.application.qualifications || [];

      if (changedObj.length > 0){
        changedObj.splice(this.currentIndex, 1);
      } else {
        changedObj = [];
      }

      this.$emit('updateApplication', { qualifications: changedObj });

      this.$refs.removeModal.closeModal();

    },
    changeQualificationOrMembership(obj) {

      let changedObj = this.application[obj.field] || {};

      if (obj.hasOwnProperty('change') && obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!changedObj[obj.index]) {
          changedObj = {
            [obj.index]: {},
          };
        }
        changedObj[obj.index][obj.extension] = obj.change;
      } else {
        changedObj = obj;
      }

      const updatedApplication = {
        [obj.field]: {
          ...this.application[obj.field], ...changedObj },
      };

      this.$emit('updateApplication', updatedApplication );

    },
    closeModal() {
      this.currentIndex = null;
      this.$refs.removeModal.closeModal();
    },
    openModal(index) {
      this.currentIndex = index;
      this.$refs.removeModal.openModal();
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
