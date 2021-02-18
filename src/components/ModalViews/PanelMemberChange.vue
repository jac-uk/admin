<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Panel Member
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
          @submit.prevent="save"
        >
          <fieldset>
            <TextField
              id="full-name"
              v-model="fullName"
              label="Full name"
              required
            />
            <!--
              TODO: The title or position needs to be a dropwdown with
              • Chair
              • Independent
              • Judicial
              • Other
            -->
            <TextField
              id="title"
              v-model="title"
              label="Title or position"
              required
            />
            <TextField
              id="first-assessor-email"
              v-model="email"
              label="Email"
              type="email"
            />
            <TextField
              id="first-assessor-Phone"
              v-model="phone"
              label="Phone"
              type="tel"
            />
          </fieldset>
          <button
            class="govuk-button govuk-!-margin-right-3"
            @click="save"
          >
            Save
          </button>
          <button
            v-if="$attrs.action === 'edit'"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="deleteAction"
          >
            Delete
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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'PanelMemberChange',
  components: {
    TextField,
  },
  data() {
    return {
      email: null,
      fullName: null,
      phone: null,
      title: null,
      action: null,
    };
  },
  created() {
    this.email = this.$attrs.email;
    this.fullName = this.$attrs.fullName;
    this.phone = this.$attrs.phone;
    this.title = this.$attrs.title;
    this.action = this.$attrs.action;
    // eslint-disable-next-line no-console
    // console.log('Modal', this.$attrs);
  },
  methods: {
    closeModal() {
      // eslint-disable-next-line no-console
      // console.log('closeModal emit CLOSE');
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    deleteAction() {
      this.action = 'delete';
      this.save();
    },
    async save() {
      const data = {
        id: this.$attrs.id,
        idx: this.$attrs.idx,
        action: this.action,
        members: {
          fullName: this.fullName,
          title: this.title,
          phone: this.phone === null || this.phone === undefined ? '' : this.phone,
          email: this.email === null || this.email === undefined ? '' : this.email,
        },
      };
      await this.$store.dispatch('panels/updateMembers', { ...data });
      // this.$store.dispatch('assessment/update', { data: data, id: this.$attrs.applicationId, AssessorNr: this.$attrs.AssessorNr });
      this.closeModal();
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
