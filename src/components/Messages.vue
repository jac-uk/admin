<template>
  <Modal ref="messageModal">
    <!-- <component
      :is="messageComponent"
      @close="closeModal('messageModal')"
    /> -->
    <component
      :is="messageComponent"
      :message="currentMessage"
      @close="closeIfNoMoreMessages"
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

    // @TODO: Once working wont need to pass in the type anymore!

    // type: {
    //   type: String,
    //   required: true,
    // },
    retrieveMsgLimit: {  // If set to zero then retrieve all
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      //messageComponent: null,
      //moduleNamespace: null,
    };
  },
  computed: {
    messageComponent() {
      // this.messageComponent = 'Approval';
      // this.messageComponent = 'ApprovalConfirmation';
      if (this.currentMessage) {
        if (this.currentMessage.type === 'lateApplicationRequest') {
          return 'Approval';
        }
        else if (this.currentMessage.type === 'lateApplicationResponse') {
          return 'ApprovalConfirmation';
        }
      }
      return '';
    },
    // @TODO: May not be needed!!
    // moduleNamespace() {
    //   // this.moduleNamespace = 'lateApplicationRequestMsg';
    //   // this.moduleNamespace = 'lateApplicationResponseMsg';
    //   if (this.currentMessage.type === 'lateApplicationRequest') {
    //     return 'lateApplicationRequestMsg';
    //   }
    //   else if (this.currentMessage.type === 'lateApplicationResponse') {
    //     return 'lateApplicationResponseMsg';
    //   }
    //   return '';
    // },

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
    // if (this.type === 'lateApplicationRequest') {
    //   this.messageComponent = 'Approval';
    //   this.moduleNamespace = 'lateApplicationRequestMsg';
    // }
    // else if (this.type === 'lateApplicationResponse') {
    //   this.messageComponent = 'ApprovalConfirmation';
    //   this.moduleNamespace = 'lateApplicationResponseMsg';

    //   // @TODO: CHANGE BELOW!!

    //   additionalParams.push([
    //     'lateApplicationResponse.decision', '==', 'approved',
    //   ]);
    // }
    // if (this.moduleNamespace) {
    //   await this.getMessages(additionalParams)
    //     .then(
    //       () => {
    //         if (this.hasMessages) {
    //           this.openModal('messageModal');
    //         }
    //       }
    //     );
    // }

    await this.getMessages(additionalParams)
      .then(
        () => {
          if (this.hasMessages) {
            this.openModal('messageModal');
          }
        }
      );
  },

  // @TODO: WANT THIS COMPONENT TO BE RENAMED TO MESSAGES.VUE
  // - IT NEEDS TO LOAD A DIFFERENT COMPONENT AS WE LOOP THROUGH THE MESSAGES!!! - SO messageComponent NEEDS TO CHANGE BASED ON THE
  // CURRENT MESSAGE INSTEAD OF IN CREATED!
  //    - SO NEED MORE OF THE LOGIC IN HERE THAN IN THE CHILD, THE CHILD SHOULD ONLY BE RESPONSIBLE FOR STUFF SPECIFIC TO IT'S TYPE
  //    OF MSG
  //    - EMIT EVENTS TO THIS COMPONENT FROM THE CHILD!!
  //  - Note that to get the message just displaying anytime we wont be able to rely on the 'created' hook in here so google
  // another solution

  // @TODO: ensure child component...
  // - Put the Message component into App.vue
  // - Ensure unique emails in Repsonse mail as well
  // - uses the 'message' passed to it
  // - emits when markAsRead (doesnt need to emit the message id as the parent knows it already from currentMessage!)
  // - comment out any computed props/methods that are no longer used!

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
      //return await this.$store.dispatch(`${this.moduleNamespace}/bind`, data);
      return await this.$store.dispatch('messageBase/bind', data);
    },

    async markMessageAsRead() {
      console.log('!!!!!! Calling markMessageAsRead in Messages !!!!!!!!', this.currentMessageId);
      //return this.$store.dispatch('lateApplicationRequestMsg/markAsRead', this.messageId);
      await this.$store.dispatch('messageBase/markAsRead', this.currentMessageId);
      this.closeIfNoMoreMessages();
    },

    openModal(modalRef){
      if (this.$refs[modalRef]) {
        this.$refs[modalRef].openModal();
      }
    },

    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    //  @close="closeModal('messageModal')"

    async closeIfNoMoreMessages() {
      console.log('closeIfNoMoreMessages?');
      if (this.messages.length === 0) {
        console.log('YES');

        //this.$emit('close');
        this.$refs['messageModal'].closeModal();
      }
      else {

        console.log('NO');

        // @TODO: THIS NEEDS TO BE IN THE CHILD!!

        //this.reset();
      }
    },

  },
};
</script>
