'use client';
import Loading from '@/components/ui/loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, []);
  return (
    <div className='flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Loading type='app' />
      </div>
    </div>
  );
}
