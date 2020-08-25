<template>
  <div class="editable-field">
    <div 
      v-if="!editField"
      class="non-editable" 
    >
      <span v-if="isEmail">
        <a
          :href="`mailto:${value}`"
          class="govuk-link govuk-link--no-visited-state wrap"
          target="_blank"
        >
          {{ value }}
        </a>
      </span>
      <span v-if="isRoute">
        <RouterLink
          :to="{ ...routeTo }"
        >
          {{ value }}
        </RouterLink>
      </span>
      <span 
        v-if="isText" 
        class="wrap"
      >
        {{ value }}
      </span>
      <span 
        v-if="isDate" 
        class="wrap"
      >
        {{ value | formatDate }}
      </span>
      <a 
        href="#"
        class="govuk-link change-link print-none"
        @click.prevent="btnClickEdit()" 
      >
        {{ link }}
      </a>
    </div>
    <div 
      v-if="editField" 
      class="edit-field"
    >
      <TextField 
        v-if="!isDate"
        :id="`editable-field-${id}`"
        v-model="localField"
      />
      <DateInput 
        v-if="isDate" 
        :id="`data-of-birth$-{id}`"
        v-model="localField"
        :value="localField" 
      />
      <button 
        class="govuk-button"
        @click="btnClickSubmit()"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';
import DateInput from '@/components/Form/DateInput';

export default {
  components: {
    TextField,
    DateInput,
  },
  props: {
    field: {
      type: String,
      default: 'value',
    },
    value: {
      type: [String, Date, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    link: {
      type: String,
      default: 'Change',
    },
    routeTo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      localField: '',
      editField: false,
      id: null,
    };
  },
  computed: {
    isEmail() {
      return this.type === 'email';
    },
    isText() {
      return this.type === 'text';
    },
    isRoute() {
      return this.type === 'route' && this.routeTo !== null;
    },
    isDate() {
      return this.type === 'date';
    },
    valueToDate() {
      const newDate = this.isDate ? new Date(this.value) : null;
      return newDate;
    },
  },
  mounted () {
    this.id = this._uid;
  },
  methods: {
    btnClickEdit() {
      this.localField = this.value;
      this.editField = true;
    },
    btnClickSubmit() {
      this.$emit('changefield', { [this.field]: this.localField });
      this.editField = false;
    },
  },
};
</script>

<style scoped>
  .non-editable {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .edit-field {
    width: 100%;
  }

  .non-editable .change-link {
    margin-left: auto;
  }

  .wrap {
    overflow-wrap: anywhere;
  }
</style>
