'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getRandomColorById } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LeaveApplication, LeaveStatusSchema } from '@/hooks/use-leave-query';
import { useAuthStore } from '@/stores/auth-store';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from '../ui/dropdown-menu';
import { EllipsisVertical, PenIcon, Trash } from 'lucide-react';
import dayjs from 'dayjs';
import { useModal } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';
interface EmployeeInterface {}
export interface ColumnsGradebook extends Omit<EmployeeInterface, 'student_first_name' | 'student_last_name'> {
  fullname: string;
  avatar: string;
}
export const defaultColums: ColumnDef<LeaveApplication & { id: string }>[] = [
  {
    header: 'Employee',
    accessorKey: 'employeeName',
    cell: ({ row, renderValue }) => {
      return (
        <div className={cn('flex items-center gap-2')}>
          <Avatar className={cn('size-8 shadow-xs')}>
            <AvatarFallback
              className='capitalize font-medium text-white text-xs'
              style={{
                backgroundColor: getRandomColorById(row.index),
              }}
            >
              {row.original.employeeName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='w-fit'>
            <p className='text-sm text-ellipsis font-medium text-gray-800'>{renderValue() as string}</p>
            <p className='text-xs text-gray-600 font-medium'>({row.original.employeeNumber})</p>
            <p className='text-xs text-ellipsis ext-gray-600'>{row.original.employeeEmail}</p>
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    header: 'Approver',
    accessorKey: 'leaveApproverName',
    cell: ({ row, renderValue }) => {
      return (
        <div className={cn('flex items-center gap-2')}>
          <Avatar className={cn('size-8 shadow-xs')}>
            <AvatarFallback
              className='capitalize font-medium text-white text-xs'
              style={{
                backgroundColor: getRandomColorById(row.index),
              }}
            >
              {row.original.employeeName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='w-fit'>
            <p className='text-sm text-ellipsis font-medium text-gray-800'>{renderValue() as string}</p>
            <p className='text-xs text-gray-600 font-medium'>({row.original.leaveApproverNumber})</p>
            <p className='text-xs text-ellipsis text-gray-600'>{row.original.leaveApproverEmail}</p>
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    header: 'Date',
    accessorKey: 'startDate',
    cell: ({ row }) => {
      return (
        <div className='w-full flex gap-x-5'>
          <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>
            {dayjs(row.original.startDate).format('YYYY-MM-DD')}
          </p>
        </div>
      );
    },
  },

  {
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            'text-xs font-medium capitalize',
            LeaveStatusSchema.safeParse(row.original.status).data === 'APPROVED'
              ? 'border-green-500 text-green-600'
              : LeaveStatusSchema.safeParse(row.original.status).data === 'REJECTED'
                ? 'border-rose-500 text-rose-600'
                : 'border-yellow-500 text-yellow-600'
          )}
          variant='outline'
        >
          {row.original.status.toLowerCase()}
        </Badge>
      );
    },
  },

  {
    header: '',
    accessorKey: 'id',
    size: 5,
    cell: ({ row }) => {
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
          {LeaveStatusSchema.safeParse(row.original.status).data !== 'APPROVED' && (
            <DropdownMenuTrigger className='hover:bg-neutral-900/5 size-6 [&_svg]:size-4 ml-auto cursor-pointer'>
              <EllipsisVertical />
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent className='shadow-none border-none rounded-sm'>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/leave-balance/${row.original.id}`);
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
    },
  },
];
