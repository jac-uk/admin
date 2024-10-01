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
      v-model:active-tab="activeTab"
      :tabs="tabs"
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
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import PanellistsForm from './components/AddEdit.vue';
import PanellistsView from './components/View.vue';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    TabsList,
    PanellistsForm,
    PanellistsView,
  },
  mixins: [permissionMixin],
  data() {
    const TabList = [
      {
        ref: 'details',
        title: 'Details',
      },
      {
        ref: 'notes',
        title: 'Notes',
      },
      {
        ref: 'panels',
        title: 'Panels',
      },
    ];
    return {
      editMode: false,
      tabs: TabList,
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
  mounted() {
    // add edit tab if user has permissions
    if (this.hasPermissions([this.PERMISSIONS.panellists.permissions.canManagePanellists.value])){
      this.$data.tabs.splice(1,0, {
        ref: 'edit',
        title: 'Edit',
      });
    }
  },
  unmounted() {
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
