import exerciseCreateJourney from '@/store/exercise/createJourney';

describe('store/exercise/createJourney', () => {
  it('is namespaced', () => {
    expect(exerciseCreateJourney.namespaced).toBe(true);
  });

  describe('mutations', () => {
    describe('setJourney', () => {
      let state;
      beforeEach(() => {
        state = {
          journey: [],
          currentPage: 'some-page',
        };
        const journey = ['shortlisting', 'timeline'];
        exerciseCreateJourney.mutations.setJourney(state, journey);
      });

      it('sets `state.journey` to the supplied value', () => {
        expect(state.journey).toEqual(['shortlisting', 'timeline']);
      });

      it('sets `state.currentPage` to `null`', () => {
        expect(state.currentPage).toBeNull();
      });
    });

    describe('setCurrentPage', () => {
      it('sets `state.currentPage` to the supplied value', () => {
        const state = {
          currentPage: null,
        };
        exerciseCreateJourney.mutations.setCurrentPage(state, 'some-page');
        expect(state.currentPage).toEqual('some-page');
      });
    });
  });

  describe('actions', () => {
    let context;
    beforeEach(() => {
      context = {
        commit: jest.fn(),
      };
    });

    describe('start', () => {
      it('calls mutation `setJourney` with the supplied journey array', () => {
        const journey = [
          'timeline',
        ];
        exerciseCreateJourney.actions.start(context, journey);
        expect(context.commit).toHaveBeenCalledWith('setJourney', journey);
      });

      describe('sorts the journey into the expected order', () => {
        /**
         * The expected complete linear journey is:
         *  1. contacts
         *  2. shortlisting
         *  3. timeline
         *  4. vacancy
         *  5. eligibility
         */
        const variations = [
          [
            'a 2 page journey',
            ['timeline', 'shortlisting'],
            ['shortlisting', 'timeline'],
          ],
          [
            'a 3 page journey',
            ['timeline', 'vacancy', 'contacts'],
            ['contacts', 'timeline', 'vacancy'],
          ],
          [
            'a complete journey',
            ['eligibility', 'shortlisting', 'vacancy', 'timeline', 'contacts'],
            ['contacts', 'shortlisting', 'timeline', 'vacancy', 'eligibility'],
          ],
          [
            'a complete journey (already in order)',
            ['contacts', 'shortlisting', 'timeline', 'vacancy', 'eligibility'],
            ['contacts', 'shortlisting', 'timeline', 'vacancy', 'eligibility'],
          ],
          [
            'a 1 page journey',
            ['timeline'],
            ['timeline'],
          ],
          [
            'an empty journey',
            [],
            [],
          ],
        ];

        it.each(variations)('%s is sorted correctly', (label, pages, expectSorted) => {
          exerciseCreateJourney.actions.start(context, pages);
          expect(context.commit.mock.calls[0][1]).toEqual(expectSorted);
        });
      });
    });

    describe('setCurrentRoute', () => {
      it('calls mutation `setCurrentPage` with the journey page name', () => {
        exerciseCreateJourney.actions.setCurrentRoute(context, 'exercise-edit-timeline');
        expect(context.commit).toHaveBeenCalledWith('setCurrentPage', 'timeline');
      });

      it('converts route name to a journey page name by trimming "exercise-edit-" off the beginning', () => {
        const routeName = 'exercise-edit-timeline';
        const pageName = 'timeline';
        exerciseCreateJourney.actions.setCurrentRoute(context, routeName);
        expect(context.commit.mock.calls[0][1]).toBe(pageName);
      });
    });
  });

  describe('getters', () => {
    describe('currentPageIndex', () => {
      const state = {
        journey: ['contacts', 'timeline', 'vacancy'],
      };
      const currentPageIndex = () => (exerciseCreateJourney.getters.currentPageIndex(state));

      it('returns the index of the current page within the journey', () => {
        state.currentPage = 'contacts';
        expect(currentPageIndex()).toBe(0);

        state.currentPage = 'timeline';
        expect(currentPageIndex()).toBe(1);

        state.currentPage = 'vacancy';
        expect(currentPageIndex()).toBe(2);
      });

      it('returns -1 when the current page is null or does not exist in the journey', () => {
        state.currentPage = null;
        expect(currentPageIndex()).toBe(-1);

        state.currentPage = 'eligibility';
        expect(currentPageIndex()).toBe(-1);
      });
    });

    describe('nextPageIndex', () => {
      const state = {
        journey: ['contacts', 'timeline', 'vacancy'],
      };
      const getters = {
        currentPageIndex: -1,
      };
      const nextPageIndex = () => (exerciseCreateJourney.getters.nextPageIndex(state, getters));

      it('returns the index of the next page in the journey', () => {
        getters.currentPageIndex = -1;
        expect(nextPageIndex()).toBe(0);

        getters.currentPageIndex = 0;
        expect(nextPageIndex()).toBe(1);

        getters.currentPageIndex = 1;
        expect(nextPageIndex()).toBe(2);
      });

      it('returns null when the current page is the last in the journey', () => {
        getters.currentPageIndex = 2;
        expect(nextPageIndex()).toBeNull();
      });
    });

    describe('nextPage', () => {
      const state = {
        journey: ['contacts', 'timeline', 'vacancy'],
      };
      const getters = {
        currentPageIndex: 0,
        nextPageIndex: 1,
      };
      const rootState = {};
      const rootGetters = {
        'exerciseDocument/id': null,
      };
      const nextPage = () => (exerciseCreateJourney.getters.nextPage(state, getters, rootState, rootGetters));

      describe('when no document is bound to `exerciseDocument`', () => {
        it('returns null', () => {
          rootGetters['exerciseDocument/id'] = null;
          expect(nextPage()).toBeNull();
        });
      });

      describe('when nextPageIndex is null (we are on the last page of the journey)', () => {
        it('returns the location of the overview page for the current exercise', () => {
          rootGetters['exerciseDocument/id'] = 'abc123';
          getters.nextPageIndex = null;
          expect(nextPage()).toEqual({
            name: 'exercise-show-overview',
            params: { id: 'abc123' },
          });
        });
      });

      describe('when nextPageIndex is not null', () => {
        it('returns the location of the next edit page in the journey for the current exercise', () => {
          rootGetters['exerciseDocument/id'] = 'abc123';
          getters.nextPageIndex = 1;
          expect(nextPage()).toEqual({
            name: 'exercise-edit-timeline',
            params: { id: 'abc123' },
          });
        });
      });
    });
  });
});
