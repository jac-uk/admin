<template>
  <Navigation
    :items="items"
    label="Exercise"
  />
</template>

<script>
import { auth } from '@/firebase';
import Navigation from '@/components/Page/Navigation';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: () => ({
    items: [
      { 
        page: 'Overview', 
        name: 'exercise-show-overview',
        children: [
          { page: 'Website listing', name: 'exercise-show-summary' },
          { page: 'Vacancy information', name: 'exercise-show-vacancy' },
          { page: 'Contacts', name: 'exercise-show-contacts' },
          { page: 'Timeline', name: 'exercise-show-timeline' },
          { page: 'Shortlisting', name: 'exercise-show-shortlisting' },
          { page: 'Eligibility information', name: 'exercise-show-eligibility' },
          { page: 'Working preferences', name: 'exercise-show-working-preferences' },
          { page: 'Assessment options', name: 'exercise-show-assessment-options' },
          { page: 'Exercise downloads', name: 'exercise-show-downloads' },
        ],
      }],
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

<style lang="scss">

  .govuk-grid-column-one-half {
    width: 100%;
    float: left;
}
  .header {
    background-color: #fafafa;
    padding: 1.25em 0.625em 0 0.625em;
  };

  .govuk-main-wrapper {
    padding-top: 0px;
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
