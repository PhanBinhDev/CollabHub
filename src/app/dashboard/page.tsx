'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import {
  IconActivity,
  IconArrowRight,
  IconCalendar,
  IconFileText,
  IconFolders,
  IconPaint,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';
import { useQuery } from 'convex/react';
import Link from 'next/link';

const DashboardPage = () => {
  const user = useQuery(api.users.currentUser);

  const stats = {
    workspaces: 0,
    documents: 3,
    collaborators: 5,
    todayActivity: 12,
  };

  const userName =
    ((user?.firstName || '') + ' ' + (user?.lastName || '')).trim() || 'User';

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            <TranslateText
              value="dashboard.welcome.title"
              params={{ name: userName }}
            />{' '}
            <span>👋</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            <TranslateText value="dashboard.welcome.subtitle" />
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <TranslateText value="dashboard.stats.workspaces.title" />
              </CardTitle>
              <IconFolders className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.workspaces}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.workspaces === 0 ? (
                  <TranslateText value="dashboard.stats.workspaces.empty" />
                ) : (
                  <TranslateText
                    value="dashboard.stats.workspaces.active"
                    params={{ count: stats.workspaces }}
                  />
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <TranslateText value="dashboard.stats.documents.title" />
              </CardTitle>
              <IconFileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.documents === 0 ? (
                  <TranslateText value="dashboard.stats.documents.empty" />
                ) : (
                  <TranslateText
                    value="dashboard.stats.documents.recent"
                    params={{ count: stats.documents }}
                  />
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <TranslateText value="dashboard.stats.collaborators.title" />
              </CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.collaborators}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.collaborators === 0 ? (
                  <TranslateText value="dashboard.stats.collaborators.empty" />
                ) : (
                  <TranslateText
                    value="dashboard.stats.collaborators.active"
                    params={{ count: stats.collaborators }}
                  />
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <TranslateText value="dashboard.stats.activity.title" />
              </CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayActivity}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.todayActivity === 0 ? (
                  <TranslateText value="dashboard.stats.activity.empty" />
                ) : (
                  <TranslateText
                    value="dashboard.stats.activity.updates"
                    params={{ count: stats.todayActivity }}
                  />
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TranslateText value="dashboard.quickActions.title" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/dashboard/notes?action=new">
                  <IconFileText className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    <TranslateText value="dashboard.quickActions.newDocument" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/dashboard/whiteboard?action=new">
                  <IconPaint className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    <TranslateText value="dashboard.quickActions.newWhiteboard" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/dashboard/workspaces?action=new">
                  <IconFolders className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    <TranslateText value="dashboard.quickActions.newWorkspace" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/dashboard/workspaces?action=invite">
                  <IconUserPlus className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    <TranslateText value="dashboard.quickActions.inviteTeam" />
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <TranslateText value="dashboard.recentDocuments.title" />
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/files">
                  <TranslateText value="dashboard.recentDocuments.viewAll" />
                  <IconArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <IconFileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  <TranslateText value="dashboard.recentDocuments.empty" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <TranslateText value="dashboard.recentDocuments.emptyDescription" />
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex h-8 flex-row items-center justify-between">
              <CardTitle>
                <TranslateText value="dashboard.recentActivity.title" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <IconActivity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  <TranslateText value="dashboard.recentActivity.empty" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <TranslateText value="dashboard.recentActivity.emptyDescription" />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <TranslateText value="dashboard.upcomingEvents.title" />
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/calendar">
                <TranslateText value="dashboard.upcomingEvents.viewCalendar" />
                <IconCalendar className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <IconCalendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                <TranslateText value="dashboard.upcomingEvents.empty" />
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <TranslateText value="dashboard.upcomingEvents.emptyDescription" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
