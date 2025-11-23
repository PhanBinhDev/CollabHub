'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import {
  IconApps,
  IconBell,
  IconLanguage,
  IconSettings,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsNav: NavItem[] = [
  {
    translationKey: 'settings.nav.account',
    href: '/dashboard/settings',
    icon: IconUser,
    name: 'Account',
  },
  {
    translationKey: 'settings.nav.notifications',
    href: '/dashboard/settings/notifications',
    icon: IconBell,
    name: 'Notifications',
  },
  {
    translationKey: 'settings.nav.language',
    href: '/dashboard/settings/language',
    icon: IconLanguage,
    name: 'Language',
  },
  {
    translationKey: 'settings.nav.apps',
    href: '/dashboard/settings/apps',
    icon: IconApps,
    name: 'Apps',
  },
  {
    translationKey: 'settings.nav.team',
    href: '/dashboard/settings/team',
    icon: IconUsers,
    name: 'Team',
  },
];

const DashboardSettingsLayout = ({ children }: IChildren) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="border-b shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-2 p-4">
          <IconSettings className="size-6" />
          <TranslateText value="settings.title" />
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Fixed */}
        <aside className="w-64 shrink-0 border-r overflow-hidden">
          <nav className="p-4 space-y-1">
            {settingsNav.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <TranslateText value={item.translationKey} />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSettingsLayout;
