'use client';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { sidebarData } from '@/components/layout/data/sidebar-data';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { TeamSwitcher } from '@/components/layout/team-switcher';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
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
          // If layout is fixed, set the height
          // to 100svh to prevent overflow
          'has-[[data-layout=fixed]]:h-svh',

          // If layout is fixed and sidebar is inset,
          // set the height to 100svh - 1rem (total margins) to prevent overflow
          // 'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-1rem)]',
          'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',

          // Set content container, so we can use container queries
          '@container/content'
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
