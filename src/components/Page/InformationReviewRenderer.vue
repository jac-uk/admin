<template>
  <div>
    <div
      v-if="data"
      class="govuk-body"
    >
      <div>Yes</div>
      <div
        v-for="( item, index ) in data"
        :key="item.name"
        class="govuk-list"
      >
        {{ index + 1 }}
        <!-- <div
          v-if="item.financialYear"
          class="govuk-!-margin-top-1"
        >
          {{ item.financialYear }}
          <EditableField />
        </div> -->

        <div
          v-if="item.title"
          class="govuk-!-margin-top-1"
        >
          <EditableField
            v-if="authorisedToPerformAction"
            :value="item.title"
            field="Sentence, penalty or fine"
            type="route"
            @changefield="emitChangeUserDetails"
          />
            <!-- :route-to="{ name: 'candidates-view', params: { id: userId } }" -->
          <!-- <EditableField
            :value="title"
            :route-to="{ name: 'candidates-view', params: { id: application.userId } }"
            field="title"
            type="route"
            @changefield="changeUserDetails"
          /> 
          -->
          <div
            v-else
          >
            {{ item.title }}
          </div>
        </div>

        <!-- 
        <div
          v-if="item.date"
          class="govuk-!-margin-top-1"
        >
          {{ displayDate(item.date) }}
        </div>

        <div
          v-if="item.details"
          class="govuk-!-margin-top-1"
        >
          {{ item.details }}
        </div>

        <div
          v-if="item.investigationConclusionDate"
          class="govuk-!-margin-top-1"
        >
          {{ item.investigationConclusionDate | formatDate }}
        </div>
    -->
      </div>
    </div>
    <div
      v-else
      class="govuk-body"
    >
      No
    </div> 
  </div>
</template>

<script>
import firebase from '@firebase/app';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';
import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';
import { authorisedToPerformAction }  from '@/helpers/authUsers';

export default {
  components: {
    EditableField,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
    isDraftApplication: {
      type: Boolean,
      required: false,
      default: false,
    },
    displayMonthYearOnly: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      authorisedToPerformAction: false,
    };
  },
  async created() {
    const email = firebase.auth().currentUser.email;
    this.authorisedToPerformAction = await authorisedToPerformAction(email);
  },
  methods: {
    displayDate(date) {
      return this.displayMonthYearOnly ? formatDate(date, 'month') : formatDate(date);
    },
    emitChangeUserDetails() {
      this.$root.$emit('changeUserDetails');
    },
  },
};
</script>
