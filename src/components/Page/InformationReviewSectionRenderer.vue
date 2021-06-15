<template>
  <div>
    <div
      v-if="data"
    >
      <div
        v-for="(item, index) in data"
        :key="item.name"
        :class="index <= data.length ? 'govuk-!-margin-bottom-0' : 'govuk-!-margin-bottom-4'"
      >
        <div 
          v-if="item.financialYear"
          class="govuk-summary-list govuk-!-margin-top-1"
        >
          <dt class="govuk-summary-list__key">
            Financial year
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="data[index].financialYear"
              :field="field"
              type="date"
              :index="index"
              extension="financialYear"
              @changeField="changeField"
            />
          </dd>
        </div>

        <div
          class="govuk-summary-list govuk-!-margin-bottom-0"
        >
          <dt class="govuk-summary-list__key">
            <span>
              {{ index + 1 }}:
            </span>
            Title
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="data[index].title"
              :field="field"
              :index="index"
              type="text"
              extension="title"
              @changeField="changeField"
            />
          </dd>
        </div>

        <div
          class="govuk-summary-list govuk-!-margin-bottom-0"
        >
          <dt class="govuk-summary-list__key">
            Date
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="data[index].date"
              :field="field"
              :index="index"
              extension="date"
              type="date"
              @changeField="changeField"
            />
          </dd>
        </div>

        <div
          class="govuk-summary-list govuk-!-margin-bottom-0"
        >
          <dt class="govuk-summary-list__key">
            Details
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="data[index].details"
              :field="field"
              :index="index"
              type="text"
              extension="details"
              @changeField="changeField"
            />
          </dd>
        </div>

        <div
          v-if="item.investigationConclusionDate" 
          class="govuk-summary-list govuk-!-margin-bottom-0"
        >
          <dt class="govuk-summary-list__key">
            Investigation Conclusion Date
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :value="data[index].investigationConclusionDate"
              :field="field"
              :index="index"
              extension="investigationConclusionDate"
              type="date"
              @changeField="changeField"
            />
          </dd>
        </div>
        <button
          class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
          @click="$refs.removeFieldModal[index].openModal()"
        >
          Remove
        </button>
        <Modal
          ref="removeFieldModal"
        >
          <component
            :is="`ModalInner`"
            @close="$refs.removeFieldModal[index].closeModal()"
            @confirmed="closeModal(index)"
          />
        </Modal>
      </div>
    </div>
    <div
      v-else
    >
      <div
        style="width: 100%;"
      >
        <span>
          No
          <!-- {{ $props }} -->
        </span>
        <!-- <button
          class="change-link print-none govuk-button govuk-!-margin-bottom-0 float-right"
          @click="addField"
        >
          Add
        </button> -->
      </div>
    </div>
    <button
      class="change-link print-none govuk-button float-left"
      @click="addField"
    >
      Add
    </button>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
// import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';

import { formatDate } from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
    // EditableField,
  },
  props: {
    field: {
      type: String,
      required: true,
      default: () => '',
    },
    data: {
      type: [Array, Object],
      required: false,
      default: () => null,
    },
    dataDefault: {
      type: Object,
      required: true,
      default: () => null,
    },
  },
  methods: {
    displayDate(date) {
      return this.displayMonthYearOnly ? formatDate(date, 'month') : formatDate(date);
    },
    changeField(obj) {
      // console.log(obj);
      this.$emit('changeField', obj);
    },
    addField() {
      this.$emit('changeField', {
        field: this.field,
        index: this.data ? this.data.length : 0,
        change: this.dataDefault,
      });
    },
    // removeField(index) {
    //   this.$refs.removeFieldModal[index].openModal();
    // },
    // closeModal(index) {
    // this.$refs.removeFieldModal[index].closeModal();
    // console.log(index);
    // },
  },
};
</script>
