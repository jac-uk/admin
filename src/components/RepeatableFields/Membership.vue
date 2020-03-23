<template>
  <div>
    <TextField
      v-if="editable"
      :id="`${id}_${index}`"
      v-model="row.label"
      type="text"
      required
      class="govuk-!-width-three-quarters"
      @input="updateValue"
    />
    <p
      v-else
      class="govuk-body govuk-!-padding-top-3"
    >
      {{ row.label }}
    </p>
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';
import { slugify } from '@/filters';

export default {
  name: 'Membership',
  components: {
    TextField,
  },
  props: {
    row: {
      required: true,
      type: Object,
      default() {
        return {
          label: '',
          value: '',
        };
      },
    },
    index: {
      required: true,
      type: Number,
    },
    id: {
      required: true,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editable: true,
    };
  },
  created() {
    if (this.row.label) {
      this.editable = false;
    }
  },
  methods: {
    updateValue(value) {
      // @TODO when we move lookup to db, we should add these to lookup
      this.row.value = slugify(value);
    },
  },
};
</script>
