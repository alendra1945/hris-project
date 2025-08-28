import { Employee, getAllEmployeeQuery, useDeleteEmployeeMutation } from '@/hooks/use-employee-query';
import { modalEventSubject } from '@/hooks/use-modal-store';
import { useSubscribe } from '@/hooks/use-subscribe';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useEmployeeTableData = () => {
  const [page, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [{ isLoading }, { setIsLoading, setInternalData }] = useTableDataContext<Employee>();
  const { mutateAsync: deleteEmployeeQuery } = useDeleteEmployeeMutation();
  const fetchDataEmployee = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllEmployeeQuery({
        page: page,
        limit: 10,
      });
      setInternalData(data.data || []);
      setTotalData(data.pagination.total);
      return data;
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);
  const deleteEmployee = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteEmployeeQuery(id);
      setActivePage(1);
      fetchDataEmployee(1);
      toast.success('Employee deleted successfully');
    } catch {
      setIsLoading(false);
      toast.error('Failed to delete employee');
    }
  };
  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      if (status === 'close' && type == 'alertConfirmation' && data?.isConfirm && data?.detail?.id) {
        deleteEmployee(data.detail.id);
      }
    },
    disabled: false,
  });
  return {
    fetchDataEmployee,
    page,
    totalData,
    setActivePage,
    isLoading,
  };
};
