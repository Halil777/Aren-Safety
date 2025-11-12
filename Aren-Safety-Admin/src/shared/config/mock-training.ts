/**
 * Mock Training Data
 *
 * Training courses, sessions, and records for tenant admin panel
 */

import { MOCK_EMPLOYEES } from './mock-employees';

export interface TrainingCourse {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'safety' | 'technical' | 'compliance' | 'leadership' | 'equipment';
  duration: number; // in hours
  validityPeriod?: number; // in months (null = lifetime)
  requiredFor: string[]; // positions or roles
  instructor?: string;
  cost: number;
  isActive: boolean;
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  courseId: string;
  courseName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  instructorName: string;
  maxParticipants: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  // Participants
  registeredParticipants: string[]; // employee IDs
  attendedParticipants: string[]; // employee IDs
  passedParticipants: string[]; // employee IDs

  // Assessment
  hasAssessment: boolean;
  passingScore?: number;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  courseId: string;
  courseName: string;
  sessionId: string;
  completionDate: string;
  expiryDate?: string;
  score?: number;
  passed: boolean;
  certificateIssued: boolean;
  certificateNumber?: string;
  instructor: string;
  instructorName: string;
  notes?: string;
  createdAt: string;
}

// Training Courses
export const MOCK_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'course_001',
    code: 'OSHA-10',
    name: 'OSHA 10-Hour Construction Safety',
    description: '10-hour general industry safety and health program for construction workers. Covers common hazards and OSHA standards.',
    category: 'compliance',
    duration: 10,
    validityPeriod: 60, // 5 years
    requiredFor: ['All Workers'],
    cost: 150,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_002',
    code: 'OSHA-30',
    name: 'OSHA 30-Hour Construction Safety',
    description: '30-hour program for supervisors and workers with safety responsibilities. In-depth coverage of OSHA standards and rights.',
    category: 'compliance',
    duration: 30,
    validityPeriod: 60,
    requiredFor: ['Supervisors', 'Safety Team', 'Inspectors'],
    cost: 350,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_003',
    code: 'FALL-PROT',
    name: 'Fall Protection Training',
    description: 'Comprehensive training on fall hazards, equipment, and rescue procedures. Includes hands-on harness fitting and anchor point selection.',
    category: 'safety',
    duration: 4,
    validityPeriod: 12,
    requiredFor: ['Workers at Height'],
    cost: 120,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_004',
    code: 'CONFINED-SPACE',
    name: 'Confined Space Entry',
    description: 'Training on confined space hazards, entry procedures, atmospheric testing, and rescue. OSHA 1926.1200 compliant.',
    category: 'safety',
    duration: 8,
    validityPeriod: 12,
    requiredFor: ['Plumbers', 'Electricians', 'Maintenance'],
    cost: 200,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_005',
    code: 'FIRST-AID',
    name: 'First Aid & CPR',
    description: 'American Red Cross First Aid and CPR/AED certification. Includes adult, child, and infant CPR.',
    category: 'safety',
    duration: 8,
    validityPeriod: 24,
    requiredFor: ['Safety Team', 'Site Supervisors'],
    cost: 85,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_006',
    code: 'SCAFFOLD',
    name: 'Scaffold Safety',
    description: 'Safe scaffold erection, use, and inspection. Covers supported and suspension scaffolds.',
    category: 'safety',
    duration: 4,
    validityPeriod: 24,
    requiredFor: ['Carpenters', 'Masons'],
    cost: 100,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_007',
    code: 'ELEC-SAFETY',
    name: 'Electrical Safety & LOTO',
    description: 'Electrical hazards, lockout/tagout procedures, and arc flash protection. NFPA 70E awareness.',
    category: 'safety',
    duration: 6,
    validityPeriod: 12,
    requiredFor: ['Electricians'],
    cost: 175,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_008',
    code: 'HEAVY-EQUIP',
    name: 'Heavy Equipment Operation',
    description: 'Safe operation of excavators, loaders, and dozers. Includes practical assessment.',
    category: 'equipment',
    duration: 16,
    validityPeriod: 36,
    requiredFor: ['Equipment Operators'],
    cost: 450,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_009',
    code: 'WELD-SAFETY',
    name: 'Welding Safety',
    description: 'Safe welding and cutting operations. Covers ventilation, PPE, fire prevention, and hot work permits.',
    category: 'safety',
    duration: 4,
    validityPeriod: 24,
    requiredFor: ['Welders'],
    cost: 110,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'course_010',
    code: 'RESP-PROT',
    name: 'Respiratory Protection',
    description: 'Respirator selection, fit testing, and maintenance. OSHA 1910.134 compliant.',
    category: 'safety',
    duration: 3,
    validityPeriod: 12,
    requiredFor: ['Painters', 'Welders'],
    cost: 90,
    isActive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
];

