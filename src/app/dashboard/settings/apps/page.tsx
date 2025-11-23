'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { IconSearch, IconPlug, IconBrandSlack, IconBrandGithub, IconBrandNotion, IconBrandTrello, IconBrandDiscord } from '@tabler/icons-react';
import { useState } from 'react';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  category: 'communication' | 'productivity' | 'development';
};

const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications and updates to Slack channels',
    icon: IconBrandSlack,
    connected: true,
    category: 'communication',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Link commits and pull requests to tasks',
    icon: IconBrandGithub,
    connected: false,
    category: 'development',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync documents and notes with Notion',
    icon: IconBrandNotion,
    connected: true,
    category: 'productivity',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Import boards and cards from Trello',
    icon: IconBrandTrello,
    connected: false,
    category: 'productivity',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send notifications to Discord servers',
    icon: IconBrandDiscord,
    connected: false,
    category: 'communication',
  },
];

const AppsSettings = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = integrations.filter(
    integration =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.apps.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.apps.description" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPlug className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                <TranslateText 
                  value="settings.apps.connectedApps" 
                  params={{ count: connectedCount, total: integrations.length }}
                />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search integrations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          
          return (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      {integration.connected && (
                        <Badge variant="secondary" className="mt-1">
                          <TranslateText value="settings.apps.connected" />
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {integration.connected ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <TranslateText value="settings.apps.configure" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TranslateText value="settings.apps.disconnect" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" className="w-full">
                    <TranslateText value="settings.apps.connect" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <IconSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              <TranslateText value="settings.apps.noResults" />
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppsSettings;