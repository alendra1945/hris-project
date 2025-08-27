import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth-store';

export type ActiveUser = {
  avatarUrl: string;
  createdAt: string;
  email: string;
  fullName: string;
  id: number;
  isVerified: boolean;
  lastLoginTime: string;
  loginGoogleId: string;
  phoneNumber: string;
  updatedAt: string;
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
  const { data, error } = await fetchClientQuery({
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
  const { data, error } = await fetchClientQuery({
    url: '/auth/signin',
    method: 'POST',
    body: payload,
  });
  if (error) {
    throw new Error(error);
  }
  console.log(data);
  return data;
};
