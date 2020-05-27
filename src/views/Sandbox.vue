<template>
  <TabsList
    :tabs="[
      {
        name: 'one',
        href: '#one'
      },
      {
        name: 'two',
        href: '#two'
      },
    ]"
  />
</template>
<script>
import TabsList from '@/components/Page/TabsList'; 
export default {
  components: {
    TabsList,
  },
  data() {
    return {
      tabs: [
        {
          name: 'one',
          selected: true,
        },
      ],
    };
  },
};
</script>
