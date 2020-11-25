<template>
  <div>
    <div>
      <FilterButton 
        :num-of-filters="numOfFilters"
        :show-tab="showTab"
        @toggle-tab="toggleTab"
      />
    </div>

    <transition name="slide">
      <div
        v-if="showTab"
        class="container govuk-grid-column-one-half govuk-grid-column-one-third-from-desktop"
      >
        <div class="header-div">
          <h1 style="display:inline-block;">
            Filters
          </h1>
          <a
            v-if="anySelected"
            class="float-right clear-all"
            href=""
            @click.prevent="clearAll"
          >
            Clear all
          </a>
          <hr>
        </div>
        <div class="content">
          <div class="scrollable">
            <div 
              v-for="(term, index) in terms"
              :key="term.title"
            >
              <div v-if="term.type==='checkbox'">
                <CheckboxGroup
                  :id="`filter-${term.title}-${index}`"
                  v-model="selected[`${term.title}`]"
                  :label="term.title"
                  hint="Select all that apply."
                >
                  <CheckboxItem
                    v-for="(option, i) in term.options"
                    :key="i"
                    :value="option"
                    :label="option"
                  />
                </CheckboxGroup>
              </div>
              <div v-if="term.type==='keyword'">
                <legend
                  class="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-margin-bottom-2"
                >
                  {{ term.title }}
                </legend>
                <TextField
                  :id="`keyword-${term.title}-${index}`"
                  v-model="selected[`${term.title}`]"
                />
              </div>
              <div v-if="term.type==='dateRange'">
                <DateInput
                  :id="`${term.title}-${index}-from`"
                  v-model="selected[`${term.title}-from`]"
                  :label="`${term.title} from`"
                />
                <DateInput
                  :id="`${term.title}-${index}-to`"
                  v-model="selected[`${term.title}-to`]"
                  :label="`${term.title} to`"
                />
              </div>
            </div>
          </div>
        </div> 
        <div class="footer-div">
          <hr>
          <button
            class="govuk-button govuk-!-margin-2 govuk-button--secondary"
            :disabled="!anySelected"
          >
            Apply
          </button>
          <button
            class="govuk-button govuk-!-margin-2 govuk-button--secondary"
            @click.prevent="clearAll"
            @click="toggleTab"
          >
            Cancel
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import TextField from '@/components/Form/TextField';
import DateInput from '@/components/Form/DateInput';
import FilterButton from '@/components/Filter/FilterButton';

export default {
  components: {
    CheckboxGroup,
    CheckboxItem,
    TextField,
    DateInput,
    FilterButton,
  },
  props: {
    terms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showTab: false,
      selected: {},
    };
  },
  computed: {
    anySelected() {
      let result = false;
      for (const [key, value] of Object.entries(this.selected)) {
        if (key){
          if (value.length > 0) {
            result = true;
          }
        }
      }
      return result;
    },
    numOfFilters() {
      let result = 0;
      Object.keys(this.selected).forEach((type) => {
        result += this.selected[type].length;
      });
      return result;
    },
  },
  methods: {
    toggleTab() {
      this.showTab = !this.showTab;
    },
    clearAll() {
      Object.keys(this.selected).forEach((type) => {
        this.selected[type] = [];
      });
    },
  },
};
</script>
<style lang="scss" scoped>

  hr {
    padding: 0;
    margin: 0;
  }

  .container {
    border: 1px solid black;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 11;
    background-color: white;
  }

  .footer-div>button {
    width: 40%;
  }

  .content {
    overflow: auto;
  }

  .scrollable {
    overflow-y: auto;
    max-height: 70vh;
  }

  .header-div {
    margin: 0;
  }

  .footer-div {
    text-align: center;
  }

  .clear-all {
    padding-top: 2em;
  }

  .slide-enter-active, .slide-leave-active {
    transition: transform 0.75s ease-in-out;
  }

  .slide-enter, .slide-leave-to {
    transform: translateX(300%);
  }

</style>
