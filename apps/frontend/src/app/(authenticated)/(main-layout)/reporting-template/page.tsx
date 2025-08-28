import { Main } from '@/components/layout/main';
import { TableDataProvider } from '@/components/table/table-provider';
import { defaultColums } from '@/components/reporting-templates/table-columns';
import { TableCardReportTemplate } from '@/components/reporting-templates/table-card';

export default function EmployeePage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardReportTemplate />
      </TableDataProvider>
    </Main>
  );
}
