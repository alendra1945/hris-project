'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { defaultColums } from './table-columns';
import { Employee, getAllEmployeeQuery } from '@/hooks/use-employee-query';
import { useEffect } from 'react';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { useEmployeeTableData } from './table-data';
// import { useTableGradebookColumns, ColumnsGradebook } from './table-colums';
// import { useAppSelector } from '@gk-app/stores/setup-store';
// import EmptyItem from '@/components/empty/empty-item';
// import { useTableDataContext } from '@/hooks/use-table-hooks';

export const TableCardEmployee = () => {
  const { fetchDataEmployee } = useEmployeeTableData();

  useEffect(() => {
    fetchDataEmployee();
  }, []);
  return (
    <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
      <AdvancedDataTable<Employee> />
    </div>
  );
};
