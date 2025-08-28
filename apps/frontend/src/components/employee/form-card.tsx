'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '../ui/date-picker';
import {
  EmployeeSchema,
  Employee,
  GenderSchema,
  StatusSchema,
  useCreateEmployeeMutation,
  EmployeeSchemaFromApi,
  useDetailEmployeeQuery,
  useUpdateEmployeeMutation,
} from '@/hooks/use-employee-query';
import { SelectDropdown } from '../base/select-dropdown';
import { Textarea } from '../ui/textarea';
import { typographyClassName } from '@/lib/contants';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

type UserActionDialogProps = {
  isEdit?: boolean;
};
const defaultValues = {
  employeeNumber: '',
  status: StatusSchema.enum.ACTIVE,
  branch: '',
  department: '',

  firstName: '',
  lastName: '',
  birthDate: new Date(),

  companyEmail: '',
  phoneNumber: '',
  gender: GenderSchema.enum.MALE,
  address: '',
};
export function EmployeeFormCard({ isEdit }: UserActionDialogProps) {
  const params = useParams<{ id: string }>();
  const { data } = useDetailEmployeeQuery(isEdit ? params.id : undefined);
  const { mutateAsync: createEmployee } = useCreateEmployeeMutation();
  const { mutateAsync: updateEmployee } = useUpdateEmployeeMutation();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(EmployeeSchema),
    values: {
      ...defaultValues,
      ...(isEdit &&
        data && {
          ...EmployeeSchemaFromApi.parse(data),
          employeeNumber: EmployeeSchemaFromApi.parse(data).employeeNumber.slice(6),
        }),
    },
  });

  const onSubmit = async (values: Employee) => {
    try {
      const payload = {
        ...values,
        employeeNumber: 'HR-MD-' + values.employeeNumber.toUpperCase(),
      };
      if (isEdit) {
        await updateEmployee({
          id: params.id,
          payload,
        });
        toast.success('Employee updated');
      } else {
        await createEmployee(payload);
        toast.success('Employee created');
      }
      router.push('/employee');
    } catch (error) {
      if (isEdit) {
        toast.error('Employee update failed');
      } else {
        toast.error('Employee creation failed');
      }
    }
  };

  return (
    <div className='w-full h-full'>
      <Form {...form}>
        <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 px-0.5'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold tracking-tight'>Employee Form</h1>
            <Button>{isEdit ? 'Update' : 'Save'}</Button>
          </div>
          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Joining</h2>
            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='employeeNumber'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Employee Number</FormLabel>
                    <FormControl className='w-full'>
                      <div className='w-full relative h-fit'>
                        <div className='h-full absolute text-gray-700 top-0 left-0 w-20 text-muted text-sm border rounded bg-gray-50 font-semibold text-center flex items-center justify-center'>
                          HR-MD
                        </div>
                        <Input placeholder='0001' className='col-span-4 pl-24' autoComplete='off' {...field} />
                      </div>
                    </FormControl>

                    <FormMessage className='' />
                  </FormItem>
                )}
              />

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
                      items={StatusSchema.options.map((value) => ({
                        label: value.toLowerCase(),
                        value: value,
                      }))}
                    />
                    <FormMessage className='' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dateOfJoining'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date of Joining</FormLabel>
                    <DatePicker selected={field.value} onSelect={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='branch'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Branch</FormLabel>
                    <FormControl>
                      <Input placeholder='branch' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Department</FormLabel>
                    <FormControl>
                      <Input placeholder='department' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Profile</h2>

            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Dwi' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Ipang' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Date of birth</FormLabel>
                    <DatePicker selected={field.value} onSelect={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='companyEmail'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='test@example.com' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='08xxxx' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='cols-span-1'>
                    <FormLabel className='required'>Gender</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select gender'
                      className='capitalize'
                      items={GenderSchema.options.map((value) => ({
                        label: value.toLowerCase(),
                        value: value,
                      }))}
                    />
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='cols-span-2'>
                    <FormLabel className=''>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Address' className='w-full' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
