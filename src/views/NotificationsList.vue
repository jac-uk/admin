<template>
  <div
    class="js-enabled"
  >
    <div>
      <h1
        class="govuk-heading-xl govuk-!-margin-bottom-6"
      >
        Notifications
      </h1>

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
    </div>

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    
    <table 
      v-if="activeTab === 'queue'"
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
      v-if="activeTab === 'sent'"
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
import TabsList from '@/components/Page/TabsList';

export default {
  components: {
    TabsList,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'queue',
          title: 'Queue',
        },
        {
          ref: 'sent',
          title: 'Sent',
        },
      ],
      activeTab: 'queue',
      processing: false,
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
      return this.processing;
    },
  },
  created() {
    this.$store.dispatch('notifications/bindQueue');
    this.$store.dispatch('notifications/bindSent');
  },
  methods: {
    showTab(tab) {
      this.currentView = tab;
    },
    startProcessing() {
      this.processing = !this.processing;
      console.log('start processing');
    },
    stopProcessing() {
      this.processing = !this.processing;
      console.log('stop processing');
    },
  },
};
</script>
