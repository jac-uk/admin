# VUE 3 UPGRADE

## Working With Dependencies

The JAC-KIT codebase is a dependency of this project. It needs to be upgraded at the same time as this project.
In order to make changes to the jac-kit being used by this project it's helpful to do the following:

+ Remove the jac-kit as a dependency in package.json
+ Copy an appropriate branch of the jac-kit/src/packages dir into the src directory at eg /src/jac-kit
+ Change all references to the jac-kit in this project, eg:
    import Modal from '@jac-uk/jac-kit/components/Modal/Modal';

    becomes: 

    import Modal from '@/jac-kit/components/Modal/Modal';
+ Remember that when the vue3 changes you've made to the local jac-kit have been made you'll need to copy them across to a branch in the actual jac-kit project and revert the changes above

## Vue-Router 4 Changes

See: https://router.vuejs.org/guide/migration/

+ Empty paths, see: https://router.vuejs.org/guide/migration/#named-children-routes-with-an-empty-path-no-longer-appends-a-slash

## Vue 3 Changes

+ 'destroyed' lifecycle hook becomes 'unmounted'
+ Using a 'watch' on an array:

```
watch: {
  bookList: {
    handler(val, oldVal) {
      console.log('book list changed')
    },
    deep: true
  },
}
```
See: https://v3-migration.vuejs.org/breaking-changes/watch.html
+ Filters in templates no longer uses the pipe command:
```
{{ application.equalityAndDiversitySurvey.gender | lookup }}
```
becomes:
```
{{ $filters.lookup(application.equalityAndDiversitySurvey.gender) }}
```
+ Filters in code:
```
this.$options.filters.formatDate(this.value, (this.displayMonthYearOnly ? 'month' : ''));
```
becomes:
```
formattedDate() {
  return this.$filters.formatDate(this.value, (this.displayMonthYearOnly ? 'month' : ''));
},
```
+ Use 'emits' to specify any events that are emitted by the component:
```
emits: ['close', 'confirmed'],
```
Where the following are emiited by the component:
```
this.$emit('confirmed');
this.$emit('closed');
```
+ v-model changes, see: https://v3-migration.vuejs.org/breaking-changes/v-model.html
+ For global events use a third party package like mitt, see: https://v3-migration.vuejs.org/breaking-changes/events-api.html
+ 'native' modifier removed, see: https://v3-migration.vuejs.org/breaking-changes/v-on-native-modifier-removed.html
+ vuedraggable has been upgraded and now uses new syntax, see: https://www.npmjs.com/package/vue-draggable-next
+ hypenate actions on components:
```
@changeAction="changeAction"
```
becomes:
```
@change-action="changeAction"
```
