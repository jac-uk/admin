<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <dl class="govuk-summary-list">
      <div
        v-for="role in roles"
        :key="role"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          {{ role | lookup }}
        </dt>
        <dd class="govuk-summary-list__value">
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
              <Select
                :id="`${role}-panellistId`"
                v-model="formData[role]"
              >
                <option value="" />
                <option
                  v-for="panellist in panellists"
                  :key="panellist.id"
                  :value="panellist.id"
                >
                  {{ panellist.fullName }}
                  ({{ panellist.email }})
                </option>
              </Select>
            </div>
            <div class="govuk-grid-column-one-third">
              <button
                class="govuk-button govuk-button--secondary"
                data-module="govuk-button"
                type="button"
                @click.prevent="addNewPanellist(role)"
              >
                Add new panellist
              </button>
            </div>
          </div>
        </dd>
      </div>
    </dl>
    <Modal ref="createPanellistModal">
      <TitleBar>
        Create panellist
      </TitleBar>
      <PanellistsForm
        class="govuk-!-margin-6"
        @save="createPanellist"
        @cancel="$refs['createPanellistModal'].closeModal()"
      />
    </Modal>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import PanellistsForm from '@/views/Panellists/components/AddEdit';

export default {
  name: 'EditPanellists',
  components: {
    Form,
    Select,
    Modal,
    TitleBar,
    PanellistsForm,
  },
  extends: Form,
  props: {
    panel: {
      required: true,
      type: Object,
    },
    panellists: {
      required: true,
      type: Array,
    },
    roles: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      selectedRole: null,
    };
  },
  methods: {
    load() {
      const data = { ...this.panel.roles };
      return data;
    },
    addNewPanellist(role) {
      this.selectedRole = role;
      this.$refs['createPanellistModal'].openModal();
    },
    async createPanellist(data) {
      const newId = await this.$store.dispatch('panellist/create', data );
      this.formData[this.selectedRole] = newId;
      this.$refs['createPanellistModal'].closeModal();
    },
  },
};
</script>

<style scoped>
.govuk-summary-list__key {
  vertical-align: top;
}
</style>
