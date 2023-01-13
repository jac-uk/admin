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
    messages() {
      // Ensure modal opens when new msgs appear
      if (!this.$refs['messageModal'].modalOpen && this.messages.length) {
        this.$refs['messageModal'].openModal();
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
  methods: {
    async markMessageAsRead(closeIfPenultimate) {
      if (closeIfPenultimate) {
        this.closeIfPenultimateMessage();
      }
      await this.$store.dispatch('messageBase/markAsRead', this.currentMessageId);
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
