'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import {
  IconDots,
  IconPlus,
  IconSettings,
  IconStar,
  IconUsers,
} from '@tabler/icons-react';
import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { toast } from 'sonner';

const WorkspacesPage = () => {
  const { openModal } = useModal();
  const { dict } = useClientDictionary();
  const workspaces = useQuery(api.workspaces.getUserWorkspaces);
  const toggleFavorite = useMutation(api.workspaces.toggleFavorite);

  const handleToggleFavorite = async (workspaceId: string) => {
    try {
      await toggleFavorite({ workspaceId: workspaceId as Id<'workspaces'> });
      toast.success(dict?.workspaces.favoriteToggled);
    } catch (error) {
      console.error(error);
      toast.error(dict?.workspaces.favoriteError);
    }
  };

  if (workspaces === undefined) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <TranslateText value="workspaces.title" />
          </h1>
          <p className="text-muted-foreground mt-1">
            <TranslateText value="workspaces.description" />
          </p>
        </div>
        <Button onClick={() => openModal('ADD_WORKSPACE')}>
          <IconPlus className="h-4 w-4 mr-2" />
          <TranslateText value="workspaces.create" />
        </Button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map(ws => (
          <Card
            key={ws._id}
            className="hover:shadow-lg transition-shadow group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={ws.imageUrl ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {ws.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate flex items-center gap-2">
                      {ws.name}
                      {ws.isFavorite && (
                        <IconStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {ws.role}
                    </Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(ws.role === 'admin' || ws.role === 'owner') && (
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/workspaces/${ws._id}/settings`}>
                          <IconSettings className="h-4 w-4 mr-2" />
                          <TranslateText value="workspaces.settings" />
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleToggleFavorite(ws._id)}
                    >
                      <IconStar className="h-4 w-4 mr-2" />
                      <TranslateText value="workspaces.toggleFavorite" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardDescription className="line-clamp-2 mt-2">
                {ws.description || (
                  <span className="text-muted-foreground/50 italic">
                    <TranslateText value="common.noDescription" />
                  </span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 mt-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUsers className="h-4 w-4" />
                <span>
                  {ws.memberCount} <TranslateText value="workspaces.members" />
                </span>
              </div>

              <Button className="w-full" asChild>
                <Link
                  href={`/dashboard/workspaces/${ws._id}`}
                  className="mt-auto"
                >
                  <TranslateText value="workspaces.open" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Create new workspace card */}
        <Card
          className="border-dashed hover:border-primary transition-colors cursor-pointer"
          onClick={() => openModal('ADD_WORKSPACE')}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <IconPlus className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold">
                <TranslateText value="workspaces.createNew" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <TranslateText value="workspaces.createNewDescription" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspacesPage;
