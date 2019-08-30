<template>
  <div class="govuk-width-container">
    <div class="govuk-main-wrapper">
      <a
        href="#main-content"
        class="govuk-skip-link"
      >Skip to main content</a>
      <header class="header">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <div class="govuk-heading-l">
              Judicial Appointments Commission
            </div>
          </div>
          <div class="govuk-grid-column-one-third">
            <button
              v-if="$route.name !== 'sign-in'"
              class="govuk-button"
              @click="signOut"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="govuk-phase-banner">
            <p class="govuk-phase-banner__content">
              <strong class="govuk-tag govuk-phase-banner__content__tag">
                alpha
              </strong>
              <span class="govuk-phase-banner__text">
                This is a new service – your feedback will help us improve it.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <main id="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { auth } from '@/firebase';

export default {
  name: 'App',
  data: () => ({
    //
  }),
  methods: {
    signOut() {
      auth().signOut();
      this.$router.go('/sign-in');
    },
  },
};
</script>

<style lang="scss">
  // Required to include global main.scss styles
  .header {
    background-color: #fafafa;
    padding: 1.25em 0.625em 0 0.625em;
  }

  .govuk-main-wrapper {
    padding-top: 0px;
  }
</style>
