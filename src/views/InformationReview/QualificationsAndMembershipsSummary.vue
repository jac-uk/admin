<template>
  <div>
    <!-- qualifications -->
    
    <div>
      <h2 class="govuk-heading-l">
        Qualifications
      </h2>
      <div v-if="application.qualifications || editable">
        <dl
          v-for="(item, index) in application.qualifications"
          :key="item.name"
          class="govuk-summary-list govuk-!-margin-bottom-5"
        >
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
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
            <dt class="govuk-summary-list__key">
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
              class="govuk-summary-list__key"
            >
              Date completed pupillage
            </dt>
            <dt
              v-else
              class="govuk-summary-list__key"
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
              v-if="(item.qualificationNotComplete && item.details) || editable"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
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
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
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
        </dl>
      </div>
    
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div>

    <!-- applied shedules -->
    <div>
      <dl
        v-if="exercise.schedule2Apply"
        class="govuk-summary-list"
      >
        <div
          v-if="exercise.appliedSchedule == 'schedule-2-3'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
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
        v-if="(exercise.appliedSchedule=='schedule-2-3' && application.applyingUnderSchedule2Three)
          || (exercise.appliedSchedule=='schedule-2-d' && application.applyingUnderSchedule2d)"
        class="govuk-summary-list  govuk-!-margin-bottom-8"
      >
        <dt
          class="govuk-summary-list__key"
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
          class="govuk-summary-list govuk-!-margin-bottom-8"
        >
          <div
            v-for="membership in otherMemberships"
            :id="membership.value"
            :key="membership.value"
            :value="membership.value"
            :label="membership.label"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              {{ membership.value }}
            </dt>
            <dd class="govuk-summary-list__value">
              <InformationReviewRenderer
                :data="extendedApplication.memberships[membership.value].date || null"
                field="memberships"
                extension="date"
                :index="membership.value"
                :edit="editable"
                type="date"
                @changeField="changeQualificationOrMembership"
              />
              <InformationReviewRenderer
                :data="extendedApplication.memberships[membership.value].number || null"
                field="memberships"
                extension="number"
                :index="membership.value"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
              <InformationReviewRenderer
                :data="extendedApplication.memberships[membership.value].information || null"
                field="memberships"
                extension="information"
                :index="membership.value"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- experience -->
    <div
      v-if="isNonLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Experience
      </h2>
      <div v-if="application.experience && application.experience.length">
        <InformationReviewSectionRenderer
          :value="application.experience"
          :data="application.experience"
          :data-default="emptyExperienceObject"
          :edit="editable"
          field="experience"
          @changeField="changeQualificationOrMembership"
        />
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

import {
  hasRelevantMemberships,
  isNonLegal
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
    InformationReviewSectionRenderer,
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
    const data = {
      memberships: {},
    };
    this.$store.state.exerciseDocument.record.otherMemberships.forEach(membership => {
      data.memberships[membership.value] = this.application[membership.value] || {};
    });
    return {
      extendedApplication: {
        ...data,
        ...this.application,
      },
    };
  },
  computed: {
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
    emptyExperienceObject() {
      return {
        'orgBusinessName': '',
        'jobTitle': '',
        'startDate': new Date(),
        'endDate': new Date(),
      };
    },
  },
  methods: {
    showMembershipOption(ref) {
      return this.exercise.memberships.indexOf(ref) >= 0;
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
