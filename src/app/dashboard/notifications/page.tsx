import { TranslateTextServer as TranslateText } from '@/components/shared/translate/translate-text-server';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { NotificationFilter, NotificationType } from '@/convex/notifications';
import NotificationsList from '@/features/dashboard/components/notification-list';
import { DictKey } from '@/features/internationalization/get-dictionaries';
import {
  IconBell,
  IconCheck,
  IconFilter,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { fetchMutation } from 'convex/nextjs';
import Link from 'next/link';

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const params = searchParams ?? {};

  try {
    if (params.action === 'markAll') {
      await fetchMutation(api.notifications.markAllAsRead, {});
    } else if (params.action === 'mark' && params.notificationId) {
      await fetchMutation(api.notifications.markAsRead, {
        notificationId: params.notificationId as Id<'notifications'>,
      });
    } else if (params.action === 'delete' && params.notificationId) {
      await fetchMutation(api.notifications.deleteNotification, {
        notificationId: params.notificationId as Id<'notifications'>,
      });
    }
  } catch (err) {
    console.error('Notification action error', err);
  }

  const filter = (params.filter as NotificationFilter) ?? 'all';
  const typeFilter = params.type as NotificationType | undefined;
  const order = (params.order as 'asc' | 'desc') ?? 'desc';
  const notificationTypes: NotificationType[] = [
    'mention',
    'comment',
    'task_assigned',
    'task_completed',
    'team_invite',
    'workspace_invite',
    'message',
    'system',
  ];

  const buildQuery = (updates: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = { filter, type: typeFilter, order, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    return `/dashboard/notifications?${q.toString()}`;
  };

  return (
    <div className="">
      <header className="border-b shrink-0">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IconBell className="size-6" />
            <TranslateText value="notifications.title" />
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href={buildQuery({ action: 'markAll' })}>
              <IconCheck className="h-4 w-4" />
              <TranslateText value="notifications.markAllRead" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex gap-2 p-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          asChild
        >
          <Link href="/dashboard/notifications?filter=all">
            <TranslateText value="notifications.filter.all" />
          </Link>
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          asChild
        >
          <Link href={buildQuery({ filter: 'unread' })}>
            <TranslateText value="notifications.filter.unread" />
          </Link>
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          asChild
        >
          <Link href={buildQuery({ filter: 'read' })}>
            <TranslateText value="notifications.filter.read" />
          </Link>
        </Button>

        {/* Toggle Sort */}
        <Button variant="outline" size="sm" className="ml-auto" asChild>
          <Link href={buildQuery({ order: order === 'asc' ? 'desc' : 'asc' })}>
            {order === 'asc' ? (
              <IconSortAscendingLetters className="h-4 w-4" />
            ) : (
              <IconSortDescendingLetters className="h-4 w-4" />
            )}
            <TranslateText
              value={
                order === 'asc' ? 'common.sort.newest' : 'common.sort.oldest'
              }
            />
          </Link>
        </Button>
        {/* Filter type button dropdown or popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconFilter className="h-4 w-4" />
              {typeFilter ? (
                <TranslateText
                  value={`notifications.type.${typeFilter}` as DictKey}
                />
              ) : (
                <TranslateText value="notifications.filterByType" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={buildQuery({ type: undefined })}>
                <TranslateText value="notifications.allTypes" />
              </Link>
            </DropdownMenuItem>
            {notificationTypes.map(type => (
              <DropdownMenuItem key={type} asChild>
                <Link
                  href={buildQuery({ type })}
                >
                  <TranslateText
                    value={`notifications.type.${type}` as DictKey}
                  />
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grow overflow-y-auto border-t p-4">
        <NotificationsList filter={filter} type={typeFilter} order={order} />
      </div>
    </div>
  );
}
