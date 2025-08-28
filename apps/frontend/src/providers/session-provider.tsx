'use client';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { getMeQuery } from '@/hooks/use-user-query';
import { EmployeeSchemaFromApi } from '@/hooks/use-employee-query';
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { auth } = useAuthStore();

  const setupUserProfile = async () => {
    // TODO add refresh token here before fetch user profile
    const { employeeInformation, ...profile } = await getMeQuery();
    const updateUser = {
      ...profile,
      employeeInformation: employeeInformation ? EmployeeSchemaFromApi.parse(employeeInformation) : undefined,
    };
    auth.setUser(updateUser);
  };
  const setupUserSession = useCallback(async () => {
    if (!auth.accessToken) {
      return Promise.reject(new Error('Unautorized'));
    }
    await setupUserProfile();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await setupUserSession();
      } catch {
        router.replace('/signin');
      }
    })();
  }, []);
  return <>{children}</>;
}
