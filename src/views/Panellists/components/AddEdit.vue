<template>
  <Form
    v-if="hasPermissions([PERMISSIONS.panellists.permissions.canManagePanellists.value]) && formData"
    :id="id"
    @save="save"
    @cancel="cancel"
    @delete="remove"
  >
    <TextField
      id="full-name"
      v-model="formData.fullName"
      label="Full name"
      required
    />
    <TextField
      id="phone"
      v-model="formData.phone"
      label="Phone"
      type="tel"
      required
    />
    <TextField
      id="jac-exercise-email"
      v-model="formData.jacEmail"
      label="JAC Exercise Email"
      type="email"
      required
    />
    <Select
      id="sex"
      v-model="formData.sex"
      label="Sex"
      required
    >
      <option
        v-for="(sex) in sexes"
        :key="sex"
        :value="sex"
      >
        {{ $filters.lookup(sex) }}
      </option>
    </Select>
    <Select
      id="ethnicity"
      v-model="formData.ethnicity"
      label="Ethnicity"
      required
    >
      <option
        value=""
        selected
      >
        Please select
      </option>
      <option
        v-for="(ethnicGroup) in ethnicities"
        :key="ethnicGroup"
        :value="ethnicGroup"
      >
        {{ $filters.lookup(ethnicGroup) }}
      </option>
    </Select>
    <TextField
      id="correspondence-email"
      v-model="formData.email"
      label="Correspondence Email"
      type="email"
      required
    />
  </Form>
  <div
    v-else
    class="govuk-body"
  >
    You do not have the permissions necessary to edit panellist data
  </div>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    TextField,
    Select,
  },
  extends: Form,
  mixins: [permissionMixin],
  data() {
    return {
      sexes: [
        'male',
        'female',
        'prefer-not-to-say',
      ],
      ethnicities: [
        'White',
        'Ethnic Minority',
        'Unknown',
      ],
      hasManagePanellistPermissions: false,
    };
  },
  created() {
    this.hasManagePanellistPermissions = this.hasPermissions([this.PERMISSIONS.panellists.permissions.canManagePanellists.value]);
  },
  methods: {
    load(data) {
      const dataFields = {
        fullName: data ? data.fullName : '',
        phone: data ? data.phone : '',
        jacEmail: data ? data.jacEmail : '',
        sex: data ? data.sex : '',
        ethnicity: data ? data.ethnicity : '',
        email: data ? data.email : '',
      };
      return dataFields;
    },
  },
};
</script>
