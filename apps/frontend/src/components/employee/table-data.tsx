import { AdvancedDataTable } from '@/components/table/components';
import { defaultColums } from './table-columns';
import { Employee, getAllEmployeeQuery } from '@/hooks/use-employee-query';
import { useEffect } from 'react';
import { useTableDataContext } from '@/hooks/use-table-hooks';

export const useEmployeeTableData = () => {
  const [, { setIsLoading, setInternalData }] = useTableDataContext<Employee[]>();
  const fetchDataEmployee = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEmployeeQuery();
      setInternalData(data.data || []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  //   useEffect(() => {
  //     setIsLoading(isLoading);
  //   }, [isLoading]);

  //   useEffect(() => {
  //     if (data) {
  //       console.log(data);
  //     }
  //   }, [data]);

  return {
    fetchDataEmployee,
  };
};
