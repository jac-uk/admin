import Vue from 'vue';

Vue.filter('formatDate', 
(value) => {
  if (value) {
    const objDate = new Date(Date.parse(value));
    return objDate.toLocaleDateString();
  }
});

Vue.filter('lookup', 
(value) => {
  if (value) {
    const lookup = {
      'advocate-scottish-bar': 'Advocate – enrolled with the Scottish bar',
      'barrister': 'Barrister',
      'cilex': 'CILEx fellow (this might be called Fellow ILEX)',
      'solicitor': 'Solicitor',
      'chartered-association-of-building-engineers': 'Chartered Association of Building Engineers',
      'chartered-institute-of-building': 'Chartered Institute of Building',
      'chartered-institute-of-environmental-health': 'Chartered Institute of Environmental Health',
      'general-medical-council': 'General Medical Council',
      'royal-college-of-psychiatrists': 'Royal College of Psychiatrists',
      'royal-institution-of-chartered-surveyors': 'Royal Institution of Chartered Surveyors',
      'royal-institute-of-british-architects': 'Royal Institute of British Architects',
      'legal': 'Legal',
      'non-legal': 'Non legal',
      'senior': 'Senior',
      'leadership': 'Leadership',
      'leadership-non-legal': 'Leadership - non legal',
      'court': 'Court',
      'tribunal': 'Tribunal',
      'salaried': 'Salaried',
      'fee-paid': 'Fee paid',
      'unpaid': 'Unpaid',
      'group-1': 'Group 1 - £262,264',
      'group-1.1': 'Group 1.1 - £234,184',
      'group-2': 'Group 2 - £226,193',
      'group-3': 'Group 3 - £215,094',
      'group-4': 'Group 4 - £188,901',
      'group-5': 'Group 5 - £151,497',
      'group-5+': 'Group 5+ - £160,377',
      'group-6.1': 'Group 6.1 - £140,289',
      'group-6.2': 'Group 6.2 - £132,075',
      'group-7': 'Group 7 - £112,542',
      'group-8': 'Group 8 - £89,428',
      'welsh-language': 'Welsh language',
      'devolution-questions': 'Devolution questions',
      'situational-judgement-qualifying-test': 'Situational judgement qualifying test (QT)',
      'critical-analysis-qualifying-test': 'Critical analysis qualifying test (QT)',
      'scenario-test-qualifying-test': 'Scenario test qualifying test (QT)',
      'name-blind-paper-sift': 'Name blind paper sift',
      'paper-sift': 'Paper sift',
      'telephone-assessment': 'Telephone assessment',
      'self-assessment-with-competencies': 'Self Assessment with competencies',
      'statement-of-suitability-with-competencies': 'Statement of Suitability with competencies',
      'statement-of-suitability-with-skills-and-abilities': 'Statement of Suitability with skills and abilities',
      'statement-of-suitability-with-skills-and-abilities-and-cv': 'Statement of Suitability with skills and abilities and CV',
      'statement-of-eligibility': 'Statement of eligibility',
      'none': 'None',
      // 'xxx': 'xxx',
    };
    return lookup[value] || value;
  }
  return value;
});
