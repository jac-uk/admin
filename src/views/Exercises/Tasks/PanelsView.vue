<template>
  <div class="panels-packs">
    <div id="panel-pack-div">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <span class="govuk-caption-l">Panel</span>
          <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
            {{ panel.name }}
          </h1>
        </div>
        <div class="govuk-grid-column-one-half text-right print-none">
          <!--
            TODO: The Actions buttons on the Panel View doesn't have any action.
            If we are not going to use this, we should delete.
            The idea was to have the GENERATE Panel Packs in different forms here
            TODO: The magic to actually create the PANEL PACKS
          -->
          <div class="moj-button-menu">
            <button
              ref="dropDownRef"
              class="govuk-button moj-button-menu__toggle-button govuk-button--secondary moj-button-menu__toggle-button--secondary"
              type="button"
              aria-haspopup="true"
              :aria-expanded="dropDownExpanded.toString()"
              @click="toggleExpand"
            >
              Actions
            </button>
            <div
              class="moj-button-menu__wrapper moj-button-menu__wrapper--right"
              role="menu"
            >
              <button
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Download As PDF
              </button>
              <button
                id="docDownloadButton"
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Download As Doc
              </button>
              <button
                id="clipboard-button"
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
          <!--  -->
          <span
            v-if="activeTab == 'full'"
            class=" govuk-!-margin-left-4"
          >
            <button
              v-if="nothing"
              class="govuk-button btn-unlock"
              @click="nothing"
            >
              Unlock
            </button>
            <button
              v-else
              class="govuk-button btn-mark-as-applied"
              @click="submitApplication"
            >
              Mark as applied
            </button>
          </span>
        </div>
      </div>
      <!--
        TODO: The dashboard area on the Panel view needs to be coded.
        This was added here as a placeholder.
      -->
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Status</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              <!-- TODO: Add the dynamic status -->
              {{ panel.status }}
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Sift / Selection Days</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              <!-- TODO: Add the dynamic date -->
              {{ exercise.siftStartDate | formatDate | showAlternative("Unknown") }},
            </h2>
            <ul class="govuk-list">
              <li
                v-for="item in exercise.selectionDays"
                :key="item.location"
              >
                <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
                  {{ item.selectionDayStart | formatDate | showAlternative("Unknown") }}
                </h2>
              </li>
            </ul>
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
              <!-- TODO: Add the candidates count -->
              25
            </h2>
          </div>
        </div>
      </div>
      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
    </div>
    <!-- MEMBER -->
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
    <!-- end MEMBER -->
    <!-- CANDIDATE LIST -->
    <div v-if="activeTab === 'candidates'">
      <p>TODO: Add the list of the candidates that are part of a specific panel.</p>
      <!-- CANDIDATES -->
      <div v-show="activeTab == 'candidates'">
        <Table
          data-key="id"
          :data="candidatesList"
          :columns="tableColumnsCandidates"
          multi-select
          :selection.sync="selectedItems"
          :page-size="50"
          :search="['candidate.fullName']"
          :filters="[
            {
              title: 'Status',
              field: 'status',
              type: 'checkbox',
            },
          ]"
          @change="getTableDatacandidates"
        >
          <template #actions>
            <button
              class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
              :disabled="isButtonDisabled"
              @click="removeFromPanel"
            >
              Remove from panel
            </button>
          </template>

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
      <!-- CANDIDATES -->
      <!--
        TODO: Create a new database query on the review and shorlisted STORE to return the value
        TODO: retrieve the candidate list according to the panel ID
        TODO: Ability to remove a candidate from the list
      -->
    </div>
    <!-- //  END CANDIDATE LIST -->

    <!-- INFO PANEL -->
    <div v-if="activeTab === 'info'">
      <p>TODO: Add the info panel.</p>
      <!--
        TODO: The information is already on the page - it is the additional information qhen creating a new panel and the information about the drive/location of the files
      -->
    </div>
    <!-- //  END INFO PANEL -->
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import PanelMemberChange from '@/components/ModalViews/PanelMemberChange';

export default {
  components: {
    TabsList,
    Modal,
    PanelMemberChange,
    Table,
    TableCell,
  },
  data() {
    return {
      activeTab: 'members',
      dropDownExpanded: false,
      memberDetails: {},
      selectedItems: [],
      tableColumns: [
        { title: 'Name' },
        { title: 'Type' },
        { title: 'Status' },
      ],
      tableColumnsCandidates: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
      ],
    };
  },
  computed: {
    tabs(){
      return [
        {
          ref: 'candidates',
          title: 'Candidates',
        },
        {
          ref: 'members',
          title: 'Panel Members',
        },
        {
          ref: 'info',
          title: 'Info',
        },
      ];
    },
    isSift() {
      const route = this.$route.fullPath.includes('/tasks/sift/');
      return route;
    },
    exercise() {
      return this.$store.getters['exerciseDocument/data'](this.panel.exerciseId);
    },
    candidatesList() {
      // eslint-disable-next-line no-console
      // console.log('panelsList', this.$store.state);
      let records = [];
      if (this.isSift) {
        records = this.$store.state.stageReview.records.filter(r => r.panelIds && r.panelIds.sift === this.panelId);
      }
      if (this.isSelectionDay) {
        records = this.$store.state.stageShortlisted.records.filter(r => r.panelIds && r.panelIds.selection === this.panelId);
      }
      return records;
    },
    isSelectionDay() {
      const route = this.$route.fullPath.includes('/tasks/selection-days/');
      return route;
    },
    type() {
      let returnType = '';
      if (this.isSift) {
        returnType = 'sift';
      }
      if (this.isSelectionDay) {
        returnType = 'selection-days';
      }
      return returnType;
    },
    panel(){
      let panel = this.$store.getters['panels/getPanel'](this.panelId);
      if (panel.length == 1) {
        panel = panel[0];
      }
      // eslint-disable-next-line no-console
      // console.log('panel', panel);
      return panel;
    },
    panelId() {
      return this.$route.params.panelId;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  created() {
    // Redirect if page Reload
    if (this.panel && this.panel.length === 0) {
      this.$router.push({
        name: `exercise-tasks-${this.type}`,
      });
    }
  },
  methods: {
    toggleExpand(){
      this.dropDownExpanded = !this.dropDownExpanded;
    },
    nothing() {
      return true;
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
    getTableDatacandidates(params) {
      if (this.isSift) {
        this.$store.dispatch(
          'stageReview/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
      if (this.isSelectionDay) {
        this.$store.dispatch(
          'stageShortlisted/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
    },
    async removeFromPanel() {
      const records = [];
      this.candidatesList.forEach(async (c) => {
        if (this.selectedItems.includes(c.id)) {

          const data = {
            panelIds: c.panelIds ? { ...c.panelIds } : {},
          };
          if (this.panel.type === 'sift') {
            data.panelIds.sift = '';
          } else {
            data.panelIds.selection = '';
          }
          records.push({ id: c.id, data: data });
        }
      });
      await this.$store.dispatch('candidateApplications/update', records);
    },
  },
};
</script>
