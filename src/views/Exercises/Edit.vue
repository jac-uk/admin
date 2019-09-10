<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      ref="loadingMessageComponent"
      :load-failed="loadFailed"
    />
    <div 
      v-else
    >
      <RouterView />
    </div>
  </div>
</template>

<script>
import LoadingMessage from '@/components/LoadingMessage';
export default {
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    
    this.$store.dispatch('exerciseDocument/bind', id)
      .then(() => {
        this.loaded = true;
      }).catch(() => {
        this.loadFailed = true;
      });
  },
};
</script>
