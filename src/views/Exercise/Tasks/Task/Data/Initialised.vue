<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p class="govuk-body govuk-!-margin-bottom-0">
      Please check the marking scheme is correct and then press Continue
    </p>

    <div
      v-for="group in markingScheme"
      :key="group.ref"
    >
      <Table
        class="marking-scheme"
        data-key="ref"
        :data="group.children"
        :columns="tableColumns(group)"
        local-data
      >
        <template #row="{row, index}">
          <TableCell>
            {{ $filters.lookup(row.ref) }}
          </TableCell>
          <TableCell>
            {{ getMarkingType(row.type).label }}
          </TableCell>
          <TableCell v-if="hasPermissions([PERMISSIONS.tasks.permissions.canEditScoreCalculation.value])">
            <div class="govuk-checkboxes govuk-checkboxes--small">
              <div class="govuk-checkboxes__item">
                <input
                  :id="`include-in-score-${index}`"
                  v-model="row.includeInScore"
                  class="govuk-checkboxes__input"
                  type="checkbox"
                  @click.stop
                  @change="onChangeIncludeInScore(group, index)"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  :for="`include-in-score-${index}`"
                >Include in score</label>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <ActionButton
              class="govuk-!-margin-bottom-0"
              :action="() => btnRemove(group, index)"
            >
              Remove
            </ActionButton>
          </TableCell>
        </template>
      </Table>

      <button
        type="button"
        class="govuk-button govuk-button--secondary"
        @click="btnAdd(group)"
      >
        Add
      </button>
    </div>

    <ActionButton
      class="govuk-!-margin-bottom-1"
      type="primary"
      :action="btnContinue"
    >
      Continue
    </ActionButton>

    <Modal ref="modalAddMarkingSchemeItem">
      <TitleBar>
        Add to marking scheme
      </TitleBar>
      <AddMarkingSchemeItem
        class="govuk-!-margin-6"
        @save="btnSave"
        @cancel="btnCancelAdd"
      />
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import AddMarkingSchemeItem from './AddMarkingSchemeItem.vue';
import { functions } from '@/firebase';
import { getMarkingType } from '@/helpers/scoreSheetHelper';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    ActionButton,
    Table,
    TableCell,
    Modal,
    TitleBar,
    FullScreenButton,
    ProgressBar,
    AddMarkingSchemeItem,
  },
  mixins: [permissionMixin],
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    const task = this.$store.getters['tasks/getTask'](this.type);
    return {
      markingScheme: task.markingScheme,
      currentGroup: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
  },
  watch: {
    task() {
      this.markingScheme = this.task.markingScheme;
    },
  },
  methods: {
    tableColumns(group) {
      const columns = [];
      columns.push({ title: this.$filters.lookup(group.ref) });
      columns.push({ title: '' });
      if (this.hasPermissions([this.PERMISSIONS.tasks.permissions.canEditScoreCalculation.value])) columns.push({ title: '' });
      columns.push({ title: '' });
      return columns;
    },
    getMarkingType(type) {
      return getMarkingType(type);
    },
    btnNext,
    async btnContinue() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    async btnRemove(group, rowIndex) {
      group.children.splice(rowIndex, 1);
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { markingScheme: this.markingScheme } } );
      return true;
    },
    btnAdd(group) {
      this.currentGroup = group;
      this.$refs.modalAddMarkingSchemeItem.openModal();
    },
    async btnSave({ type, ref, includeInScore }) {
      this.$refs.modalAddMarkingSchemeItem.closeModal();
      const newItem = {};
      newItem.type = type;
      newItem.ref = ref;
      if (includeInScore) newItem.includeInScore = includeInScore;
      this.currentGroup.children.push(newItem);
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { markingScheme: this.markingScheme } } );
    },
    btnCancelAdd() {
      this.$refs.modalAddMarkingSchemeItem.closeModal();
    },
    async onChangeIncludeInScore() {
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { markingScheme: this.markingScheme } } );
    },
  },
};
</script>

<style>
.marking-scheme td {
  vertical-align: middle;
}
</style>
