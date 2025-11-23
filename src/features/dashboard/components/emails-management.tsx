'use client';

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
import useModal from '@/hooks/use-modal';
import { useUser } from '@clerk/nextjs';
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react';

const EmailsManagement = () => {
  const { openModal } = useModal();
  const { user: clerkUser, isLoaded } = useUser();

  const handleAddEmail = () => {
    openModal('ADD_EMAIL');
  };

  const handleSetPrimary = (emailId: string) => {
    openModal('UPDATE_EMAIL', { emailId });
  };
  const handleRemoveEmail = (emailId: string) => {
    openModal('REMOVE_EMAIL', { emailId });
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}

          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TranslateText value="settings.account.emails.title" />
        </CardTitle>
        <CardDescription>
          <TranslateText value="settings.account.emails.description" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {clerkUser?.emailAddresses.map(email => (
          <div
            key={email.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{email.emailAddress}</p>
                  {email.id === clerkUser?.primaryEmailAddressId && (
                    <Badge variant="secondary" className="h-5">
                      <TranslateText value="settings.account.emails.primary" />
                    </Badge>
                  )}
                  {email.verification.status === 'verified' && (
                    <IconCheck className="h-4 w-4 text-green-600" />
                  )}
                </div>
                {email.verification.status !== 'verified' && (
                  <p className="text-xs text-muted-foreground">
                    <TranslateText value="settings.account.emails.unverified" />
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {email.id !== clerkUser.primaryEmailAddressId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetPrimary(email.id)}
                >
                  <TranslateText value="settings.account.emails.setPrimary" />
                </Button>
              )}
              {clerkUser.emailAddresses.length > 1 &&
                email.id !== clerkUser.primaryEmailAddressId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveEmail(email.id)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={handleAddEmail}>
          <IconPlus className="h-4 w-4 mr-2" />
          <TranslateText value="settings.account.emails.addEmail" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailsManagement;
