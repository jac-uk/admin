<template>
  <ul class="govuk-list">
    <li
      v-for="(item, itemIndex) in answers"
      :key="itemIndex"
    >
      <div v-if="grouped">
        {{ item.group }}
        <ul>
          <li
            v-for="(answer, answerIndex) in item.answers"
            :key="answerIndex"
          >
            {{ answer.answer }}
          </li>
        </ul>
      </div>
      <template v-else>
        {{ item.answer }}
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ViewAnswers',
  props: {
    answers: {
      required: true,
      type: Array,
    },
    grouped: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
