<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Set panel
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
          @submit.prevent="save"
        >
          <div class="govuk-form-group">
            <select
              id="selectPanel"
              v-model="selected"
              name="selectPanel"
              class="govuk-select"
            >
              <option
                value=""
                selected
              >
                Please select from available options:
              </option>
              <option
                v-for="panel in panelList"
                :key="panel.id"
                :value="panel"
              >
                {{ panel.name }}
              </option>
            </select>
          </div>
          <button
            class="govuk-button govuk-!-margin-right-3"
            @click="save"
          >
            Save
          </button>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SelectPanel',
  components: {

  },
  props: {
    panels: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      panelList: null,
      selectedPanel: null,
      selected: '',
    };
  },
  created() {
    this.panelList = this.$props.panels;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    async save() {
      if (this.selected !== '') {
        this.closeModal();
        this.$emit('selected', this.selected);
      }
    },
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
</style>
