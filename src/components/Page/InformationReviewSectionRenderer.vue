<template>
  <div>
    <template
      v-if="hasData"
    >
      <div
        v-for="(item, index) in data"
        :key="item.name"
        class="govuk-!-margin-bottom-6"
      >
        <button
          v-if="edit && hasPermissions([PERMISSIONS.exercises.permissions.canDeleteCandidateCharacterInformation.value])"
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
            v-if="key != 'endDate' || edit"
            class="govuk-summary-list govuk-!-margin-bottom-0"
          >
            <dt
              v-if="key == 'startDate' && !edit"
              class="govuk-summary-list__key"
            >
              Dates
            </dt>
            <dt
              v-if="key != 'taskDetails' && key != 'details' && key != 'startDate' || (edit && key == 'startDate' && showDateRange)"
              class="govuk-summary-list__key"
            >
              {{ $filters.lookup(key) }}
            </dt>
            <dt
              v-else-if="key == 'details'"
              class="govuk-summary-list__key"
            >
              Details
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
                    :is-asked="isAsked"
                    @change-field="changeTaskDetail"
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
                    :is-asked="isAsked"
                    @change-field="changeTaskDetail"
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
                    :is-asked="isAsked"
                    @change-field="changeTaskDetail"
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
                    :is-asked="isAsked"
                    @change-field="changeTaskDetail"
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
                :is-asked="isAsked"
                @change-field="changeField"
              />

              <template v-if="data[index][key]">
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
                    :is-asked="isAsked"
                    @change-field="changeField"
                  />
                </div>
              </template>
            </dd>

            <dd
              v-if="key === 'tasks'"
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
                :is-asked="isAsked"
                @change-field="changeField"
              />
              <template v-if="data[index][key]">
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
                    extension="otherTasks"
                    :is-asked="isAsked"
                    @change-field="changeField"
                  />
                </div>
              </template>
            </dd>

            <dd
              v-else-if="key === 'date' || (key == 'startDate' && showDateRange && edit) || (key === 'endDate' && edit)"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="data[index][key]"
                :field="field"
                :edit="edit"
                :index="index"
                :display-month-year-only="displayMonthYearOnly"
                type="date"
                :extension="key"
                :is-asked="isAsked"
                @change-field="changeField"
              />
            </dd>

            <dd
              v-else-if="(key == 'startDate' && showDateRange && !edit)"
              class="govuk-summary-list__value"
            >
              {{ `${formattedRange(index)}` }}
            </dd>

            <dd
              v-else-if="key === 'details'"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="data[index][key]"
                :field="field"
                :edit="edit"
                :index="index"
                type="textarea"
                :extension="key"
                :is-asked="isAsked"
                @change-field="changeField"
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
                :is-asked="isAsked"
                @change-field="changeField"
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
    </template>

    <span
      v-else
      class="govuk-body"
    >
      No information
      <span v-if="!isAsked">
        (not asked)
      </span>
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
import _ from 'lodash';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'InformationReviewSectionRenderer',
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
  },
  mixins: [permissionMixin],
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
    displayMonthYearOnly: {
      type: Boolean,
      default: () => false,
    },
    isAsked: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['changeField', 'changeTaskDetails', 'addField', 'removeField'],
  data() {
    return {
      currentIndex: null,
    };
  },
  computed: {
    showDateRange() {
      return Object.keys(this.dataDefault).includes('startDate') && Object.keys(this.dataDefault).includes('endDate') || !this.edit;
    },
    hasData() {
      if (this.data && this.data.length) {
        if (this.data.length === 1 && _.isEmpty(this.data[0])) {
          return false; // ignore array containing empty object e.g. `[{}]`
        }
        return true;
      }
      return false;
    },
  },
  methods: {
    formattedRange(index) {
      let result = 'No information';
      if (this.data[index].startDate && this.data[index].endDate) {
        result = `${this.displayDate(this.data[index].startDate)} - ${this.displayDate(this.data[index].endDate)}`;
      } else if (this.data[index].startDate && !this.data[index].endDate) {
        result = `${this.displayDate(this.data[index].startDate)} - Ongoing`;
      }
      return result;
    },
    displayDate(date) {
      return this.displayMonthYearOnly ? formatDate(date, 'month') : formatDate(date);
    },
    changeField(obj) {
      this.$emit('changeField', obj);
    },
    changeTaskDetail(obj) {
      this.$emit('changeTaskDetails', { ...obj, ...{ taskDetails: true } });
    },
    addField() {
      this.$emit('addField', {
        field: this.field,
        index: (this.data ? this.data.length : 0),
        change: this.dataDefault,
      });
    },
    removeField() {
      this.$emit('removeField', {
        field: this.field,
        index: this.currentIndex,
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
