import React from 'react';
import { Main } from '@/components/layout/main';
import { LeaveBalanceFormCard } from '@/components/leave-balance/form-card';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LeaveBalanceDetailPage({ params }: Props) {
  const { id } = await params;
  if (id == 'new') {
    return (
      <Main>
        <LeaveBalanceFormCard />;
      </Main>
    );
  }
  return (
    <Main>
      <LeaveBalanceFormCard isEdit={true} />
    </Main>
  );
}
