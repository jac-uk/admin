<template>
  <div>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    {{ activeTab }}
  </div>
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
          ref: 'one',
          title: 'this is tab 1',
        },
        {
          ref: 'two',
          title: 'here is tab 2',
        },
      ],
      activeTab: null,
    };
  },
};
</script>
