<template>
  <div>
    <div
      v-if="data && data.length"
    >
      <div
        v-for="(item, index) in data"
        :key="item.name"
        class="govuk-!-margin-bottom-6"
      >
        <button
          v-if="edit"
          class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
          @click="openModal(index)"
        >
          Remove
        </button>
        <div
          v-for="(value, key) in dataDefault"
          :key="`${key}_${index}`"
          class="govuk-!-padding-top-1"
        >
          <div
            class="govuk-summary-list govuk-!-margin-bottom-0"
          >
            <dt class="govuk-summary-list__key">
              {{ key | lookup }}
            </dt>
            <dd
              v-if="data[index][key] instanceof Array && key === 'tasks'"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="data[index][key]"
                :field="field"
                :edit="edit"
                :index="index"
                type="multi-selection"
                :options="taskOptions"
                :extension="key"
                @changeField="changeField"
              />
              <div v-if="data[index][key].includes('other')">
                <dt class="govuk-summary-list__key">
                  Other task
                </dt>
                <InformationReviewRenderer
                  :data="data[index].otherTasks"
                  :field="field"
                  :edit="edit"
                  :index="index"
                  type="text"
                  :extension="key"
                  @changeField="changeField"
                />
              </div>
            </dd>
            <dd
              v-else
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="data[index][key]"
                :field="field"
                :edit="edit"
                :index="index"
                type="text"
                :extension="key"
                @changeField="changeField"
              />
            </dd>
          </div>
        </div>
        <div />
      </div>
      <Modal
        ref="removeModal"
      >
        <ModalInner
          @close="closeModal"
          @confirmed="removeField"
        />
      </Modal>
    </div>

    <span
      v-else
    >
      No {{ field | lookup }} declaired
    </span>
    <button
      v-if="edit"
      class="print-none govuk-button govuk-!-margin-bottom-0 float-right"
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
    taskOptions: {
      type: Array,
      default: () => null,
    },
  },
  data() {
    return {
      currentIndex: null,
    };
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
    removeField() {
      this.$emit('changeField', {
        field: this.field,
        index: this.currentIndex,
        remove: true,
      });
      this.closeModal();
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
