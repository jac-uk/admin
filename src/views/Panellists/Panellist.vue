<template>
  <div v-if="panellist">
    <router-link
      class="govuk-back-link govuk-!-margin-top-0 "
      :to="{ name: 'panellists-list' }"
    >
      Back
    </router-link>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Panellist: {{ panellist.fullName }}
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <div
      v-if="activeTab === 'details'"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <PanellistsView :data="panellist" />
        </div>
      </div>
    </div>

    <div
      v-if="activeTab === 'edit'"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <PanellistsForm
            :id="panellistId"
            :data="panellist"
            @save="savePanellist"
            @cancel="activeTab = 'details'"
            @delete="deletePanellist"
          />
        </div>
      </div>
    </div>

    <div
      v-if="activeTab === 'notes'"
    >
      notes about this panellist
    </div>

    <div
      v-if="activeTab === 'panels'"
    >
      panels
    </div>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import PanellistsForm from './components/AddEdit';
import PanellistsView from './components/View';

export default {
  components: {
    TabsList,
    PanellistsForm,
    PanellistsView,
  },
  data() {
    return {
      authorisedToPerformAction: false,
      editMode: false,
      tabs: [
        {
          ref: 'details',
          title: 'Details',
        },
        {
          ref: 'edit',
          title: 'Edit',
        },
        {
          ref: 'notes',
          title: 'Notes',
        },
        {
          ref: 'panels',
          title: 'Panels',
        },
      ],
      activeTab: 'details',
    };
  },
  computed: {
    panellist() {
      return this.$store.getters['panellist/data']();
    },
    panellistId() {
      return this.$route.params.id || '';
    },
  },
  async created() {
    this.$store.dispatch('panellist/bind', this.panellistId);
  },
  destroyed() {
    this.$store.dispatch('panellist/unbind');
  },
  methods: {
    async savePanellist(data) {
      await this.$store.dispatch('panellist/update', { id: this.panellistId, data: data } );
      this.activeTab = 'details';
    },
    async deletePanellist() {
      await this.$store.dispatch('panellist/delete', this.panellistId );
      this.$router.push({ name: 'panellists-list' });
    },
  },
};
</script>
