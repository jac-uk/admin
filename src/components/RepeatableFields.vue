<template>
  <div class="repeatableContainer">
    <div
      v-for="(row, index) in rows"
      :key="index"
      ref="repeatableField"
      class="repeatableField"
    >
      <component
        :is="component"
        :row="row"
        :index="index"
      >
        <template v-slot:removeButton>
          <button
            type="button"
            class="govuk-link govuk-link-delete govuk-!-margin-bottom-4"
            @click.prevent="removeRow(index)"
          >
            Remove
          </button>
        </template>
      </component>
    </div>
    <button
      v-if="canAddRow"
      type="button"
      class="govuk-link govuk-!-margin-bottom-6"
      @click.prevent="addRow"
    >
      Add another
    </button>
  </div>
</template>

<script>
export default {
  name: 'RepeatableFields',
  props: {
    value: {
      validator: (value) => (value instanceof Array || value === null || value === undefined),
      required: true,
    },
    component: {
      required: true,
      type: Object,
    },
    max: {
      required: false,
      default: false,
      type: [Number, Boolean],
    },
  },
  data() {
    return {
      rows: [],
    };
  },
  computed: {
    canAddRow() {
      if (this.max) {
        return this.rows.length < this.max;
      } else {
        return true;
      }
    },
  },
  created() {
    if (this.value instanceof Array) {
      this.rows = this.value;
    } else {
      this.$emit('input', this.rows);
    }

    if (this.rows.length === 0) {
      this.addRow();
    }
  },
  methods: {
    addRow() {
      if (this.canAddRow) {
        this.rows.push({});
      }
    },
    removeRow(index) {
      this.rows.splice(index, 1);
    },
  },
};
</script>

<style>
  button.govuk-link {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: 0;
    color: #1d70b8;
    font-size: 1em;
    text-decoration: underline;
    cursor: pointer;
  }

  button.govuk-link.govuk-link-delete {
    color: red;
  }

  .repeatableField .govuk-form-group {
    margin-bottom: 1em;
  }

  .repeatableContainer .repeatableField:not(:first-child) label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  } 
</style>
