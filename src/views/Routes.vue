<template>
    <div>
      <table>
        <tr>
          <th>Path</th>
          <th>Link</th>
          <th>Name</th>
          <th>Redirect</th>
        </tr>
        <tr v-for="route of orderedRoutes" :key="route.path">
          <td>{{ route.path }}</td>
          <td><router-link :to="route.path">{{ route.name }}</router-link></td>
          <td>{{ route.name }}</td>
          <td>{{ route.redirect }}</td>
        </tr>
      </table>
    </div>
</template>
<script>
import _orderBy from 'lodash/orderBy';
export default {
  name: 'Routes',
  computed: {
    routes() {
      return this.$router.getRoutes();
    },
    orderedRoutes() {
      return _orderBy(this.routes, ['path'], ['asc']);
    },
    environment() {
      return this.$store.getters.appEnvironment;
    },
  },
};
</script>
<style scoped>
  table, th, td {
    border: 1px solid;
  }
  th {
    font-weight: 800;
  }
  td, th {
    text-align: left;
    padding: 5px;
  }
</style>
