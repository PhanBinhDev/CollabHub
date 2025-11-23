'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationSettings = () => {
  const settings = useQuery(api.users.getUserSettings);
  const updateSettings = useMutation(api.users.updateNotificationSettings);

  const updateEmailNotification = async (key: string, value: boolean) => {
    if (!settings) return;
    
    try {
      await updateSettings({
        emailNotifications: {
          ...settings.emailNotifications,
          [key]: value,
        },
      });
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  const updatePushNotification = async (key: string, value: boolean) => {
    if (!settings) return;
    
    try {
      await updateSettings({
        pushNotifications: {
          ...settings.pushNotifications,
          [key]: value,
        },
      });
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  const updateInAppNotification = async (key: string, value: boolean) => {
    if (!settings) return;
    
    try {
      await updateSettings({
        inAppNotifications: {
          ...settings.inAppNotifications,
          [key]: value,
        },
      });
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  if (settings === undefined) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Failed to load settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.notifications.email.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.notifications.email.description" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-workspace" className="text-sm font-medium">
                <TranslateText value="settings.notifications.email.newWorkspace" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.email.newWorkspaceDesc" />
              </p>
            </div>
            <Switch
              id="email-workspace"
              checked={settings.emailNotifications.newWorkspace}
              onCheckedChange={(val) => updateEmailNotification('newWorkspace', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-invitation" className="text-sm font-medium">
                <TranslateText value="settings.notifications.email.invitation" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.email.invitationDesc" />
              </p>
            </div>
            <Switch
              id="email-invitation"
              checked={settings.emailNotifications.invitation}
              onCheckedChange={(val) => updateEmailNotification('invitation', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-task" className="text-sm font-medium">
                <TranslateText value="settings.notifications.email.taskAssigned" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.email.taskAssignedDesc" />
              </p>
            </div>
            <Switch
              id="email-task"
              checked={settings.emailNotifications.taskAssigned}
              onCheckedChange={(val) => updateEmailNotification('taskAssigned', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-comments" className="text-sm font-medium">
                <TranslateText value="settings.notifications.email.comments" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.email.commentsDesc" />
              </p>
            </div>
            <Switch
              id="email-comments"
              checked={settings.emailNotifications.comments}
              onCheckedChange={(val) => updateEmailNotification('comments', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-weekly" className="text-sm font-medium">
                <TranslateText value="settings.notifications.email.weeklySummary" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.email.weeklySummaryDesc" />
              </p>
            </div>
            <Switch
              id="email-weekly"
              checked={settings.emailNotifications.weeklySummary}
              onCheckedChange={(val) => updateEmailNotification('weeklySummary', val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.notifications.push.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.notifications.push.description" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-messages" className="text-sm font-medium">
                <TranslateText value="settings.notifications.push.messages" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.push.messagesDesc" />
              </p>
            </div>
            <Switch
              id="push-messages"
              checked={settings.pushNotifications.messages}
              onCheckedChange={(val) => updatePushNotification('messages', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-tasks" className="text-sm font-medium">
                <TranslateText value="settings.notifications.push.taskUpdates" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.push.taskUpdatesDesc" />
              </p>
            </div>
            <Switch
              id="push-tasks"
              checked={settings.pushNotifications.taskUpdates}
              onCheckedChange={(val) => updatePushNotification('taskUpdates', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-mentions" className="text-sm font-medium">
                <TranslateText value="settings.notifications.push.mentions" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.push.mentionsDesc" />
              </p>
            </div>
            <Switch
              id="push-mentions"
              checked={settings.pushNotifications.mentions}
              onCheckedChange={(val) => updatePushNotification('mentions', val)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-reminders" className="text-sm font-medium">
                <TranslateText value="settings.notifications.push.reminders" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.push.remindersDesc" />
              </p>
            </div>
            <Switch
              id="push-reminders"
              checked={settings.pushNotifications.reminders}
              onCheckedChange={(val) => updatePushNotification('reminders', val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.notifications.inApp.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.notifications.inApp.description" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inapp-all" className="text-sm font-medium">
                <TranslateText value="settings.notifications.inApp.enableAll" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.notifications.inApp.enableAllDesc" />
              </p>
            </div>
            <Switch
              id="inapp-all"
              checked={settings.inAppNotifications.enableAll}
              onCheckedChange={(val) => updateInAppNotification('enableAll', val)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;