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
          <CriminalOffencesSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <FixedPenaltiesSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <MotoringOffencesSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <FinancialMattersSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <ProfessionalConductSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <FurtherInformationSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
          <CharacterDeclarationSummary
            :character-information="application.characterInformationV2 || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
          />
        </div>
        <div v-else>
          No information providied
        </div>
      </dl>
      <dl v-else>
        <div v-if="hasValues(application.characterInformation)|| editable">
          <CharacterInformationV1Summary
            :character-information="application.characterInformation || {}"
            :edit="editable"
            @changeCharacterInfo="changeCharacterInfo"
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
import CharacterInformationV1Summary from '@/views/Exercise/Applications/CharacterInformationV1Summary';
import CriminalOffencesSummary from '@/views/InformationReview/CharacterReview/CriminalOffencesSummary';
import FixedPenaltiesSummary from '@/views/InformationReview/CharacterReview/FixedPenaltiesSummary';
import MotoringOffencesSummary from '@/views/InformationReview/CharacterReview/MotoringOffencesSummary';
import FinancialMattersSummary from '@/views/InformationReview/CharacterReview/FinancialMattersSummary';
import ProfessionalConductSummary from '@/views/InformationReview/CharacterReview/ProfessionalConductSummary';
import FurtherInformationSummary from '@/views/InformationReview/CharacterReview/FurtherInformationSummary';
import CharacterDeclarationSummary from '@/views/InformationReview/CharacterReview/CharacterDeclarationSummary';

export default {
  name: 'CharacterInformationSummary',
  components: {
    CriminalOffencesSummary,
    FixedPenaltiesSummary,
    MotoringOffencesSummary,
    FinancialMattersSummary,
    ProfessionalConductSummary,
    FurtherInformationSummary,
    CharacterDeclarationSummary,
    CharacterInformationV1Summary,
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
      let myCharacterInfo;
      if (this.isVersion2) {
        myCharacterInfo = { ...this.application.characterInformationV2, ...obj };
        this.$store.dispatch('application/update', { data: { characterInformationV2: myCharacterInfo }, id: this.applicationId });
      } else {
        myCharacterInfo = { ...this.application.characterInformation, ...obj };
        this.$store.dispatch('application/update', { data: { characterInformation: myCharacterInfo }, id: this.applicationId });
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
