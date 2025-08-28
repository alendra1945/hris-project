import { Main } from '@/components/layout/main';
import { TableDataProvider } from '@/components/table/table-provider';
import { defaultColums } from '@/components/leave-balance/table-columns';
import { TableCardLeaveBalance } from '@/components/leave-balance/table-card';

export default function EmployeePage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardLeaveBalance />
      </TableDataProvider>
    </Main>
  );
}
