const ROLES = {
  CHAIR: 'chair',
  INDEPENDENT: 'independent',
  JUDICIAL: 'judicial',
  OTHER: 'other',
};

const PANEL_TYPES = {
  SIFT: 'sift',
  SELECTION: 'selectionDay',
  SCENARIO: 'scenarioTest',
};

const PANEL_STATUS = {
  // TODO include all statuses
  DRAFT: 'draft',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  CREATED: 'created',
  SUBMITTED: 'submitted',
};

export {
  ROLES,
  PANEL_TYPES,
  PANEL_STATUS
};
