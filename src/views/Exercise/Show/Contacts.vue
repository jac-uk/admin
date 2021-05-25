<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-edit-contacts'}"
      >
        Update exercise contacts
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      JAC contacts
    </h2>

    <p class="govuk-body">
      <strong>Exercise mailbox</strong>
      <span class="display-block">{{ exercise.exerciseMailbox }}</span>
    </p>
    
    <p class="govuk-body">
      <strong>Email signature name</strong>
      <span class="display-block">{{ exercise.emailSignatureName }}</span>
    </p>

    <p class="govuk-body">
      <strong>Exercise phone number</strong>
      <span class="display-block">{{ exercise.exercisePhoneNumber }}</span>
    </p>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Senior selection exercise manager
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.seniorSelectionExerciseManager"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Selection exercise manager
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.selectionExerciseManager"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Selection exercise officers
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.selectionExerciseOfficer"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Assigned commissioners
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.assignedCommissioner"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <h2 class="govuk-heading-l govuk-!-margin-top-9">
      Other contacts
    </h2>
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appropriate authority
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.appropriateAuthority"
              :key="item"
            >
              {{ item | lookup }}
            </li>
          </ul>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          HMCTS or Welsh Government lead contact
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.hmctsWelshGovLead }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Judicial Office contact
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.judicialOfficeContact }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Lead judge
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.leadJudge"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Drafting judges
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.draftingJudge"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Statutory consultees
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.statutoryConsultee"
              :key="item.name"
            >
              {{ item.name }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
  },
};
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
