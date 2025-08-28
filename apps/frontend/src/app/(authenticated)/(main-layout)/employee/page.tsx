import { Main } from '@/components/layout/main';
import { TableDataProvider } from '@/components/table/table-provider';
import { defaultColums } from '@/components/employee/table-columns';
import { TableCardEmployee } from '@/components/employee/table-card';

export default function EmployeePage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardEmployee />
      </TableDataProvider>
    </Main>
  );
}
