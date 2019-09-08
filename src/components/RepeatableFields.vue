<template>
  <div>
    <div
      v-for="(row, index) in rows"
      :key="index"
      ref="repeatableField"
    >
      <component
        :is="component"
        :row="row"
        :index="index"
      >
        <template slot="removeButton">
          <button
            class="govuk-link govuk-link-delete"
            @click.prevent="removeRow(index)"
          >
            Remove
          </button>
        </template>
      </component>
    </div>
    <div class="text-right">
      <button
        v-if="canAddRow"
        class="govuk-link"
        @click.prevent="addRow"
      >
        Add another
      </button>
    </div>
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
  }

  button.govuk-link.govuk-link-delete {
    color: red;
  }
</style>
