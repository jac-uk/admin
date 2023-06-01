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

+ When trying to get the current route the following no longer works:

```
router.currentRoute.name
```
Instead you should use useRoute() or useRouter() if the code is inside functional components such as setup(). However if it isn't then you can use:
```
router.currentRoute.value.name
```

+ Discarded invalid param(s), see: https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22

Passing params when none are defined on the route causes the app to break. There are multiple ways of fixing this, as per the link above, but one way is as follows. Given the link below which passes a param called 'referrer' which isn't defined on the route: 
```
<router-link
  class="govuk-link"
  :to="{name: 'test', params: { referrer: 'exercise-show-overview' }}"
>
  Test
</router-link>
```
needs to be changed to:
```
<router-link
  class="govuk-link"
  :to="{name: 'test', query: { referrer: 'exercise-show-overview' }}"
>
  Test
</router-link>
```

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
+ Local filters should be removed and replaced with computed props or local methods, see: https://v3-migration.vuejs.org/breaking-changes/filters.html
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

+ Other than at the beginning of the component, avoid using template tags with no special directives, ie:

```
<template v-if="condition">GOOD</template>
```
but...
```
<template>BAD</template>
```