// Training Sessions
export const MOCK_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'session_001',
    courseId: 'course_003',
    courseName: 'Fall Protection Training',
    sessionDate: '2025-10-22',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Site A - Training Room',
    instructor: 'emp_002',
    instructorName: 'Sarah Johnson',
    maxParticipants: 12,
    status: 'scheduled',
    registeredParticipants: ['emp_011', 'emp_012', 'emp_006', 'emp_016', 'emp_017'],
    attendedParticipants: [],
    passedParticipants: [],
    hasAssessment: true,
    passingScore: 80,
    notes: 'Bring hard hat and work boots. Harnesses will be provided.',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-10-17T14:00:00Z',
  },
  {
    id: 'session_002',
    courseId: 'course_004',
    courseName: 'Confined Space Entry',
    sessionDate: '2025-10-14',
    startTime: '08:00',
    endTime: '16:00',
    location: 'Site B - Conference Room',
    instructor: 'emp_004',
    instructorName: 'Emily Davis',
    maxParticipants: 10,
    status: 'completed',
    registeredParticipants: ['emp_007', 'emp_008', 'emp_015', 'emp_019'],
    attendedParticipants: ['emp_007', 'emp_008', 'emp_015', 'emp_019'],
    passedParticipants: ['emp_007', 'emp_008', 'emp_015', 'emp_019'],
    hasAssessment: true,
    passingScore: 80,
    notes: 'Retraining session after recent violation. All participants passed.',
    createdAt: '2025-10-08T09:00:00Z',
    updatedAt: '2025-10-14T17:00:00Z',
  },
  {
    id: 'session_003',
    courseId: 'course_005',
    courseName: 'First Aid & CPR',
    sessionDate: '2025-09-15',
    startTime: '08:00',
    endTime: '16:00',
    location: 'Main Office - Training Center',
    instructor: 'ext_001',
    instructorName: 'Red Cross Instructor',
    maxParticipants: 15,
    status: 'completed',
    registeredParticipants: [
      'emp_001',
      'emp_002',
      'emp_003',
      'emp_004',
      'emp_013',
      'emp_018',
    ],
    attendedParticipants: [
      'emp_001',
      'emp_002',
      'emp_003',
      'emp_004',
      'emp_013',
      'emp_018',
    ],
    passedParticipants: [
      'emp_001',
      'emp_002',
      'emp_003',
      'emp_004',
      'emp_013',
      'emp_018',
    ],
    hasAssessment: true,
    passingScore: 80,
    notes: 'Annual recertification for safety team and supervisors.',
    createdAt: '2025-08-20T10:00:00Z',
    updatedAt: '2025-09-15T17:00:00Z',
  },
  {
    id: 'session_004',
    courseId: 'course_007',
    courseName: 'Electrical Safety & LOTO',
    sessionDate: '2025-10-02',
    startTime: '08:00',
    endTime: '14:00',
    location: 'Site B - Training Room',
    instructor: 'emp_002',
    instructorName: 'Sarah Johnson',
    maxParticipants: 8,
    status: 'completed',
    registeredParticipants: ['emp_007'],
    attendedParticipants: ['emp_007'],
    passedParticipants: ['emp_007'],
    hasAssessment: true,
    passingScore: 90,
    notes: 'Mandatory retraining following critical LOTO violation.',
    createdAt: '2025-09-25T11:00:00Z',
    updatedAt: '2025-10-02T15:00:00Z',
  },
  {
    id: 'session_005',
    courseId: 'course_010',
    courseName: 'Respiratory Protection',
    sessionDate: '2025-10-13',
    startTime: '13:00',
    endTime: '16:00',
    location: 'Site A - Training Room',
    instructor: 'emp_003',
    instructorName: 'Michael Chen',
    maxParticipants: 10,
    status: 'completed',
    registeredParticipants: ['emp_010', 'emp_012'],
    attendedParticipants: ['emp_010', 'emp_012'],
    passedParticipants: ['emp_010', 'emp_012'],
    hasAssessment: true,
    passingScore: 80,
    notes: 'Includes fit testing for all participants.',
    createdAt: '2025-10-05T09:00:00Z',
    updatedAt: '2025-10-13T16:30:00Z',
  },
  {
    id: 'session_006',
    courseId: 'course_008',
    courseName: 'Heavy Equipment Operation',
    sessionDate: '2025-09-18',
    startTime: '08:00',
    endTime: '16:00',
    location: 'Site B - Equipment Yard',
    instructor: 'ext_002',
    instructorName: 'Equipment Training Co.',
    maxParticipants: 6,
    status: 'completed',
    registeredParticipants: ['emp_009'],
    attendedParticipants: ['emp_009'],
    passedParticipants: ['emp_009'],
    hasAssessment: true,
    passingScore: 85,
    notes: 'Certification renewal. Practical and written assessment completed.',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-09-18T17:00:00Z',
  },
  {
    id: 'session_007',
    courseId: 'course_001',
    courseName: 'OSHA 10-Hour Construction Safety',
    sessionDate: '2025-11-05',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Main Office - Training Center',
    instructor: 'emp_001',
    instructorName: 'John Smith',
    maxParticipants: 20,
    status: 'scheduled',
    registeredParticipants: ['emp_011', 'emp_012'],
    attendedParticipants: [],
    passedParticipants: [],
    hasAssessment: true,
    passingScore: 70,
    notes: 'Two-day course. Day 1: Nov 5, Day 2: Nov 6. New hires training.',
    createdAt: '2025-10-18T09:00:00Z',
    updatedAt: '2025-10-18T09:00:00Z',
  },
];

