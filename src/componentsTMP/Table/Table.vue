<template>
  <div class="jac-table">
    <div class="govuk-grid-row">
      <div
        v-if="hasSearch"
        class="govuk-grid-column-one-half"
      >
        <Search
          :placeholder="searchPlaceholder"
          @search="useSearch"
        />
      </div>
      <div :class="search.length ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-half'">
        <button
          v-if="filters.length"
          type="button"
          class="btn-filter govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
          @click="btnToggleSidePanel"
        >
          {{ showSidePanel ? "Hide filters" : "Show filters" }}
        </button>
        <Badge :number="numberOfFiltersApplied" />
      </div>
      <div :class="[search.length ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-half', 'text-right']">
        <slot name="actions" />
      </div>
    </div>
    <SidePanel :show="showSidePanel">
      <template #header>
        <div class="govuk-grid-row govuk-!-padding-top-3 govuk-!-padding-bottom-3">
          <div class="govuk-grid-column-one-half">
            <div class="govuk-heading-l govuk-!-margin-bottom-0">
              Filters
            </div>
          </div>
          <div class="govuk-grid-column-one-half text-right">
            <a
              href
              class="govuk-link"
              @click.prevent="btnClearFilters"
            >
              Clear all
            </a>
          </div>
        </div>
      </template>
      <template #default>
        <!-- <CustomForm
          :fields="filters"
          :data.sync="filterValues"
        /> -->
      </template>
      <template #footer>
        <button
          type="button"
          class="govuk-button govuk-!-margin-2"
          @click="btnUpdateFilters"
        >
          Apply
        </button>
        <button
          type="button"
          class="govuk-button govuk-!-margin-2 govuk-button--secondary"
          @click="btnCancelFilters"
        >
          Cancel
        </button>
      </template>
    </SidePanel>
    <table
      v-if="hasData"
      class="govuk-table govuk-!-margin-top-2"
    >
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
            :class="[ 'govuk-table__header', ...column.class ]"
            :aria-sort="columnSortState(column)"
            @click="sortBy(column)"
          >
            <button
              v-if="column.sort"
              type="button"
              :data-index="index"
            >
              {{ column.title }}
            </button>
            <span v-else>
              {{ column.title }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="row in data"
          :key="row[dataKey]"
          class="govuk-table__row govuk-!-padding-left-2 govuk-!-padding-right-2"
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
      v-if="showPaging"
      class="moj-pagination"
    >
      <p
        class="govuk-visually-hidden"
        aria-labelledby="pagination-label"
      >
        Table pagination
      </p>
      <ul class="moj-pagination__list">
        <li
          v-if="page"
          class="moj-pagination__item  moj-pagination__item--prev"
        >
          <a
            class="moj-pagination__link"
            href="#"
            @click="btnPrev"
          >Previous<span class="govuk-visually-hidden"> set of pages</span></a>
        </li>

        <li
          v-if="showNext"
          class="moj-pagination__item  moj-pagination__item--next"
        >
          <a
            class="moj-pagination__link"
            href="#"
            @click="btnNext"
          >Next<span class="govuk-visually-hidden"> set of pages</span></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Search from './Search';
import SidePanel from './SidePanel';
import Badge from './Badge';
// import CustomForm from './CustomForm';

export default {
  components: {
    Search,
    SidePanel,
    Badge,
    // CustomForm,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    filters: {
      type: Array,
      required: false,
      default: () => [],
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
      default: 0,
    },
    search: {
      type: Array,
      required: false,
      default: () => [],
    },
    customSearch: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      searchTerm: null,
      orderBy: null,
      direction: null,
      page: 0,
      showSidePanel: false,
      filterValues: {},
      numberOfFiltersApplied: 0,
      where: [],
      customSearchValues: [],
    };
  },
  computed: {
    defaultState() {
      const state = {};
      if (this.pageSize) {
        state.pageSize = this.pageSize;
      }
      const defaultColumn = this.columns.filter(item => item.default);
      if (defaultColumn && defaultColumn.length) {
        state.orderBy = defaultColumn[0].sort;
        state.direction = defaultColumn[0].direction ? defaultColumn[0].direction : 'asc';
      }
      if (this.search.length) {
        state.search = this.search;
      }
      if (Object.keys(this.customSearch).length) {
        state.customSearch = this.customSearch;
      }
      return state;
    },
    currentState() {
      const state = { ...this.defaultState };
      if (this.searchTerm) { state.searchTerm = this.searchTerm; }
      if (this.orderBy) { state.orderBy = this.orderBy; }
      if (this.direction) { state.direction = this.direction; }
      if (this.where) { state.where = this.where; }
      if (this.customSearchValues.length) { state.customSearchValues = this.customSearchValues; }
      return state;
    },
    showPaging() {
      return this.pageSize > 0;
    },
    showNext() {
      return this.data.length >= this.pageSize;
    },
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
    hasData() {
      return this.data.length > 0;
    },
    hasCustomSearch() {
      return Object.keys(this.customSearch).length;
    },
    hasSearch() {
      return this.search.length || this.hasCustomSearch;
    },
    searchPlaceholder() {
      let placeholderText = '';
      if (this.hasCustomSearch) {
        placeholderText = this.customSearch.placeholder;
      }
      if (!placeholderText) {
        placeholderText = 'Search candidate names - enter first few letters of candidate name (case sensitive)';
      }
      return placeholderText;
    },
  },
  created() {
    if (this.defaultState.orderBy) {
      this.orderBy = this.defaultState.orderBy;
      this.direction = this.defaultState.direction;
    }
    this.$emit('change', this.currentState);
  },
  methods: {
    btnPrev() {
      if (this.page > 0) {
        this.page--;
        const state = { ...this.currentState };
        state.pageChange = -1;
        this.$emit('change', state);
      }
    },
    btnNext() {
      this.page++;
      const state = { ...this.currentState };
      state.pageChange = 1;
      this.$emit('change', state);
    },
    btnToggleSidePanel() {
      this.showSidePanel = !this.showSidePanel;
    },
    btnCancelFilters() {
      this.filterValues = {};
      if (this.numberOfFiltersApplied) {
        this.filterValues = JSON.parse(JSON.stringify(this.appliedFilterValues));
      }
      this.btnToggleSidePanel();
    },
    btnClearFilters() {
      this.filterValues = {};
      this.appliedFilterValues = {};
      this.where = [];
      this.numberOfFiltersApplied = 0;
      this.$emit('change', this.currentState);
      this.showSidePanel = false;
    },
    btnUpdateFilters() {
      const where = [];
      this.appliedFilterValues = JSON.parse(JSON.stringify(this.filterValues));
      this.numberOfFiltersApplied = 0;
      // iterate filters and build where clause if a filter value has been chosen
      this.filters.forEach((filter) => {
        switch (filter.type) {
        case 'checkbox':
          if (this.filterValues[filter.field] && this.filterValues[filter.field].length) {
            where.push({
              field: filter.field,
              comparator: 'in',
              value: this.filterValues[filter.field],
            });
            this.numberOfFiltersApplied += this.filterValues[filter.field].length;
          }
          break;
        case 'dateRange':
          if (this.filterValues[`${filter.field}-from`] || this.filterValues[`${filter.field}-to`]) {
            if (this.filterValues[`${filter.field}-from`]) {
              where.push({
                field: filter.field,
                comparator: '>=',
                value: this.filterValues[`${filter.field}-from`],
              });
            }
            if (this.filterValues[`${filter.field}-to`]) {
              where.push({
                field: filter.field,
                comparator: '<',
                value: this.filterValues[`${filter.field}-to`],
              });
            }
            this.orderBy = filter.field;  // order by date field
            this.direction = 'asc';
            this.numberOfFiltersApplied += 1;
          }
          break;
        case 'customDateRange':
          if (
            this.filterValues[`${filter.ident}-field`]
            && (this.filterValues[`${filter.ident}-from`] || this.filterValues[`${filter.ident}-to`])
          ) {
            if (this.filterValues[`${filter.ident}-from`]) {
              where.push({
                field: this.filterValues[`${filter.ident}-field`],
                comparator: '>=',
                value: this.filterValues[`${filter.ident}-from`],
              });
            }
            if (this.filterValues[`${filter.ident}-to`]) {
              where.push({
                field: this.filterValues[`${filter.ident}-field`],
                comparator: '<',
                value: this.filterValues[`${filter.ident}-to`],
              });
            }
            this.orderBy = this.filterValues[`${filter.ident}-field`];  // order by date field
            this.direction = 'asc';
            this.numberOfFiltersApplied += 1;
          }
          break;
        }
      });
      this.where = where;
      this.$emit('change', this.currentState);
      this.showSidePanel = false;
    },
    sortBy(column) {
      if (column.sort && !this.searchTerm) {
        this.page = 0;
        if (column.sort === this.orderBy) {
          this.direction = (this.direction === 'desc') ? 'asc' : 'desc';
        } else {
          this.orderBy = column.sort;
          this.direction = column.direction ? column.direction : 'asc';
        }
        this.$emit('change', this.currentState);
      }
    },
    columnSortState(column) {
      if (this.searchTerm) {
        return 'none';
      } else if (column.sort === this.orderBy) {
        return this.direction === 'asc' ? 'ascending' : 'descending';
      } else {
        return 'none';
      }
    },
    async useSearch(searchTerm) {
      this.searchTerm = searchTerm;
      if (this.searchTerm) { this.searchTerm = this.searchTerm.trim(); }
      if (this.searchTerm) {
        this.orderBy = '';
      } else {
        this.orderBy = this.defaultState.orderBy;
      }
      if (this.defaultState.customSearch) {
        this.customSearchValues = [];
        if (this.searchTerm) {
          const handlerResults = await this.defaultState.customSearch.handler(this.searchTerm);
          if (handlerResults.length) {
            this.customSearchValues = handlerResults;
          }
        }
      }
      this.$emit('change', this.currentState);
    },
    reload() {
      this.$emit('change', this.currentState);
    },
  },
};
</script>

<style lang="scss" scoped>
  @mixin mobile-view {
    @media (max-width: 599px) { @content; }
  }
  .btn-filter {
    width: 130px;
  }

  @include mobile-view {
    tbody > tr > td:last-child {
      border-bottom: 1px solid #b1b4b6 !important;
    }
    tbody > tr > td, tbody > tr:last-child > td:last-child {
      border-bottom: none !important;
    }
    .govuk-table__body {
      border: 1px solid grey;
    }
    .govuk-table__head {
      display: none;
    }
    .govuk-table__row {
      display: grid;
    }
  }
</style>
