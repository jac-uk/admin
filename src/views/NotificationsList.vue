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

      <div
        v-if="hasPermissions([
          PERMISSIONS.notifications.permissions.canUpdateNotifications.value,
          PERMISSIONS.settings.permissions.canUpdateSettings.value
        ])"
      >
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
        <ActionButton
          class="govuk-!-margin-left-4"
          :action="processNow"
        >
          Process now (single batch)
        </ActionButton>
      </div>
    </div>

    <TabsList
      v-model:active-tab="activeTab"
      :tabs="tabs"
    />
    <Table
      v-show="activeTab == 'queue'"
      data-key="id"
      :data="notificationsQueue"
      :page-size="50"
      :columns="tableColumns"
      @change="getQueueData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ $filters.formatDate(row.createdAt, 'datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.template.name }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.email }}
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ row.status }}
        </TableCell>
      </template>
    </Table>

    <p v-if="activeTab === 'queue' && !notificationsQueue.length">
      No notifications in queue
    </p>

    <Table
      v-show="activeTab == 'sent'"
      data-key="id"
      :data="notificationsSent"
      :page-size="50"
      :columns="tableColumns"
      @change="getSentData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ $filters.formatDate(row.createdAt, 'datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ $filters.formatDate(row.sentAt, 'datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.template.name }}
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ row.email }}
          <span v-if="row.email != row.sentTo">({{ row.sentTo }})</span>
        </TableCell>
      </template>
    </Table>

    <div
      v-if="activeTab === 'settings'"
      ref="settings"
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
            v-if="hasPermissions([
              PERMISSIONS.notifications.permissions.canUpdateNotifications.value,
              PERMISSIONS.settings.permissions.canUpdateSettings.value
            ])"
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
import { httpsCallable } from '@firebase/functions';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import permissionMixin from '@/permissionMixin';
import { functions } from '@/firebase';

export default {
  name: 'NotificationsList',
  components: {
    Table,
    TableCell,
    TabsList,
    ErrorSummary,
    TextField,
    Checkbox,
    ActionButton,
  },
  extends: Form,
  mixins: [permissionMixin],
  data() {
    return {
      activeTab: 'queue',
      formData: {
        delayInMinutes: 5,
        defaultMailbox: '',
        sendToRecipient: false,
      },
      tableColumns: [
        { title: 'Created', sort: 'createdAt', direction: 'desc', default: true },
        { title: 'Template' },
        { title: 'To' },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    tabs(){
      return [
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
      ];
    },
    notificationsQueue() {
      return this.$store.state.notifications.queue;
    },
    notificationsSent() {
      return this.$store.state.notifications.sent;
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
    if (this.notificationsSettings) {
      this.formData.delayInMinutes = this.notificationsSettings.delayInMinutes;
      this.formData.defaultMailbox = this.notificationsSettings.defaultMailbox;
      this.formData.sendToRecipient = this.notificationsSettings.sendToRecipient;
    }
  },
  updated() {
    const canUpdateNotifications = this.hasPermissions([this.PERMISSIONS.notifications.permissions.canUpdateNotifications.value]);
    if (!canUpdateNotifications) {
      const settingsRef = this.$refs.settings;
      if (settingsRef) {
        const inputs = settingsRef.querySelectorAll('input');
        inputs && inputs.forEach(input => input.disabled = true);
      }
    }
  },
  methods: {
    startProcessing() {
      this.$store.dispatch('services/notificationsStart');
    },
    stopProcessing() {
      this.$store.dispatch('services/notificationsStop');
    },
    async processNow() {
      try {
        await httpsCallable(functions, 'processNotificationsNow')();
        return true;
      } catch (error) {
        return;
      }
    },
    async save() {
      await this.$store.dispatch('services/saveNotificationsSettings', this.formData);
    },
    getQueueData(params) {
      this.$store.dispatch(
        'notifications/bindQueue',
        params
      );
    },
    getSentData(params) {
      this.$store.dispatch(
        'notifications/bindSent',
        params
      );
    },
  },
};
</script>
