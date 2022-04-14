const PERMISSIONS = {
  database: {
    label: 'Database',
    permissions: {
      canCreate: {
        label: 'Can create',
        value: 'canCreate',
      },
      canUpdate: {
        label: 'Can update',
        value: 'canUpdate',
      },
      canDelete: {
        label: 'Can delete',
        value: 'canDelete',
      },
    },
  },
  users: {
    label: 'Users',
    permissions: {
      canEnableUsers: {
        label: 'Can enable users',
        value: 'canEnableUsers',
      },
      canChangeUserRole: {
        label: 'Can change user role',
        value: 'canChangeUserRole',
      },
      canEditRolePermissions: {
        label: 'Can edit role permissions',
        value: 'canEditRolePermissions',
      },
    },
  },
  exercises: {
    label: 'Exercises',
    permissions: {
      canApproveExercise: {
        label: 'Can approve exercise',
        value: 'canApproveExercise',
      },
      canAddNotesToExercise: {
        label: 'Can add notes to exercise',
        value: 'canAddNotesToExercise',
      },
      canResetExercise: {
        label: 'Can reset exercise',
        value: 'canResetExercise',
      },
      canAmendAfterLaunch: {
        label: 'Can amend after launch',
        value: 'canAmendAfterLaunch',
      },
    },
  },
  candidates: {
    label: 'Candidates',
    permissions: {
      canViewAllCandidates: {
        label: 'Can view all candidates',
        value: 'canViewAllCandidates',
      },
      canAddNotesToCandidates: {
        label: 'Can add notes to candidates',
        value: 'canAddNotesToCandidates',
      },
    },
  },
};

export default PERMISSIONS;
