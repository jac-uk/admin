'use strict';

import firebase from '@firebase/app';
import MessageBase from '@/store/baseClasses/messageBase';

export default class extends MessageBase {
  actions() {
    return {
      ...super.actions(),
      create: async (context, data) => {
        const d = {
          status: 'created',
          type: 'lateApplicationResponse',
          to: data.requestMessage.lateApplicationRequest.replyTo,
          from: {
            name: data.requester.fullName,
            email: data.requester.email,
          },
          lateApplicationResponse: {
            exerciseId: data.requestMessage.lateApplicationRequest.exerciseId,
            exerciseName: data.requestMessage.lateApplicationRequest.exerciseName,
            exerciseRef: data.requestMessage.lateApplicationRequest.exerciseRef,
            reason: data.requestMessage.lateApplicationRequest.reason,
            decision: data.decision,
            decisionAt: firebase.firestore.FieldValue.serverTimestamp(),
            requestMessageId: data.requestMessage.id,
            candidateId: data.requestMessage.lateApplicationRequest.candidateId,
            candidateName: data.requestMessage.lateApplicationRequest.candidateName,
            candidateEmail: data.requestMessage.lateApplicationRequest.candidateEmail,
            url: data.requestMessage.lateApplicationRequest.url,
          },
        };
        if (data.applicationId) {
          d.lateApplicationResponse.applicationId = data.applicationId;
        }
        if (data.rejectionReason) {
          d.lateApplicationResponse.rejectionReason = data.rejectionReason;
        }
        await super.actions().save(context, {
          data: d,
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
