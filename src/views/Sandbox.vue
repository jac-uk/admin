<template>
  <SearchFilter :terms="terms" />
</template>
<script>
import SearchFilter from '@/components/SearchFilter';

export default {
  components: {
    SearchFilter,
  },
  data(){
    return {
      terms: [
        {
          type: 'checkbox',
          title: 'Status',
          options: ['one', 'two', 'three'],
        },
        {
          type: 'checkbox',
          title: 'Status',
          options: ['one', 'two', 'three'],
        },
        {
          type: 'keyword',
          title: 'keyword',
        },
        {
          type: 'keyword',
          title: 'keyword',
        },
        {
          type: 'dateRange',
          title: 'dateRange',
        },
        {
          type: 'dateRange',
          title: 'dateRange',
        },
      ],
    };
  },
};
</script>
