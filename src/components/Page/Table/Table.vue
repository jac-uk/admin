<template>
  <table class="govuk-table">
    <thead class="govuk-table__head">
      <tr class="govuk-table__row">
        <th
          v-if="multiSelect"
          scope="col"
          class="govuk-table__header govuk-!-padding-top-0"
        >
          <div class="govuk-checkboxes govuk-checkboxes--small">
            <div class="govuk-checkboxes__item">
              <input
                id="selectAll"
                v-model="selectAll"
                class="govuk-checkboxes__input"
                type="checkbox"
              >
              <label
                class="govuk-label govuk-checkboxes__label"
                for="checkboxes"
              />
            </div>
          </div>
        </th>        
        <th
          v-for="(column, index) in columns"
          :key="index"
          scope="col"
          class="govuk-table__header"          
        >
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody class="govuk-table__body">
      <tr
        v-for="row in data"
        :key="row[dataKey]"
        class="govuk-table__row"
      >
        <td 
          v-if="multiSelect"
          class="govuk-table__cell govuk-!-padding-top-0"
        >
          <div class="govuk-checkboxes govuk-checkboxes--small">
            <div class="govuk-checkboxes__item">
              <input
                :id="`item-${row[dataKey]}`"
                v-model="selectedItems"
                :value="row[dataKey]"
                class="govuk-checkboxes__input"
                type="checkbox"
              >
              <label
                class="govuk-label govuk-checkboxes__label"
                :for="`item-${row[dataKey]}`"
              />
            </div>
          </div>
        </td>      
        <slot 
          name="row" 
          :row="row"
        />
      </tr>
    </tbody>
  </table>  
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    dataKey: {
      type: String,
      required: true,
    },
    multiSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    selection: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    selectAll: {
      get: function () {
        return this.data ? this.selectedItems.length == this.data.length : false;
      },
      set: function (value) {
        const selectedItems = [];
        if (value) {
          this.data.forEach((item) => {
            selectedItems.push(item.id);
          });
        }
        this.selectedItems = selectedItems;
      },
    },
    selectedItems: {
      get() {
        return this.selection;
      },
      set(value) {
        this.$emit('update:selection', value);
      },
    },    
  },
};
</script>
