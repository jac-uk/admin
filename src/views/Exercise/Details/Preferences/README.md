# Working Preferences

See documentation at https://github.com/jac-uk/documentation/blob/master/docs/architecture/data-models/working-preferences.md


The data model has changed for working preferences.
Rather than migrating data across to the new data model we opted to maintain backwards-compatible code.

The file `Edit.v1.vue` contains the previous code for editing working preferences.

By default all new exercises will use the new data model and `Edit.vue`. Any existing exercises which have working preferences set up using the previous data model will be directed to use `Edit.v1.vue`