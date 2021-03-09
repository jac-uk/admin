<template>
  <div>
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Signed character information declaration
        </dt>
        <dd class="govuk-summary-list__value">
          {{ signedDeclaration() | toYesNo }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>

export default {
  name: 'CharacterDeclarationSummary',
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: new Object({}),
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
  },
  methods: {
    signedDeclaration() {
      if (this.characterInformation.declaration1 === true &&
        this.characterInformation.declaration2 === true &&
        this.characterInformation.declaration3 === true) {
        return true;
      }
      return false;
    },
  },
};

</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>

