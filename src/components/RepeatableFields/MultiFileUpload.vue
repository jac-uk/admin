<template>
  <div class="jac-multi-file-upload">
    <TextField
      :id="`${uniqueId}--title`"
      v-model="row.title"
      label="Title of file"
      required
    />
    <FileUpload
      :id="`${uniqueId}--file`"
      v-model="row.file"
      :name="uniqueId"
      :path="path"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import FileUpload from '@/components/Form/FileUpload';
import TextField from '@/components/Form/TextField';

export default {
  name: 'MultiFileUpload',
  components: {
    FileUpload,
    TextField,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    path: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    uniqueId() {
      return `${this.id}_${this.index}`;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.jac-multi-file-upload {
  padding-top: govuk-spacing(1);
  position: relative;
}
</style>
