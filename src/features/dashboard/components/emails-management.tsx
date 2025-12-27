/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { verifyEmailAddress } from '@/app/actions/account';
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
import { INTERVAL } from '@/constants/app';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useReverification, useUser } from '@clerk/nextjs';
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const EmailsManagement = () => {
  const { openModal } = useModal();
  const { dict } = useClientDictionary();
  const { user: clerkUser, isLoaded } = useUser();
  const createEmailAddress = useReverification(verifyEmailAddress);

  const [verifyCooldowns, setVerifyCooldowns] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const timer = setInterval(() => {
      setVerifyCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const id in prev) {
          const remaining = prev[id] - 1;
          if (remaining > 0) next[id] = remaining;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddEmail = () => {
    openModal('ADD_EMAIL');
  };

  const handleSetPrimary = (emailId: string) => {
    openModal('UPDATE_EMAIL', { emailId });
  };
  const handleRemoveEmail = (emailId: string) => {
    openModal('REMOVE_EMAIL', { emailId });
  };

  const handleVerifyEmail = async (emailId: string) => {
    const result = await createEmailAddress(emailId);

    console.log('verify email result:', result);

    if (!result?.success) {
      if (result?.retryAfter) {
        const translate = dict?.settings.account.emails.retryVerifyAfter;
        toast.error(
          translate?.replace('{{seconds}}', String(result.retryAfter)),
        );
      }
    } else {
      console.log('Starting email verification flow for emailId:', emailId);
      try {
        const email = clerkUser?.emailAddresses.find(e => e.id === emailId);

        if (!email) {
          toast.error(dict?.common.somethingWrong);
          return;
        }

        console.log('Found email address:', email.emailAddress);

        const { startEmailLinkFlow } = email?.createEmailLinkFlow();

        const protocol = window.location.protocol;
        const host = window.location.host;

        const res = await startEmailLinkFlow({
          redirectUrl: `${protocol}//${host}/dashboard/settings/verify-email`,
        });

        console.log('Email link flow started:', res);

        toast.success(dict?.settings.account.emails.verificationSent);
        setVerifyCooldowns(prev => ({ ...prev, [emailId]: INTERVAL }));
      } catch (err: any) {
        console.log('Error during email verification flow:', err);

        console.error(JSON.stringify(err, null, 2));

        if (err.errors?.[0]?.code === 'form_identifier_exists') {
          toast.error(dict?.settings.account.emails.emailExists);
        } else {
          toast.error(dict?.common.somethingWrong);
        }
      }
    }
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
            className="flex items-center justify-between h-[58px] p-3 border rounded-lg"
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
              {email.id !== clerkUser.primaryEmailAddressId &&
                email.verification.status === 'verified' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetPrimary(email.id)}
                  >
                    <TranslateText value="settings.account.emails.setPrimary" />
                  </Button>
                )}
              {email.verification.status !== 'verified' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVerifyEmail(email.id)}
                  disabled={!!verifyCooldowns[email.id]}
                >
                  {verifyCooldowns[email.id] ? (
                    `${verifyCooldowns[email.id]}s`
                  ) : (
                    <TranslateText value="common.verify" />
                  )}
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
