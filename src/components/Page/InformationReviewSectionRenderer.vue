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
            <dt
              v-if="key != 'taskDetails'"
              class="govuk-summary-list__key"
            >
              {{ data.taskDetails }}
              {{ key | lookup }}
            </dt>

            <dd
              v-else-if="key === 'taskDetails'"
              class="govuk-summary-list__value"
            >
              <div class="govuk-summary-list govuk-!-margin-0">
                <div
                  class="govuk-summary-list__key"
                >
                  Location 
                </div>
                <div
                  class="govuk-summary-list__value"
                >
                  <InformationReviewRenderer
                    :edit="edit"
                    :field="field"
                    :index="index"
                    type="text"
                    :data="data[index][key] ? data[index][key].location : ''"
                    :extension="'location'"
                    @changeField="changeTaskDetail"
                  />
                </div>
              </div>
              <div class="govuk-summary-list govuk-!-margin-0">
                <div
                  class="govuk-summary-list__key"
                >
                  Jurisdiction
                </div>
                <div
                  class="govuk-summary-list__value"
                >
                  <InformationReviewRenderer
                    :edit="edit"
                    :data="data[index][key] ? data[index][key].jurisdiction : ''"
                    :field="field"
                    :index="index"
                    :extension="'jurisdiction'"
                    type="text"
                    @changeField="changeTaskDetail"
                  />
                </div>
              </div>
              <div class="govuk-summary-list govuk-!-margin-0">
                <div
                  class="govuk-summary-list__key"
                >
                  Working Basis
                </div>
                <div
                  class="govuk-summary-list__value"
                >
                  <InformationReviewRenderer
                    :edit="edit"
                    :data="data[index][key] ? data[index][key].workingBasis : ''"
                    :field="field"
                    :index="index"
                    :extension="'workingBasis'"
                    type="selection"
                    :options="['full-time', 'salaried-part-time', 'fee-paid', 'voluntary']"
                    @changeField="changeTaskDetail"
                  />
                </div>
              </div>
              <div class="govuk-summary-list govuk-!-margin-0">
                <div
                  class="govuk-summary-list__key"
                >
                  Total Days In Role
                </div>
                <div
                  class="govuk-summary-list__value"
                >
                  <InformationReviewRenderer
                    :edit="edit"
                    :data="data[index][key] ? data[index][key].totalDaysInRole : ''"
                    :field="field"
                    :index="index"
                    :extension="'totalDaysInRole'"
                    type="text"
                    @changeField="changeTaskDetail"
                  />
                </div>
              </div>
            </dd>

            <dd
              v-else-if="(typeof data[index][key] === Object && key !== 'taskDetails')"
              class="govuk-summary-list__value"
            >
              {{ index }}
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
              v-else-if="data[index][key] instanceof Date"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="data[index][key]"
                :field="field"
                :edit="edit"
                :index="index"
                type="date"
                :extension="key"
                @changeField="changeField"
              />
            </dd>

            <dd
              v-else-if="key != 'taskDetails'"
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
      class="govuk-body"
    >
      No answers provided
    </span>
    <button
      v-if="edit"
      class="print-none govuk-button govuk-!-margin-bottom-0 float-right"
      @click="addField"
    >
      Add
    </button>
  </div>
</template>gaps 
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
    changeTaskDetail(obj) {
      this.$emit('changeField', { ...obj, ...{ taskDetails: true } });
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
