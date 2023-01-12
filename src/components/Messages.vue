<template>
  <Modal ref="messageModal">
    <component
      :is="messageComponent"
      :message="currentMessage"
      @close="close"
      @read="markMessageAsRead"
    />
  </Modal>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Approval from '@/components/ModalViews/LateApplication/Approval';
import ApprovalConfirmation from '@/components/ModalViews/LateApplication/ApprovalConfirmation';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'Messages',
  components: {
    Modal,
    Approval,
    ApprovalConfirmation,
  },
  mixins: [permissionMixin],
  props: {
    retrieveMsgLimit: {  // If set to zero then retrieve all
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      messageComponent: '',
    };
  },
  watch: {
    // Need to use a watch below as we want fine control of when the messages modal closes, ie not when the list of messages
    // run out (so we don't use a computed property)
    currentMessage(newMessage) {
      if (newMessage) {
        if (newMessage.type === 'lateApplicationRequest') {
          this.messageComponent = 'Approval';
        }
        else if (newMessage.type === 'lateApplicationResponse') {
          this.messageComponent = 'ApprovalConfirmation';
        }
      }
    },
  },
  computed: {
    messages() {
      return this.$store.state.messageBase.records;
    },
    hasMessages() {
      return this.messages.length > 0;
    },
    currentMessage() {
      return this.hasMessages ? this.messages[0] : null;
    },
    currentMessageId() {
      if (this.hasMessages) {
        return this.currentMessage.id;
      }
      return null;
    },
  },
  async created() {
    const additionalParams = [];
    await this.getMessages(additionalParams)
      .then(
        () => {
          if (this.hasMessages) {
            this.openModal('messageModal');
          }
        }
      );
  },

  // @TODO: ensure child component...
  // *** Could try making currentMessage something which is set in the watch as well so we are in control of when it is unloaded
  // hence dont nec need the penultimate thing!!
  // - Put the Message component into App.vue and try to get a watcher working (else get it working with the onSnapshot listener, if
  // struggling then get help from Warren!!)
  // - Check response messages display ok for the admins, and ensure they see a rejection message as well as the current approval one!
  // - Ensure unique emails in Repsonse mail as well

  methods: {
    async getMessages(additionalParams) {
      // @TODO: Once working should be able to remove the additionalParams
      const defaultParams = [
        //['type', '==', this.type],
        ['to', 'array-contains', this.$store.getters['auth/getEmail']],
        ['status', '==', 'created'],
      ];
      const mergedParams = [...defaultParams, ...additionalParams];
      const data = {
        params: mergedParams,
      };
      if (this.retrieveMsgLimit) {
        data.limit = this.retrieveMsgLimit;
      }
      return await this.$store.dispatch('messageBase/bind', data);
    },
    async markMessageAsRead(closeIfPenultimate) {
      if (closeIfPenultimate) {
        this.closeIfPenultimateMessage();
      }
      await this.$store.dispatch('messageBase/markAsRead', this.currentMessageId);
    },
    openModal(modalRef){
      if (this.$refs[modalRef]) {
        this.$refs[modalRef].openModal();
      }
    },
    closeModal() {
      this.$refs['messageModal'].closeModal();
    },
    closeIfPenultimateMessage() {
      if (this.messages.length === 1) {
        this.closeModal();
      }
    },
    close(closeIfNoMoreMessages) {
      if (closeIfNoMoreMessages && this.messages.length === 0) {
        this.closeModal();
      }
    },
  },
};
</script>
