'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';
import { SelectDropdown } from '../base/select-dropdown';
import { GenderSchema } from '@/hooks/use-employee-query';
import { Textarea } from '../ui/textarea';
import { useAuthStore } from '@/stores/auth-store';
import { useUpdateUserDetailMutation, ProfileSchema } from '@/hooks/use-user-query';
import { toast } from 'sonner';

export function FormProfile() {
  const { auth } = useAuthStore();
  const { mutateAsync: updateUserDetail } = useUpdateUserDetailMutation();
  console.log(auth.user?.employeeInformation);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: standardSchemaResolver(ProfileSchema),
    mode: 'onChange',
    values: auth.user?.employeeInformation! || {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      gender: GenderSchema.enum.MALE,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      await updateUserDetail({ payload: values });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
        <CardDescription>update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
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
            </div>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
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
              <div className='flex flex-col space-y-2'>
                <FormLabel className='text-gray-500'>Company Email</FormLabel>
                <Input
                  placeholder='test@example.com'
                  className='col-span-4'
                  autoComplete='off'
                  defaultValue={auth.user?.employeeInformation?.companyEmail}
                  disabled
                />
              </div>
            </div>
            <div className='grid md:grid-cols-2 gap-x-2 items-start space-y-4'>
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
                      isControlled
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
            <div className='flex justify-end'>
              <Button disabled={form.formState.isSubmitting} type='submit'>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
