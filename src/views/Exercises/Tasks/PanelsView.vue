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

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Status</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              Created
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Interview</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              02/03/2021
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <div class="govuk-caption-m">
              Participants
            </div>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
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
        List of Panelists
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
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import PanelMemberChange from '@/components/ModalViews/PanelMemberChange';

export default {
  components: {
    TabsList,
    Modal,
    PanelMemberChange,
  },
  data() {
    return {
      activeTab: 'members',
      dropDownExpanded: false,
      memberDetails: {},
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
      console.log('btnClickEditMember', idx, action);
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
  },
};
</script>
