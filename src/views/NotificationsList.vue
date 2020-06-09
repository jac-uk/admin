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
      v-if="activeTab === 'queue' && notificationsQueue.length"
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
          <th
            scope="col"
            class="govuk-table__header"
          >
            Status
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
          <td class="govuk-table__cell">
            {{ notification.status }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="activeTab === 'queue' && !notificationsQueue.length">
      No notifications in queue
    </p>

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
            Sent
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
            {{ notification.sentAt | formatDate('datetime') }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.template.name }}
          </td>
          <td class="govuk-table__cell">
            {{ notification.email }}
            <span v-if="notification.email != notification.sentTo">({{ notification.sentTo }})</span>            
          </td>
        </tr>
      </tbody>
    </table>

    <div 
      v-if="activeTab === 'settings'"
      class="govuk-grid-row"
    >
      <form @submit.prevent="validateAndSave">
        <div class="govuk-grid-column-two-thirds">
          <ErrorSummary 
            :errors="errors" 
          />

          <TextField
            id="default-mailbox"
            v-model="formData.defaultMailbox"
            label="Default mailbox"
            hint="If no other mailbox has been provided the default mailbox will be used"
            type="email"
            required
            :pattern="{ match: /@judicialappointments.(digital|gov.uk)$/, message: 'Please use a JAC email address'}"
          />

          <TextField
            id="delay-in-minutes"
            v-model="formData.delayInMinutes"
            type="number"
            label="Delay in minutes"
            hint="e.g. A delay of 5 minutes will mean there's a 5 minute lag between notifications being created and actually sent. So a 5 minute window to check for problems and stop the send!"
            required
          />

          <Checkbox
            id="send-to-recipient"
            v-model="formData.sendToRecipient"
            label="Send to recipient"
            hint="When this is un-checked, emails will be sent to the provided mailbox (or default mailbox). This allows basic 'safe' testing of emails."
          >
            Yes - send emails to the intended recipient
          </Checkbox>

          <button 
            class="govuk-button"
            :disabled="!hasChanges"
          >
            Save
          </button>
        </div>
      </form>
    </div>      
  </div>  
</template>

<script>
import TabsList from '@/components/Page/TabsList';
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextField from '@/components/Form/TextField';
import Checkbox from '@/components/Form/Checkbox';

export default {
  components: {
    TabsList,
    ErrorSummary,
    TextField,
    Checkbox,
  },
  extends: Form,
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
        {
          ref: 'settings',
          title: 'Settings',
        },
      ],
      activeTab: 'settings',
      formData: {
        delayInMinutes: 5,
        defaultMailbox: '',
        sendToRecipient: false,
      },
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
    notificationsSettings() {
      return this.$store.getters['services/getNotificationSettings'];
    },
    isProcessing() {
      return this.notificationsSettings && this.notificationsSettings.isProcessing;
    },
    hasChanges() {
      return this.notificationsSettings && (
        this.formData.delayInMinutes !== this.notificationsSettings.delayInMinutes ||
        this.formData.defaultMailbox !== this.notificationsSettings.defaultMailbox ||
        this.formData.sendToRecipient !== this.notificationsSettings.sendToRecipient
      );
    },
  },
  created() {
    this.$store.dispatch('notifications/bindQueue');
    this.$store.dispatch('notifications/bindSent');
    if (this.notificationsSettings) {
      this.formData.delayInMinutes = this.notificationsSettings.delayInMinutes;
      this.formData.defaultMailbox = this.notificationsSettings.defaultMailbox;
      this.formData.sendToRecipient = this.notificationsSettings.sendToRecipient;
    }
  },
  methods: {
    startProcessing() {
      this.$store.dispatch('services/notificationsStart');
    },
    stopProcessing() {
      this.$store.dispatch('services/notificationsStop');
    },
    async save() {
      await this.$store.dispatch('services/saveNotificationsSettings', this.formData);
    },
  },
};
</script>
