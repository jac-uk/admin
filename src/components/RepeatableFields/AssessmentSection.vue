<template>
  <div>
    <strong v-if="section.question">
      {{ `${index + 1}. ${section.question}` }}
    </strong>
    <div
      v-if="!isFieldInEditMode"
      class="govuk-!-margin-top-2"
      :class="{ 'exceed-limit': getWordCount(content) > getWordLimit(section.wordLimit) }"
    >
      <strong>Saved Words:</strong> {{ getWordCount(content) }} (of a {{ getWordLimit(section.wordLimit) }} word limit)
    </div>

    <InformationReviewRenderer
      :data="content"
      :edit="editable"
      :index="index"
      field="uploadedSelfAssessmentContent"
      type="textareaV2"
      :type-props="{ wordLimit: getWordLimit(section.wordLimit) }"
      :disable-submit-on-error="true"
      :disable-universal-validation="true"
      class="govuk-!-margin-top-2"
      @change-field="changeSelfAssessmentAnswer"
      @edit-field="editField"
    />
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import { splitWords } from '@jac-uk/jac-kit/helpers/splitWords';

export default {
  name: 'AssessmentSection',
  components: {
    InformationReviewRenderer,
  },
  props: {
    section: {
      type: Object,
      required: true,
      default: () => {},
    },
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    content: {
      type: String,
      required: true,
      default: '',
    },
    index: {
      type: Number,
      required: true,
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  emits: ['updateApplication'],
  data() {
    return {
      defaultWordLimit: 250,
      isFieldInEditMode: false,
    };
  },
  computed: {
    isExtractingSelfAssessment() {
      return this.application.isExtractingSelfAssessment;
    },
  },
  methods: {
    changeSelfAssessmentAnswer(obj) {
      this.isFieldInEditMode = false;
      let changedObj = this.application[obj.field] || [];
      // Check if the key exists in the map and adjust the changedObj accordingly
      if (!changedObj.hasOwnProperty(obj.index)) {
        changedObj = {
          [obj.index]: obj.change,
        };
      } else {
        changedObj[obj.index] = obj.change;
      }
      this.$emit('updateApplication', { [obj.field]: changedObj });
    },
    getWordCount(textStr) {
      if (textStr.length === 0) {
        return 0;
      }
      return splitWords(textStr).length;
    },
    getWordLimit(sectionWordLimit) {
      return sectionWordLimit ? sectionWordLimit : this.defaultWordLimit;
    },
    editField(obj) {
      this.isFieldInEditMode = obj.value;
    },
  },
};
</script>
<style scoped>
  .exceed-limit {
    color: red;
  }
</style>
