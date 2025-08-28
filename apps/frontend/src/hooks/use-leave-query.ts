import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// Leave Application: Enums and Schemas
export const LeaveTypeSchema = z.enum(['CASUAL', 'COMPENSATORY', 'LEAVE_WITHOUT_PAY', 'PRIVILEGE', 'SICK']);
export type LeaveType = z.infer<typeof LeaveTypeSchema>;

export const LeaveStatusSchema = z.enum(['OPEN', 'APPROVED', 'REJECTED', 'CANCELLED']);
export type LeaveStatus = z.infer<typeof LeaveStatusSchema>;

export const LeaveApplicationSchema = z.object({
  employeeNumber: z.string().min(1, 'Employee Number is required.').default(''),
  employeeName: z.string().min(1, 'Employee Name is required.').default(''),
  employeeEmail: z.email().default(''),
  leaveApproverNumber: z.string().min(1, 'Leave Approver Number is required.').default(''),
  leaveApproverName: z.string().min(1, 'Leave Approver Name is required.').default(''),
  leaveApproverEmail: z.email().default(''),
  leaveType: LeaveTypeSchema,
  startDate: z.date('Start Date is required.'),
  endDate: z.date('End Date is required.'),
  reason: z.string().min(1, 'Reason is required.').default(''),
  isHalfDay: z.boolean().default(false),
  followViaEmail: z.boolean().default(false),
  status: LeaveStatusSchema.default('OPEN'),
});

export const LeaveApplicationSchemaFromApi = LeaveApplicationSchema.omit({
  startDate: true,
  endDate: true,
}).extend({
  startDate: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
  endDate: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
});

export const LeaveApplicationSchemaToApi = LeaveApplicationSchema.transform((data) => ({
  ...data,
  startDate: data.startDate.toISOString(),
  endDate: data.endDate.toISOString(),
}));

export type LeaveApplication = z.infer<typeof LeaveApplicationSchema>;

// Leave Application: Queries
export async function getAllLeaves({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<LeaveApplication[]>>({
    url: '/leave-balance',
    method: 'GET',
    params,
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}

export const getAllLeaveQuery = (rawParams?: Record<string, any>) => {
  const params = { page: 1, limit: 20, ...(rawParams || {}) };
  return queryClient.fetchQuery({
    queryKey: ['get-all-leaves', params],
    queryFn: async () => await getAllLeaves({ params }),
  });
};

export const useCreateLeaveMutation = () => {
  return useMutation({
    mutationFn: async (payload: LeaveApplication) => {
      const { data: res, error } = await fetchClientQuery({
        url: '/leave-balance',
        method: 'POST',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-leaves'] });
    },
  });
};

export const useDeleteLeaveMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/leave-balance/${id}`,
        method: 'DELETE',
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-leaves'] });
    },
  });
};

export const useDetailLeaveQuery = (id?: string) => {
  return useQuery({
    queryKey: ['get-detail-leave', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await fetchClientQuery<LeaveApplication>({
        url: `/leave-balance/${id}`,
        method: 'GET',
      });
      if (error || !data) {
        throw new Error(error || 'Something went wrong');
      }
      return data;
    },
  });
};

export const useUpdateLeaveMutation = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: LeaveApplication }) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/leave-balance/${id}`,
        method: 'PUT',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      queryClient.invalidateQueries({ queryKey: ['get-detail-leave', id] });
      return res;
    },
  });
};
