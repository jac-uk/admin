import qualifyingTestResponses from '@/store/qualifyingTest/qualifyingTestResponses';
import { mockScenarioResponses, mockScenarioQualifyingTest, mockScenarioQualifyingTestResponse } from '../../storeMocks';

const mockContext = {
  dispatch: jest.fn(),
};

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
    });

  });
});
