<template>
  <div class="govuk-width-container">
    <div
      style="padding-top: 0px"
      class="govuk-main-wrapper"
    >
      <header class="header">
        <!-- HEADER SECTION -->
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds organisation__margin-bottom">
            <div class="gem-c-organisation-logo brand--ministry-of-justice">
              <img
                src="@/assets/jac-logo.svg"
                alt="Judicial Appointments Commission"
                width="197"
                height="66"
                style="text-align: center"
              >
            </div>
          </div>

          <div class="govuk-grid-column-one-third organisation__margin-bottom">
            <nav
              role="navigation"
              class="gem-c-translation-nav gem-c-translation-nav gem-c-translation-nav--no-margin-top brand--ministry-of-justice"
              aria-label="Translations"
            >
              <ul class="gem-c-translation-nav__list">
                <li class="gem-c-translation-nav__list-item">
                  <span lang="en">English</span>
                </li>
                <li class="gem-c-translation-nav__list-item">
                  <a
                    hreflang="cy"
                    lang="cy"
                    rel="alternate"
                    class="gem-c-translation-nav__link brand__color"
                    href="https://www.judicialappointments.gov.uk/cymraeg"
                  >Cymraeg</a>
                </li>
              </ul>
            </nav>

            <ol class="app-c-topic-list app-c-topic-list--small brand--ministry-of-justice ">
              <li class="app-c-topic-list__item">
                <a
                  class="govuk-link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
                  href="https://www.judicialappointments.gov.uk/business-plan"
                  target="_blank"
                >How do I apply</a>
              </li>
              <li class="app-c-topic-list__item">
                <a
                  class="govuk-link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
                  href="https://www.judicialappointments.gov.uk/jac-official-statistics"
                  target="_blank"
                >How do I qualify</a>
              </li>

              <li class="app-c-topic-list__item">
                <a
                  class="govuk-link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
                  href="https://apply.judicialappointments.digital/vacancies"
                  target="_blank"
                >Judicial vacancies</a>
              </li>
              <li class="app-c-topic-list__item">
                <button
                  v-if="$route.name !== 'sign-in'"
                  class="govuk-button govuk-!-margin-bottom-0"
                  @click="signOut"
                >
                  Sign Out
                </button>
              </li>
              <li
                v-if="isSignedIn"
                class="app-c-topic-list__item"
              >
                <b>You are now signed in as {{ userName }}</b>
              </li>
            </ol>
          </div>
        </div>
        <!-- HEADER SECTION -->
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
  computed: {
    isSignedIn() {
      return this.$store.getters['auth/isSignedIn'];
    },
    userName() {
      return this.$store.state.auth.currentUser.displayName ? this.$store.state.auth.currentUser.displayName : this.$store.state.auth.currentUser.email;
    },
  },
  methods: {
    signOut() {
      auth().signOut();
      this.$router.go('/sign-in');
    },
  },
};
</script>

<style lang="scss">
// @import 'https://assets.publishing.service.gov.uk/static/govuk-template-c0b8ba8b1652aacad298d74f24752260187f538b50c40c2484f7f333cbc3cf2b.css';
@import 'https://assets.publishing.service.gov.uk/static/fonts-e9ec5a5f82e5c2a17927ce356e5a054cb28025ec1547ec5d00f5c98d2ec5e481.css';
@import 'https://assets.publishing.service.gov.uk/static/core-layout-535eb07d05bcae550061481a9cbefad8c4807bf8da32da77312cf8ef2ab616c0.css';
@import 'https://assets.publishing.service.gov.uk/collections/application-1da0069f0ad5c09cfd287444f877560d89793e621ff13c1ababf63cc4eaceb8e.css';
  // Required to include global main.scss styles
  .header {
    background-color: #fafafa;
    padding: 1.25em 0.625em 0 0.625em;
  };

  .govuk-main-wrapper {
    padding-top: 0px;
  }
</style>
