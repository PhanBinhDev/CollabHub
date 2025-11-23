/* eslint-disable @typescript-eslint/no-explicit-any */
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconCrown,
  IconDotsVertical,
  IconMail,
  IconShield,
  IconUser,
  IconUserPlus,
} from '@tabler/icons-react';
import { useState } from 'react';

type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
};

const members: Member[] = [
  {
    id: '1',
    name: 'Brian F.',
    email: 'brian@example.com',
    avatar: '/avatars/brian.jpg',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'member',
    status: 'pending',
    joinedAt: '2024-11-20',
  },
];

const TeamSettings = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  const getRoleIcon = (role: Member['role']) => {
    switch (role) {
      case 'owner':
        return <IconCrown className="h-4 w-4" />;
      case 'admin':
        return <IconShield className="h-4 w-4" />;
      default:
        return <IconUser className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: Member['role']) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Member */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.team.invite.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.team.invite.description" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Select
              value={inviteRole}
              onValueChange={v => setInviteRole(v as any)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  <TranslateText value="settings.team.roles.member" />
                </SelectItem>
                <SelectItem value="admin">
                  <TranslateText value="settings.team.roles.admin" />
                </SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <IconUserPlus className="h-4 w-4 mr-2" />
              <TranslateText value="settings.team.invite.button" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.team.members.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText
              value="settings.team.members.description"
              params={{ count: members.length }}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {member.status === 'pending' && (
                        <Badge variant="outline" className="text-xs">
                          <IconMail className="h-3 w-3 mr-1" />
                          <TranslateText value="settings.team.status.pending" />
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>

                  <Badge className={getRoleColor(member.role)}>
                    <span className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      <TranslateText
                        value={`settings.team.roles.${member.role}`}
                      />
                    </span>
                  </Badge>
                </div>

                {member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <TranslateText value="settings.team.actions.changeRole" />
                      </DropdownMenuItem>
                      {member.status === 'pending' && (
                        <DropdownMenuItem>
                          <TranslateText value="settings.team.actions.resendInvite" />
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <TranslateText value="settings.team.actions.remove" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSettings;
