/**
 * Mock Corrective Actions Data
 *
 * Corrective and preventive actions for tenant admin panel
 */

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  type: 'corrective' | 'preventive' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'pending_review' | 'completed' | 'cancelled';

  // Assignment
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  assignedByName: string;
  assignedDate: string;

  // Timeline
  dueDate: string;
  startedDate?: string;
  completedDate?: string;

  // Details
  rootCause?: string;
  actionPlan: string;
  resources?: string;
  estimatedCost?: number;

  // Progress
  progressPercentage: number;
  updates: {
    date: string;
    author: string;
    authorName: string;
    message: string;
  }[];

  // Related items
  observationId?: string;
  incidentId?: string;
  warningId?: string;

  // Verification
  verificationRequired: boolean;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedDate?: string;
  verificationNotes?: string;

  // Location & Category
  location: string;
  category: 'ppe' | 'equipment' | 'procedure' | 'training' | 'infrastructure' | 'environment' | 'other';

  createdAt: string;
  updatedAt: string;
}

export const MOCK_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: 'ca_001',
    title: 'Install additional fall protection anchor points on Building 3',
    description: 'Multiple observations noted insufficient fall protection anchor points on the 3rd floor of Building 3. Workers are having to move equipment frequently, increasing risk.',
    type: 'corrective',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'emp_013',
    assignedToName: 'Daniel White',
    assignedBy: 'emp_001',
    assignedByName: 'John Smith',
    assignedDate: '2025-10-05',
    dueDate: '2025-10-25',
    startedDate: '2025-10-08',
    rootCause: 'Original design did not account for current work layout. Insufficient anchor points for multiple work teams.',
    actionPlan: '1. Conduct engineering assessment of roof structure\n2. Order and install 12 additional permanent anchor points\n3. Update fall protection plan\n4. Conduct worker training on new anchor point locations',
    resources: 'Structural engineer, Installation crew, Fall protection equipment supplier',
    estimatedCost: 8500,
    progressPercentage: 60,
    updates: [
      {
        date: '2025-10-08',
        author: 'emp_013',
        authorName: 'Daniel White',
        message: 'Engineering assessment completed. Roof structure can support additional anchor points.',
      },
      {
        date: '2025-10-12',
        author: 'emp_013',
        authorName: 'Daniel White',
        message: 'Equipment ordered. Expected delivery: October 18th.',
      },
      {
        date: '2025-10-18',
        author: 'emp_013',
        authorName: 'Daniel White',
        message: 'Equipment received. Installation scheduled for October 22-23.',
      },
    ],
    observationId: 'obs_042',
    verificationRequired: true,
    location: 'Site A - Building 3',
    category: 'equipment',
    createdAt: '2025-10-05T10:00:00Z',
    updatedAt: '2025-10-18T14:30:00Z',
  },
  {
    id: 'ca_002',
    title: 'Implement daily confined space pre-entry checklist',
    description: 'Recent violation highlighted gaps in confined space entry procedures. Need standardized checklist and verification process.',
    type: 'preventive',
    priority: 'critical',
    status: 'completed',
    assignedTo: 'emp_002',
    assignedToName: 'Sarah Johnson',
    assignedBy: 'emp_001',
    assignedByName: 'John Smith',
    assignedDate: '2025-10-06',
    dueDate: '2025-10-13',
    startedDate: '2025-10-06',
    completedDate: '2025-10-12',
    rootCause: 'Lack of standardized checklist led to procedural shortcuts. No verification system in place.',
    actionPlan: '1. Develop comprehensive pre-entry checklist based on OSHA standards\n2. Create digital form in safety management system\n3. Train all affected workers on new procedure\n4. Implement supervisor verification requirement',
    resources: 'Safety team, IT support for digital forms, Training materials',
    estimatedCost: 1200,
    progressPercentage: 100,
    updates: [
      {
        date: '2025-10-06',
        author: 'emp_002',
        authorName: 'Sarah Johnson',
        message: 'Checklist drafted based on OSHA 1926.1200 requirements.',
      },
      {
        date: '2025-10-09',
        author: 'emp_002',
        authorName: 'Sarah Johnson',
        message: 'Digital form created and tested. Training materials prepared.',
      },
      {
        date: '2025-10-11',
        author: 'emp_002',
        authorName: 'Sarah Johnson',
        message: 'Training completed for all Site A workers (15 employees). Site B scheduled for tomorrow.',
      },
      {
        date: '2025-10-12',
        author: 'emp_002',
        authorName: 'Sarah Johnson',
        message: 'All training completed. Checklist now mandatory for all confined space entries.',
      },
    ],
    warningId: 'warn_002',
    verificationRequired: true,
    verifiedBy: 'emp_001',
    verifiedByName: 'John Smith',
    verifiedDate: '2025-10-12',
    verificationNotes: 'Procedure implemented successfully. Will monitor compliance over next 30 days.',
    location: 'All Sites',
    category: 'procedure',
    createdAt: '2025-10-06T09:00:00Z',
    updatedAt: '2025-10-12T16:00:00Z',
  },
  {
    id: 'ca_003',
    title: 'Replace damaged scaffolding components on East Wing',
    description: 'Inspection revealed multiple damaged scaffolding boards and connections that need immediate replacement.',
    type: 'corrective',
    priority: 'high',
    status: 'completed',
    assignedTo: 'emp_019',
    assignedToName: 'Brian Allen',
    assignedBy: 'emp_004',
    assignedByName: 'Emily Davis',
    assignedDate: '2025-09-28',
    dueDate: '2025-10-05',
    startedDate: '2025-09-29',
    completedDate: '2025-10-03',
    rootCause: 'Normal wear and tear. Damaged components were not reported or tagged out promptly.',
    actionPlan: '1. Tag out all damaged scaffolding\n2. Order replacement boards and connections\n3. Replace damaged components\n4. Conduct full scaffold inspection\n5. Retrain workers on damage reporting procedures',
    resources: 'Maintenance crew, Scaffolding supplier',
    estimatedCost: 3200,
    progressPercentage: 100,
    updates: [
      {
        date: '2025-09-29',
        author: 'emp_019',
        authorName: 'Brian Allen',
        message: 'All damaged sections tagged out. Work halted in affected areas.',
      },
      {
        date: '2025-10-01',
        author: 'emp_019',
        authorName: 'Brian Allen',
        message: 'Replacement components arrived. Beginning installation.',
      },
      {
        date: '2025-10-03',
        author: 'emp_019',
        authorName: 'Brian Allen',
        message: 'All repairs completed. Full inspection passed. Area cleared for work.',
      },
    ],
    warningId: 'warn_003',
    verificationRequired: true,
    verifiedBy: 'emp_004',
    verifiedByName: 'Emily Davis',
    verifiedDate: '2025-10-03',
    verificationNotes: 'Scaffolding meets all safety standards. Worker training on reporting scheduled.',
    location: 'Site B - East Wing',
    category: 'equipment',
    createdAt: '2025-09-28T14:00:00Z',
    updatedAt: '2025-10-03T17:00:00Z',
  },
  {
    id: 'ca_004',
    title: 'Upgrade electrical panel LOTO devices',
    description: 'Install modern lockout/tagout devices on all electrical panels to prevent bypass and improve compliance.',
    type: 'preventive',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'emp_007',
    assignedToName: 'Robert Martinez',
    assignedBy: 'emp_001',
    assignedByName: 'John Smith',
    assignedDate: '2025-09-25',
    dueDate: '2025-10-30',
    startedDate: '2025-09-27',
    rootCause: 'Current LOTO devices are old and can be easily bypassed. Recent critical violation highlighted this risk.',
    actionPlan: '1. Assess all electrical panels and document current LOTO devices\n2. Procure modern multi-lock LOTO devices\n3. Install new devices on all panels\n4. Update LOTO procedures\n5. Conduct refresher training for all electricians',
    resources: 'Electrical team, LOTO equipment supplier, Safety coordinator',
    estimatedCost: 5600,
    progressPercentage: 45,
    updates: [
      {
        date: '2025-09-27',
        author: 'emp_007',
        authorName: 'Robert Martinez',
        message: 'Assessment completed. Identified 28 panels requiring upgrades.',
      },
      {
        date: '2025-10-02',
        author: 'emp_007',
        authorName: 'Robert Martinez',
        message: 'Equipment ordered. Estimated delivery: October 15th.',
      },
      {
        date: '2025-10-16',
        author: 'emp_007',
        authorName: 'Robert Martinez',
        message: 'Equipment received. Starting installations at Site A (12 panels).',
      },
    ],
    incidentId: 'inc_018',
    verificationRequired: true,
    location: 'All Sites',
    category: 'equipment',
    createdAt: '2025-09-25T11:00:00Z',
    updatedAt: '2025-10-16T09:00:00Z',
  },
  {
    id: 'ca_005',
    title: 'Install additional ventilation in fabrication shop',
    description: 'Air quality monitoring showed elevated welding fume levels. Need improved ventilation system.',
    type: 'improvement',
    priority: 'medium',
    status: 'pending_review',
    assignedTo: 'emp_015',
    assignedToName: 'Kevin Clark',
    assignedBy: 'emp_003',
    assignedByName: 'Michael Chen',
    assignedDate: '2025-10-10',
    dueDate: '2025-11-15',
    startedDate: '2025-10-12',
    rootCause: 'Increased welding activity exceeded capacity of existing ventilation system.',
    actionPlan: '1. Conduct air quality assessment\n2. Design ventilation upgrade\n3. Obtain quotes from HVAC contractors\n4. Get approval for budget\n5. Install new ventilation units\n6. Conduct post-installation air quality testing',
    resources: 'HVAC specialist, Air quality consultant, Installation contractor',
    estimatedCost: 18500,
    progressPercentage: 30,
    updates: [
      {
        date: '2025-10-12',
        author: 'emp_015',
        authorName: 'Kevin Clark',
        message: 'Air quality assessment completed. Recommendations received.',
      },
      {
        date: '2025-10-17',
        author: 'emp_015',
        authorName: 'Kevin Clark',
        message: 'Design completed. Requesting quotes from 3 contractors.',
      },
    ],
    verificationRequired: true,
    location: 'Site A - Fabrication Shop',
    category: 'environment',
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-17T15:00:00Z',
  },
  {
    id: 'ca_006',
    title: 'Implement weekly equipment inspection program',
    description: 'Standardize and formalize weekly equipment inspection procedures to catch issues early.',
    type: 'preventive',
    priority: 'medium',
    status: 'open',
    assignedTo: 'emp_019',
    assignedToName: 'Brian Allen',
    assignedBy: 'emp_001',
    assignedByName: 'John Smith',
    assignedDate: '2025-10-18',
    dueDate: '2025-11-08',
    rootCause: 'Current inspection program is informal and inconsistent. Equipment issues not caught early.',
    actionPlan: '1. Develop standardized inspection checklists for all equipment types\n2. Create digital inspection forms\n3. Assign inspection responsibilities\n4. Train equipment operators\n5. Implement tracking and follow-up system',
    resources: 'Maintenance team, IT support, Training coordinator',
    estimatedCost: 2400,
    progressPercentage: 0,
    updates: [],
    verificationRequired: false,
    location: 'All Sites',
    category: 'procedure',
    createdAt: '2025-10-18T09:00:00Z',
    updatedAt: '2025-10-18T09:00:00Z',
  },
  {
    id: 'ca_007',
    title: 'Update emergency response signage and exit routes',
    description: 'Annual review identified outdated emergency signage and obstructed exit routes that need correction.',
    type: 'corrective',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'emp_003',
    assignedToName: 'Michael Chen',
    assignedBy: 'emp_001',
    assignedByName: 'John Smith',
    assignedDate: '2025-10-01',
    dueDate: '2025-10-22',
    startedDate: '2025-10-03',
    rootCause: 'Layout changes created new exit routes, but signage not updated. Storage materials blocking some exits.',
    actionPlan: '1. Conduct full site walk-through\n2. Order new emergency signage\n3. Clear obstructed exit routes\n4. Install updated signage\n5. Update emergency response plan\n6. Conduct emergency drill',
    resources: 'Safety team, Signage supplier, Facility team',
    estimatedCost: 1800,
    progressPercentage: 70,
    updates: [
      {
        date: '2025-10-03',
        author: 'emp_003',
        authorName: 'Michael Chen',
        message: 'Site assessment completed. Identified 8 locations needing new/updated signage.',
      },
      {
        date: '2025-10-08',
        author: 'emp_003',
        authorName: 'Michael Chen',
        message: 'All exit routes cleared. New signage ordered.',
      },
      {
        date: '2025-10-16',
        author: 'emp_003',
        authorName: 'Michael Chen',
        message: 'Signage received. Installing at Site A today, Site B tomorrow.',
      },
    ],
    verificationRequired: true,
    location: 'All Sites',
    category: 'infrastructure',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-16T11:30:00Z',
  },
  {
    id: 'ca_008',
    title: 'Provide additional PPE storage lockers',
    description: 'Workers leaving PPE in unsecured areas. Need dedicated storage to prevent loss and damage.',
    type: 'improvement',
    priority: 'low',
    status: 'completed',
    assignedTo: 'emp_020',
    assignedToName: 'Donna Young',
    assignedBy: 'emp_003',
    assignedByName: 'Michael Chen',
    assignedDate: '2025-09-15',
    dueDate: '2025-09-30',
    startedDate: '2025-09-16',
    completedDate: '2025-09-28',
    rootCause: 'Insufficient secure storage at work sites. Workers leaving equipment in break areas.',
    actionPlan: '1. Determine optimal locker locations\n2. Order weatherproof storage lockers\n3. Install lockers at each work site\n4. Label and assign lockers to workers\n5. Communicate new storage policy',
    resources: 'Facility team, Locker supplier',
    estimatedCost: 4200,
    progressPercentage: 100,
    updates: [
      {
        date: '2025-09-16',
        author: 'emp_020',
        authorName: 'Donna Young',
        message: 'Met with site supervisors. Identified locations for 24 lockers across 3 sites.',
      },
      {
        date: '2025-09-20',
        author: 'emp_020',
        authorName: 'Donna Young',
        message: 'Lockers ordered. Expected delivery: September 25th.',
      },
      {
        date: '2025-09-26',
        author: 'emp_020',
        authorName: 'Donna Young',
        message: 'Lockers delivered and installed at all sites.',
      },
      {
        date: '2025-09-28',
        author: 'emp_020',
        authorName: 'Donna Young',
        message: 'Lockers assigned to workers. Policy communicated via toolbox talks.',
      },
    ],
    verificationRequired: false,
    location: 'All Sites',
    category: 'infrastructure',
    createdAt: '2025-09-15T14:00:00Z',
    updatedAt: '2025-09-28T16:00:00Z',
  },
];

