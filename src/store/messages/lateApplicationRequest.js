'use strict';

import MessageBase from '@/store/baseClasses/messageBase';
import { getSeniorSelectionMgrs } from '@/helpers/exerciseHelper';

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
        await super.actions().save(context, {
          data: {
            status: 'created',
            type: 'lateApplicationRequest',
            to: getSeniorSelectionMgrs(data.exercise),
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
  getters() {
    return {
      ...super.getters(),
      getMessages(state) {
        return state.records.filter(item => {
          return item.type === 'lateApplicationRequest';
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
