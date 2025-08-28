'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { LeaveApplication } from '@/hooks/use-leave-query';
import { useEffect } from 'react';
import { useLeaveTableData } from './table-data';
import Pagination from '../base/pagination';
import { typographyClassName } from '@/lib/contants';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const TableCardLeaveBalance = () => {
  const { fetchDataLeave, page, totalData, setActivePage, isLoading } = useLeaveTableData();
  const router = useRouter();
  useEffect(() => {
    fetchDataLeave(page);
  }, [page]);
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Leave Balance</h1>
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => {
              router.push('/leave-balance/new');
            }}
          >
            Add Leave Application
          </Button>
        </div>
      </div>

      {(isLoading || !!totalData) && (
        <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
          <AdvancedDataTable<LeaveApplication> />
          <div className='flex justify-end px-2'>
            <Pagination limit={10} page={page} total={totalData} onPageChange={(page) => setActivePage(page)} />
          </div>
        </div>
      )}
      {!isLoading && !totalData && (
        <div className='w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center'>
          <Image src='/empty.svg' alt='no-data' width={200} height={200} />
          <p className={typographyClassName.p}>No data available</p>
        </div>
      )}
    </>
  );
};
