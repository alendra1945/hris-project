'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { Employee } from '@/hooks/use-employee-query';
import { useEffect } from 'react';
import { useEmployeeTableData } from './table-data';
import Pagination from '../base/pagination';
import { typographyClassName } from '@/lib/contants';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const TableCardEmployee = () => {
  const { fetchDataEmployee, page, totalData, setActivePage, isLoading } = useEmployeeTableData();
  const router = useRouter();
  useEffect(() => {
    fetchDataEmployee(page);
  }, [page]);
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Employee</h1>
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => {
              router.push('/employee/new');
            }}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {(isLoading || !!totalData) && (
        <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
          <AdvancedDataTable<Employee> />
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
