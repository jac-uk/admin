<template>
  <div />
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  computed: {
    requiredStyle () {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
  },

  methods: {
    changeCharacterFlag (obj) {
      this.$emit('changeInfo', obj);
    },
    emptyObject (items) {
      const obj = {};
      if (items.some(item => item === 'title')) {
        obj.title = '';
      }
      if (items.some(item => item === 'date')) {
        obj.date = new Date();
      }
      if (items.some(item => item === 'investigationConclusionDate')) {
        obj.investigationConclusionDate = new Date();
      }
      if (items.some(item => item === 'investigations')) {
        obj.investigations = '';
      }
      if (items.some(item => item === 'details')) {
        obj.details = '';
      }
      return obj;
    },
    addInfo (obj) {
      let changedObj = this.formData[obj.field] || {};

      if (changedObj.length > 0) {
        changedObj = [...changedObj, obj.change];
      } else {
        changedObj = [obj.change];
      }

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);
    },

    changeInfo (obj) {
      let changedObj = this.formData[obj.field] || {};

      changedObj[obj.index][obj.extension] = obj.change;

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);
    },
    removeInfo (obj) {
      let changedObj = this.formData[obj.field] || {};

      if (changedObj.length > 0) {
        changedObj.splice(obj.index, 1);
      } else {
        changedObj = [];
      }

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);
    },
  },
};
</script>
