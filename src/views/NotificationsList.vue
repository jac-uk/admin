<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Notifications
      <button 
        v-if="isProcessing"
        class="govuk-button"
        @click="stopProcessing()"
      >
        Stop
      </button>
      <button 
        v-else
        class="govuk-button"
        @click="startProcessing()"
      >
        Start
      </button>
    </h1>
    
    <button 
      class="govuk-button"
      @click="showQueue()"
    >
      Queue
    </button>
    <button 
      class="govuk-button"
      @click="showSent()"
    >
      Sent
    </button>
    
    <table 
      v-if="showingQueue"
      class="govuk-table"
    >
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header"
          >
            Created
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Template
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            To
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="notification in notificationsQueue"
          :key="notification.id"
          class="govuk-table__row"
        >
          <td class="govuk-table__cell">
            {{ notification.createdAt | formatDate('datetime') }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.template.name }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.email }}
          </td>
        </tr>
      </tbody>
    </table>

    <table 
      v-if="showingSent"
      class="govuk-table"
    >
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header"
          >
            Created
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Template
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            To
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="notification in notificationsSent"
          :key="notification.id"
          class="govuk-table__row"
        >
          <td class="govuk-table__cell">
            {{ notification.createdAt | formatDate('datetime') }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.template.name }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      currentView: 'queue',
    };
  },
  computed: {
    notificationsQueue() {
      return this.$store.state.notifications.queue;
    },
    notificationsSent() {
      return this.$store.state.notifications.sent;
    },
    showingQueue() {
      return this.currentView === 'queue';
    },
    showingSent() {
      return this.currentView === 'sent';
    },
    isProcessing() {
      return false;
    },
  },
  created() {
    this.$store.dispatch('notifications/bindQueue');
    this.$store.dispatch('notifications/bindSent');
  },
  methods: {
    showQueue() {
      this.currentView = 'queue';
    },
    showSent() {
      this.currentView = 'sent';
    },
    startProcessing() {
      console.log('start processing');
    },
    stopProcessing() {
      console.log('stop processing');
    },
  },
};
</script>
