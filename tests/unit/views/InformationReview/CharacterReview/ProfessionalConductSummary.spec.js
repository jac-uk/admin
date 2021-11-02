{/* <template>
  <div>
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of professional misconduct
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of negligence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfNegligenceDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfNegligenceDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of wrongful dismissal
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of discrimination proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of harassment proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of complaints or disciplinary action
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.complaintOrDisciplinaryActionDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="complaintOrDisciplinaryActionDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been asked to resign from a position
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.requestedToResignDetails"
            :data-default="emptyResignObject"
            :edit="edit"
            field="requestedToResignDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'ProfessionalConductSummary',
  components: {
    InformationReviewSectionRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: () => {},
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
    emptyDetailObject() {
      return {
        'details': '',
        'date': new Date(),
        'investigations': '',
        'investigationConclusionDate': '',
      };
    },
    emptyResignObject() {
      return {
        'details': '',
        'date': new Date(),
      };
    },
  },
  methods: {
    changeCharacterInfo(obj) {
      let changedObj = this.characterInformation[obj.field] || {};

      if (obj.change && obj.extension && obj.field && obj.hasOwnProperty('index')) { //UPDATE

        changedObj[obj.index][obj.extension] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.change && !obj.remove) { // ADD

        if (changedObj.length > 0){
          changedObj = [...changedObj, obj.change];
        } else {
          changedObj = [obj.change];
        } 
      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE

        if (changedObj.length > 0){
          changedObj.splice(obj.index, 1);
        } else {
          changedObj = [];
        } 
      } 
      changedObj = { [obj.field]: changedObj };
      this.$emit('changeCharacterInfo', changedObj);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style> */}
