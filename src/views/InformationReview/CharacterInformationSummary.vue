<template>
  <div>
    <div>
      <h2 class="govuk-heading-l govuk-!-padding-top-6">
        Character information
      </h2>
      <h3 class="govuk-visually-hidden govuk-heading-s">
        Version {{ version }}
      </h3>
      <button
        v-if="hasPermissions([PERMISSIONS.exercises.permissions.canDeleteCandidateCharacterInformation.value]) && hasValues(characterInformation) && editable"
        class="govuk-button govuk-button--warning"
        @click="changeCharacterInfo({})"
      >
        Delete
      </button>
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
import permissionMixin from '@/permissionMixin';

export default {
  name: 'CharacterInformationSummary',
  components: {
    CharacterInformationSummaryV1,
    CharacterInformationSummaryV2,
  },
  mixins: [permissionMixin],
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
    hasValues(target){
      if (target !== null && target !== undefined) {
        return Object.keys(target).some(item => (item && item.length) || (item !== false && item !== true));
      } else {
        return false;
      }
    },
    changeCharacterInfo(obj) {
      let myCharacterInfo;
      if (Object.keys(obj).length === 0) {
        if (this.isVersion2) {
          this.$emit('updateApplication', { characterInformationV2: null });
        } else {
          this.$emit('updateApplication', { characterInformation: null });
        }
      } else {
        if (this.isVersion2) {
          myCharacterInfo = { ...this.characterInformation, ...obj };
          this.$emit('updateApplication', { characterInformationV2: myCharacterInfo });
        } else {
          myCharacterInfo = { ...this.characterInformation, ...obj };
          this.$emit('updateApplication', { characterInformation: myCharacterInfo });
        }
      }
    },
  },
};
</script>
