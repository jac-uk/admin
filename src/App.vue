<template>
  <div class="govuk-width-container">
    <div
      id="header"
      class="header-background clearfix"
    >
      <div class="header-title govuk-!-margin-bottom-2">
        <a
          href="/"
          class="govuk-link govuk-link--no-visited-state govuk-!-font-size-24 govuk-!-font-weight-bold"
        >
          Internal service name
        </a>
        <nav class="float-right">
          <ul
            id="navigation"
            class="govuk-header__navigation user-menu"
          >
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
        <strong class="govuk-tag govuk-phase-banner__content__tag">beta</strong>
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
    <main
      id="main-content"
      class="govuk-main-wrapper govuk-main-wrapper--auto-spacing"
      role="main"
    >
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
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>

  .header {
    background-color: #fafafa;
    padding: 1.25em 0.625em 0 0.625em;
  };

  .govuk-main-wrapper {
    padding-top: 0 !important;
  }

  .govuk-main-wrapper {
    padding-top: 0px;
  }

  .govuk-grid-column-one-half {
    width: 100%;
    float: left;
  }

  .header-background {
    background-color: #f7f7f7;
    padding: 20px 20px 10px 20px;
    margin-top: 0 !important;
  }

  .header-background h1 a,
  .header-background .header-title a,
  #navigation li a  {
    color: #753880 !important;
    text-decoration: none;
  }

  .header-background h1 a:hover,
  .header-background .header-title a:hover,
  #navigation li a:hover {
    text-decoration: underline;
  }

  .header-background span {
    color: #753880 !important;
  }
  
</style>
