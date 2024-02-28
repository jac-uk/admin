<template>
  <div
    class="jac-table"
    :class="{ 'sticky-headers-table': sticky }"
  >
    <div class="govuk-grid-row govuk-!-margin-bottom-4">
      <div
        v-if="hasSearch"
        class="govuk-grid-column-one-half"
      >
        <Search
          :placeholder="searchPlaceholderText"
          :search-map="searchMap"
          @search="useSearch"
        />
      </div>
      <div
        :class="hasSearch ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-half'"
        class="govuk-!-margin-top-6"
      >
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
      <div
        :class="[hasSearch ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-half', 'text-right']"
        class="govuk-!-margin-top-6"
      >
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
        <CustomForm
          v-model:data="filterValues"
          :fields="filters"
        />
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
    <LoadingMessage
      v-if="loading"
      class="loading govuk-!-margin-bottom-2"
    />
    <div
      v-if="hasData"
      style="overflow: auto;"
    >
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <slot name="header" />
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
              :class="[ 'govuk-table__header', column.class ]"
              :aria-sort="columnSortState(column)"
              @click="clickHeaderColumn(column)"
            >
              <button
                v-if="column.sort"
                type="button"
                :data-index="index"
              >
                {{ column.title }}
              </button>
              <span
                v-else-if="column.emitEvent"
                class="header-link"
              >
                {{ column.title }}
              </span>
              <span v-else>
                {{ column.title }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="(row, index) in data"
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
              :index="index"
            />
          </tr>
          <slot name="footer" />
        </tbody>
      </table>
    </div>

    <EmptySearchResults
      v-else-if="!loading"
      :search-map="searchMap"
    />

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
          v-if="page && showPreviousNext"
          class="moj-pagination__item  moj-pagination__item--prev"
        >
          <a
            class="moj-pagination__link"
            href="#"
            @click="btnPrev"
          >Previous<span class="govuk-visually-hidden"> set of pages</span></a>
        </li>

        <template v-if="showPageItems">
          <li
            v-for="(n, index) in pageItems"
            :key="n"
            class="moj-pagination__item"
            :class="index === page ? 'moj-pagination__item--active' : ''"
          >
            <template v-if="index === page">
              {{ n }}
            </template>
            <template v-else>
              <a
                class="moj-pagination__link"
                href="#"
                @click="btnItem(n)"
              >
                {{ n }}
              </a>
            </template>
          </li>
        </template>
        <li
          v-if="showNext && showPreviousNext"
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

    <button
      v-if="isLetterPagination(pageItemType)"
      class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-top-2"
      @click="togglePagination"
    >
      {{ pageTypeToggleText }}
    </button>
  </div>
</template>

<script>
import Search from './Search.vue';
import SidePanel from './SidePanel.vue';
import Badge from './Badge.vue';
import CustomForm from './CustomForm.vue';
import LoadingMessage from '../LoadingMessage.vue';
import EmptySearchResults from './EmptySearchResults.vue';
import _has from 'lodash/has';
const ACTIONS = {
  LOAD: 'load',
  RELOAD: 'reload',
  PAGE_SIZE: 'page_size',
  PAGE_NEXT: 'next',
  PAGE_PREVIOUS: 'previous',
  SEARCH: 'search',
  SORT: 'sort',
};
const pageItemTypes = ['number', 'uppercase-letter', 'lowercase-letter'];

export default {
  components: {
    Search,
    SidePanel,
    Badge,
    CustomForm,
    LoadingMessage,
    EmptySearchResults,
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
    pageItemType: {
      type: String,
      required: false,
      default: null,
    },
    total: {
      type: Number,
      required: false,
      default: 0,
    },
    search: {
      type: Array,
      required: false,
      default: () => [],
    },
    searchPlaceholder: {
      type: String,
      required: false,
      default: 'Type at least three letters to show the results.',
    },
    customSearch: {
      type: Object,
      required: false,
      default: () => {},
    },
    searchMap: {
      type: Object,
      required: false,
      default: null,
    },
    localData: {
      type: Boolean,
      required: false,
      default: false,
    },
    sticky: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:selection', 'change', 'emitEvent'],
  data() {
    return {
      currentPageItemType: this.pageItemType,
      currentPageSize: this.pageSize,
      currentLetter: this.getInitCurrentLetter(this.pageItemType),
      loading: !this.localData,
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
      if (this.currentPageSize) {
        state.pageSize = this.currentPageSize;
      }
      const defaultColumn = this.columns.filter(item => item.default);
      if (defaultColumn && defaultColumn.length) {
        state.orderBy = defaultColumn[0].sort;
        state.direction = defaultColumn[0].direction ? defaultColumn[0].direction : 'asc';
      }
      if (this.search.length) {
        state.search = this.search;
      }
      if (this.customSearch && Object.keys(this.customSearch).length) {
        state.customSearch = this.customSearch;
      }
      if (this.searchMap) {
        state.searchMap = '_search';
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
      if (this.isLetterPagination(this.currentPageItemType) && this.currentLetter) {
        state.pageItemType = this.currentPageItemType;
        state.currentLetter = this.currentLetter;
      }
      return state;
    },
    showPaging() {
      return this.currentPageItemType === 'number' ? this.currentPageSize > 0 : true;
    },
    showPageItems() {
      return pageItemTypes.includes(this.currentPageItemType);
    },
    showPreviousNext() {
      return !this.isLetterPagination(this.currentPageItemType);
    },
    pageItems() {
      const items = [];
      if (!this.showPaging || !this.currentPageItemType) return items;

      if (this.currentPageItemType === 'number') {
        const length = Math.ceil(this.total / this.currentPageSize);
        for (let i = 1; i <= length; i++) {
          items.push(i);
        }
      } else if (this.currentPageItemType === 'uppercase-letter') {
        items.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
      } else if (this.currentPageItemType === 'lowercase-letter') {
        items.push(...'abcdefghijklmnopqrstuvwxyz'.split(''));
      }
      return items;
    },
    showNext() {
      if (!this.currentPageSize) return false; // hide `Next` button if page size is 0
      if (this.total) {
        const length = Math.ceil(this.total / this.currentPageSize);
        return this.page < length - 1;
      }
      return this.data.length >= this.currentPageSize;
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
      return this.customSearch && Object.keys(this.customSearch).length;
    },
    hasSearch() {
      return this.search.length || this.hasCustomSearch || this.searchMap;
    },
    searchPlaceholderText() {
      let placeholderText = '';
      if (this.hasCustomSearch) {
        placeholderText = this.customSearch.placeholder;
      }
      if (!placeholderText) {
        placeholderText = this.searchPlaceholder;
      }
      return placeholderText;
    },
    pageTypeToggleText() {
      if (this.isLetterPagination(this.currentPageItemType)) {
        return '1 2 3 4';
      } else {
        return this.pageItemType === 'uppercase-letter' ? 'A B C D' : 'a b c d';
      }
    },
  },
  watch: {
    data: {
      deep: true,  // vue3 upgrade
      handler(val) {
        if (val) {
          this.loading = false;
        }
      },
    },
    pageSize() {
      this.currentPageSize = this.pageSize;
      this.changeTableState(ACTIONS.PAGE_SIZE, this.currentState);
    },
  },
  created() {
    if (this.defaultState.orderBy) {
      this.orderBy = this.defaultState.orderBy;
      this.direction = this.defaultState.direction;
    }
    this.initialiseFilters();
    this.changeTableState(ACTIONS.LOAD, this.currentState);
  },
  methods: {
    initialiseFilters() {
      for (const filter of this.filters) {
        if ('defaultValue' in filter) {
          // Only supports radio currently (others can be supported as and when they're needed)
          if (filter.type === 'radio') {
            this.filterValues[filter.field] = filter.defaultValue;
          }
        }
      }
    },
    isLetterPagination(type) {
      return ['uppercase-letter', 'lowercase-letter'].includes(type);
    },
    getInitCurrentLetter(type) {
      if (type === 'uppercase-letter') {
        return 'A';
      } else if (type === 'lowercase-letter') {
        return 'a';
      } else {
        return null;
      }
    },
    btnPrev() {
      if (this.page > 0) {
        this.page--;
        const state = { ...this.currentState };
        state.pageChange = -1;
        this.changeTableState(ACTIONS.PAGE_PREVIOUS, state);
      }
    },
    btnItem(n) {
      let index = this.currentPageItemType === 'number' ? n : this.charToNumber(n.toLowerCase());
      // index starts from 1 and this.page starts from 0
      index = index - 1;
      if (index === this.page) return;

      const pageChange = index - this.page;
      this.page = index;
      const state = { ...this.currentState };
      state.pageChange = pageChange;
      state.pageItemType = this.currentPageItemType;

      if (this.isLetterPagination(this.currentPageItemType)) {
        this.currentLetter = n;
        state.currentLetter = n;
      }

      this.changeTableState(ACTIONS.PAGE_NEXT, state);
    },
    btnNext() {
      if (this.showNext) {
        this.page++;
        const state = { ...this.currentState };
        state.pageChange = 1;
        this.$emit('change', state);
      }
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
      this.changeTableState(ACTIONS.FILTER_CLEAR, this.currentState);
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
        case 'singleCheckbox':
          if (this.filterValues[filter.field]) {
            if (filter.fieldComparator === 'arrayNotEmpty') {
              where.push({
                field: filter.field,
                comparator: '!=',
                value: [],
              });
            }
            else {
              where.push({
                field: filter.field,
                comparator: '==',
                value: true,
              });
            }
            this.numberOfFiltersApplied += 1;
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
        case 'radio':
          if (this.filterValues[filter.field]) {
            const value = this.filterValues[filter.field];
            // Ensure if empty option is selected the 'where' clause is skipped
            if (!('emptyOption' in filter) || value !== filter.emptyOption) {
              where.push({
                field: filter.field,
                comparator: '==',
                value: value.toLowerCase(),
              });
              this.numberOfFiltersApplied += 1;
            }
          }
          break;
        }
      });
      this.where = where;
      this.changeTableState(ACTIONS.FILTER, this.currentState);
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
        this.changeTableState(ACTIONS.SORT, this.currentState);
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
      // If search is used then use numbered pagination
      if (this.searchTerm.length >= 3) {
        this.currentPageItemType = null;
      }
      else {
        // Revert to original value
        this.currentPageItemType = this.pageItemType;
      }
      if (!this.defaultState.searchMap || (this.searchTerm.length === 0 || this.searchTerm.length >= 3)) {
        if (this.currentPageItemType === 'number') {
          this.page = 0; // reset current page to first page when using search function
        }
        this.changeTableState(ACTIONS.SEARCH, this.currentState);
      }
    },
    reload() {
      this.changeTableState(ACTIONS.RELOAD, this.currentState);
    },
    loaded() {
      this.loading = false;
    },
    changeTableState(action, state) {
      console.log(action, state);
      // process action
      switch (action) {
      case ACTIONS.LOAD:
      case ACTIONS.RELOAD:
      case ACTIONS.PAGE_SIZE:
      case ACTIONS.PAGE_NEXT:
      case ACTIONS.PAGE_PREVIOUS:
      case ACTIONS.SEARCH:
      case ACTIONS.FILTER:
      case ACTIONS.SORT:
        if (!this.localData) {
          this.loading = true;
        }
        break;
      }
      this.$emit('change', state);
    },
    numberToChar(num) {
      // 1 -> a, 2 -> b
      return String.fromCharCode(97 + num - 1).toUpperCase();
    },
    charToNumber(char) {
      // a -> 1, b -> 2
      return char.charCodeAt(0) - 97 + 1;
    },
    clickHeaderColumn(column) {
      // By clicking on a column we can either emit an event or sort (default)
      if (_has(column, 'emitEvent') && _has(column, 'eventParams') && Array.isArray(column.eventParams)) {
        this.$emit(column.emitEvent, ...column.eventParams);
      }
      else {
        this.sortBy(column);
      }
    },
    togglePagination() {
      this.currentPageItemType =  this.isLetterPagination(this.currentPageItemType) ? null : this.pageItemType;
      this.currentPageSize = this.isLetterPagination(this.currentPageItemType) ? 0 : this.pageSize;
      this.currentLetter = this.getInitCurrentLetter(this.currentPageItemType);
      this.page = 0;
      this.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
  @mixin mobile-view {
    @media (max-width: 599px) { @content; }
  }
  .jac-table {
    position: relative;
  }
  .btn-filter {
    width: 130px;
  }
  .loading {  /* to be replaced with something prettier */
    position: absolute;
    z-index: 1;
    background: rgba(255, 255, 255, 0.75);
    padding-left: 50px;
    padding-top: 50px;
    width: 100%;
    height: 100%;
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

  .header-link {
    cursor: pointer;
    color: #005ea5;
  }

  .sticky-headers-table {
    table {
      display: block;
      overflow-x: auto;
      overflow-y: auto;
      scroll-behavior: smooth;
      max-width: 100%;
      max-height: 80vh;
      margin: 0 !important;
      border-spacing: 0;
      table-layout: fixed;
      border-collapse: collapse;
      border-right: 1px solid #f3f2f1;
      border-left: 1px solid #f3f2f1;
    }
    tbody {
      white-space: nowrap;
    }
    th,
    td {
        border: 1px solid #f3f2f1;
        vertical-align: middle;
        white-space: nowrap;
        &.v-top {
          vertical-align: top;
        }
    }
    tr > th:first-child,
    tr > td:first-child {
      position: sticky;
      left: 0;
      background-color: #f3f2f1;
      z-index:1;
    }
    tr:first-child > th {
      position: sticky;
      top: 0;
      background-color:#f3f2f1;
      z-index: 2;
      border: 0;
      padding-left: 20px;
      &.expandable {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    /* Get the JAC-KIT colour from Warren for header-link */
    tr:nth-child(2) > th {
      position: sticky;
      top: 46px;
      /*top: 44.5px;*/
      background-color: #f3f2f1;
      z-index: 2;
    }
    tr:first-child > th:first-child,
    tr:nth-child(2) > th:first-child {
      z-index: 3;
    }
    tr > th:last-child,
    tr > td:last-child {
      padding-right: 10px;
    }
    .table-cell {
      padding: 0 10px;
    }
    .table-cell-application {
      min-width: 160px;
      padding: 10px;
    }
    .table-cell-score {
      min-width: 50px;
      padding: 0 10px;
      text-align: center;
    }
    .elipses {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;  // IE 6+, FF 7+, Op 11+, Saf 1.3+, Chr 1+
      -o-text-overflow: ellipsis;  // for Opera 9 & 10
    }
  }
</style>
