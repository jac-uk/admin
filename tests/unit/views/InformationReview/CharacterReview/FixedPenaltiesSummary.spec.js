{/* <template>
  <div>
    <dl class="govuk-summary-list smallerMargin">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has received a fixed penalty notice in the last 4 years
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.fixedPenaltyDetails"
            :display-month-year-only="false"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="fixedPenaltyDetails"
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
  name: 'FixedPenaltiesSummary',
  components: {
    InformationReviewSectionRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
    emptyDetailObject() {
      return {
        'title': '',
        'date': new Date(),
        'details': '',
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
  .smallerMargin {
    margin-bottom: 0;
  }
</style> */}
