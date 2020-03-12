import applications from '@/store/applications';

describe('store/vacancies', () => {
  const getters = applications.getters;
  let state;

  beforeEach(() => {
    state = {
      records: [],
    };
  });

  describe('getters', () => {
    describe('reasonableAdjustments', () => {
      it('returns a report object', () => {
        const report = getters.reasonableAdjustments(state);

        expect(report).toBeObject();
      });

      describe('with no applications', () => {
        it('totalCount is zero', () => {
          const report = getters.reasonableAdjustments(state);

          expect(report.totalCount).toEqual(0);
        });
        it('list of candidates is empty', () => {
          const report = getters.reasonableAdjustments(state);

          expect(report.candidates).toBeArrayOfSize(0);
        });
      });

      describe('with applications', () => {
        const mockApplications = [
          {
            userId: '123',
            personalDetails: {
              name: 'mock name 1',
              email: 'email1@somewhere.com',
              reasonableAdjustments: false,
            },
          },
          {
            userId: '234',
            personalDetails: {
              name: 'mock name 2',
              email: 'email2@somewhere.com',
              reasonableAdjustments: true,
              reasonableAdjustmentsDetails: 'Indexs sunt quadras de barbatus animalis.',
            },
          },
          {
            userId: '345',
            personalDetails: {
              name: 'mock name 3',
              email: 'email3@somewhere.com',
            },
          },
        ];
        beforeEach(() => {
          state.records = mockApplications;
        });

        it('totalCount counts all applications', () => {
          const report = getters.reasonableAdjustments(state);

          expect(report.totalCount).toEqual(mockApplications.length);
        });

        it('list of candidates includes only those who require adjustments', () => {
          const report = getters.reasonableAdjustments(state);

          report.candidates.forEach((candidate) => {
            expect(candidate.requiresAdjustments).toBeTrue();
          });
        });
      });
    });
  });
});
