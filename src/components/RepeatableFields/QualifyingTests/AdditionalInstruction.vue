<template>
  <div>
    <TextareaInput
      :id="`${uniqueId}--additional-information`"
      v-model="row.text"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextareaInput from '@/components/Form/TextareaInput';

export default {
  name: 'QTAdditionalInstruction',
  components: {
    TextareaInput,
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
