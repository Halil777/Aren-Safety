import { useState } from 'react';
import type { ProjectCode } from '@/features/project-codes';

export function useProjectCodes(initialData: ProjectCode[]) {
  const [data, setData] = useState(initialData);
  const [loading] = useState(false);

  const handleFilterChange = (filters: any) => {
    // TODO: Implement filtering logic
    console.log('Filters changed:', filters);
  };

  const handleNewProjectCode = (projectCode: ProjectCode) => {
    setData((prev) => [...prev, projectCode]);
  };

  return { data, loading, handleFilterChange, handleNewProjectCode };
}