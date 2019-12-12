import Vue from 'vue';

Vue.filter('formatDate', 
(value) => {
  if (value) {
    const objDate = new Date(Date.parse(value));
    return objDate.toLocaleDateString();
  }
});
