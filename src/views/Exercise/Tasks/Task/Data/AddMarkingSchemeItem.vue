<template>
  <Form
    @save="preSave"
    @cancel="cancel"
  >
    <RadioGroup
      id="item-type"
      v-model="itemType"
      label="Please choose which data you'd like to collect"
    >
      <RadioItem
        v-for="item in additionalColumns"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
      <RadioItem
        value="custom"
        label="Custom"
      >
        <TextField
          id="ref"
          v-model="formData.ref"
          type="text"
          label="Title"
          :max-length="40"
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
          v-if="showIncludeInScore"
          id="include-in-score"
          v-model="formData.includeInScore"
        >
          Include in overall score?
        </Checkbox>
      </RadioItem>
    </RadioGroup>
  </Form>
</template>

<script>
import Form from '@/components/Page/Form.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import { MARKING_TYPE, getAdditionalColumns, getAdditionalColumn } from '@/helpers/scoreSheetHelper';

export default {
  name: 'SelectPanel',
  components: {
    Form,
    RadioGroup,
    RadioItem,
    Select,
    TextField,
    Checkbox,
  },
  extends: Form,
  data() {
    return {
      MARKING_TYPE: MARKING_TYPE,
      types: [
        MARKING_TYPE.GRADE,
        MARKING_TYPE.YES_NO,
        MARKING_TYPE.PASS_FAIL,
        MARKING_TYPE.LEVEL,
        MARKING_TYPE.NUMBER,
      ],
      additionalColumns: getAdditionalColumns(),
      itemType: null,
      showIncludeInScore: false,
    };
  },
  methods: {
    onChangeType() {
      if (this.formData.type) {
        const type = this.types.find(item => item.value === this.formData.type);
        if (type) {
          if (type.includeInScore) {
            this.showIncludeInScore = true;
          } else {
            this.showIncludeInScore = false;
          }
          this.formData.includeInScore = false;
        }
      }
    },
    preSave() {
      if (this.itemType && this.itemType != 'custom') {
        this.formData = getAdditionalColumn(this.itemType).config;
      }
      this.save();
    },
  },
};
</script>
