
import { lookup } from '@/filters';
import _cloneDeep from 'lodash/cloneDeep';
import { EXERCISE_STAGE } from '@/helpers/constants';

const REPORTS = {
  ApplicationStageDiversity: {
    labels: [
      {
        key: EXERCISE_STAGE.APPLIED,
        title: lookup(EXERCISE_STAGE.APPLIED),
      },
      {
        key: EXERCISE_STAGE.SHORTLISTED,
        title: lookup(EXERCISE_STAGE.SHORTLISTED),
      },
      {
        key: EXERCISE_STAGE.SELECTED,
        title: lookup(EXERCISE_STAGE.SELECTED),
      },
      {
        key: EXERCISE_STAGE.RECOMMENDED,
        title: lookup(EXERCISE_STAGE.RECOMMENDED),
      },
      {
        key: EXERCISE_STAGE.HANDOVER,
        title: lookup(EXERCISE_STAGE.HANDOVER),
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
      attendedUKStateSchool: [
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
  key: 'parentsNotAttendedUniversity',
  title: `${lookup('parentsNotAttendedUniversity')}`,
};

const getReports = (applicationOpenDate, exerciseRef, processingVersion) => {
  const usesPre01042023Questions = ['JAC00130', 'JAC00123', 'JAC00164'].includes(exerciseRef);
  const mergedReports = _cloneDeep(REPORTS);

  if (processingVersion >= 2) {
    mergedReports.ApplicationStageDiversity.labels = REPORTS.ApplicationStageDiversity.labels.map(item => {
      if (item.key === EXERCISE_STAGE.SELECTED) {
        return {
          key: EXERCISE_STAGE.SELECTABLE,
          title: lookup(EXERCISE_STAGE.SELECTABLE),
        };
      }
      return item;
    });
  }

  if (applicationOpenDate > new Date('2023-04-01') && !usesPre01042023Questions) {
    mergedReports.ApplicationStageDiversity.legend.parentsNotAttendedUniversity = [];
    mergedReports.ApplicationStageDiversity.legend.parentsNotAttendedUniversity.push(post04012023SocialMobility);
  }
  else {
    mergedReports.ApplicationStageDiversity.legend.firstGenerationUniversity = [];
    mergedReports.ApplicationStageDiversity.legend.firstGenerationUniversity.push(pre04012023SocialMobility);
  }
  return mergedReports;
};

export {
  getReports
};
