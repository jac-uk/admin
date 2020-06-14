<template>
  <div
    v-if="hasData"
    class="govuk-!-margin-top-9 "
  >
    <h2 class="govuk-heading-l">
      Personal details
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          <div 
            v-if="!fullNameEdit"
            class="editable-field" 
          >
            <span>{{ candidate.fullName }}</span>
            <a 
              href="#"
              class="govuk-link change-link"
              @click.prevent="btnClickEdit('fullName')" 
            >
              Change
            </a>
          </div>
          <div v-if="fullNameEdit">
            <TextField 
              :id="candidate.id"
              v-model="fullNameLocal"
            />
            <button 
              class="govuk-button"
              @click="btnClickSubmit('fullName')"
            >
              Submit
            </button>
          </div>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Email address
        </dt>
        <dd class="govuk-summary-list__value">
          <div 
            v-if="!emailEdit"
            class="editable-field" 
          >
            <a
              :href="`mailto:${candidate.email}`"
              class="govuk-link govuk-link--no-visited-state"
              target="_blank"
            >
              {{ candidate.email }}
            </a>
            <a 
              href="#"
              class="govuk-link change-link"
              @click.prevent="btnClickEdit('email')" 
            >
              Change
            </a>
          </div>
          <div v-if="emailEdit">
            <TextField 
              :id="candidate.id"
              v-model="emailLocal"
            />
            <button 
              class="govuk-button"
              @click="btnClickSubmit('email')"
            >
              Submit
            </button>
          </div>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Phone number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ candidate.phone }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          <p v-if="candidate.dateOfBirth">
            {{ candidate.dateOfBirth | formatDate }}
          </p>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          NI Number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ candidate.nationalInsuranceNumber | formatNIN }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Citizenship
        </dt>
        <dd class="govuk-summary-list__value">
          {{ candidate.citizenship | lookup }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable adjustments
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          {{ candidate.reasonableAdjustments | toYesNo }}
          <ul
            v-if="candidate.reasonableAdjustmentsDetails"
            class="govuk-list govuk-!-margin-top-1"
          >
            <li>
              {{ candidate.reasonableAdjustmentsDetails }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
  },
  props: {
    candidate: {
      type: Object,
      default: null,
      required: true,
    },
  },
  data() {
    // Add the fields to edit like [field]Local and [field]Edit
    return {
      fullNameLocal: '',
      fullNameEdit: false,
      emailLocal: '',
      emailEdit: false,
    };
  },
  computed: {
    hasData() {
      return Object.keys(this.candidate).length > 0;
    },
  },
  methods: {
    btnClickEdit(field) {
      this[`${field}Local`] = this.candidate[field];
      this[`${field}Edit`] = true;
    },
    btnClickSubmit(field) {
      this.$emit('changedetails', { [field]: this[`${field}Local`] });
      this[`${field}Edit`] = false;
    },
  },
};
</script>

<style>
  .editable-field {
    display: flex;
    flex-direction: row;
  }

  .editable-field .change-link {
    margin-left: auto;
  }
</style>
