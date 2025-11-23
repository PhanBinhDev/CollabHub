/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { revokeAllOtherSessions, revokeSession } from '@/app/actions/session';
import TranslateText from '@/components/shared/translate/translate-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { formatLocation, getDeviceIcon } from '@/utils/session';
import { useReverification, useSession, useUser } from '@clerk/nextjs';
import { IconMapPin, IconRefresh } from '@tabler/icons-react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const SessionsManagement = () => {
  const router = useRouter();
  const { user } = useUser();
  const { session: currentSession } = useSession();
  const { dict } = useClientDictionary();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const activeToasts = useRef<Map<string, string | number>>(new Map());
  const pendingSessions = useQuery(
    api.sessions.getPendingSessions,
    user?.id ? { clerkUserId: user.id } : 'skip',
  );

  const prevPendingRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!pendingSessions) return;

    const currentPending = new Set(pendingSessions.map(p => p.sessionId));
    const prevPending = prevPendingRef.current;

    for (const sessionId of prevPending) {
      if (!currentPending.has(sessionId)) {
        const toastId = activeToasts.current.get(sessionId);
        if (toastId !== undefined) {
          toast.success(
            dict?.settings.account.sessions.revokeSuccess || 'Session revoked',
            { id: toastId },
          );
          activeToasts.current.delete(sessionId);
        }
      }
    }

    // update prev
    prevPendingRef.current = currentPending;
  }, [pendingSessions, dict]);

  const pendingSessionIds = useMemo(
    () => new Set(pendingSessions?.map(p => p.sessionId) || []),
    [pendingSessions],
  );

  const fetchSessions = useCallback(async () => {
    if (!user) return;

    try {
      const userSessions = await user.getSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user, fetchSessions, pendingSessionIds]);

  const revokeSessionAction = useReverification(revokeSession);
  const revokeAllOthersAction = useReverification(revokeAllOtherSessions);

  const handleRevokeSession = async (sessionId: string) => {
    const toastId = toast.loading(
      dict?.settings.account.sessions.revoking || 'Revoking session...',
    );
    activeToasts.current.set(sessionId, toastId);

    try {
      const result = await revokeSessionAction(sessionId);

      if (!result?.success) {
        activeToasts.current.delete(sessionId);
        toast.error(dict?.settings.account.sessions.revokeError, {
          id: toastId,
        });
      }
      // Success will be handled when pendingSessions updates
    } catch (error) {
      console.error('Revoke session error:', error);
      activeToasts.current.delete(sessionId);
      toast.error(dict?.settings.account.sessions.revokeError, { id: toastId });
    }
  };

  const handleSignOutAllOthers = async () => {
    if (!currentSession?.id) return;

    const otherSessions = sessions.filter(s => s.id !== currentSession.id);
    const toastId = toast.loading(
      dict?.settings.account.sessions.revokingAllSessions ||
        'Revoking all sessions...',
    );

    // Track all sessions with same toast
    otherSessions.forEach(s => {
      activeToasts.current.set(s.id, toastId);
    });

    try {
      const result = await revokeAllOthersAction(currentSession.id);

      if (!result?.success) {
        otherSessions.forEach(s => activeToasts.current.delete(s.id));
        toast.error(dict?.settings.account.sessions.signOutAllError, {
          id: toastId,
        });
      }
      // Success will be handled when all sessions complete
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      otherSessions.forEach(s => activeToasts.current.delete(s.id));
      toast.error(dict?.settings.account.sessions.signOutAllError, {
        id: toastId,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-start justify-between gap-4">
          <div>
            <CardTitle>
              <TranslateText value="settings.account.sessions.title" />
            </CardTitle>
            <CardDescription>
              <TranslateText value="settings.account.sessions.description" />
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                const toastId = toast.loading(dict?.common.refreshing);
                try {
                  await fetchSessions();
                  router.refresh();
                  user?.reload();
                  toast.success(dict?.common.refreshSuccess, { id: toastId });
                } catch {
                  toast.error(dict?.common.refreshError, { id: toastId });
                }
              }}
              aria-label="Refresh sessions"
            >
              <IconRefresh className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingSessions ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <>
            {sessions.map(session => {
              const DeviceIcon = getDeviceIcon(
                session.latestActivity?.deviceType,
                session.latestActivity?.isMobile,
              );
              const location = formatLocation(
                session.latestActivity?.city,
                session.latestActivity?.country,
              );

              const isPending = pendingSessionIds.has(session.id);

              return (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <DeviceIcon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">
                          {session.latestActivity?.browserName || 'Unknown'}{' '}
                          {session.latestActivity?.browserVersion &&
                            `v${session.latestActivity.browserVersion}`}
                        </p>
                        {session.id === currentSession?.id && (
                          <Badge variant="secondary" className="h-5">
                            <TranslateText value="settings.account.sessions.current" />
                          </Badge>
                        )}
                        {session.status === 'active' && (
                          <Badge variant="default" className="h-5">
                            <TranslateText value="settings.account.sessions.active" />
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <IconMapPin className="h-3.5 w-3.5" />
                          <span>{location}</span>
                        </div>
                        {session.latestActivity?.ipAddress && (
                          <span>IP: {session.latestActivity.ipAddress}</span>
                        )}
                        <span>
                          Last active:{' '}
                          {new Date(session.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {session.id !== currentSession?.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRevokeSession(session.id)}
                      loading={isPending}
                      disabled={isPending}
                    >
                      <TranslateText value="settings.account.sessions.revoke" />
                    </Button>
                  )}
                </div>
              );
            })}

            {sessions.filter(s => s.id !== currentSession?.id).length > 0 && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOutAllOthers}
                  disabled={pendingSessionIds.size > 0}
                >
                  <TranslateText value="settings.account.sessions.signOutAllOthers" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            <TranslateText value="settings.account.sessions.noSessions" />
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsManagement;
