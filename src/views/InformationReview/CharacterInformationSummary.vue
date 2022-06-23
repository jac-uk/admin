<template>
  <div>
    <div>
      <h2 class="govuk-heading-l govuk-!-padding-top-6">
        Character information
      </h2>
      <h3 class="govuk-visually-hidden govuk-heading-s">
        Version {{ version }}
      </h3>
      <div
        v-if="!hasValues(characterInformation) && !editable"
        class="govuk-body"
      >
        No information provided
        <hr>
      </div>
      <dl
        v-else-if="isVersion2"
        class="govuk-summary-list"
      >
        <div>
          <CharacterInformationSummaryV2
            :form-data="characterInformation || {}"
            :edit="editable"
            @changeInfo="changeCharacterInfo"
          />
        </div>
      </dl>
      <dl v-else>
        <div>
          <CharacterInformationSummaryV1
            :form-data="characterInformation || {}"
            :edit="editable"
            @changeInfo="changeCharacterInfo"
          />
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
    characterInformation: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
    version: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isVersion2() {
      return this.version === 2;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    hasValues(target) {
      if (target !== null && target !== undefined) {
        return Object.keys(target).some(item => (item && item.length) || (item !== false && item !== true));
      } else {
        return false;
      }
    },
    changeCharacterInfo(obj) {
      let myCharacterInfo;
      if (this.isVersion2) {
        myCharacterInfo = { ...this.characterInformation, ...obj };
        this.$emit('updateApplication', { characterInformationV2: myCharacterInfo });
      } else {
        myCharacterInfo = { ...this.characterInformation, ...obj };
        this.$emit('updateApplication', { characterInformation: myCharacterInfo });
      }
    },
  },
};
</script>
