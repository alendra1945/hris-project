import { Main } from '@/components/layout/main';
import { GenderOverview } from '@/components/overview/gender-overview';
import TotalOverview from '@/components/overview/total-overview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function DashboardPage() {
  return (
    <>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <div className='w-full space-y-5'>
          <TotalOverview />
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Gender Diversity Ratio</CardTitle>
            </CardHeader>
            <CardContent className='ps-2'>
              <GenderOverview />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
