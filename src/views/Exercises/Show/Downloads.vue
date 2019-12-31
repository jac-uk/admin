<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-downloads'}"
      >
        Update downloads
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Downloads
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Job Description Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a
            id="job-description-template"
            class="govuk-link"
            :class="{'download-visited': documentsDownloaded.jobDescription}"
            href="javascript:void(0)"
            @click.prevent="download(exercise.uploadedJobDescriptionTemplate); documentsDownloaded.jobDescription = true; "
          >
            {{ exercise.uploadedJobDescriptionTemplate }}</a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Terms and Conditions Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a
            id="terms-and-conditions-template"
            class="govuk-link"
            :class="{'download-visited': documentsDownloaded.termsAndConditions}"
            href="javascript:void(0)"
            @click.prevent="download(exercise.uploadedTermsAndConditionsTemplate); documentsDownloaded.jobDescription = true;"
          >{{ exercise.uploadedTermsAndConditionsTemplate }}</a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Independent Assessor Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a
            id="independent-assessor-template"
            class="govuk-link"
            :class="{'download-visited': documentsDownloaded.independentAssessor}"
            href="javascript:void(0)"
            @click="download(exercise.uploadedIndependentAssessorTemplate); documentsDownloaded.independentAssessor = true;"
          >{{ exercise.uploadedIndependentAssessorTemplate }}</a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Candidate Assessment Form Template
        </dt>
        <dd class="govuk-summary-list__value">
          <a
            id="candidate-assessment-form-template"
            class="govuk-link"
            :class="{'download-visited': documentsDownloaded.candidateAssessmentForm}"
            href="javascript:void(0)"
            @click="download(exercise.uploadedCandidateAssessmentFormTemplate); documentsDownloaded.independentAssessor = true; "
          >{{ exercise.uploadedCandidateAssessmentFormTemplate }}</a>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      documentsDownloaded: {
        jobDescription: false,
        termsAndConditions: false,
        independentAssessor: false,
        candidateAssessmentForm: false,
      },
    };
  },
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
    lookVisited(id) {
      var download = document.getElementById(id);
      download.classList.toggle('download-visted');
    },
  },
};
</script>

<style scoped>

.download-visited {
  color: #4c2c92;
}

</style>
