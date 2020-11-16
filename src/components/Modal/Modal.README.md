example usage:
<template>
  <div>
    <button 
      @click="openModal"
    >
      openModal
    </button>

    <Modal 
      ref="modalRef"
    >
      <component 
        :is="`UploadAssessment`" 
        v-bind="uploadAsssessmentProps" 
        @close="closeModal"
      />
    </Modal>
  </div>
</template>
<script>
import Modal from '@/components/Page/Modal';
import { auth } from '@/firebase';

export default {
  name: 'App',
  components: {
    Modal,
  },
  methods: {
    openModal(){
      this.$refs.modalRef.openModal();
    };
    closeModal() {
      this.$refs.modalRef.closeModal();
    },
  },
}
</script>

#Props

  #methods
  openModal:
    To trigger the modal.
    Component is self contained so the suggested use is as in example at top of page.
    Also adds an overflow block to the document body, which stops scrolling, and shows the modalMask layer which prevents clicking page objects.
  closeModal:
    To close or cancel the modal, removes above blocking elements and styling, emits a 'closed' event which can be listen in parent to trigger behaviour following a modal being dismissed/declined.
    Linked to the _optional_ secondary button togglable with the _cancelable_ prop.

