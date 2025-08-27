import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { z } from 'zod';

export const GenderSchema = z.enum(['MALE', 'FEMALE']);
export type Gender = z.infer<typeof GenderSchema>;

export const StatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LEFT']);
export type Status = z.infer<typeof StatusSchema>;

export const BaseEmployeeSchema = z.object({
  employeeNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.date(),
  phoneNumber: z.string(),
  companyEmail: z.string(),
  address: z.string(),
  dateOfJoining: z.date().optional(),
  branch: z.string().optional(),
  department: z.string().optional(),
  gender: GenderSchema,
  status: StatusSchema,
});
export const EmployeeSchemaFromApi = BaseEmployeeSchema.transform((data) => ({
  ...data,
  birthDate: new Date(data.birthDate),
  dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining) : undefined,
}));
export const EmployeeSchemaToApi = BaseEmployeeSchema.transform((data) => ({
  ...data,
  birthDate: data.birthDate.toISOString(),
  dateOfJoining: data.dateOfJoining?.toISOString(),
}));

export type Employee = z.infer<typeof EmployeeSchemaFromApi>;

export async function getAllEmployees({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<Employee[]>>({
    url: '/employee-information',
    method: 'GET',
    // params,
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
