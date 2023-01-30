
import { lookup } from '@/filters';

const REPORTS = {
  ApplicationStageDiversity: {
    labels: [
      {
        key: 'applied',
        title: 'Applied',
      },
      {
        key: 'shortlisted',
        title: 'Shortlisted',
      },
      {
        key: 'recommended',
        title: 'Recommended',
      },
      {
        key: 'selected',
        title: 'Selected',
      },
      {
        key: 'handover',
        title: 'Handover',
      },
    ],
    legend: {
      gender: [
        {
          key: 'male',
          title: `${lookup('male')}`,
        },
        {
          key: 'female',
          title: `${lookup('female')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'genderNeutral',
          title: `${lookup('genderNeutral')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
      emp: [
        {
          key: 'gender',
          title: `${lookup('gender')}`,
        },
        {
          key: 'ethnicity',
          title: `${lookup('ethnicity')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
        {
          key: 'applied',
          title: `${lookup('applied')}`,
        },
      ],
      ethnicity: [
        {
          key: 'bame',
          title: `${lookup('bame')}`,
        },
        {
          key: 'white',
          title: `${lookup('white')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
      disability: [
        {
          key: 'no',
          title: `${lookup('no')}`,
        },
        {
          key: 'yes',
          title: `${lookup('yes')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
      socialMobility: [
        {
          key: 'attendedUKStateSchool',
          title: `${lookup('attendedUKStateSchool')}`,
        },
        {
          key: 'firstGenerationUniversity',
          title: `${lookup('firstGenerationUniversity')}`,
        },
      ],
      professionalBackground: [
        {
          key: 'solicitor',
          title: `${lookup('solicitor')}`,
        },
        {
          key: 'barrister',
          title: `${lookup('barrister')}`,
        },
        {
          key: 'cilex',
          title: `${lookup('cilex')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
    },
  },
};

export default REPORTS;
