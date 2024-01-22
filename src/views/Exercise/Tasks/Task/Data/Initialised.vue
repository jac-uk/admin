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
        data-key="ref"
        :data="group.children"
        :columns="[
          { title: $filters.lookup(group.ref) },
          { title: '' },
          { title: '' },
        ]"
        local-data
      >
        <template #row="{row, index}">
          <TableCell>
            {{ $filters.lookup(row.ref) }}
          </TableCell>
          <TableCell>
            {{ $filters.lookup(row.type) }}
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
      tableColumns: [
        { title: 'Criteria' },
        { title: 'Type' },
        { title: '' },
      ],
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
    btnNext,
    async btnContinue() {
      await functions.httpsCallable('updateTask')({
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
    async btnSave({ type, title, ref, excludeFromScore }) {
      const newItem = {};
      newItem.type = type;
      newItem.title = title;
      newItem.ref = ref;
      if (excludeFromScore) newItem.excludeFromScore = excludeFromScore;
      this.currentGroup.children.push(newItem);
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { markingScheme: this.markingScheme } } );
      this.$refs.modalAddMarkingSchemeItem.closeModal();
    },
    btnCancelAdd() {
      this.$refs.modalAddMarkingSchemeItem.closeModal();
    },
  },
};
</script>