// Training Records
export const MOCK_TRAINING_RECORDS: TrainingRecord[] = [
  {
    id: 'record_001',
    employeeId: 'emp_001',
    employeeName: 'John Smith',
    courseId: 'course_002',
    courseName: 'OSHA 30-Hour Construction Safety',
    sessionId: 'session_historic_001',
    completionDate: '2020-02-15',
    expiryDate: '2025-02-15',
    score: 95,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'OSHA30-2020-0015',
    instructor: 'ext_osha',
    instructorName: 'OSHA Authorized Trainer',
    createdAt: '2020-02-15T00:00:00Z',
  },
  {
    id: 'record_002',
    employeeId: 'emp_001',
    employeeName: 'John Smith',
    courseId: 'course_005',
    courseName: 'First Aid & CPR',
    sessionId: 'session_003',
    completionDate: '2025-09-15',
    expiryDate: '2027-09-15',
    score: 98,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'RC-FA-2025-1523',
    instructor: 'ext_001',
    instructorName: 'Red Cross Instructor',
    createdAt: '2025-09-15T17:00:00Z',
  },
  {
    id: 'record_003',
    employeeId: 'emp_002',
    employeeName: 'Sarah Johnson',
    courseId: 'course_002',
    courseName: 'OSHA 30-Hour Construction Safety',
    sessionId: 'session_historic_002',
    completionDate: '2021-04-20',
    expiryDate: '2026-04-20',
    score: 92,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'OSHA30-2021-0087',
    instructor: 'ext_osha',
    instructorName: 'OSHA Authorized Trainer',
    createdAt: '2021-04-20T00:00:00Z',
  },
  {
    id: 'record_004',
    employeeId: 'emp_002',
    employeeName: 'Sarah Johnson',
    courseId: 'course_005',
    courseName: 'First Aid & CPR',
    sessionId: 'session_003',
    completionDate: '2025-09-15',
    expiryDate: '2027-09-15',
    score: 96,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'RC-FA-2025-1524',
    instructor: 'ext_001',
    instructorName: 'Red Cross Instructor',
    createdAt: '2025-09-15T17:00:00Z',
  },
  {
    id: 'record_005',
    employeeId: 'emp_007',
    employeeName: 'Robert Martinez',
    courseId: 'course_007',
    courseName: 'Electrical Safety & LOTO',
    sessionId: 'session_004',
    completionDate: '2025-10-02',
    expiryDate: '2026-10-02',
    score: 92,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'ELEC-LOTO-2025-078',
    instructor: 'emp_002',
    instructorName: 'Sarah Johnson',
    notes: 'Retraining following violation. Excellent performance.',
    createdAt: '2025-10-02T15:00:00Z',
  },
  {
    id: 'record_006',
    employeeId: 'emp_008',
    employeeName: 'Linda Anderson',
    courseId: 'course_004',
    courseName: 'Confined Space Entry',
    sessionId: 'session_002',
    completionDate: '2025-10-14',
    expiryDate: '2026-10-14',
    score: 88,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'CS-ENTRY-2025-092',
    instructor: 'emp_004',
    instructorName: 'Emily Davis',
    notes: 'Retraining following violation. Good improvement.',
    createdAt: '2025-10-14T17:00:00Z',
  },
  {
    id: 'record_007',
    employeeId: 'emp_009',
    employeeName: 'William Taylor',
    courseId: 'course_008',
    courseName: 'Heavy Equipment Operation',
    sessionId: 'session_006',
    completionDate: '2025-09-18',
    expiryDate: '2028-09-18',
    score: 91,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'HEAVY-EQUIP-2025-034',
    instructor: 'ext_002',
    instructorName: 'Equipment Training Co.',
    createdAt: '2025-09-18T17:00:00Z',
  },
  {
    id: 'record_008',
    employeeId: 'emp_010',
    employeeName: 'Jessica Thomas',
    courseId: 'course_010',
    courseName: 'Respiratory Protection',
    sessionId: 'session_005',
    completionDate: '2025-10-13',
    expiryDate: '2026-10-13',
    score: 94,
    passed: true,
    certificateIssued: true,
    certificateNumber: 'RESP-PROT-2025-156',
    instructor: 'emp_003',
    instructorName: 'Michael Chen',
    createdAt: '2025-10-13T16:30:00Z',
  },
];

