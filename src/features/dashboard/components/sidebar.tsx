'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { isNavItemActive } from '@/utils';
import { OrganizationSwitcher } from '@clerk/nextjs';
import {
  IconBell,
  IconCalendarEvent,
  IconChecklist,
  IconChevronRight,
  IconFiles,
  IconHome,
  IconLayoutKanban,
  IconNotes,
  IconPaint,
  IconSettings,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation: NavItem[] = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: IconHome,
    translationKey: 'nav.dashboard',
    exactMatch: true,
  },
  {
    name: 'Notes',
    href: '/dashboard/notes',
    icon: IconNotes,
    translationKey: 'nav.notes',
  },
  {
    name: 'Files',
    href: '/dashboard/files',
    icon: IconFiles,
    translationKey: 'nav.files',
  },
  {
    name: 'Whiteboard',
    href: '/dashboard/whiteboard',
    icon: IconPaint,
    translationKey: 'nav.whiteboard',
  },
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: IconChecklist,
    translationKey: 'nav.tasks',
  },
  {
    name: 'Kanban',
    href: '/dashboard/kanban',
    icon: IconLayoutKanban,
    translationKey: 'nav.kanban',
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: IconCalendarEvent,
    translationKey: 'nav.calendar',
  },
];

const secondaryNavigation: NavItem[] = [
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: IconBell,
    translationKey: 'nav.notifications',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: IconSettings,
    translationKey: 'nav.settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const renderNavItem = (item: NavItem) => {
    const isActive = isNavItemActive(pathname, item);
    const Icon = item.icon;

    const linkContent = (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center rounded-lg text-sm font-medium transition-colors h-10',
          isActive
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        )}
        title={collapsed ? item.name : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate">
              <TranslateText value={item.translationKey} />
            </span>
            {item.badge && item.badge > 0 && (
              <span className="ml-auto min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full bg-slate-500 text-white">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <TranslateText value={item.translationKey} />
            {item.badge && item.badge > 0 && (
              <span className="ml-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full bg-slate-500 text-white">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{linkContent}</div>;
  };

  return (
    <div
      className={cn(
        'bg-background border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-[65px]' : 'w-72',
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <OrganizationSwitcher
          fallback={
            <div
              className={cn(
                'flex items-center gap-2 w-full p-2 rounded-lg bg-muted',
                collapsed ? 'justify-center' : '',
              )}
            >
              <Skeleton className="size-8 rounded bg-gray-500" />
              {!collapsed && <Skeleton className="h-4 w-32 rounded" />}
            </div>
          }
          appearance={{
            elements: {
              rootBox: '!w-full',
              organizationSwitcherTrigger:
                '!flex-1 w-full bg-muted !justify-between hover:bg-accent rounded-lg text-sm' +
                (collapsed ? '!p-0' : '!px-3 !py-2'),
              organizationPreview__organizationSwitcherTrigger: collapsed
                ? '!gap-0 !flex-1 !max-w-none !w-full'
                : '',
              organizationPreviewAvatarContainer__organizationSwitcherTrigger:
                '!size-8',
              organizationPreviewTextContainer__organizationSwitcherTrigger:
                collapsed ? '!hidden' : '',
              organizationSwitcherPopoverFooter: '!hidden',
              organizationSwitcherPreviewButton__organization: '!p-3',
              organizationSwitcherPreviewButton: '!p-0 !pr-3',
              organizationSwitcherPopoverActionButton__createOrganization:
                '!p-3',
              organizationPreview__organizationSwitcherActiveOrganization:
                '!p-3',
              organizationSwitcherPopoverCard: '!rounded-sm !max-w-[350px]',
              organizationPreviewAvatarBox: 'size-8!',
              organizationSwitcherTriggerIcon: collapsed ? '!hidden' : '',
            },
          }}
          afterCreateOrganizationUrl="/dashboard"
          afterLeaveOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
          hidePersonal
        />
      </div>

      {/* Main Navigation */}
      <div className={cn('flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden')}>
        <div
          className={cn(
            'text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 transition-all duration-300',
            collapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto',
            !collapsed && 'mb-3',
          )}
        >
          <TranslateText value="nav.workspace" />
        </div>
        <nav className="space-y-1">{navigation.map(renderNavItem)}</nav>

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Secondary Navigation */}
        <div
          className={cn(
            'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3 transition-all duration-300',
            collapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto',
          )}
        >
          <TranslateText value="nav.general" />
        </div>
        <nav className="space-y-1">
          {secondaryNavigation.map(renderNavItem)}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border relative">
        {!collapsed ? (
          <div className="space-y-3 transition-all duration-300">
            {/* Quick Stats */}
            <div className="bg-accent rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium whitespace-nowrap">
                  <TranslateText value="nav.activeUsers" />
                </span>
                <span className="font-bold text-green-500 whitespace-nowrap">
                  24 online
                </span>
              </div>
            </div>
            {/* Version */}
            <div className="text-xs text-muted-foreground text-center">
              CollabHub v1.0.0
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}

        {/* Collapse/Expand Button at bottom right */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn('absolute bottom-[84px] -right-4 transition-all')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <IconChevronRight className="h-5 w-5" />
          ) : (
            <IconChevronRight className="h-5 w-5 rotate-180" />
          )}
        </Button>
      </div>
    </div>
  );
}
