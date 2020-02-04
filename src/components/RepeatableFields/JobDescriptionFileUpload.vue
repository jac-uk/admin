<template>
  <div>
    <TextField
      :id="`job_description_title_${index}`"
      v-model="row.title"
      label="Title of file"
      required
    />

    <FileUpload
      :id="`job-description_file_${index}`"
      :ref="`job-description_file_${index}`"
      v-model="row.file"
      :name="`job-description_file_${index}`"
      label="Job description"
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
  components: {
    FileUpload,
    TextField,
  },
  props: {
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
};
</script>
