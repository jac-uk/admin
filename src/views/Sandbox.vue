<template>
  <Banner
    :message="'gabe'"
    :status="'success'"
  />
</template>
<script>
import Banner from '@/components/Page/Banner'; 
export default {
  components: {
    Banner,
  },
};
</script>
