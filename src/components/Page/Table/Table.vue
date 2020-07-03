<template>
  <div>
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
          v-for="row in getPaginatedItems"
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
    <nav
      v-if="pagination"
      class="moj-pagination"
    >
      <p
        class="govuk-visually-hidden"
        aria-labelledby="pagination-label"
      >
        Pagination navigation
      </p>
      <ul class="moj-pagination__list">
        <li class="moj-pagination__item  moj-pagination__item--prev">
          <a
            class="moj-pagination__link"
            href=""
          >Previous<span class="govuk-visually-hidden"> set of pages</span></a>
        </li> 
        <li class="moj-pagination__item">
          <a
            class="moj-pagination__link"
            href="#"
          >9</a>
        </li> 
        <li class="moj-pagination__item moj-pagination__item--active">
          10
        </li> 
        <li class="moj-pagination__item">
          <a
            class="moj-pagination__link"
            href="#"
          >11</a>
        </li> 
        <li class="moj-pagination__item  moj-pagination__item--next">
          <a
            class="moj-pagination__link"
            href=""
          >Next<span class="govuk-visually-hidden"> set of pages</span></a>
        </li>
      </ul>
      <p class="moj-pagination__results">
        Showing <b>10</b> to <b>20</b> of <b>30</b> results
      </p>
    </nav>
  </div>
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
    pageSize: {
      type: Number, 
      required: false, 
      default: 2,
    },
    pageNumber: {
      type: Number,
      required: false, 
      default: 1,
    },
  },
  computed: {
    selectAll: {
      get: function () {
        return this.data ? this.selectedItems.length == this.data.length : false;
      },
      set: function (value) {
        let selectedItems = [];
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
    pagination() {
      return true; 
    },
    calculatePages(){
      if(this.data.length > this.pageSize){
        return Math.round(this.data.length / this.pageSize);
      } else {
        return this.data.length;
      }
    },
    getPaginatedItems(){
      const numberOfPages = this.calculatePages;

      if(this.pageNumber > numberOfPages) throw 'Page {0} exceeds page size of {1}'.format(this.pageNumber, numberOfPages);

      const sliceFrom = (this.pageNumber * this.pageSize) - 1;
      const sliceTo = sliceFrom + this.pageSize; 

      const sliced = this.data.slice(sliceFrom, sliceTo);

      console.log(this.pageSize);
      console.log(numberOfPages);
      console.log(sliceFrom);
      console.log(sliceTo);
      console.log(sliced);

      return sliced;
    },
  },
};
</script>
