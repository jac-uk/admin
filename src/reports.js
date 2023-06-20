
import { lookup } from '@/filters';
import _cloneDeep from 'lodash/cloneDeep';

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
        key: 'selected',
        title: 'Selected',
      },
      {
        key: 'recommended',
        title: 'Recommended',
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
          key: 'genderNeutral',
          title: `${lookup('genderNeutral')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
      emp: [
        {
          key: 'noAnswer',
          title: `${lookup('empNoAnswer')}`,
        },
        {
          key: 'applied',
          title: `${lookup('applied')}`,
        },
        {
          key: 'ethnicity',
          title: `${lookup('ethnicity')}`,
        },
        {
          key: 'gender',
          title: `${lookup('gender')}`,
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
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
      disability: [
        {
          key: 'yes',
          title: `${lookup('yes')}`,
        },
        {
          key: 'no',
          title: `${lookup('no')}`,
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
      socialMobility: [   // THIS VARIES SO WILL BE APPENDED TO BEFORE BEING RETURNED
        {
          key: 'attendedUKStateSchool',
          title: `${lookup('attendedUKStateSchool')}`,
        },
      ],
      professionalBackground: [
        {
          key: 'barrister',
          title: `${lookup('barrister')}`,
        },
        {
          key: 'cilex',
          title: `${lookup('cilex')}`,
        },
        {
          key: 'solicitor',
          title: `${lookup('solicitor')}`,
        },
        {
          key: 'preferNotToSay',
          title: `${lookup('preferNotToSay')}`,
        },
        {
          key: 'other',
          title: `${lookup('other')}`,
        },
        {
          key: 'noAnswer',
          title: `${lookup('noAnswer')}`,
        },
      ],
    },
  },
};

const pre04012023SocialMobility = {
  key: 'firstGenerationUniversity',
  title: `${lookup('firstGenerationUniversity')}`,
};

const post04012023SocialMobility = {
  key: 'parentsAttendedUniversity',
  title: `${lookup('parentsAttendedUniversity')}`,
};

const getReports = (applicationOpenDate) => {
  const mergedReports = _cloneDeep(REPORTS);
  if (applicationOpenDate > new Date('2023-04-01')) {
    mergedReports.ApplicationStageDiversity.legend.socialMobility.push(post04012023SocialMobility);
  }
  else {
    mergedReports.ApplicationStageDiversity.legend.socialMobility.push(pre04012023SocialMobility);
  }
  return mergedReports;
};

export {
  getReports
};
