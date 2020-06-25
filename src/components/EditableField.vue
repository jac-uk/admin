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
      <span 
        v-if="isText" 
        class="wrap"
      >
        {{ value }}
      </span>
      <a 
        href="#"
        class="govuk-link change-link"
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
        :id="`editable-field-${id}`"
        v-model="localField"
      />
      <button 
        class="govuk-button"
        @click="btnClickSubmit()"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
  },
  props: {
    field: {
      type: String,
      default: 'value',
    },
    value: {
      type: String,
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
