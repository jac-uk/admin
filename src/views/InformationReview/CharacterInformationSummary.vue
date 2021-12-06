<template>
  <div>
    <div>
      <h2 class="govuk-heading-l">
        Character information
      </h2>
      <dl 
        v-if="isVersion2"
        class="govuk-summary-list"
      >
        <div v-if="hasValues(application.characterInformationV2) || editable">
          <CharacterInformationSummaryV2
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeInfo="changeCharacterInfo"
          /> 
        </div>
        <div v-else>
          No information providied
        </div>
      </dl>
      <dl v-else>
        <div v-if="hasValues(application.characterInformation)|| editable">
          <CharacterInformationSummaryV1
            :character-information="application.characterInformation || {}"
            :edit="editable"
            @changeInfo="changeCharacterInfo"
          /> 
        </div>
        <div v-else>
          No information providied
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import CharacterInformationSummaryV1 from '@/views/InformationReview/CharacterInformationSummaryV1.vue';
import CharacterInformationSummaryV2 from '@/views/InformationReview/CharacterInformationSummaryV2.vue';

export default {
  name: 'CharacterInformationSummary',
  components: {
    CharacterInformationSummaryV1,
    CharacterInformationSummaryV2,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isVersion2() {
      if (this.exercise._applicationVersion && this.exercise._applicationVersion === 2) {
        return true;
      }
      return false;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    hasValues(target){
      if (target !== null && target !== undefined) {
        return Object.values(target).some(item => item && item.length);
      } else {
        return false;
      }
    },
    changeCharacterInfo(obj) {
      console.log(obj);
      let myCharacterInfo;
      if (this.isVersion2) {
        myCharacterInfo = { ...this.application.characterInformationV2, ...obj };
        this.$emit('updateApplication', { characterInformationV2: myCharacterInfo });
      } else {
        myCharacterInfo = { ...this.application.characterInformation, ...obj };
        console.log(myCharacterInfo);
        this.$emit('updateApplication', { characterInformation: myCharacterInfo });
      }
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>

