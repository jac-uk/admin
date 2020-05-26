export default {
    namespaced: true,
    state: {
      applicationRecords: [
        {
          id: 'application1',
          candidate: {
            fullName: 'Timmy Thomas',
          },
        },
        {
          id: 'application2',
          candidate: {
            fullName: 'Janine Joy',
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
