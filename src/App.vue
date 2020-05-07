<template>
  <div class="govuk-width-container">
    <div
      id="header"
      style="padding-top: 0px"
      class="govuk-main-wrapper"
    >
      <header class="header">
        <!-- HEADER SECTION -->
        <div>
          <div>
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds organisation__margin-bottom">
                <div class="gem-c-organisation-logo brand--ministry-of-justice">
                  <a href="https://judicialappointments.gov.uk/">
                    <img
                      src="@/assets/jac-logo.svg"
                      alt="Judicial Appointments Commission"
                      width="197"
                      height="66"
                      style="text-align: center"
                    >
                  </a>
                </div>
              </div>
              <div class="govuk-grid-column-one-third organisation__margin-bottom">
                <button
                  v-if="$route.name !== 'sign-in'"
                  class="govuk-button govuk-!-margin-right-1"
                  @click="signOut"
                >
                  Sign Out
                </button>
                <button
                  style="background-color: #753880;"
                  target="_blank"
                  class="govuk-button"
                  onclick="location.href='https://apply.judicialappointments.digital/vacancies';"
                >
                  Vacancies
                </button>
                <br>
                <span
                  v-if="isSignedIn"
                  class="app-c-topic-list__item nostyle"
                >
                  <b>You are now signed in as {{ userName }}</b>
                </span>
              </div>
            </div>
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

<style type="text/css" rel="stylesheet/scss" lang="scss">
@import "@/styles/main.scss";
</style>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.header {
  background-color: #fafafa;
  padding: 1.25em 0.625em 0 0.625em;
};
.govuk-main-wrapper {
  padding-top: 0px;
}
</style>