// Helper functions
export function getUpcomingSessions(days: number = 30): TrainingSession[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return MOCK_TRAINING_SESSIONS.filter((session) => {
    const sessionDate = new Date(session.sessionDate);
    return (
      session.status === 'scheduled' &&
      sessionDate >= now &&
      sessionDate <= futureDate
    );
  });
}

export function getRecordsByEmployee(employeeId: string): TrainingRecord[] {
  return MOCK_TRAINING_RECORDS.filter((record) => record.employeeId === employeeId);
}

export function getExpiredRecords(): TrainingRecord[] {
  const now = new Date();
  return MOCK_TRAINING_RECORDS.filter((record) => {
    if (!record.expiryDate) return false;
    return new Date(record.expiryDate) < now;
  });
}

export function getRecordsExpiringSoon(days: number = 90): TrainingRecord[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return MOCK_TRAINING_RECORDS.filter((record) => {
    if (!record.expiryDate) return false;
    const expiryDate = new Date(record.expiryDate);
    return expiryDate >= now && expiryDate <= futureDate;
  });
}

export function getCompletionRate(): number {
  const totalRequired = MOCK_EMPLOYEES.length * 3; // Assume 3 required courses per employee
  const completed = MOCK_TRAINING_RECORDS.length;
  return Math.round((completed / totalRequired) * 100);
}

export const TRAINING_CATEGORIES: TrainingCourse['category'][] = [
  'safety',
  'technical',
  'compliance',
  'leadership',
  'equipment',
];
