import { AdvancedDataTable } from '@/components/table/components';
import { defaultColums } from './table-columns';
import { Employee, getAllEmployeeQuery } from '@/hooks/use-employee-query';
import { useEffect, useState } from 'react';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { modalEventSubject } from '@/hooks/use-modal-store';
import { useSubscribe } from '@/hooks/use-subscribe';
import { getAllLeaveQuery, useDeleteLeaveMutation, LeaveApplication } from '@/hooks/use-leave-query';
import { toast } from 'sonner';

export const useLeaveTableData = () => {
  const [page, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [{ isLoading }, { setIsLoading, setInternalData }] = useTableDataContext<LeaveApplication>();
  const { mutateAsync: deleteLeaveQuery } = useDeleteLeaveMutation();
  const fetchDataLeave = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllLeaveQuery({
        page: page,
        limit: 10,
      });
      setInternalData(data.data || []);
      setTotalData(data.pagination.total);
      return data;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const deleteLeave = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteLeaveQuery(id);
      setActivePage(1);
      fetchDataLeave(1);
      toast.success('Leave deleted successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to delete leave');
    }
  };
  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      console.log(data.detail);
      if (status === 'close' && type == 'alertDelete' && data?.isConfirm && data?.detail?.id) {
        deleteLeave(data.detail.id);
      }
    },
    disabled: false,
  });
  return {
    fetchDataLeave,
    page,
    totalData,
    isLoading,
    setActivePage,
  };
};
