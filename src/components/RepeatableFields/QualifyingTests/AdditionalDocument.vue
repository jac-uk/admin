<template>
  <div>
    <RichTextInput
      :id="`${uniqueId}--additional-richtext`"
      v-model="row.content"
      :label="`Supporting document ${1 + index}`"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import RichTextInput from '@/components/Form/RichTextInput';

export default {
  name: 'QTAdditionalRichText',
  components: {
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
