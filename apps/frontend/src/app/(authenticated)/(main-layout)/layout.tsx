'use client';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { AppLogo } from '@/components/layout/app-logo';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { TopNav } from '@/components/layout/top-nav';
import { LayoutDashboard, ListTodo, Users, UserSearchIcon } from 'lucide-react';

const topNav = [
  {
    title: 'Overview',
    href: '/dashboard',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Employee Lifecycle',
    href: '/employee',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Shift & Attendance',
    href: 'dashboard/shift-attendance',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Leaves',
    href: 'dashboard/leaves',
    isActive: false,
    disabled: true,
  },
];

export const navGroups = [
  {
    title: '',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Employee Information',
        icon: Users,
        items: [
          {
            title: 'List',
            url: '/employee',
          },
          {
            title: 'Leave Balance',
            url: '/leave-balance',
          },
        ],
      },
      {
        title: 'Report',
        icon: ListTodo,
        items: [
          {
            title: 'Templates',
            url: '/reporting-template',
          },
        ],
      },
      {
        title: 'Users',
        icon: UserSearchIcon,
        items: [
          {
            title: 'List',
            url: '/members',
          },
        ],
      },
    ],
  },
];
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className='smooth-scroll'>
          {navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </AppSidebar>
      <SidebarInset
        className={cn(
          'has-[[data-layout=fixed]]:h-svh',
          'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',
          '@container/content'
        )}
      >
        <Header>
          <TopNav links={topNav} />
        </Header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
