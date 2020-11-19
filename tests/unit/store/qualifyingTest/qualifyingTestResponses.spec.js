import firebase from '@firebase/app';
import * as authUsers from '@/helpers/authUsers';
import qualifyingTestResponses from '@/store/qualifyingTest/qualifyingTestResponses';
import { mockScenarioResponses, mockScenarioQualifyingTest, mockScenarioQualifyingTestResponse } from '../../storeMocks';

const mockContext = {
  dispatch: jest.fn(),
};

jest.spyOn(authUsers,'authorisedToReset').mockImplementation((email) => {
  return email === 'test@test.com';
});

describe('store/qualifyingTestResponses', () => {
  describe('Scenario Test', () => {

    describe('actions', () => {

      describe('moveTest', () => {
        beforeEach(()=>{
          mockContext.dispatch.mockClear();
        });

        it('removes Test Questions', async () => {
          expect(mockScenarioQualifyingTestResponse.testQuestions).toEqual(expect.anything()); // create separate mock for TQuestions and test
          await qualifyingTestResponses.actions.moveTest(mockContext, { qualifyingTest: mockScenarioQualifyingTest, qualifyingTestResponse: mockScenarioQualifyingTestResponse });
          expect(mockContext.dispatch.mock.calls[0][1].data.testQuestions).not.toBe(expect.anything());
        });

        describe('without responses on qtResponse Object', () => {
          beforeEach(()=>{
            mockScenarioQualifyingTestResponse.responses = [];
          });
          it('dispatches empty array', async () => {
            await qualifyingTestResponses.actions.moveTest(mockContext, { qualifyingTest: mockScenarioQualifyingTest, qualifyingTestResponse: mockScenarioQualifyingTestResponse });
            expect(mockContext.dispatch.mock.calls[0][1].data.responses.length).toBe(0);
          });
        });

        describe('with responses on qtResponse Object', () => {
          beforeEach(()=>{
            mockScenarioQualifyingTestResponse.responses = mockScenarioResponses;
          });
          it('dispatches given responses array', async () => {
            await qualifyingTestResponses.actions.moveTest(mockContext, { qualifyingTest: mockScenarioQualifyingTest, qualifyingTestResponse: mockScenarioQualifyingTestResponse });
            expect(mockContext.dispatch.mock.calls[0][1].data.responses).toBe(mockScenarioResponses);
          });
        });

      });

      describe('canReset', () => {
        beforeEach(() => {
          mockContext.dispatch.mockClear();
        });

        it('user is not authorised to reset candidate test', async () => {
          jest.spyOn(firebase,'auth').mockImplementation(() => ({
            currentUser: {
              email: 'user@test.com',
            },
          }));
          mockContext.state = {
            record: {
              id: '1',
              status: 'activated',
              statusLog: {
                completed: '10/28/2020',
                started: '10/29/2020',
              },
            },
          };
          await qualifyingTestResponses.actions.resetTest(mockContext);
          expect(mockContext.dispatch.mock.calls.length).toBe(0);
        });

        it('user is authorised to reset and field isOutOfTime doesn`t exist', async () => {
          jest.spyOn(firebase,'auth').mockImplementation(() => ({
            currentUser: {
              email: 'test@test.com',
            },
          }));
          mockContext.state = {
            record: {
              id: '1',
              status: 'activated',
              statusLog: {
                completed: '10/28/2020',
                started: '10/29/2020',
              },
            },
          };
          await qualifyingTestResponses.actions.resetTest(mockContext);
          const updateCall = mockContext.dispatch.mock.calls[0];
          expect(updateCall[0]).toBe('update');
          const updateCallData = updateCall[1];
          expect(updateCallData.id).toBe('1');
          expect(updateCallData.data.status).toBe('activated');
          expect(updateCallData.data['statusLog.started']).toBeNull();
          expect(updateCallData.data['statusLog.completed']).toBeNull();
          expect(updateCallData.data.isOutOfTime).toBeUndefined();
        });

        it('isOutOfTime field is updated if exists and equals to true', async () => {
          jest.spyOn(firebase,'auth').mockImplementation(() => ({
            currentUser: {
              email: 'test@test.com',
            },
          }));
          mockContext.state = {
            record: {
              id: '1',
              status: 'activated',
              isOutOfTime: true,
              statusLog: {
                completed: '10/28/2020',
                started: '10/29/2020',
              },
            },
          };
          await qualifyingTestResponses.actions.resetTest(mockContext);
          const updateCall = mockContext.dispatch.mock.calls[0];
          expect(updateCall[0]).toBe('update');
          const updateCallData = updateCall[1];
          expect(updateCallData.id).toBe('1');
          expect(updateCallData.data.status).toBe('activated');
          expect(updateCallData.data.isOutOfTime).toBe(false);
          expect(updateCallData.data['statusLog.started']).toBeNull();
          expect(updateCallData.data['statusLog.completed']).toBeNull();
        });

        it('isOutOfTime field is not updated if exists and equals to false', async () => {
          jest.spyOn(firebase,'auth').mockImplementation(() => ({
            currentUser: {
              email: 'test@test.com',
            },
          }));
          mockContext.state = {
            record: {
              id: '1',
              status: 'activated',
              isOutOfTime: false,
              statusLog: {
                completed: '10/28/2020',
                started: '10/29/2020',
              },
            },
          };
          await qualifyingTestResponses.actions.resetTest(mockContext);
          const updateCall = mockContext.dispatch.mock.calls[0];
          expect(updateCall[0]).toBe('update');
          const updateCallData = updateCall[1];
          expect(updateCallData.id).toBe('1');
          expect(updateCallData.data.status).toBe('activated');
          expect(updateCallData.data.isOutOfTime).toBeUndefined();
          expect(updateCallData.data['statusLog.started']).toBeNull();
          expect(updateCallData.data['statusLog.completed']).toBeNull();
        });

      });
    });

  });
});
