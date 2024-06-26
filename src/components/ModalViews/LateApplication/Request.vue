<template>
  <div class="late-application">
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Request a Late Application
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <div>
          <div class="govuk-inset-text">
            Check that the user has an account on the system
          </div>
          <ErrorSummary
            :errors="errors"
          />
          <form @submit.prevent="validateAndSave">
            <TextField
              id="late-application-name"
              v-model="formData.fullName"
              label="Candidate Name"
              type="text"
              required
            />
            <TextField
              id="late-application-email"
              v-model="formData.email"
              label="Candidate Email"
              type="email"
              required
            />
            <TextField
              id="late-application-reason"
              v-model="formData.reason"
              label="Reason for allowing a late application"
              type="text"
              required
            />
            <button
              type="button"
              class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              class="govuk-button"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import { checkNested } from '@/helpersTMP/object';
import ExtendedError from '@/errors/extendedError';
export default {
  name: 'LateApplicationRequest',
  components: {
    TextField,
    ErrorSummary,
  },
  extends: Form,
  emits: ['close', 'success'],
  data() {
    return {
      formData: {
        email: '',
        fullName: '',
        reason: '',
        seniorLeadership: '', // @TODO: DO WE NEED THIS (OR SEND TO WHOLE TEAM??) - Warren said send to whole team
      },
      errors: [],
    };
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    candidate() {
      return this.$store.state.candidates.record;
    },
    candidateId() {
      return this.$store.state.candidates.record ? this.$store.state.candidates.record.id : null;
    },
    hasAppliedForExercise() {
      if (this.candidate) {
        return checkNested(this.candidate, 'computed', 'exercisesMap', this.exerciseId);
      }
      return false;
    },
    hasLateApplicationRequest() {
      if (this.candidate && this.exercise._lateApplicationRequests) {
        return this.exercise._lateApplicationRequests.includes(this.candidateId);
      }
      return false;
    },
  },
  unmounted() {
    this.reset();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    openConfirmModal() {
      this.$emit('success');
      this.reset();
    },
    reset() {
      this.formData = {};
      this.errors = [];
      this.$store.commit('candidates/resetRecord');
    },
    async save() {
      try {
        await this.$store.dispatch('candidates/getByEmail', this.formData.email);
        if (!this.candidate) {
          throw {
            id: 'error',
            message: 'A candidate with that email does not exist.',
          };
        }
        else if (this.hasAppliedForExercise) {
          throw new ExtendedError({
            id: 'error',
            message: 'The candidate has already applied for the exercise.',
            routerLink: {
              link: { name: 'exercise-overview', params: { id: this.exerciseId } },
              text: 'Click here to open the exercise',
            },
          });
        }
        else if (this.hasLateApplicationRequest) {
          throw {
            id: 'error',
            message: 'An application request has already been created for this candidate.',
          };
        }
        else {
          const route = this.$router.resolve({
            name: 'exercise-overview',
            params: { id: this.exerciseId },
          });
          const absoluteURL = new URL(route.href, window.location.origin).href;
          await this.$store.dispatch(
            'lateApplicationRequestMsg/create', {
              exerciseId: this.exerciseId,
              exercise: this.exercise,
              requester: {
                fullName: this.$store.getters['auth/getDisplayName'],
                email: this.$store.getters['auth/getEmail'],
              },
              candidate: this.candidate,
              reason: this.formData.reason,
              url: absoluteURL,
            });
          this.openConfirmModal();
        }
      }
      catch (error) {
        console.error(error);
        this.errors.push(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .modal .late-application .govuk-form-group,
  .modal .late-application .govuk-inset-text {
    text-align: left;
  }
  /*
  .late-application .modal__title {
    color: #ffffff;
  }
  */
  .form-row {
    margin-bottom: 1em;
  }
</style>
