'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DictKey } from '@/features/internationalization/get-dictionaries';
import {
  IconCalendar,
  IconChartBar,
  IconChecklist,
  IconFile,
  IconLayoutKanban,
  IconNote,
  IconSettings,
  IconUsers,
  TablerIcon,
} from '@tabler/icons-react';
import Link from 'next/link';

type QuickAction = {
  href: string;
  label: DictKey;
  icon: TablerIcon;
};

type Stat = {
  label: DictKey;
  value: number;
  icon: TablerIcon;
};

export default function WorkspaceDetailPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  // TODO: fetch workspace data from Convex
  const workspace = {
    _id: params.workspaceId,
    name: 'CollabHub Team',
    description: 'Main development workspace',
    imageUrl: null,
    memberCount: 12,
    role: 'admin',
  };

  const stats: Stat[] = [
    { label: 'workspaces.stats.notes', value: 24, icon: IconNote },
    { label: 'workspaces.stats.tasks', value: 48, icon: IconChecklist },
    { label: 'workspaces.stats.files', value: 156, icon: IconFile },
    {
      label: 'workspaces.stats.members',
      value: workspace.memberCount,
      icon: IconUsers,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      href: `/dashboard/workspaces/${params.workspaceId}/notes/new`,
      label: 'workspaces.quickActions.createNote',
      icon: IconNote,
    },
    {
      href: `/dashboard/workspaces/${params.workspaceId}/tasks/new`,
      label: 'workspaces.quickActions.createTask',
      icon: IconChecklist,
    },
    {
      href: `/dashboard/workspaces/${params.workspaceId}/files/upload`,
      label: 'workspaces.quickActions.uploadFile',
      icon: IconFile,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      user: 'John Doe',
      action: 'created a new task',
      target: 'Implement authentication',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: 'Jane Smith',
      action: 'uploaded a file',
      target: 'design-mockup.fig',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      user: 'Mike Johnson',
      action: 'completed a task',
      target: 'Setup CI/CD pipeline',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={workspace.imageUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {workspace.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            <p className="text-muted-foreground">{workspace.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/members`}>
              <IconUsers className="h-4 w-4" />
              <TranslateText value="workspaces.members" />
            </Link>
          </Button>
          {workspace.role === 'admin' && (
            <Button variant="outline" asChild>
              <Link
                href={`/dashboard/workspaces/${params.workspaceId}/settings`}
              >
                <IconSettings className="h-4 w-4" />
                <TranslateText value="workspaces.settings" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">
                  <TranslateText value={stat.label} />
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="workspaces.quickActions.title" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {quickActions.map(action => (
            <Button key={action.href} variant="outline" asChild>
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                <TranslateText value={action.label} />
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}`}>
              <IconChartBar className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.overview" />
            </Link>
          </TabsTrigger>
          <TabsTrigger value="notes" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/notes`}>
              <IconNote className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.notes" />
            </Link>
          </TabsTrigger>
          <TabsTrigger value="tasks" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/tasks`}>
              <IconChecklist className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.tasks" />
            </Link>
          </TabsTrigger>
          <TabsTrigger value="kanban" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/kanban`}>
              <IconLayoutKanban className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.kanban" />
            </Link>
          </TabsTrigger>
          <TabsTrigger value="files" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/files`}>
              <IconFile className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.files" />
            </Link>
          </TabsTrigger>
          <TabsTrigger value="calendar" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/calendar`}>
              <IconCalendar className="h-4 w-4" />
              <TranslateText value="workspaces.tabs.calendar" />
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslateText value="workspaces.recentActivity" />
              </CardTitle>
              <CardDescription>
                <TranslateText value="workspaces.recentActivityDescription" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b last:border-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {activity.user.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
