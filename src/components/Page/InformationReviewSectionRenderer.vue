<template>
  <div>
    <div
      v-if="data && data.length"
    >
      <div
        v-for="(item, index) in data"
        :key="item.name"
        :class="index <= data.length ? 'govuk-!-margin-bottom-0' : 'govuk-!-margin-bottom-4'"
      >
        <div
          class="govuk-!-padding-top-1"
        > 
          <div 
            v-if="item.financialYear"
            class="govuk-summary-list govuk-!-margin-top-2"
          >
            <dt class="govuk-summary-list__key">
              Financial year
            </dt>
            <dd class="govuk-summary-list__value">
              <InformationReviewRenderer
                :data="data[index].financialYear"
                :field="field"
                :edit="edit"
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
                :edit="edit"
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
                :edit="edit"
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
                :edit="edit"
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
                :edit="edit"
                :index="index"
                extension="investigationConclusionDate"
                type="date"
                @changeField="changeField"
              />
            </dd>
          </div>
        </div>
        <Modal
          ref="removeModal"
        >
          <ModalInner
            :index="index"
            @close="closeModal"
            @confirmed="removeField"
          />
        </Modal>

        <button
          v-if="edit"
          class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
          @click="openModal(index)"
        >
          Remove
        </button>
      </div>
    </div>
    <div
      v-else
      style="display: inline-block"
    >
      <div
        style="width: 100%; display: inline-block"
      >
        <span>
          No {{ field | lookup }} declaired
        </span>
      </div>
    </div>
    <button
      v-if="edit"
      class="change-link print-none govuk-button govuk-!-margin-bottom-0 govuk-!-margin-right-4 float-right"
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
import { formatDate } from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
  },
  props: {
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: () => false,
    },
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
      this.$emit('changeField', obj);
    },
    addField() {
      this.$emit('changeField', {
        field: this.field,
        index: (this.data ? this.data.length : 0),
        change: this.dataDefault,
      });
    },
    removeField(index) {
      this.$emit('changeField', {
        field: this.field,
        index: index,
        remove: true,
      });
      this.$refs.removeModal.forEach((modal) => {
        // console.log(i === index);
        // i === index ? modal.closeModal() : null;
        modal.closeModal();
      });
    },
    closeModal() {
      this.$refs.removeModal.forEach((modal) => {
        // console.log(i === index);
        // i === index ? modal.closeModal() : null;
        modal.closeModal();
      });
    },
    openModal(index) {
      this.$refs.removeModal.forEach((modal, i) => {
        i === index ? modal.openModal() : null;
      });
    },
  },
};
</script>
