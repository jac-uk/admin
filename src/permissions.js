const PERMISSIONS = {
  database: {
    label: 'Database',
    permissions: {
      canCreate: {
        label: 'Can create',
        value: 'd1',
      },
      canUpdate: {
        label: 'Can update',
        value: 'd2',
      },
      canDelete: {
        label: 'Can delete',
        value: 'd3',
      },
    },
  },
  users: {
    label: 'Users',
    permissions: {
      canEnableUsers: {
        label: 'Can enable users',
        value: 'u1',
      },
      canChangeUserRole: {
        label: 'Can change user role',
        value: 'u2',
      },
      canEditRolePermissions: {
        label: 'Can edit role permissions',
        value: 'u3',
      },
      canDeleteUsers: {
        label: 'Can delete users',
        value: 'u4',
      },
    },
  },
  exercises: {
    label: 'Exercises',
    permissions: {
      canApproveExercise: {
        label: 'Can approve exercise',
        value: 'e1',
      },
      canAddNotesToExercise: {
        label: 'Can add notes to exercise',
        value: 'e2',
      },
      canResetExercise: {
        label: 'Can reset exercise',
        value: 'e3',
      },
      canAmendAfterLaunch: {
        label: 'Can amend after launch',
        value: 'e4',
      },
      canPublishExercise: {
        label: 'Can publish an exercise as live',
        value: 'e5',
      },
      canDeleteCandidateCharacterInformation: {
        label: 'Can delete candidate character information',
        value: 'e6',
      },
      canDeleteQualifyingTest: {
        label: 'Can delete qualifying test',
        value: 'e7',
      },
    },
  },
  candidates: {
    label: 'Candidates',
    permissions: {
      canViewAllCandidates: {
        label: 'Can view all candidates',
        value: 'c1',
      },
      canAddNotesToCandidates: {
        label: 'Can add notes to candidates',
        value: 'c2',
      },
    },
  },
};

export default PERMISSIONS;
