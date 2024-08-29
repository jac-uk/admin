<template>
  <div
    class="page-container"
    :class="{ 'full-screen': fullScreen }"
    @mouseenter="onMouseOver"
  >
    <header class="govuk-width-container">
      <div class="jac-header clearfix">
        <div class="header-title">
          <a
            href="/"
            class="govuk-link govuk-link--no-visited-state govuk-!-font-size-24 govuk-!-font-weight-bold"
          >
            JAC Digital Platform
          </a>

          <RouterLink
            v-if="hasPermissions([PERMISSIONS.releases.permissions.canReadReleases.value])"
            :to="{ name: 'releases' }"
            class="govuk-body-xs govuk-!-padding-left-2 govuk-!-font-weight-bold"
          >
            {{ $store.getters.appEnvironment }} {{ $store.getters.appVersion }}
          </RouterLink>

          <span
            v-else
            class="govuk-body-xs govuk-!-padding-left-2"
          >{{ $store.getters.appEnvironment }} {{ $store.getters.appVersion }}</span>

          <TabMenu
            v-if="isSignedIn"
            class="float-right print-none"
            :tabs="tabs"
          />
        </div>
        <div class="govuk-phase-banner print-none govuk-width-container" />
      </div>
    </header>

    <main
      id="main-content"
      class="govuk-width-container govuk-main-wrapper govuk-main-wrapper--auto-spacing govuk-!-padding-left-4 govuk-!-padding-right-4"
      role="main"
    >
      <RouterView />
    </main>

    <UserFeedbackLink
      v-show="showFeedbackLink"
      :style="{ 'bottom': linkBottom }"
      @open-feedback-modal="openFeedbackModal()"
    />

    <Modal
      v-if="isSignedIn"
      ref="feedbackModal"
      data-html2canvas-ignore
      class="fixed-width-modal"
    >
      <UserFeedbackModal @close="$refs['feedbackModal'].closeModal()" />
    </Modal>

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

    <div
      v-show="hasClipboardData"
      class="clipboard-actions"
    >
      <div class="govuk-width-container govuk-!-padding-4 content background-blue">
        <a
          class="govuk-link float-right"
          @click.prevent="emptyClipboard"
        >Empty clipboard</a>
        <p class="govuk-heading-m govuk-!-margin-bottom-2">
          Your clipboard has content
        </p>
        <p class="govuk-body govuk-!-margin-bottom-0">
          You have {{ clipboardData.type }} "{{ clipboardData.title }}" from <strong>{{ clipboardData.environment }}</strong> on your clipboard. <br>
          Navigate to the
          <RouterLink
            :to="{ name: 'create-exercise' }"
            class="govuk-link govuk-link--inverse"
          >
            Create Exercise
          </RouterLink>
          page and press the <strong>Create exercise from clipboard</strong> button in order to import it.
        </p>
      </div>
    </div>

    <Messages v-if="canReadMessages" />

    <Modal ref="modalRefDisabled">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Your account has been disabled
      </div>
      <div class="modal__content govuk-!-margin-6">
        <p class="govuk-body">
          Please sign out.
        </p>
        <button
          class="govuk-button"
          @click="signOut"
        >
          Sign out
        </button>
      </div>
    </Modal>

    <Modal ref="modalRefRoleChanged">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Your role has been changed
      </div>
      <div class="modal__content govuk-!-margin-6">
        <p class="govuk-body">
          Please refresh the page.
        </p>
        <button
          class="govuk-button"
          @click="refresh"
        >
          Refresh
        </button>
      </div>
    </Modal>

    <Modal ref="archiveModal">
      <ModalInner
        :title="archiveTitle"
        :message="archiveMessage"
        :button-text="archiveButtonText"
        @close="closeArchiveModal"
        @confirmed="archive"
      />
    </Modal>
  </div>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import { auth } from '@/firebase';
import permissionMixin from '@/permissionMixin';
import Messages from '@/components/Messages.vue';
import UserFeedbackModal from '@/components/ModalViews/UserFeedbackModal.vue';
import _debounce from 'lodash/debounce';
import UserFeedbackLink from '@/components/Feedback/UserFeedbackLink.vue';
import { isApproved, isArchived, isPublished } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import { logEvent } from '@jac-uk/jac-kit/helpers/logEvent';
import TabMenu from '@/components/Navigation/TabMenu1.vue';

