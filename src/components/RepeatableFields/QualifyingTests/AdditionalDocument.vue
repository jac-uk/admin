<template>
  <div>
    <TextField
      :id="`title_${id}_${index}`"
      v-model="row.title"
      :label="`Title ${1 + index}`"
    />
    <RichTextInput
      :id="`${uniqueId}--additional-richtext`"
      v-model="row.content"
      :label="`Document ${1 + index}`"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';
import RichTextInput from '@/components/Form/RichTextInput';

export default {
  name: 'QTAdditionalRichText',
  components: {
    TextField,
    RichTextInput,
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
    id: {
      required: false,
      type: String,
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
