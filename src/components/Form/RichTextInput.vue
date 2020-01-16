<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      :for="id"
      class="govuk-heading-m govuk-!-margin-bottom-2"
    >
      {{ label }}
    </label>
    <span
      v-if="hint"
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />

    <ckeditor
      :id="id"
      v-model="text"
      class="govuk-textarea"
      :editor="editor"
      :config="editorConfig"
      @change="validate"
    />
  </div>
</template>

<script>
import FormField from '@/components/Form/FormField';
import FormFieldError from '@/components/Form/FormFieldError';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    value: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList'],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'govuk-body' },
            { model: 'heading1', view: 'h2', title: 'Heading', class: 'govuk-heading-m' },
          ],
        },
        link: {
          addTargetToExternalLinks: true,
        },
      },
    };
  },
  computed: {
    text: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

  },
};
</script>

<style lang="scss">

:root {
  --ck-font-size-base: 19px;
}

.ck-editor {
  .ck-editor__top {
    border: 2px solid black;
    .ck-toolbar {
      background-color: transparent;
    }    
  }
  .ck-editor__main {
    border: 2px solid black;
    border-top: none;    
  }
}

</style>
