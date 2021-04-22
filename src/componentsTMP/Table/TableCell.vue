<template>
  <td
    class="govuk-table__cell"
    :title="title"
  >
    <slot />
  </td>  
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
  @mixin mobile-view {
    @media (max-width: 599px) { @content; }
  }
  td:before {
    display: none;
  }
  @include mobile-view { 
    td:before {
      font-weight: 999;
      // padding-top: 10px;
      display: grid;
      content: attr(title);
    }
    td:first-child {
      padding-top: 10px;
    }
    td {
      // padding-top: 10px;
      padding-bottom: 10px;
      display: inline-block;
        // background: rgba(18, 209, 252, 0.213); 
      }
  }
</style>
