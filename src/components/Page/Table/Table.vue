<template>
  <div>
    <Search
      v-if="search.length"
      @search="useSearch"
    />
    <table
      v-if="hasData"
      class="govuk-table"
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
import Search from '@/components/Search';

export default {
  components: {
    Search,
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
  },
  data() {
    return {
      searchTerm: null,
      orderBy: null,
      direction: null,
      page: 0,
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
      return state;
    },
    currentState() {
      const state = { ...this.defaultState };
      if (this.searchTerm) { state.searchTerm = this.searchTerm; }
      if (this.orderBy) { state.orderBy = this.orderBy; }
      if (this.direction) { state.direction = this.direction; }
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
    useSearch(searchTerm) {
      this.searchTerm = searchTerm;
      if (searchTerm) {
        this.orderBy = '';
      } else {
        this.orderBy = this.defaultState.orderBy;
      }
      this.$emit('change', this.currentState);
    },
    reload() {
      this.$emit('change', this.currentState);
    },
  },
};
</script>
