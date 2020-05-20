export default {
  namespaced: true,
  state: {
    applicationRecords: [
      {
        id: 'application1',
        candidate: {
          fullName: 'Jimmy Jones',
        },
      },
      {
        id: 'application2',
        candidate: {
          fullName: 'Benny Bojangles',
        },
      },
    ],
  },
  getters: {
    availableStatuses() {
      return [
        { ref: 'passedSift', title: 'Passed Sift' },
        { ref: 'failedSift', title: 'Failed Sift' },
      ];
    },
  },
};
