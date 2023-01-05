<template>
  <Modal ref="messageModal">
    <component :is="messageComponent" @close="closeModal('messageModal')"></component>
  </Modal>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Approval from '@/components/ModalViews/LateApplication/Approval';
import ApprovalConfirmation from '@/components/ModalViews/LateApplication/ApprovalConfirmation';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'Message',
  components: {
    Modal,
    Approval,
    ApprovalConfirmation,
  },
  mixins: [permissionMixin],
  props: {
    type: {
      type: String,
      required: true,
    },
    retrieveMsgLimit: {  // If set to zero then retrieve all
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      messageComponent: null,
      moduleNamespace: null,
    };
  },
  computed: {
    messages() {
      return this.$store.state[`${this.moduleNamespace}`].records;
    },
    hasMessages() {
      return this.messages.length;
    },
  },
  async created() {
    const additionalParams = [];
    if (this.type === 'lateApplicationRequest') {
      this.messageComponent = 'Approval';
      this.moduleNamespace = 'lateApplicationRequestMsg';
    }
    else if (this.type === 'lateApplicationResponse') {
      this.messageComponent = 'ApprovalConfirmation';
      this.moduleNamespace = 'lateApplicationResponseMsg';
      additionalParams.push([
        'lateApplicationResponse.decision', '==', 'approved',
      ]);
    }
    if (this.moduleNamespace) {
      await this.getMessages(additionalParams)
        .then(
          () => {
            if (this.hasMessages) {
              this.openModal('messageModal');
            }
          }
        );
    }
  },
  methods: {
    async getMessages(additionalParams) {
      const defaultParams = [
        ['type', '==', this.type],
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
      return await this.$store.dispatch(`${this.moduleNamespace}/bind`, data);

    },
    openModal(modalRef){
      if (this.$refs[modalRef]) {
        this.$refs[modalRef].openModal();
      }
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
  },
};
</script>
