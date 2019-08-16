<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <span class="govuk-caption-xl">003</span>
        <h1 class="govuk-heading-xl">
          Salaried Judge of the Upper Tribunal, Immigration and Asylum Chamber
        </h1>

        <router-link 
          :to="{name: 'number-of-vacancies'}" 
          class="govuk-button"
        >
          Add information about the role
        </router-link>

        <div>
          <a href="role-combined.html">Role combined form</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
};
</script>
