'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { IconBell } from '@tabler/icons-react';
import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';

export function NotificationBell() {
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <IconBell className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              <TranslateText value="notifications.title" />
            </h3>
            {unreadCount !== undefined && unreadCount > 0 && (
              <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
                <TranslateText
                  value="notifications.new"
                  params={{ count: unreadCount }}
                />
              </span>
            )}
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center py-8">
                <TranslateText value="notifications.empty" />
              </p>
            </div>
          </ScrollArea>

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            {unreadCount !== undefined && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full"
              >
                <TranslateText value="notifications.markAllRead" />
              </Button>
            )}
            <Button asChild variant="link" size="sm" className="w-full">
              <Link href="/dashboard/notifications">
                <TranslateText value="notifications.viewAll" />
              </Link>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
