import { Main } from '@/components/layout/main';
import { TableDataProvider } from '@/components/table/table-provider';
import { defaultColums } from '@/components/employee/table-columns';
import { TableCardEmployee } from '@/components/employee/table-card';
import { typographyClassName } from '@/lib/contants';
import { Button } from '@/components/ui/button';

export default function EmployeePage() {
  return (
    <Main className='pt-16'>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Employee</h1>
        <div className='flex items-center space-x-2'>
          <Button>Download</Button>
        </div>
      </div>
      {/* <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
       
        </div> */}
      <TableDataProvider columns={defaultColums}>
        <TableCardEmployee />
      </TableDataProvider>
    </Main>
  );
}
