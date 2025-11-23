'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { isNavItemActive } from '@/utils';
import {
  IconBell,
  IconCalendarEvent,
  IconChecklist,
  IconChevronLeft,
  IconChevronRight,
  IconFiles,
  IconHome,
  IconLayoutKanban,
  IconNotes,
  IconPaint,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import Image from 'next/image';
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
    name: 'Workspaces',
    href: '/dashboard/workspaces',
    icon: IconUsers,
    translationKey: 'nav.workspaces',
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
      <div className="h-16 flex items-center justify-between px-3 border-b border-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="CollabHub"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">
                <TranslateText value="app.name" />
              </span>
              <span className="text-xs text-muted-foreground">
                <TranslateText value="nav.realtimeWorkspace" />
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="CollabHub"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </Link>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            <IconChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Toggle button when collapsed */}
      {collapsed && (
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            <IconChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <div
        className={cn(
          'flex-1 px-3 pb-4 overflow-y-auto overflow-x-hidden',
          collapsed ? 'pt-0' : 'pt-4',
        )}
      >
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
      <div className="p-4 border-t border-border overflow-hidden">
        {!collapsed ? (
          <div
            className={cn(
              'space-y-3 transition-all duration-300',
              collapsed ? 'opacity-0' : 'opacity-100',
            )}
          >
            {/* Quick Stats */}
            <div className="bg-accent rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium whitespace-nowrap">
                  <TranslateText value="nav.activeUsers" />
                </span>
                <span className="font-bold text-primary whitespace-nowrap">
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
      </div>
    </div>
  );
}