export default {
  name: 'App',
  components: {
    Messages,
    UserFeedbackModal,
    UserFeedbackLink,
    Modal,
    ModalInner,
    TabMenu,
  },
  mixins: [permissionMixin],
  data() {
    return {
      authorisedToPerformAction: false,
      rect: null,
      linkBottom: '',
      isMounted: false,
      observer: null,
    };
  },
  computed: {
    isDevelopmentEnvironment() {
      return this.$store.getters.isDevelop;
    },
    environment() {
      return this.$store.getters.appEnvironment;
    },
    isSignedIn() {
      return this.$store.getters['auth/isSignedIn'];
    },
    userName() {
      const currentUser = this.$store.state.auth.currentUser;
      if (!currentUser) {
        return '';
      }
      return currentUser.displayName || currentUser.email || '';
    },
    clipboardData() {
      return this.$store.state.clipboard.data;
    },
    hasClipboardData() {
      return this.$store.state.clipboard.hasData;
    },
    fullScreen() {
      return this.$store.state.ui.fullScreen;
    },
    canReadMessages() {
      return this.hasPermissions([this.PERMISSIONS.messages.permissions.canReadMessages.value]);
    },
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canArchiveExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]);
    },
    currentUser() {
      return this.$store.state.auth.currentUser;
    },
    showFeedbackLink() {
      // Enable when the environment and app are defined (these are used when creating the bug request number)
      return this.isSignedIn && this.isMounted && this.environment && (import.meta.env.PACKAGE_NAME !== undefined && import.meta.env.PACKAGE_NAME !== null);
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    isApproved() {
      return isApproved(this.exercise);
    },
    isArchived() {
      return isArchived(this.exercise);
    },
    isPublished() {
      return isPublished(this.exercise);
    },
    archiveTitle() {
      if (this.isArchived) {
        return 'Unarchive exercise';
      } else {
        return 'Archive exercise';
      }
    },
    archiveMessage() {
      if (this.isArchived) {
        return 'By clicking accept you authorise the exercise to be unarchived';
      } else if (this.isPublished) {
        return 'This exercise is Live on Apply; by clicking accept, you authorise the exercise to be removed from Apply and archived';
      } else {
        return 'By clicking accept you authorise the exercise to be archived';
      }
    },
    archiveButtonText() {
      if (this.isArchived) {
        return 'Accept - unarchive this exercise';
      } else {
        return 'Accept - archive this exercise';
      }
    },
    tabs() {
      const tabs = [];
      if (this.hasPermissions([this.PERMISSIONS.logs.permissions.canReadLogs.value])) {
        tabs.push({
          title: 'Events',
          link: { name: 'events' },
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.notifications.permissions.canReadNotifications.value])) {
        tabs.push({
          title: 'Notifications',
          link: { name: 'notifications' },
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.exercises.permissions.canReadExercises.value])) {
        const exerciseContent = [];
        exerciseContent.push(
          {
            title: 'Live exercises',
            link: () => {
              this.$store.dispatch('exerciseCollection/showAll');
              this.$router.push({ name: 'exercises' });
            },
          },
          {
            title: 'Archived exercises',
            link: () => {
              this.$store.dispatch('exerciseCollection/showArchived');
              this.$router.push({ name: 'exercises' });
            },
          },
          {
            title: 'Programme view',
            link: () => {
              this.$store.dispatch('exerciseCollection/showAll');
              this.$router.push({ name: 'exercises-programme-view' });
            },
          },
          { title: 'Create exercise', link: { name: 'create-exercise' } }
        );
        if (this.canUpdateExercises && this.isApproved) {
          exerciseContent.push(
            {
              title: 'Copy exercise to clipboard',
              link: () => {
                this.copyToClipboard();
              },
            }
          );
        }
        if (this.canArchiveExercises) {
          exerciseContent.push(
            {
              title: this.archiveTitle,
              link: () => {
                this.openArchiveModal();
              },
            }
          );
        }
        exerciseContent.push(
          {
            title: 'My favourites',
            link: () => {
              this.$store.dispatch('exerciseCollection/showFavourites');
              this.$router.push({ name: 'exercises' });
            },
          }
        );
        tabs.push({
          title: 'Exercises',
          content: exerciseContent,
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.candidates.permissions.canReadCandidates.value])) {
        tabs.push({
          title: 'Candidates',
          link: { name: 'candidates-list' },
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.panellists.permissions.canManagePanellists.value])) {
        tabs.push({
          title: 'Panellists',
          link: { name: 'panellists-list' },
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.users.permissions.canReadUsers.value])) {
        tabs.push({
          title: 'Users',
          link: { name: 'users' },
        });
      }
      tabs.push({
        title: this.userName,
        content: [
          { title: 'Sign out', link: () => { this.signOut(); } },
        ],
      });
      return tabs;
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.load();
      }
    },
    currentUser(newValue, oldValue) {
      if (newValue?.role?.isChanged && !oldValue?.role?.isChanged) {
        this.$refs['modalRefRoleChanged'] && this.$refs['modalRefRoleChanged'].openModal();
      } else if (newValue?.disabled) {
        this.$refs['modalRefDisabled'] && this.$refs['modalRefDisabled'].openModal();
      }
    },
  },
  async created() {
    if (this.isSignedIn) {
      this.load();
    }
  },
  mounted() {
    this.handleDebouncedScroll = _debounce(this.calculateLinkPosition, 20);
    window.addEventListener('scroll', this.handleDebouncedScroll);

    // Need to observe changes to the main content div to recalculate the position of the help button
    this.bindObserver();

    this.isMounted = true;
    if (!this.showFeedbackLink) {
      console.log('The user feedback link is not enabled for this environment');
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleDebouncedScroll);
  },
  unmounted() {
    if (this.isSignedIn) {
      this.$store.dispatch('services/unbind');
      this.$store.dispatch('messageBase/unbind');
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    bindObserver() {
      // Select the node that will be observed for mutations
      const targetNode = document.getElementById('main-content');

      // Options for the observer (which mutations to observe)
      const config = { attributes: true, childList: true, subtree: true };

      // Callback function to execute when mutations are observed
      // eslint-disable-next-line no-unused-vars
      const callback = (mutationList, observer) => {
        // eslint-disable-next-line no-unused-vars
        for (const mutation of mutationList) {
          // mutation.type = 'attributes' | 'childList' | 'subtree'
          this.calculateLinkPosition();
        }
      };

      // Create an observer instance linked to the callback function
      this.observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      this.observer.observe(targetNode, config);

    },
    async load() {
      // Leave async calls til the end so dont block the instant calls
      await this.$store.dispatch('services/bind');
      if (this.canReadMessages) {
        await this.getMessages();
      }
    },
    async refresh() {
      if (this.$refs['modalRefSignOut']) {
        this.$refs['modalRefSignOut'].closeModal();
      }
      window.location.href = '/';
    },
    signOut() {
      auth.signOut();
      this.$router.go('/sign-in');
    },
    async onMouseOver() {
      await this.$store.dispatch('clipboard/read');
    },
    async emptyClipboard() {
      await this.$store.dispatch('clipboard/empty');
    },
    async getMessages() {
      const authEmail = this.$store.getters['auth/getEmail'];
      if (authEmail) {
        const params = [
          ['to', 'array-contains', authEmail],
          ['status', '==', 'created'],
        ];
        const data = {
          params: params,
        };
        return await this.$store.dispatch('messageBase/bind', data);
      }
    },
    calculateLinkPosition() {
      // Ensure the feedback link sits above the footer when scrolled to the bottom of the page
      if (this.isMounted) {
        this.linkBottom = (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 70) ? '5em' : '1em';
      }
    },
    async openFeedbackModal() {
      this.$refs.feedbackModal.openModal();
    },
    async copyToClipboard() {
      try {
        const exercise = await this.$store.dispatch('exerciseDocument/getDocumentData', this.exerciseId);
        await this.$store.dispatch('clipboard/write', {
          environment: this.$store.getters.appEnvironment,
          type: 'exercise',
          title: `${exercise.referenceNumber} ${exercise.name}`,
          content: exercise,
        });
        return true;
      } catch (error) {
        return;
      }
    },
    openArchiveModal() {
      this.$refs.archiveModal.openModal();
    },
    closeArchiveModal() {
      this.$refs.archiveModal.closeModal();
    },
    archive() {
      if (this.isArchived) {
        this.$store.dispatch('exerciseDocument/unarchive');
        logEvent('info', 'Exercise unarchived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      }
      else {
        this.$store.dispatch('exerciseDocument/archive');
        logEvent('info', 'Exercise archived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      }
      this.$refs.archiveModal.closeModal();
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

.clipboard-actions {
  position: fixed;
  bottom: 0;
  width: 100%;
  .govuk-link {
    cursor: pointer;
  }
  > .content {
    box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.25);
    margin-bottom: 10px;
  }
}

/* customize nested ordered list (1.1, 1.2) */
.custom-html ol {
  counter-reset: item;
}
.custom-html ol li {
  display: block;
}
.custom-html ol li::before {
  counter-increment: item;
  content: counters(item, '.') '. ';
}

</style>
