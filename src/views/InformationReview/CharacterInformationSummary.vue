<template>
  <div>
    <dl 
      v-if="isVersion2 && application.characterInformationV2"
      class="govuk-summary-list"
    >
      <CriminalOffencesSummary
        :character-information="application.characterInformationV2"
        @changeCharacterInfo="changeCharacterInfo"
      />
    </dl>
    <!-- 
    <FixedPenaltiesSummary
      :character-information="application.characterInformationV2"
    />
    <MotoringOffencesSummary
      :character-information="application.characterInformationV2"
    />
    <FinancialMattersSummary
      :character-information="application.characterInformationV2"
    />
    <ProfessionalConductSummary
      :character-information="application.characterInformationV2"
    />
    <FurtherInformationSummary
      :character-information="application.characterInformationV2"
    />
    <CharacterDeclarationSummary
      :character-information="application.characterInformationV2"
    /> 
    </dl>
    -->
    <dl v-else>
      <CharacterInformationSummaryV1
        :character-information="application.characterInformation || {}"
      /> 
    </dl>
  </div>
</template>

<script>
import CriminalOffencesSummary from '@/views/InformationReview/CharacterReview/CriminalOffencesSummary';
// import FixedPenaltiesSummary from '@/views/InformationReview/CharacterReview/FixedPenaltiesSummary';
// import MotoringOffencesSummary from '@/views/InformationReview/CharacterReview/MotoringOffencesSummary';
// import FinancialMattersSummary from '@/views/InformationReview/CharacterReview/FinancialMattersSummary';
// import ProfessionalConductSummary from '@/views/InformationReview/CharacterReview/ProfessionalConductSummary';
// import FurtherInformationSummary from '@/views/InformationReview/CharacterReview/FurtherInformationSummary';
// import CharacterDeclarationSummary from '@/views/InformationReview/CharacterReview/CharacterDeclarationSummary';

export default {
  name: 'CharacterInformationSummary',
  components: {
    CriminalOffencesSummary,
    // FixedPenaltiesSummary,
    // MotoringOffencesSummary,
    // FinancialMattersSummary,
    // ProfessionalConductSummary,
    // FurtherInformationSummary,
    // CharacterDeclarationSummary,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
  //     requiredWiderColumn: {
  //       type: Boolean,
  //       required: false,
  //       default: true,
  //     },
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
    changeCharacterInfo(objChanged) {
      let myCharacterInfo;
      console.log(objChanged);
      if (this.isVersion2 && this.application.characterInformationV2) {
        myCharacterInfo = { ...this.application.characterInformationV2, ...objChanged };
        // console.log(myCharacterInfo);
        this.$store.dispatch('application/update', { data: { characterInformationV2: myCharacterInfo }, id: this.applicationId });
        this.$store.dispatch('candidates/saveCharacterInfo', { data: objChanged, id: this.application.userId });
      } 
      // else {
      //   myCharacterInfo = { ...this.application.characterInformation, ...objChanged };
      // }
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>

