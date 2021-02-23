<template>
  <div class="page-container">
    <header class="govuk-width-container">
      <div class="jac-header clearfix">
        <div class="header-title">
          <a
            href="/"
            class="govuk-link govuk-link--no-visited-state govuk-!-font-size-24 govuk-!-font-weight-bold"
          >
            JAC Digital Platform
          </a>

          <nav class="float-right">
            <ul class="govuk-header__navigation user-menu">
              <li class="govuk-header__navigation-item">
                <RouterLink
                  :to="{ name: 'notifications' }"
                  class="govuk-header__link"
                >
                  Notifications
                </RouterLink>
              </li>
              <li class="govuk-header__navigation-item">
                <RouterLink
                  :to="{ name: 'dashboard' }"
                  class="govuk-header__link"
                >
                  Exercises
                </RouterLink>
              </li>
              <li class="govuk-header__navigation-item">
                <RouterLink
                  :to="{ name: 'candidates-list' }"
                  class="govuk-header__link"
                >
                  Candidates
                </RouterLink>
              </li>
              <li class="govuk-header__navigation-item">
                <a
                  v-if="$route.name !== 'sign-in'"
                  href="#"
                  class="govuk-header__link"
                  @click="signOut"
                >
                  Sign out
                </a>
              <!-- <span
                v-if="isSignedIn"
                class="app-c-topic-list__item nostyle"
              >
                <b>You are now signed in as {{ userName }}</b>
              </span> -->
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="govuk-phase-banner govuk-!-margin-bottom-4 print-none">
        <p class="govuk-phase-banner__content">
          <strong class="govuk-tag govuk-phase-banner__content__tag">
            beta
          </strong>
          <span class="govuk-phase-banner__text">
            This is a new service – your
            <a
              class="govuk-link govuk-link--no-visited-state"
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSexm0qgMV0tOQTFP4QUSegOOX89VeYhWwuofV---JZTOEXGIQ/viewform"
            >
              feedback
            </a>
            will help us to improve it.
          </span>
        </p>
      </div>
    </header>

    <main
      id="main-content"
      class="govuk-width-container govuk-main-wrapper govuk-main-wrapper--auto-spacing"
      role="main"
    >
      <RouterView />
    </main>

    <footer
      class="govuk-footer"
      role="contentinfo"
    >
      <div class="govuk-width-container">
        <div class="govuk-footer__meta">
          <!-- <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 class="govuk-visually-hidden">
              Support links
            </h2>
            <svg
              aria-hidden="true"
              focusable="false"
              class="govuk-footer__licence-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 483.2 195.7"
              height="17"
              width="41"
            >
              <path
                fill="currentColor"
                d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
              />
            </svg>
            <span class="govuk-footer__licence-description">All content is available under the <a
              class="govuk-footer__link"
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              rel="license"
            >Open Government Licence v3.0</a>, except where otherwise stated</span>
          </div> -->
        </div>
      </div>
    </footer>
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
  created() {
    if (this.isSignedIn) {
      this.$store.dispatch('services/bind');
    }
  },
  destroyed() {
    if (this.isSignedIn) {
      this.$store.dispatch('services/unbind');
    }
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
$jac-link-colour: #753880;

.page-container {
  position: relative;
  min-height: 100vh;
  padding-bottom: 10vh;
  background: #fff;
}

.jac-header {
  margin-top: 0 !important;
  padding: 20px;

  span {
    color: $jac-link-colour !important;
    font-weight: bold !important;
  }

  h1 a,
  .header-title a,
  .govuk-header__navigation li a {
    color: $jac-link-colour !important;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.govuk-main-wrapper {
  padding-top: 0 !important;
  overflow: hidden;
}

.govuk-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: block;
};

</style>
