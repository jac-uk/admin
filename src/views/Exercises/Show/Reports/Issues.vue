<template>
  <TabsList
    :tabs="[{title:'Character', ref: 'character'}, {title: 'Eligibility', ref: 'eligibility'}]"
  />
</template>

<script>
import TabsList from '@/components/Page/TabsList';

export default {
  components: {
    TabsList,
  },
};
</script>
