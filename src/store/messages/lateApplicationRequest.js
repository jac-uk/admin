'use strict';

import MessageBase from '@/store/baseClasses/messageBase';

export default class extends MessageBase {
  actions() {
    return {
      ...super.actions(),
      create: async (context, data) => {
        const toArr = [data.exercise.exerciseMailbox, data.requester.email];
        // Get unique entries in the 'to' array of email addresses
        const uniqueToArr = toArr.filter((item, pos) => {
          return toArr.indexOf(item) === pos;
        });

        // Get email recipients from settings
        const emails = context.rootGetters['services/getEmails']('seniorLeaders');
        if (!emails) {
          throw {
            id: 'error',
            message: 'Error retrieving emails for senior leaders. Please report this to the web team.',
          };
        }
        await super.actions().save(context, {
          data: {
            status: 'created',
            type: 'lateApplicationRequest',
            to: emails,
            from: {
              name: data.requester.fullName,
              email: data.requester.email,
            },
              lateApplicationRequest: {
                exerciseId: data.exerciseId,
                exerciseName: data.exercise.name,
                exerciseRef: data.exercise.referenceNumber,
                exerciseCloseDate: data.exercise.applicationCloseDate,
                replyTo: uniqueToArr,
                reason: data.reason,
                candidateId: data.candidate.id,
                candidateName: data.candidate.fullName,
                candidateEmail: data.candidate.email,
                url: data.url,
              },
          },
          id: null,
        });
      },
      markAsRead: async (context, id) => {
        await super.actions().save(context, {
          data: {
            status: 'read',
          },
          id: id,
        });
      },
    };
  }
  state() {
    return {
      ...super.state(),
    };
  }
}
