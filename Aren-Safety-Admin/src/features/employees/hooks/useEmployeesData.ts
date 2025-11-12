import { useState, useMemo } from 'react';
import type {
  WarningEmployee,
  SafetyStaffMember,
  Inspector,
  InspectorInput,
} from '../types';

const generateInspectorId = () => `i-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function useWarningEmployees(initialData: WarningEmployee[]) {
  const [records] = useState(initialData);
  const summary = useMemo(() => {
    const totalFines = records.reduce((sum, item) => sum + item.totalFineAmount, 0);
    const activeActions = records.filter((item) => item.activeCorrectiveAction).length;
    return {
      count: records.length,
      totalFines,
      activeActions,
    };
  }, [records]);

  return { records, summary };
}

export function useSafetyStaff(initialData: SafetyStaffMember[]) {
  const [members] = useState(initialData);
  const summary = useMemo(() => {
    const totalExperience = members.reduce((sum, item) => sum + item.yearsOfExperience, 0);
    const experts = members.filter((item) => item.certificationLevel === 'expert').length;
    const dayShift = members.filter((item) => item.shift === 'day').length;
    return {
      count: members.length,
      averageExperience: members.length ? Math.round((totalExperience / members.length) * 10) / 10 : 0,
      experts,
      dayShift,
    };
  }, [members]);

  return { members, summary };
}

export function useInspectors(initialData: Inspector[]) {
  const [inspectors, setInspectors] = useState(initialData);

  const addInspector = (input: InspectorInput) => {
    const newInspector: Inspector = {
      id: generateInspectorId(),
      fullName: input.fullName as string,
      department: input.department as string,
      position: (input.position ?? 'Inspector') as string,
      licenseId: input.licenseId as string,
      region: input.region as string,
      assignedSites: input.assignedSites as number,
      lastAuditDate: input.lastAuditDate as string,
      avatarUrl: input.avatarUrl as string | undefined,
      email: input.email as string | undefined,
      phone: input.phone as string | undefined,
    };
    setInspectors((prev) => [...prev, newInspector]);
  };

  const summary = useMemo(() => {
    const totalSites = inspectors.reduce((sum, inspector) => sum + inspector.assignedSites, 0);
    const regions = new Set(inspectors.map((item) => item.region));
    return {
      count: inspectors.length,
      totalSites,
      regions: regions.size,
    };
  }, [inspectors]);

  return { inspectors, addInspector, summary };
}

