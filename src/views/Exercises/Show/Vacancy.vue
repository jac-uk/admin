<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-vacancy'}"
      >
        Update vacancy information
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Vacancy information
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Type of exercise
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.typeOfExercise }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is the vacancy for a court or tribunal?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.isCourtOrTribunal }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.appointmentType }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Salary group
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.salaryGrouping }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is salaried part-time working (SPTW) offered?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.isSPTWOffered }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Detail of salaried part-time working (SPTW)
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.yesSalaryDetails }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Number of vacancies
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li>
              {{ exercise.immediateStart }} Immediate start (S87)
            </li>
            <li>
              {{ exercise.futureStart }} Future start (S94)
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Location
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.location }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Jurisdiction
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.jurisdiction }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          About the role
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.aboutTheRole }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Welsh requirement
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.welshRequirement"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Has uploaded Job Description Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a @click="download(exercise.uploadedJobDescriptionTemplate)">{{ exercise.uploadedJobDescriptionTemplate }}</a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Has uploaded Terms and Conditions Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a @click="download(exercise.uploadedTermsAndConditionsTemplate)">{{ exercise.uploadedTermsAndConditionsTemplate }}</a>
        </dd>
      </div>              
    </dl>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    exerciseId() {
      return this.$store.getters['exerciseDocument/id'];
    },
  },
  methods: {
    download(fileName) {
      // Create a reference to the file we want to download
      const fileSavePath = `exercise-${this.exerciseId}/${fileName}`;

      // Get a reference to the storage service, which is used to create references in your storage bucket
      const storage = firebase.storage();

      // Create a storage reference from our storage service
      const storageRef = storage.ref();

      // Create a reference with an initial file path and name
      const fileNameRef = storageRef.child(fileSavePath);

      // Get the download URL
      fileNameRef.getDownloadURL().then((url) => {
        // open url in another window
        window.open(url);
      }).catch((error) => {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
