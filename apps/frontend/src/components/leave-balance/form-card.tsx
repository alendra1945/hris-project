'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '../ui/date-picker';
import {
  LeaveApplicationSchema,
  LeaveApplication,
  LeaveStatusSchema,
  LeaveTypeSchema,
  useCreateLeaveMutation,
  LeaveApplicationSchemaFromApi,
  useDetailLeaveQuery,
  useUpdateLeaveMutation,
} from '@/hooks/use-leave-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectDropdown } from '../base/select-dropdown';
import { Textarea } from '../ui/textarea';
import { typographyClassName } from '@/lib/contants';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Employee, getAllEmployees } from '@/hooks/use-employee-query';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';

type UserActionDialogProps = {
  isEdit?: boolean;
};

const defaultValues = {
  employeeNumber: '',
  employeeName: '',
  employeeEmail: '',
  leaveApproverNumber: '',
  leaveApproverName: '',
  leaveApproverEmail: '',
  leaveType: LeaveTypeSchema.enum.CASUAL,
  startDate: new Date(),
  endDate: new Date(),
  reason: '',
  isHalfDay: false,
  followViaEmail: false,
  status: LeaveStatusSchema.enum.OPEN,
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
export function LeaveBalanceFormCard({ isEdit = false }: UserActionDialogProps) {
  const params = useParams<{ id: string }>();
  const { data } = useDetailLeaveQuery(isEdit ? params.id : undefined);
  console.log('data', isEdit, data);
  const { mutateAsync: createLeave } = useCreateLeaveMutation();
  const { mutateAsync: updateLeave } = useUpdateLeaveMutation();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 500);
  const { data: employeesResp, isLoading } = useQuery({
    queryKey: ['search-employees', { page: 1, limit: 10, search: debouncedSearchTerm }],
    queryFn: async () => await getAllEmployees({ params: { page: 1, limit: 10, search: debouncedSearchTerm } }),
  });

  const resultDataEmployee = useMemo(() => {
    return employeesResp?.data || [];
  }, [employeesResp?.data]);

  const form = useForm({
    resolver: zodResolver(LeaveApplicationSchema),
    values: {
      ...defaultValues,
      ...(isEdit && data ? LeaveApplicationSchemaFromApi.parse(data) : {}),
    },
  });

  const onSubmit = async (values: LeaveApplication) => {
    try {
      const payload = {
        ...values,
        employeeNumber: 'HR-MD-' + values.employeeNumber.toUpperCase(),
      };
      if (isEdit) {
        await updateLeave({ id: params.id, payload });
        toast.success('Leave application updated');
      } else {
        await createLeave(payload);
        toast.success('Leave application created');
      }
      router.push('/leave-balance');
    } catch (error) {
      if (isEdit) {
        toast.error('Leave application update failed');
      } else {
        toast.error('Leave application creation failed');
      }
    }
  };
  return (
    <div className='w-full h-full'>
      <Form {...form}>
        <form id='leave-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 px-0.5'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold tracking-tight'>Leave Application Form</h1>
            <Button disabled={!form.watch('employeeNumber')}>{isEdit ? 'Update' : 'Save'}</Button>
          </div>
          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Application</h2>

            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='employeeName'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Employee</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className='flex h-10 justify-between items-center px-4 rounded-md border border-input cursor-pointer'>
                          <span className={cn(!field.value && 'text-muted-foreground')}>
                            {field.value || 'Select...'}
                          </span>
                          <ChevronsUpDown className='h-4 w-4 shrink-0 text-gray-800' />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className='w-[100vw] max-w-2xl px-4 py-3' align='center' side='bottom'>
                        <div className='relative mb-2'>
                          <Input placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className='max-h-72 overflow-auto'>
                          {resultDataEmployee.length ? (
                            resultDataEmployee.map((emp) => {
                              const fullName = `${emp.firstName} ${emp.lastName}`.trim();
                              const isSelected = fullName === field.value;
                              return (
                                <div
                                  key={emp.employeeNumber}
                                  className='cursor-pointer py-2 px-1 flex items-center justify-between hover:bg-muted rounded'
                                  onClick={() => {
                                    form.setValue('employeeName', fullName);
                                    form.setValue('employeeEmail', emp.companyEmail || '');
                                    form.setValue('employeeNumber', emp.employeeNumber || '');
                                  }}
                                >
                                  <div className='flex flex-col'>
                                    <span className='font-medium'>{fullName}</span>
                                    <span className='text-xs text-muted-foreground'>
                                      {emp.employeeNumber} • {emp.companyEmail}
                                    </span>
                                  </div>
                                  <CheckIcon
                                    className={cn('h-5 w-5 text-green-600', isSelected ? 'opacity-100' : 'opacity-0')}
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <div className='text-sm text-muted-foreground py-2'>No results found.</div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col space-y-2'>
                <FormLabel className='required text-gray-500'>Employee Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='select an employee first...'
                    autoComplete='off'
                    disabled
                    value={form.watch('employeeNumber')}
                  />
                </FormControl>
                <FormMessage />
              </div>
              <div className='flex flex-col space-y-2'>
                <FormLabel className='required text-gray-500'>CompanyEmail Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='select an employee first...'
                    autoComplete='off'
                    disabled
                    value={form.watch('employeeEmail')}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </div>

            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select status'
                      className='capitalize'
                      items={LeaveStatusSchema.options.map((value) => ({
                        label: value.toLowerCase(),
                        value,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Date</FormLabel>
                    <DatePicker
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        form.setValue('endDate', date || new Date());
                      }}
                      disabledFn={(date: Date) => date < new Date()}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='leaveType'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Leave Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select leave type'
                      className='capitalize'
                      items={LeaveTypeSchema.options.map((value) => ({
                        label: value.toLowerCase(),
                        value,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='followViaEmail'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className=''>Follow Via Email</FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(v) => field.onChange(v === 'true')}
                      placeholder='Select'
                      items={[
                        { label: 'No', value: 'false' },
                        { label: 'Yes', value: 'true' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem className='cols-span-2'>
                    <FormLabel className='required'>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Reason for leave' className='w-full' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {form.watch('employeeNumber') && (
            <div className='space-y-4'>
              <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Approver</h2>
              <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='leaveApproverName'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel className='required'>Employee</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className='flex h-10 justify-between items-center px-4 rounded-md border border-input cursor-pointer'>
                            <span className={cn(!field.value && 'text-muted-foreground')}>
                              {field.value || 'Select...'}
                            </span>
                            <ChevronsUpDown className='h-4 w-4 shrink-0 text-gray-800' />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className='w-[100vw] max-w-2xl px-4 py-3' align='center' side='bottom'>
                          <div className='relative mb-2'>
                            <Input placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                          </div>
                          <div className='max-h-72 overflow-auto'>
                            {resultDataEmployee.filter((emp) => emp.employeeNumber !== form.watch('employeeNumber'))
                              .length ? (
                              resultDataEmployee
                                .filter((emp) => emp.employeeNumber !== form.watch('employeeNumber'))
                                .map((emp) => {
                                  const fullName = `${emp.firstName} ${emp.lastName}`.trim();
                                  const isSelected = fullName === field.value;
                                  return (
                                    <div
                                      key={emp.employeeNumber}
                                      className='cursor-pointer py-2 px-1 flex items-center justify-between hover:bg-muted rounded'
                                      onClick={() => {
                                        form.setValue('leaveApproverName', fullName);
                                        form.setValue('leaveApproverEmail', emp.companyEmail || '');
                                        form.setValue('leaveApproverNumber', emp.employeeNumber || '');
                                      }}
                                    >
                                      <div className='flex flex-col'>
                                        <span className='font-medium'>{fullName}</span>
                                        <span className='text-xs text-muted-foreground'>
                                          {emp.employeeNumber} • {emp.companyEmail}
                                        </span>
                                      </div>
                                      <CheckIcon
                                        className={cn(
                                          'h-5 w-5 text-green-600',
                                          isSelected ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                    </div>
                                  );
                                })
                            ) : (
                              <div className='text-sm text-muted-foreground py-2'>No results found.</div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-col space-y-2'>
                  <FormLabel className='required text-gray-500'>Approver Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='select an approver first...'
                      autoComplete='off'
                      disabled
                      value={form.watch('leaveApproverNumber')}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
                <div className='flex flex-col space-y-2'>
                  <FormLabel className='required text-gray-500'>Approver CompanyEmail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='select an approver first...'
                      autoComplete='off'
                      disabled
                      value={form.watch('leaveApproverEmail')}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
