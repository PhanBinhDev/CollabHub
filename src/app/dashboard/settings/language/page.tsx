'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TranslateText from '@/components/shared/translate/translate-text';
import { ChangeLanguage } from '@/components/shared/change-language';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const LanguageSettings = () => {
  const settings = useQuery(api.users.getUserSettings);
  const updateSettings = useMutation(api.users.updateLanguageSettings);

  const handleUpdate = async (field: string, value: string) => {
    try {
      await updateSettings({ [field]: value });
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  if (settings === undefined) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
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
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.language.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.language.description" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="space-y-3">
            <Label>
              <TranslateText value="settings.language.language" />
            </Label>
            <ChangeLanguage />
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <Label htmlFor="timezone">
              <TranslateText value="settings.language.timezone" />
            </Label>
            <Select 
              value={settings.timezone} 
              onValueChange={(val) => handleUpdate('timezone', val)}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC+7">(UTC+07:00) Bangkok, Hanoi, Jakarta</SelectItem>
                <SelectItem value="UTC+8">(UTC+08:00) Beijing, Singapore</SelectItem>
                <SelectItem value="UTC+9">(UTC+09:00) Tokyo, Seoul</SelectItem>
                <SelectItem value="UTC+0">(UTC+00:00) London</SelectItem>
                <SelectItem value="UTC-5">(UTC-05:00) New York</SelectItem>
                <SelectItem value="UTC-8">(UTC-08:00) Los Angeles</SelectItem>
                <SelectItem value="UTC+1">(UTC+01:00) Paris, Berlin</SelectItem>
                <SelectItem value="UTC+10">(UTC+10:00) Sydney</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Format */}
          <div className="space-y-3">
            <Label>
              <TranslateText value="settings.language.dateFormat" />
            </Label>
            <RadioGroup 
              value={settings.dateFormat} 
              onValueChange={(val) => handleUpdate('dateFormat', val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd/mm/yyyy" id="date1" />
                <Label htmlFor="date1" className="font-normal cursor-pointer">
                  DD/MM/YYYY (22/11/2025)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm/dd/yyyy" id="date2" />
                <Label htmlFor="date2" className="font-normal cursor-pointer">
                  MM/DD/YYYY (11/22/2025)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yyyy-mm-dd" id="date3" />
                <Label htmlFor="date3" className="font-normal cursor-pointer">
                  YYYY-MM-DD (2025-11-22)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time Format */}
          <div className="space-y-3">
            <Label>
              <TranslateText value="settings.language.timeFormat" />
            </Label>
            <RadioGroup 
              value={settings.timeFormat} 
              onValueChange={(val) => handleUpdate('timeFormat', val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="time1" />
                <Label htmlFor="time1" className="font-normal cursor-pointer">
                  24-hour (14:30)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="time2" />
                <Label htmlFor="time2" className="font-normal cursor-pointer">
                  12-hour (2:30 PM)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSettings;