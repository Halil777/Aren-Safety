import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { Employee } from '@/shared/config/mock-employees';

interface EmployeeFilters {
  safetyRole?: 'worker' | 'safety_team' | 'inspector' | 'head_of_safety';
  department?: string;
  status?: 'active' | 'on_leave' | 'suspended' | 'terminated';
  workLocation?: string;
  search?: string;
}

// Query Keys
export const employeesKeys = {
  all: ['employees'] as const,
  list: (filters?: EmployeeFilters) => [...employeesKeys.all, 'list', filters] as const,
  detail: (id: string) => [...employeesKeys.all, 'detail', id] as const,
};

// API Functions
const fetchEmployees = async (filters?: EmployeeFilters): Promise<Employee[]> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.safetyRole) params.append('safetyRole', filters.safetyRole);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.workLocation) params.append('workLocation', filters.workLocation);
    if (filters.search) params.append('search', filters.search);
  }
  const { data } = await axios.get(`/tenant/employees?${params.toString()}`);
  return data;
};

const fetchEmployee = async (id: string): Promise<Employee> => {
  const { data } = await axios.get(`/tenant/employees/${id}`);
  return data;
};

const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
  const { data } = await axios.post('/tenant/employees', employeeData);
  return data;
};

const updateEmployee = async ({ id, employeeData }: { id: string; employeeData: Partial<Employee> }): Promise<Employee> => {
  const { data } = await axios.patch(`/tenant/employees/${id}`, employeeData);
  return data;
};

const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/employees/${id}`);
};

// Hooks
export const useEmployees = (filters?: EmployeeFilters) => {
  return useQuery({
    queryKey: employeesKeys.list(filters),
    queryFn: () => fetchEmployees(filters),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeesKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onMutate: async (newEmployee) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: employeesKeys.all });

      // Snapshot previous value
      const previousEmployees = queryClient.getQueriesData({ queryKey: employeesKeys.all });

      // Optimistically update all employee lists
      queryClient.setQueriesData({ queryKey: employeesKeys.all }, (old: Employee[] | undefined) => {
        if (!old) return old;
        return [...old, { ...newEmployee, id: 'temp-' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      });

      return { previousEmployees };
    },
    onError: (err, newEmployee, context) => {
      // Rollback on error
      if (context?.previousEmployees) {
        context.previousEmployees.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onMutate: async ({ id, employeeData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: employeesKeys.all });
      await queryClient.cancelQueries({ queryKey: employeesKeys.detail(id) });

      // Snapshot previous values
      const previousEmployees = queryClient.getQueriesData({ queryKey: employeesKeys.all });
      const previousEmployee = queryClient.getQueryData(employeesKeys.detail(id));

      // Optimistically update employee lists
      queryClient.setQueriesData({ queryKey: employeesKeys.all }, (old: Employee[] | undefined) => {
        if (!old) return old;
        return old.map((emp) => emp.id === id ? { ...emp, ...employeeData, updatedAt: new Date().toISOString() } : emp);
      });

      // Optimistically update single employee
      queryClient.setQueryData(employeesKeys.detail(id), (old: Employee | undefined) => {
        if (!old) return old;
        return { ...old, ...employeeData, updatedAt: new Date().toISOString() };
      });

      return { previousEmployees, previousEmployee, id };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousEmployees) {
        context.previousEmployees.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousEmployee) {
        queryClient.setQueryData(employeesKeys.detail(context.id), context.previousEmployee);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all });
      queryClient.invalidateQueries({ queryKey: employeesKeys.detail(variables.id) });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: employeesKeys.all });

      // Snapshot previous value
      const previousEmployees = queryClient.getQueriesData({ queryKey: employeesKeys.all });

      // Optimistically remove from all employee lists
      queryClient.setQueriesData({ queryKey: employeesKeys.all }, (old: Employee[] | undefined) => {
        if (!old) return old;
        return old.filter((emp) => emp.id !== id);
      });

      return { previousEmployees };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousEmployees) {
        context.previousEmployees.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all });
    },
  });
};
