<template>
  <div class="govuk-!-margin-bottom-4">
    <div class="govuk-!-margin-bottom-4">
      <h2 class="govuk-heading-l govuk-!-padding-top-6">
        Personal details
        <span
          v-if="!isCandidateView"
          class="govuk-hint print-none"
        >
          <!-- vv this isnt true at the moment vv -->
          <!-- Any changes made here will also update the candidate information.  -->
          <!-- ^^ this isnt true at the moment ^^ have updated the line below describe fucntionaility -->
          Any changes made here will only update the application information.
        </span>
        <span
          v-else
          class="govuk-hint"
        >
          Any changes made here will not update the details on the most recent application.
          Please go to the Application to make the change.
        </span>
      </h2>
      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Title
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :application-id="userId"
              field="title"
              :edit="editable"
              type="route"
              :data="hasPersonalDetails ? personalDetails.title : ''"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            First name
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.firstName || ''"
              type="route"
              field="firstName"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Middle name(s)
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.middleNames || ''"
              field="middleNames"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Last name
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.lastName || ''"
              type="route"
              field="lastName"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Suffix
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.suffix || ''"
              field="suffix"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Previous known name(s)
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.previousNames || ''"
              field="previousNames"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Professional name
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.professionalName || ''"
              field="professionalName"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="!(personalDetails.lastName || personalDetails.firstName) && personalDetails.fullName && !editable"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Full name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ personalDetails.fullName }}
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Other names
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.otherNames || ''"
              field="otherNames"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Email address
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="hasPersonalDetails ? personalDetails.email : ''"
              type="email"
              field="email"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Phone number
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :data="hasPersonalDetails ? personalDetails.phone : ''"
              type="tel"
              field="phone"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Date of birth
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :data="hasPersonalDetails ? personalDetails.dateOfBirth : ''"
              type="date"
              field="dateOfBirth"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Place of birth
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :application-id="userId"
              :data="personalDetails.placeOfBirth || ''"
              field="placeOfBirth"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            NI Number
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :data="(hasPersonalDetails ? $filters.formatNIN(personalDetails.nationalInsuranceNumber): '')"
              field="nationalInsuranceNumber"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Current Address
          </dt>
          <dd class="govuk-summary-list__value">
            <div
              v-for="key in currentAddressFields"
              :key="key"
            >
              <h5
                v-if="editable"
                class="govuk-hint govuk-!-margin-1"
              >
                {{ $filters.lookup(key) }}
              </h5>
              <InformationReviewRenderer
                :edit="editable"
                :data="currentAddress[key]"
                :field="key"
                @change-field="changeCurrentAddress"
              />
            </div>
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Has lived at this address for more than 5 years
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :options="[true, false]"
              type="selection"
              :data="currentMoreThan5Years"
              field="currentMoreThan5Years"
              @change-field="changeInfo"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Previous Addresses
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewSectionRenderer
              :edit="editable"
              :data-default="emptyPreviousAddressObject"
              :data="previousAddress"
              field="previous"
              @change-field="changeInfo"
              @removeField="removeInfo"
              @addField="addInfo"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Citizenship
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :data="hasPersonalDetails ? personalDetails.citizenship : ''"
              :options="['uk','republic-of-ireland','another-commonwealth-country','other']"
              type="selection"
              field="citizenship"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row ">
          <dt :class="requiredStyle">
            Reasonable adjustments
          </dt>

          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :data="hasPersonalDetails ? personalDetails.reasonableAdjustments : ''"
              :options="[true, false]"
              type="selection"
              field="reasonableAdjustments"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="personalDetails && personalDetails.reasonableAdjustments === true"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div
          class="govuk-summary-list__row "
        >
          <dt :class="requiredStyle">
            Reasonable Adjustments Details
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            <InformationReviewRenderer
              :edit="editable"
              :data="hasPersonalDetails ? personalDetails.reasonableAdjustmentsDetails : ''"
              field="reasonableAdjustmentsDetails"
              @change-field="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row ">
          <dt :class="requiredStyle">
            VAT registration number
          </dt>

          <dd class="govuk-summary-list__value">
            <span v-if="!VATNumbers.length">No answer provided</span>
            <div
              v-for="(VATNumber, index) in VATNumbers"
              :key="index"
              class="govuk-!-margin-bottom-3"
            >
              <button
                v-if="editable"
                class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-3 float-right"
                @click="removeVATNumber(index)"
              >
                Remove
              </button>
              <InformationReviewRenderer
                :edit="editable"
                :data="VATNumber"
                field="VATNumber"
                @change-field="(obj) => changeVATNumber(index, obj)"
              />
            </div>
            <button
              v-if="editable"
              class="print-none govuk-button govuk-!-margin-top-3 govuk-!-margin-bottom-0 float-right"
              @click="addVATNumber"
            >
              Add
            </button>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'PersonalDetailsSummary',
  components: {
    InformationReviewRenderer,
    InformationReviewSectionRenderer,
  },
  props: {
    userId: {
      type: String,
      required: false,
      default: () => '',
    },
    personalDetails: {
      type: Object,
      required: true,
      default: () => {},
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  emits: ['update'],
  data() {
    const emptyAddressObject = {
      street: '',
      street2: '',
      town: '',
      county: '',
      postcode: '',
    };

    return {
      hasPersonalDetails: !!this.personalDetails,
      emptyAddressObject,
      emptyPreviousAddressObject: {
        ...emptyAddressObject,
        startDate: '',
        endDate: '',
      },
      emptyVATNumberObject: {
        VATNumber: '',
      },
    };
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    isCandidateView() {
      return this.$route.name === 'candidates-view';
    },
    hasCurrentAddress() {
      return this.hasPersonalDetails && this.personalDetails.address && this.personalDetails.address.current;
    },
    hasPreviousAddress() {
      return this.hasPersonalDetails && this.personalDetails.address && this.personalDetails.address.previous;
    },
    currentAddressFields() {
      return Object.keys(this.emptyAddressObject);
    },
    currentAddress() {
      return this.hasCurrentAddress ? this.personalDetails.address.current : this.emptyAddressObject;
    },
    currentMoreThan5Years() {
      return this.hasPersonalDetails && this.personalDetails.address && this.personalDetails.address.currentMoreThan5Years;
    },
    previousAddress() {
      if (this.hasPersonalDetails && this.personalDetails.address && this.personalDetails.address.previous) {
        return this.personalDetails.address.previous;
      }
      return [];
    },
    VATNumbers() {
      return this.personalDetails.VATNumbers ? this.personalDetails.VATNumbers.map(item => item.VATNumber) : [];
    },
  },
  methods: {
    makeFullName(obj) {
      if (obj.firstName && this.personalDetails.lastName) {
        obj.fullName = `${obj.firstName} ${this.personalDetails.lastName}`;
      }
      if (obj.lastName && this.personalDetails.firstName) {
        obj.fullName = `${this.personalDetails.firstName} ${obj.lastName}`;
      }
      return obj;
    },
    emptyObject(items){
      const obj = {};
      for (const key of items) {
        obj[key] = '';
      }
      return obj;
    },
    changeCurrentAddress(obj) {
      this.changeUserDetails({
        address: {
          current: obj,
        },
      });
    },
    addInfo(obj) {
      if (obj.field == 'previous') {
        let changeObj = [];
        if (this.hasPreviousAddress) {
          changeObj = [...this.previousAddress, this.emptyPreviousAddressObject];
        } else {
          changeObj = [this.emptyPreviousAddressObject];
        }

        this.changeUserDetails({
          address: {
            previous: changeObj,
          },
        });
      }
    },
    removeInfo(obj) {
      if (obj.field == 'previous') {
        const changeObj = this.previousAddress.filter((_, index) => index !== obj.index);
        this.changeUserDetails({
          address: {
            previous: changeObj,
          },
        });
      }
    },
    changeInfo(obj) {
      if (obj.hasOwnProperty('change') && obj.hasOwnProperty('extension') && obj.hasOwnProperty('index')) {
        if (obj.field == 'previous') {
          const copy = cloneDeep(this.previousAddress);
          copy[obj.index][obj.extension] = obj.change;
          this.changeUserDetails({
            address: {
              previous: copy,
            },
          });
        }
      } else if (obj.hasOwnProperty('currentMoreThan5Years')) {
        this.changeUserDetails({
          address: {
            currentMoreThan5Years: obj['currentMoreThan5Years'],
          },
        });
      }
    },
    addVATNumber() {
      const VATNumbers = this.personalDetails.VATNumbers
        ? [...this.personalDetails.VATNumbers, this.emptyVATNumberObject]
        : [this.emptyVATNumberObject];
      this.changeUserDetails({
        VATNumbers,
      });
    },
    changeVATNumber(index, value) {
      if (this.personalDetails.VATNumbers) {
        this.changeUserDetails({
          VATNumbers: this.personalDetails.VATNumbers.map((item, i) => {
            return i === index ? value : item;
          }),
        });
      }
    },
    removeVATNumber(index) {
      if (this.personalDetails.VATNumbers) {
        this.changeUserDetails({
          VATNumbers: this.personalDetails.VATNumbers.filter((_, i) => i !== index),
        });
      }
    },
    changeUserDetails(obj) {
      if (obj.firstName || obj.lastName) {
        obj = this.makeFullName(obj);
      }
      const myPersonalDetails = { ...this.personalDetails, ...obj };

      this.$emit('update', myPersonalDetails );
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
