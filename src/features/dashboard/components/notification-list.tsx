'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import type { NotificationFilter, NotificationType } from '@/convex/notifications';
import { IconCheck, IconExternalLink, IconTrash } from '@tabler/icons-react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationListProps {
  filter: NotificationFilter;
  type?: NotificationType;
  order?: 'asc' | 'desc';
}

export default function NotificationsList({ filter, type, order }: NotificationListProps) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.notifications.getUserNotifications,
    { filter, type, order },
    { initialNumItems: 10 },
  );

  const markAsRead = useMutation(api.notifications.markAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleMark = async (notificationId: string) => {
    try {
      await markAsRead({
        notificationId: notificationId as Id<'notifications'>,
      });
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification({
        notificationId: notificationId as Id<'notifications'>,
      });
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  if (status === 'LoadingFirstPage') {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <TranslateText value="notifications.empty" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {results.map(n => (
        <Card
          key={n._id}
          className={n.read ? '' : 'border-primary/50 bg-primary/5'}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {n.actorImageUrl && (
                <Avatar>
                  <AvatarImage src={n.actorImageUrl} />
                  <AvatarFallback>
                    {n.actorName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{n.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {n.type}
                    </Badge>
                    {!n.read && (
                      <Badge variant="default" className="text-xs">
                        <TranslateText value="common.new" />
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMark(n._id)}
                      >
                        <IconCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(n._id)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{n.message}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {n.actorName && <span>{n.actorName}</span>}
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(n._creationTime ?? Date.now(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {n.actionUrl && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    asChild
                  >
                    <a
                      href={n.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TranslateText value="notifications.viewDetails" />
                      <IconExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {status === 'CanLoadMore' && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => loadMore(10)}>
            <TranslateText value="common.loadMore" />
          </Button>
        </div>
      )}

      {status === 'LoadingMore' && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" disabled>
            <TranslateText value="common.loading" />
          </Button>
        </div>
      )}
    </div>
  );
}
