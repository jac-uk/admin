export default {
  namespaced: true,
  state: {
    applicationRecords: [
      {
        id: 'Ux8mmRuOxzTs0Rgf9BNP',
        candidate: {
          fullName: 'Sheev Palpatine',
        },
      },
      {
        id: 'Ux8mmRuOxzTs0Rgf9BNQ',
        candidate: {
          fullName: 'Darth Vader',
        },
      },
      {
        id: 'Ux8mmRuOxzTs0Rgf9BNR',
        candidate: {
          fullName: 'Jabba the Hut',
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
