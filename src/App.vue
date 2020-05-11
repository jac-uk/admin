<template>
  <div class="govuk-width-container">
    <div class="header-background clearfix">
      <div class="header-title govuk-!-margin-bottom-2">
        <a
          href="https://judicialappointments.gov.uk/"
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
              <a
                :disabled="isVacanciesPage"
                class="govuk-header__link"
                @click="gotoVacancies"
              >
                Vacancies
              </a>
            </li>
            <li class="govuk-header__navigation-item">
              <a
                v-if="isSignedIn"
                class="govuk-header__link"
                @click="signOut"
              >
                Sign out
              </a>
              <a
                v-else
                :disabled="isSignInPage"
                class="govuk-header__link"
                @click="signIn"
              >
                Sign In
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
    <div class="govuk-phase-banner">
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
  computed: {
    isSignInPage() {
      return this.$route.name === 'sign-in';
    },
    isVacanciesPage() {
      return this.$route.name === 'vacancies';
    },
    isSignedIn() {
      return this.$store.getters['auth/isSignedIn'];
    },
    userName() {
      return this.$store.state.auth.currentUser.displayName ? this.$store.state.auth.currentUser.displayName : this.$store.state.auth.currentUser.email;
    },
  },
  methods: {
    signIn() {
      this.$router.push({ name: 'sign-in' });
    },
    signOut() {
      auth().signOut();
      if (this.$route.name != 'vacancies') {
        this.$router.push({ name: 'vacancies' });
      }
    },
    gotoVacancies() {
      this.$router.push({ name: 'vacancies' });
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
  padding-top: 0px;
}
  .govuk-grid-column-one-half {
    width: 100%;
    float: left;
}

.float-right {
    float: right;
}

.govuk-main-wrapper {
	padding-top: 0 !important;
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
