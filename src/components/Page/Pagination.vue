<template>
  <nav
    v-if="lowIndex != highIndex"
    class="moj-pagination"
  >
    <p
      class="govuk-visually-hidden"
      aria-labelledby="pagination-label"
    >
      Pagination navigation
    </p>
    <ul class="moj-pagination__list">
      <li class="moj-pagination__item  moj-pagination__item--prev">
        <a
          class="moj-pagination__link"
          :class="{ 'pointer': !atBeginning, 'disable': atBeginning }"
          @click.prevent="changePage('previous')"
        >Previous<span class="govuk-visually-hidden"> set of pages</span></a>
      </li> 
        
      <li
        v-for="number in range"
        :key="number"
        scope="col"
        class="moj-pagination__item"
        :class="{ 'moj-pagination__item--active disable': number == pageNumber, 'pointer': number!= pageNumber }" 
      >
        <a
          class="moj-pagination__link"
          @click.prevent="changePage(number)"
        >{{ number }}</a>
      </li> 

      <li class="moj-pagination__item  moj-pagination__item--next">
        <a
          class="moj-pagination__link"
          :class="{ 'pointer': !atEnd, 'disable': atEnd}"
          @click.prevent="changePage('next')"
        >Next<span class="govuk-visually-hidden"> set of pages</span></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    lowIndex: {
      type: Number, 
      required: false,
      default: 1, 
    },
    highIndex: {
      type: Number, 
      required: true, 
    },
  },
  data() {
    return {
      pageNumber: this.lowIndex,
    };
  },
  computed: {
    range(){
      var numbers = [];
      for(var i = this.lowIndex; i <= this.highIndex; i++){
        numbers.push(i);
      }
      return numbers;
    },
    atBeginning(){
      return this.pageNumber == this.lowIndex;
    },
    atEnd(){
      return this.pageNumber == this.highIndex;
    },
  },
  methods: {
    changePage(direction){
      // Direction can either be: next, previous, {{jump page number}}
      var newPageNumber = this.pageNumber;

      if(direction == 'next'){
        newPageNumber++;
      } else if (direction == 'previous'){
        newPageNumber--;
      } else if (Number.isInteger(direction)){
        newPageNumber = direction;
      } else {
        throw `Invalid direction: '${direction}'`;
      }

      if (!(newPageNumber < this.lowIndex || newPageNumber > this.highIndex)) {
        this.pageNumber = newPageNumber;
        this.$emit('pageChanged', this.pageNumber);
        return;
      }
      return;
    },
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
.disable {
  pointer-events: none;
  text-decoration: none; 
  cursor: default;
}
</style>
