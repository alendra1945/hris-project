'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Employee, StatusSchema } from '@/hooks/use-employee-query';
import { cn, getRandomColorById } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, PenIcon, Trash } from 'lucide-react';
import CopyBtn from '../base/copy-btn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

import { useModal } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';
interface EmployeeInterface {}
export interface ColumnsGradebook extends Omit<EmployeeInterface, 'student_first_name' | 'student_last_name'> {
  fullname: string;
  avatar: string;
}

type DataColumnEmployee = Employee & { id: string };
type CellContextEmployee = CellContext<DataColumnEmployee, any>; //eslint-disable-line

export const MenuColumns = ({ row }: CellContextEmployee) => {
  const { auth } = useAuthStore();
  const { onOpen } = useModal();
  const router = useRouter();
  const handleDelete = () => {
    onOpen('alertConfirmation', {
      alertConfirmation: {
        detail: {
          id: row.original.id,
        },
      },
    });
  };
  return (
    <DropdownMenu>
      {auth.user?.employeeInformation?.employeeNumber !== row.original.employeeNumber && (
        <DropdownMenuTrigger className='hover:bg-neutral-900/5 size-6 [&_svg]:size-4 ml-auto cursor-pointer'>
          <EllipsisVertical />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className='shadow-none border-none rounded-sm'>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/employee/${row.original.id}`);
          }}
        >
          <PenIcon className='size-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleDelete();
          }}
          className='text-red-400 hover:!text-red-500'
        >
          <Trash className='size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ColumnEmployee = ({ row, renderValue }: CellContextEmployee) => {
  const { auth } = useAuthStore();
  return (
    <div className={cn('flex items-center gap-2')}>
      <Avatar className={cn('size-8 shadow-xs')}>
        <AvatarFallback
          className='capitalize font-medium text-white text-xs'
          style={{
            backgroundColor: getRandomColorById(row.index),
          }}
        >
          {row.original.firstName?.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='w-fit'>
        <p className='text-sm text-ellipsis font-medium text-gray-800'>
          {renderValue() as string}
          {auth.user?.employeeInformation?.employeeNumber === row.original.employeeNumber && (
            <span className='font-bold pl-2 text-rose-500'>(You)</span>
          )}
        </p>
        <p className='text-xs text-ellipsis'>{row.original.companyEmail}</p>
      </div>
    </div>
  );
};
export const defaultColums: ColumnDef<DataColumnEmployee>[] = [
  {
    header: 'Employee',
    accessorFn: (row) => (row.firstName + ' ' + row.lastName).trim(),
    cell: ColumnEmployee,
    size: 250,
  },
  {
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            'text-xs font-medium capitalize',
            StatusSchema.safeParse(row.original.status).data == 'ACTIVE'
              ? 'border-green-500 text-green-600'
              : 'border-rose-500 text-rose-600'
          )}
          variant='outline'
        >
          {row.original.status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: 'ID',
    accessorKey: 'employeeNumber',
    cell: ({ row }) => {
      return (
        <div className='w-full flex gap-x-5'>
          <p className='text-sm text-gray-600 hover:text-gray-700 font-medium'>{row.original.employeeNumber}</p>
          <CopyBtn value={row.original.employeeNumber} />
        </div>
      );
    },
  },
  {
    header: 'Department',
    accessorKey: 'department',
    cell: ({ row }) => {
      return (
        <div className='w-full flex gap-x-5'>
          <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>{row.original.department}</p>
        </div>
      );
    },
  },
  {
    header: '',
    accessorKey: 'id',
    size: 5,
    cell: MenuColumns,
  },
];
