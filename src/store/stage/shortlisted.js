export default {
    namespaced: true,
    state: {
      applicationRecords: [
        {
          id: 'Ux8mmRuOxzTs0Rgf9BNP',
          candidate: {
            fullName: 'Jamie Bones',
          },
        },
      ],
    },
    getters: {
      availableStatuses() {
        return [
          { ref: 'passedSelection', title: 'Passed Selection' },
          { ref: 'failedSelection', title: 'Failed Selection' },
          { ref: 'passedButNotRecommended', title: 'Passed but not recommended' },
        ];
      },
    },
  };
