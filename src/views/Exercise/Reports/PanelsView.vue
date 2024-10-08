<template>
  <div
    v-if="panel"
    class="panels-packs"
  >
    <div id="panel-pack-div">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <span class="govuk-caption-l">Panel</span>
          <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
            {{ panel.name }}
          </h1>
        </div>
        <div
          v-if="hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])"
          class="govuk-grid-column-one-half text-right print-none"
        >
          <ActionButton
            type="primary"
            :disabled="!canExportToGoogleDrive"
            :action="exportToGoogleDrive"
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
              {{ $filters.showAlternative($filters.formatDate(panel.dateFrom), 'Unknown') }} -
              {{ $filters.showAlternative($filters.formatDate(panel.dateTo), 'Unknown') }}
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
        v-model:active-tab="activeTab"
        :tabs="tabs"
      />
    </div>
    <!-- CANDIDATE LIST -->
    <div v-show="activeTab == 'candidates'">
      <button
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])"
        class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
        :disabled="isButtonDisabled"
        @click="removeFromPanel"
      >
        Remove from panel
      </button>
      <Table
        v-model:selection="selectedItems"
        data-key="id"
        :data="candidatesList"
        :columns="tableColumnsCandidates"
        multi-select
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
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])"
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
              v-if="hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])"
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
    <div v-if="activeTab === 'edit' && hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])">
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
              v-if="hasPermissions([PERMISSIONS.panels.permissions.canUpdatePanels.value])"
              class="govuk-button"
            >
              Confirm changes
            </button>
            <button
              v-if="hasPermissions([PERMISSIONS.panels.permissions.canDeletePanels.value])"
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
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import PanelMemberChange from '@/components/ModalViews/PanelMemberChange.vue';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { serverTimestamp } from '@firebase/firestore';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'PanelsView',
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
  mixins: [permissionMixin],
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
    const panelData = this.$store.getters['xpanels/getPanel'](this.$route.params.panelId);
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
      return this.$store.getters['xpanels/getPanel'](this.panelId);
    },
    isSift() {
      return this.panel.type === 'sift';
    },
    isSelectionDay() {
      return this.panel.type === 'selection';
    },
    isScenario() {
      return this.panel.type === 'scenario';
    },
    typeName() {
      if (this.panel && this.panel.type) {
        return this.panel.type.charAt(0).toUpperCase() + this.panel.type.slice(1);
      }
      return '';
    },
    candidatesList() {
      return this.$store.state.xpanels.panelApplications;
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
      let nextRoute = '';
      if (this.$route.fullPath.includes('/reports/selection/')) {
        nextRoute = 'exercise-reports-selection';
      } else if (this.$route.fullPath.includes('/reports/scenario')) {
        nextRoute = 'exercise-reports-scenario';
      } else {
        nextRoute = 'exercise-reports-sift';
      }
      this.$router.push({
        name: nextRoute,
      });
    }
  },
  methods: {
    async save(isValid) {
      if (isValid) {
        await this.$store.dispatch('xpanels/updatePanel', { id: this.panelId, data: this.formData });
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
          'xpanels/bindPanelApplications',
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
      await this.$store.dispatch('xpanels/removePanelApplications', { panelType: this.panel.type, applicationIds: this.selectedItems });
    },
    async deletePanel(){
      const redirectTo = `exercise-reports-${this.panel.type}`;
      await this.$store.dispatch('xpanels/deletePanel', this.panelId );
      this.$router.push({ name: redirectTo });
    },
    async exportToGoogleDrive() {
      const data = {
        status: 'approved',
        'statusLog.approved': serverTimestamp(),
      };
      await this.$store.dispatch('xpanels/updatePanel', { id: this.panelId, data: data });
      return true;
    },
  },
};
</script>
