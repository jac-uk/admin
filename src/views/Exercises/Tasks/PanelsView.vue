<template>
  <div class="panels-packs">
    <div id="panel-pack-div">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <span class="govuk-caption-l">Panel</span>
          <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
            {{ panel.name }}
          </h1>
        </div>
        <div class="govuk-grid-column-one-half text-right print-none">
          <div class="moj-button-menu">
            <button
              ref="dropDownRef"
              class="govuk-button moj-button-menu__toggle-button govuk-button--secondary moj-button-menu__toggle-button--secondary"
              type="button"
              aria-haspopup="true"
              :aria-expanded="dropDownExpanded.toString()"
              @click="toggleExpand"
            >
              Actions
            </button>
            <div
              class="moj-button-menu__wrapper moj-button-menu__wrapper--right"
              role="menu"
            >
              <button
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Download As PDF
              </button>
              <button
                id="docDownloadButton"
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Download As Doc
              </button>
              <button
                id="clipboard-button"
                class="govuk-button govuk-button--secondary drop-down-button"
                @click="nothing"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
          <!--  -->
          <span
            v-if="activeTab == 'full'"
            class=" govuk-!-margin-left-4"
          >
            <button
              v-if="nothing"
              class="govuk-button btn-unlock"
              @click="nothing"
            >
              Unlock
            </button>
            <button
              v-else
              class="govuk-button btn-mark-as-applied"
              @click="submitApplication"
            >
              Mark as applied
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'full',
      dropDownExpanded: false,
    };
  },
  computed: {
    isSift() {
      const route = this.$route.fullPath.includes('/tasks/sift/');
      return route;
    },
    isSelectionDay() {
      const route = this.$route.fullPath.includes('/tasks/selection-days/');
      return route;
    },
    type() {
      let returnType = '';
      if (this.isSift) {
        returnType = 'sift';
      }
      if (this.isSelectionDay) {
        returnType = 'selection-days';
      }
      return returnType;
    },
    panel(){
      let panel = this.$store.getters['panels/getPanel'](this.panelId);
      if (panel.length == 1) {
        panel = panel[0];
      }
      // eslint-disable-next-line no-console
      console.log('panel', panel);
      return panel;
    },
    panelId() {
      return this.$route.params.panelId;
    },
  },
  created() {
    // Redirect if page Reload
    if (this.panel && this.panel.length === 0) {
      this.$router.push({ 
        name: `exercise-tasks-${this.type}`,
      });
    }
  },
  methods: {
    toggleExpand(){
      this.dropDownExpanded = !this.dropDownExpanded;
    },
    nothing() {
      return true;
    },
  },
};
</script>
