<template>
  <Form
    @save="save"
    @cancel="cancel"
  >
    <TextField
      id="ref"
      v-model="formData.ref"
      type="text"
      label="Title"
      required
    />

    <Select
      id="type"
      v-model="formData.type"
      label="Please select a type"
      required
      @change="onChangeType"
    >
      <option
        v-for="type in types"
        :key="type.value"
        :value="type.value"
      >
        {{ type.label }}
      </option>
    </Select>

    <Checkbox
      id="exclude-from-score"
      v-model="formData.excludeFromScore"
    >
      Exclude from score?
    </Checkbox>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import { MARKING_TYPE } from '@/helpers/scoreSheetHelper';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    Select,
    TextField,
    Checkbox,
  },
  extends: Form,
  data() {
    return {
      types: [
        MARKING_TYPE.GRADE,
        MARKING_TYPE.YES_NO,
        MARKING_TYPE.PASS_FAIL,
        MARKING_TYPE.LEVEL,
        MARKING_TYPE.NUMBER,
      ],
    };
  },
  methods: {
    onChangeType() {
      if (this.formData.type) {
        const type = this.types.find(item => item.value === this.formData.type);
        if (type) {
          this.formData.excludeFromScore = type.excludeFromScore;
        }        
      }
    },
  },
};
</script>
