<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Downloads
        </h1>

        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="job-description-file"
          >
            Add/Replace job description template
          </label>
          <input
            id="job-description-file"
            class="govuk-file-upload"
            type="file"
            @change="fileSelected"
          >
        </div>

        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="terms-and-conditions-file"
          >
            Add/Replace terms and conditions template
          </label>
          <input
            id="terms-and-conditions-file"
            class="govuk-file-upload"
            type="file"
            @change="fileSelected"
          >
        </div>
        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="independent-assessor-file"
          >
            Add/Replace independent assessor template
          </label>
          <input
            id="independent-assessor-file"
            class="govuk-file-upload"
            type="file"
            @change="fileSelected"
          >
        </div>
        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="candidate-assesssment-form-file"
          >
            Add/Replace candidate assessment form template
          </label>
          <input
            id="candidate-assessment-form-file"
            class="govuk-file-upload"
            type="file"
            @change="fileSelected"
          >
        </div>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import '@firebase/storage';
import BackLink from '@/components/BackLink';

export default {
  components: {
    BackLink,
  },
  data() {
    const defaults = {
      uploadedJobDescriptionTemplate: null,
      uploadedTermsAndConditionsTemplate: null,
      uploadedIndependentAssessorTemplate: null,
      uploadedCandidateAssessmentFormTemplate: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
      files: {},
    };
  },
  computed: {
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    exerciseId() {
      return this.$store.getters['exerciseDocument/id'];
    },
  },
  methods: {
    async save(isValid) {

      // check for job description file to upload
      if (this.files['job-description-file']) {
        await this.upload(this.files['job-description-file']);
      }

      // check for terms and conditions file to upload
      if (this.files['terms-and-conditions-file']) {
        await this.upload(this.files['terms-and-conditions-file']);
      }

      // check for independent assessor file to upload
      if (this.files['independent-assessor-file']) {
        await this.upload(this.files['independent-assessor-file']);
      }

      // check for candidate assessment form file to upload
      if (this.files['candidate-assessment-form-file']) {
        await this.upload(this.files['candidate-assessment-form-file']);
      }

      this.exercise.progress.downloads = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-downloads'));
    },
    fileSelected(event) {
      //console.log('fileSelected called');
      if (event.target.files.length > 0) {
        //console.log(event.target.files.length);
        const file = event.target.files[0];
        //console.log(file);

        const data = {
          name: file.name,
          file: file,
          type: event.target.id,
        };
        //console.log(data);

        //console.log(`Before this.files[data.type] = ${this.files[data.type]}`);
        this.files[data.type] = data;
        //console.log(`After this.files[data.type] = ${this.files[data.type].name}`);
      }
    },
    upload(item) {
      //console.log('upload function called');
      //console.log(`item.name = ${item.name}`);
      //console.log(`item.type = ${item.type}`);
      //console.log('item = ', item);

      const file = item.file;
      const fileExtension = file.name.split('.')[1];
      //console.log(fileExtension);

      const fileNameMap = new Map([
        ['job-description-file', 'job-description'],
        ['terms-and-conditions-file', 'terms-and-conditions'],
        ['independent-assessor-file', 'independent-assessor'],
        ['candidate-assessment-form-file', 'candidate-assessment-form'],
      ]);

      const fileName = fileNameMap.get(item.type);
      const fileSavePath = `exercise-${this.exerciseId}/${fileName}.${fileExtension}`;
      //console.log(`fileSavePath = ${fileSavePath}`);

      const storageRef = firebase.storage().ref();

      let uploadTask = storageRef.child(fileSavePath).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask
        .on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              //let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              //console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                //console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                //console.log('Upload is running');
                break;
              }
            }, (error) => {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
              }
            }, () => {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                //console.log('File available at', downloadURL);
                const file = item.file;
                const fileExtension = file.name.split('.')[1];

                if (downloadURL.includes('job-description')) {

                  // set job description database values
                  this.exercise.uploadedJobDescriptionTemplate = `job-description.${fileExtension}`;
                } else if (downloadURL.includes('terms-and-conditions')) {

                  // set terms and conditions database values
                  this.exercise.uploadedTermsAndConditionsTemplate = `terms-and-conditions.${fileExtension}`;
                } else if (downloadURL.includes('independent-assessor')) {

                  // set independent assessor database values
                  this.exercise.uploadedIndependentAssessorTemplate = `independent-assessor.${fileExtension}`;
                } else if (downloadURL.includes('candidate-assessment-form')) {

                  // set candidate assessment form database values
                  this.exercise.uploadedCandidateAssessmentFormTemplate = `candidate-assessment-form.${fileExtension}`;
                }

                // don't forget to save
                this.$store.dispatch('exerciseDocument/save', this.exercise);
                //console.log('uploadedJobDescriptionTemplate = ', this.exercise.uploadedJobDescriptionTemplate);
              });
            });
    },
  },
};
</script>
