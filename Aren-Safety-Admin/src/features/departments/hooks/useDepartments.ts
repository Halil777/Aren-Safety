import { useState } from 'react';
import type { Department } from '@/features/departments';

export function useDepartments(initialData: Department[]) {
  const [data, setData] = useState(initialData);
  const [loading] = useState(false);

  const handleFilterChange = (filters: any) => {
    // TODO: Implement filtering logic
    console.log('Filters changed:', filters);
  };

  const handleNewDepartment = (department: Department) => {
    setData((prev) => [...prev, department]);
  };

  return { data, loading, handleFilterChange, handleNewDepartment };
}