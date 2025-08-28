import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { Employee, EmployeeSchema } from './use-employee-query';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
export type ActiveUser = {
  name: string;
  avatarUrl: string;
  createdAt: string;
  email: string;
  id: string;
  isActive: boolean;
  role: string;
  updatedAt: string;
  employeeInformation?: Employee;
};
export async function refreshToken() {
  const { data, error } = await fetchClientQuery({
    url: '/auth/refresh-token',
    method: 'GET',
  });
  if (error) {
    throw new Error(error);
  }
  return data;
}
async function getCurrentUser() {
  const { data, error } = await fetchClientQuery<ActiveUser>({
    url: '/account/me',
    method: 'GET',
  });
  if (error) {
    throw new Error(error);
  }

  return data as ActiveUser;
}

export const getMeQuery = () => {
  return queryClient.fetchQuery({
    queryKey: ['get-current-user'],
    queryFn: async () => await getCurrentUser(),
  });
};

export const sigInWithEmail = async ({ payload }: { payload: { email: string; password: string } }) => {
  const { data, error } = await fetchClientQuery<{ accessToken: string; refreshToken: string }>({
    url: '/auth/signin',
    method: 'POST',
    body: payload,
  });
  if (error || !data) {
    throw new Error(error || 'Failed to sign in');
  }
  return data;
};

export const ProfileSchema = EmployeeSchema.omit({
  dateOfJoining: true,
  branch: true,
  department: true,
  companyEmail: true,
});
export async function updateUserDetail({ payload }: { payload: z.infer<typeof ProfileSchema> }) {
  const { data, error } = await fetchClientQuery<{ accessToken: string; refreshToken: string }>({
    url: '/account/employee-information',
    method: 'PUT',
    body: payload,
  });
  if (error || !data) {
    throw new Error(error || 'Failed to update user detail');
  }
  return data;
}
export function useUpdateUserDetailMutation() {
  return useMutation({
    mutationFn: updateUserDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-current-user'] });
    },
  });
}
