import Vue from 'vue';

Vue.filter('formatDate',
(value, type) => {
  if (value) {
    const objDate = new Date(Date.parse(value));
    switch (type) {
    case 'month':
      return `${objDate.toLocaleString('default', { month: 'long' })} ${objDate.getUTCFullYear()}`;
    default:
      return objDate.toLocaleDateString();
    }
  }
});

Vue.filter('formatNumber',
(value, decimalPlaces) => {
  if (value) {
    if (decimalPlaces > 0) {
      return Number(value).toFixed(decimalPlaces);
    } else {
      return parseInt(value);
    }  
  }
  return value;
});

Vue.filter('toHumanCase',
(value) => {
  if (value) {
    return value.replace(/([A-Z0-9])/g, ' $1');
  }
});

Vue.filter('toYesNo',
(value) => {
  return value ? 'Yes' : 'No';
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
      'self-assessment-with-competencies-and-cv': 'Self Assessment with competencies and CV',
      'statement-of-suitability-with-competencies': 'Statement of Suitability with competencies',
      'statement-of-suitability-with-skills-and-abilities': 'Statement of Suitability with skills and abilities',
      'statement-of-suitability-with-skills-and-abilities-and-cv': 'Statement of Suitability with skills and abilities and CV',
      'statement-of-eligibility': 'Statement of eligibility',
      'read': 'Read',
      'write': 'Write',
      'both': 'Both',
      'none': 'None',
      'lord-chancellor': 'Lord Chancellor',
      'lord-chief-justice': 'Lord Chief Justice',
      'senior-president-of-tribunals': 'Senior President of Tribunals (SPT)',
      'scottish-ministers': 'Scottish ministers',
      'welsh-government': 'Welsh Government',
      'crime': 'Crime',
      'civil': 'Civil',
      'family': 'Family',
      'general-regulatory-chamber': 'General Regulatory Chamber',
      'health-education-and-social-care-chamber': 'Health, Education and Social Care Chamber',
      'immigration-and-asylum-chamber': 'Immigration and Asylum Chamber',
      'property-chamber': 'Property Chamber',
      'social-entitlement-chamber': 'Social Entitlement Chamber',
      'tax-chamber': 'Tax Chamber',
      'war-pension-and-armed-forces-compensation-chamber': 'War Pension and Armed Forces Compensation Chamber',
      'administrative-appeals-chamber': 'Administrative Appeals Chamber',
      'second-tier-immigration-and-asylum-chamber': 'Immigration and Asylum Chamber (second-tier)',
      'lands-chamber': 'Lands Chamber',
      'tax-and-chancery': 'Tax and Chancery',
      'employment-tribunal': 'Employment Tribunal',
      'employment-appeals-tribunal': 'Employment Appeals Tribunal',
      'welsh-speaking': 'Speak Welsh',
      'welsh-reading-writing': 'Read and/or write Welsh',
      'welsh-administration-questions': 'Welsh administration questions',
      'single-choice': 'Single choice',
      'multiple-choice': 'Multiple choice',
      'ranked-choice': 'Ranked choice',
      's9-1': 's9(1)',
      's9-4': 's9(4)',
      'schedule-2d': 'Schedule 2(d)',
      'schedule-23': 'Schedule 2(3)',
      'draft': 'Draft',
      'ready': 'Ready for approval',
      'approved': 'Approved',
      'pre-launch': 'Pre launch',
      'open': 'Open',
      'closed': 'Closed',
      'applied': 'Applied',
      // 'xxx': 'xxx',
    };
    return lookup[value] || value;
  }
  return value;
});
