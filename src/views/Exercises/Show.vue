<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      ref="loadingMessageComponent"
      :load-failed="loadFailed"
    />
    <div v-else>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="text-right govuk-!-margin-0">
            <a
              href="#"
              class="govuk-button govuk-button--secondary govuk-!-margin-0"
            >
              ☆ Add to favourites
            </a>
          </div>
          <span class="govuk-caption-xl">118</span>
          <h1 class="govuk-heading-xl">
            {{ exercise.name }}
          </h1>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter">
          <nav aria-label="Main Navigation">
            <ul class="dwp-vertical-navigation">
              <router-link 
                v-for="navItem in navPages"
                :key="navItem.name"
                :to="{name: navItem.name}"
                tag="li"
              >
                <a 
                  :aria-current="isActive(navItem.name) ? 'page' : false"
                >
                  {{ navItem.page }} 
                </a>
              </router-link>
            </ul>
          </nav>
        </div>
        <div class="govuk-grid-column-three-quarters">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingMessage from '@/components/LoadingMessage';
export default {
  components: {
    LoadingMessage,
  },
  data() {
    const navPages = [
      { page: 'Overview', name: 'exercise-show-overview' },
      { page: 'Applications', name: 'exercise-show-applications' },
      { page: 'Contacts', name: 'exercise-show-contacts' },
      { page: 'Timeline', name: 'exercise-show-timeline' },
      { page: 'Shortlisting', name: 'exercise-show-shortlisting' },
      { page: 'Vacancy information', name: 'exercise-show-vacancy' },
      { page: 'Eligibility information', name: 'exercise-show-eligibility' },
    ];

    return {
      loaded: false,
      loadFailed: false,
      exercise: {},
      navPages,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    
    this.$store.dispatch('exerciseDocument/bind', id)
      .then(() => {
        this.loaded = true;
        this.exercise = this.$store.state.exerciseDocument.record;
      }).catch((e) => {
        this.loadFailed = true;
        throw e;
      });

    // to display overview page
    this.$router.push({ name: 'exercise-show-overview' })
  },
  methods: {
    isActive(name) {
      return name === this.$route.name;
    },
  },
};
</script>
