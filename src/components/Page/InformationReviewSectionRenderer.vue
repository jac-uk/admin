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
        <span>
          {{ index + 1 }}:
        </span>
        <div
          v-for="(value, key) in dataDefault"
          :key="`${key}_${index}`"
          class="govuk-!-padding-top-1"
        >
          <div
            class="govuk-summary-list govuk-!-margin-bottom-0"
          >
            <dt class="govuk-summary-list__key">
              {{ key }}
            </dt>
            <dd class="govuk-summary-list__value">
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
        <button
          v-if="edit"
          class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
          @click="openModal(index)"
        >
          Remove
        </button>
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