// Helper functions
export function getActionsByStatus(status: CorrectiveAction['status']): CorrectiveAction[] {
  return MOCK_CORRECTIVE_ACTIONS.filter((action) => action.status === status);
}

export function getActionsByPriority(priority: CorrectiveAction['priority']): CorrectiveAction[] {
  return MOCK_CORRECTIVE_ACTIONS.filter((action) => action.priority === priority);
}

export function getActionsByAssignee(employeeId: string): CorrectiveAction[] {
  return MOCK_CORRECTIVE_ACTIONS.filter((action) => action.assignedTo === employeeId);
}

export function getOverdueActions(): CorrectiveAction[] {
  const now = new Date();
  return MOCK_CORRECTIVE_ACTIONS.filter((action) => {
    if (action.status === 'completed' || action.status === 'cancelled') return false;
    return new Date(action.dueDate) < now;
  });
}

export function getActionsDueSoon(days: number = 7): CorrectiveAction[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return MOCK_CORRECTIVE_ACTIONS.filter((action) => {
    if (action.status === 'completed' || action.status === 'cancelled') return false;
    const dueDate = new Date(action.dueDate);
    return dueDate >= now && dueDate <= futureDate;
  });
}

export function getOpenActions(): CorrectiveAction[] {
  return MOCK_CORRECTIVE_ACTIONS.filter(
    (action) => action.status !== 'completed' && action.status !== 'cancelled'
  );
}

export function getTotalEstimatedCost(): number {
  return MOCK_CORRECTIVE_ACTIONS.reduce(
    (sum, action) => sum + (action.estimatedCost || 0),
    0
  );
}

export const ACTION_TYPES: CorrectiveAction['type'][] = [
  'corrective',
  'preventive',
  'improvement',
];

export const ACTION_PRIORITIES: CorrectiveAction['priority'][] = [
  'low',
  'medium',
  'high',
  'critical',
];

export const ACTION_CATEGORIES: CorrectiveAction['category'][] = [
  'ppe',
  'equipment',
  'procedure',
  'training',
  'infrastructure',
  'environment',
  'other',
];
