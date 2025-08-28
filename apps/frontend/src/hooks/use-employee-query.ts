import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const GenderSchema = z.enum(['MALE', 'FEMALE']);
export type Gender = z.infer<typeof GenderSchema>;

export const StatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LEFT']);
export type Status = z.infer<typeof StatusSchema>;

export const EmployeeSchema = z.object({
  employeeNumber: z.string().min(1, 'Employee Number is required.').default(''),
  firstName: z.string().min(1, 'First Name is required.').default(''),
  lastName: z.string().min(1, 'Last Name is required.').default(''),
  birthDate: z.date('Birth Date is required.'),
  phoneNumber: z
    .string()
    .min(1, 'Phone Number is required')
    .regex(/^[0-9]+$/, {
      message: 'Phone Number must contain only numeric characters',
    }),
  companyEmail: z.email().default(''),
  address: z.string().default(''),
  dateOfJoining: z.date().optional(),
  branch: z.string().optional().default(''),
  department: z.string().optional().default(''),
  gender: GenderSchema,
  status: StatusSchema,
});
export const EmployeeSchemaFromApi = EmployeeSchema.omit({
  dateOfJoining: true,
  birthDate: true,
}).extend({
  birthDate: z
    .string()
    .optional()
    .transform((data) => new Date(data || '')),
  dateOfJoining: z
    .string()
    .optional()
    .transform((data) => new Date(data || '')),
});

export const EmployeeSchemaToApi = EmployeeSchema.transform((data) => ({
  ...data,
  birthDate: data.birthDate.toISOString(),
  dateOfJoining: data.dateOfJoining?.toISOString(),
}));

export type Employee = z.infer<typeof EmployeeSchema>;

export async function getEmployeeOverview() {
  const { data, error } = await fetchClientQuery<{
    totalEmployee: number;
    totalMaleEmployee: number;
    totalFemaleEmployee: number;
  }>({
    url: '/employee-information/overview',
    method: 'GET',
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}
export const useEmployeeOverviewQuery = () => {
  return useQuery({
    queryKey: ['get-employee-overview'],
    queryFn: async () => await getEmployeeOverview(),
  });
};
export async function getAllEmployees({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<Employee[]>>({
    url: '/employee-information',
    method: 'GET',
    params,
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}

export const getAllEmployeeQuery = (rawParams?: Record<string, any>) => {
  const params = { page: 1, limit: 20, ...(rawParams || {}) };
  return queryClient.fetchQuery({
    queryKey: ['get-all-employee', params],
    queryFn: async () => await getAllEmployees({ params: params }),
  });
};

export const useCreateEmployeeMutation = () => {
  return useMutation({
    mutationFn: async (data: Employee) => {
      const { data: res, error } = await fetchClientQuery({
        url: '/employee-information',
        method: 'POST',
        body: data,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-employee'] });
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/employee-information/${id}`,
        method: 'DELETE',
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-employee'] });
    },
  });
};

export const useDetailEmployeeQuery = (id?: string) => {
  return useQuery({
    queryKey: ['get-detail-employee', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await fetchClientQuery<Employee>({
        url: `/employee-information/${id}`,
        method: 'GET',
      });
      if (error || !data) {
        throw new Error(error || 'Something went wrong');
      }
      return data;
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Employee }) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/employee-information/${id}`,
        method: 'PUT',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      queryClient.invalidateQueries({ queryKey: ['get-detail-employee', id] });
      return res;
    },
  });
};
