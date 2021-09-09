<template>
  <div
    v-if="panel"
    class="panels-packs"
  >
    <div id="panel-pack-div">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <router-link
            class="govuk-back-link"
            :to="{ name: `exercise-tasks-${panel.type}` }"
          >
            Back
          </router-link>
          <span class="govuk-caption-l">Panel</span>
          <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
            {{ panel.name }}
          </h1>
        </div>
        <div class="govuk-grid-column-one-half text-right print-none">
          <ActionButton
            type="primary"
            :disabled="!canExportToGoogleDrive"
            @click="exportToGoogleDrive"
          >
            Export to google drive
          </ActionButton>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Status</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ panel.status }}
              <span v-if="isProcessing">
                {{ processingProgress }} of {{ processingTotal }}
              </span>
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">{{ typeName }} Dates</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ panel.dateFrom | formatDate | showAlternative("Unknown") }} -
              {{ panel.dateTo | formatDate | showAlternative("Unknown") }}
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <div class="govuk-caption-m">
              Candidates
            </div>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ candidatesList.length }}
            </h2>
          </div>
        </div>
      </div>
      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
    </div>
    <!-- CANDIDATE LIST -->
    <div v-show="activeTab == 'candidates'">
      <button
        class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
        :disabled="isButtonDisabled"
        @click="removeFromPanel"
      >
        Remove from panel
      </button>
      <Table
        data-key="id"
        :data="candidatesList"
        :columns="tableColumnsCandidates"
        multi-select
        :selection.sync="selectedItems"
        :page-size="500"
        @change="getTableDataCandidates"
      >
        <template #row="{row}">
          <TableCell :title="tableColumnsCandidates[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsCandidates[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- //  END CANDIDATE LIST -->

    <!-- MEMBERS -->
    <div v-if="activeTab === 'members'">
      <h2
        class="govuk-heading-l"
      >
        List of Panellists
      </h2>
      <button
        class="govuk-button"
        @click="btnClickEditMember('modalRefMember', null, 'new')"
      >
        Add a member
      </button>

      <dl
        v-for="(member, idx) in panel.members"
        :key="idx"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              class="govuk-button btn-unlock"
              @click="btnClickEditMember('modalRefMember', idx, 'edit')"
            >
              Edit
            </button>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Full Name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ member.fullName }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Position
          </dt>
          <dd class="govuk-summary-list__value">
            {{ member.title }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Email address
          </dt>
          <dd class="govuk-summary-list__value">
            {{ member.email }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Telephone
          </dt>
          <dd class="govuk-summary-list__value">
            {{ member.phone }}
          </dd>
        </div>
      </dl>
    </div>
    <Modal
      ref="modalRefMember"
    >
      <component
        :is="`PanelMemberChange`"
        v-bind="memberDetails"
        @close="closeModal('modalRefMember')"
      />
    </Modal>
    <!-- END MEMBERS -->

    <!-- EDIT PANEL -->
    <div v-if="activeTab === 'edit'">
      <div class="govuk-grid-row">
        <form @submit.prevent="validateAndSave">
          <div class="govuk-grid-column-two-thirds">
            <h1 class="govuk-heading-l">
              Edit
            </h1>

            <ErrorSummary
              :errors="errors"
              :show-save-button="true"
              @save="save"
            />

            <TextField
              id="panel-name"
              v-model="formData.name"
              label="Panel Name"
              required
            />

            <DateInput
              id="date-from"
              v-model="formData.dateFrom"
              label="Date from"
            />
            <DateInput
              id="date-to"
              v-model="formData.dateTo"
              label="to"
            />

            <button
              class="govuk-button"
            >
              Confirm changes
            </button>
            <button
              class="float-right govuk-button govuk-button--warning"
              type="button"
              @click="deletePanel()"
            >
              Delete Panel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- //  END EDIT PANEL -->
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import PanelMemberChange from '@/components/ModalViews/PanelMemberChange';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import firebase from '@firebase/app';

export default {
  components: {
    TabsList,
    ErrorSummary,
    DateInput,
    TextField,
    Modal,
    PanelMemberChange,
    Table,
    TableCell,
    ActionButton,
  },
  extends: Form,
  data() {
    const data = {
      tabs: [
        {
          ref: 'candidates',
          title: 'Candidates',
        },
        {
          ref: 'members',
          title: 'Panel Members',
        },
        {
          ref: 'edit',
          title: 'Edit',
        },
      ],
      activeTab: 'candidates',
      memberDetails: {},
      selectedItems: [],
      tableColumnsCandidates: [
        { title: 'Reference number' },
        { title: 'Name' },
      ],
      formData: {},
    };
    const panelData = this.$store.getters['panels/getPanel'](this.$route.params.panelId);
    if (panelData) {
      data.formData = {
        name: panelData.name,
        dateFrom: panelData.dateFrom,
        dateTo: panelData.dateTo,
      };
    }
    return data;
  },
  computed: {
    panelId() {
      return this.$route.params.panelId;
    },
    panel(){
      return this.$store.getters['panels/getPanel'](this.panelId);
    },
    isSift() {
      return this.panel.type === 'sift';
    },
    isSelectionDay() {
      return this.panel.type === 'selection';
    },
    typeName() {
      if (this.panel && this.panel.type) {
        return this.panel.type.charAt(0).toUpperCase() + this.panel.type.slice(1);
      }
      return '';
    },
    candidatesList() {
      return this.$store.state.panels.panelApplications;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    canExportToGoogleDrive() {
      if (this.panel && ['draft', 'created'].indexOf(this.panel.status) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    isProcessing() {
      return this.panel && this.panel.status === 'processing';
    },
    processingTotal() {
      if (this.panel && this.panel.applicationsMap) {
        return Object.keys(this.panel.applicationsMap).length;
      }
      return 0;
    },
    processingRemaining() {
      if (this.panel && this.panel.processing && this.panel.processing.queue) {
        return this.panel.processing.queue.length;
      }
      return 0;
    },
    processingProgress() {
      return this.processingTotal - this.processingRemaining;
    },
  },
  created() {
    // Redirect if page Reload
    if (!this.panel) {
      const nextRoute = this.$route.fullPath.includes('/tasks/selection/') ? 'exercise-tasks-selection' : 'exercise-tasks-sift';
      this.$router.push({
        name: nextRoute,
      });
    }
  },
  methods: {
    async save(isValid) {
      if (isValid) {
        await this.$store.dispatch('panels/updatePanel', { id: this.panelId, data: this.formData });
        this.activeTab = 'members';
      }
    },
    btnClickEditMember(modal, idx, action) {
      // eslint-disable-next-line no-console
      //console.log('btnClickEditMember', idx, action);
      this.memberDetails = {};
      if (idx !== null) {
        this.memberDetails = { ...this.panel.members[idx] };
      }
      this.memberDetails.action = action;
      this.memberDetails.id = this.panelId;
      this.memberDetails.idx = idx;

      this.openModal(modal);
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    getTableDataCandidates(params) {
      if (this.panel) {
        this.$store.dispatch(
          'panels/bindPanelApplications',
          {
            exerciseId: this.panel.exerciseId,
            panelId: this.panelId,
            type: this.panel.type,
            ...params,
          }
        );
      }
    },
    async removeFromPanel() {
      await this.$store.dispatch('panels/removePanelApplications', { panelType: this.panel.type, applicationIds: this.selectedItems });
    },
    async deletePanel(){
      const redirectTo = `exercise-tasks-${this.panel.type}`;
      await this.$store.dispatch('panels/deletePanel', this.panelId );
      this.$router.push({ name: redirectTo });
    },
    async exportToGoogleDrive() {
      const data = {
        status: 'approved',
        'statusLog.approved': firebase.firestore.FieldValue.serverTimestamp(),
      };
      await this.$store.dispatch('panels/updatePanel', { id: this.panelId, data: data });
    },
  },
};
</script>
