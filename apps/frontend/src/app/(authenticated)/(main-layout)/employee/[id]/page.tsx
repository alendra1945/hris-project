import React from 'react';
import { Main } from '@/components/layout/main';
import { EmployeeFormCard } from '@/components/employee/form-card';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EmployeeDetailPage({ params }: Props) {
  const { id } = await params;
  if (id == 'new') {
    return (
      <Main>
        <EmployeeFormCard />;
      </Main>
    );
  }
  return (
    <Main>
      <EmployeeFormCard isEdit />
    </Main>
  );
}
