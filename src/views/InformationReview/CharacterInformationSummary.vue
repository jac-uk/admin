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
        No information
        <span v-if="!isAsked">
          (not asked)
        </span>
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
            :is-asked="isAsked"
            @change-info="changeCharacterInfo"
          />
        </div>
      </dl>
      <dl
        v-else-if="isVersion3"
        class="govuk-summary-list"
      >
        <div>
          <CharacterInformationSummaryV3
            :form-data="characterInformation || {}"
            :edit="editable"
            :is-asked="isAsked"
            @change-info="changeCharacterInfo"
          />
        </div>
      </dl>
      <dl v-else>
        <div>
          <CharacterInformationSummaryV1
            :form-data="characterInformation || {}"
            :edit="editable"
            :is-asked="isAsked"
            @change-info="changeCharacterInfo"
          />
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import CharacterInformationSummaryV1 from '@/views/InformationReview/CharacterInformationSummaryV1.vue';
import CharacterInformationSummaryV2 from '@/views/InformationReview/CharacterInformationSummaryV2.vue';
import CharacterInformationSummaryV3 from '@/views/InformationReview/CharacterInformationSummaryV3.vue';

export default {
  name: 'CharacterInformationSummary',
  components: {
    CharacterInformationSummaryV1,
    CharacterInformationSummaryV2,
    CharacterInformationSummaryV3,
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
    isAsked: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['updateApplication'],
  computed: {
    isVersion3() {
      return this.version === 3;
    },
    isVersion2() {
      return this.version === 2;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    hasValues(target){
      if (target !== null && target !== undefined) {
        return Object.keys(target).some(item => (item && item.length) || (item !== false && item !== true));
      } else {
        return false;
      }
    },
    changeCharacterInfo(obj) {
      const myCharacterInfo = { ...this.characterInformation, ...obj };
      if (this.isVersion3) {
        this.$emit('updateApplication', { characterInformationV3: myCharacterInfo });
      } else if (this.isVersion2) {
        this.$emit('updateApplication', { characterInformationV2: myCharacterInfo });
      } else {
        this.$emit('updateApplication', { characterInformation: myCharacterInfo });
      }
    },
  },
};
</script>
