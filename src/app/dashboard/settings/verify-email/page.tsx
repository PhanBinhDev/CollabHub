/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TranslateText from '@/components/shared/translate/translate-text';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { useClerk, useUser } from '@clerk/nextjs';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { handleEmailLinkVerification } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const { dict } = useClientDictionary();

  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'verified' | 'failed'
  >('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        await handleEmailLinkVerification({
          redirectUrl: window.location.href,
          redirectUrlComplete: '/dashboard/settings',
        });

        // Reload user to get updated email addresses
        await user?.reload();

        setVerificationStatus('verified');
        toast.success(dict?.settings.account.emails.verificationSuccess);

        setTimeout(() => {
          router.push('/dashboard/settings');
        }, 2000);
      } catch (err: any) {
        console.error('Email verification error:', err);
        setVerificationStatus('failed');
        setError(
          err.errors?.[0]?.message ||
            dict?.settings.account.emails.verificationFailed ||
            'Verification failed',
        );
      }
    };

    verify();
  }, [handleEmailLinkVerification, user, router, dict]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verificationStatus === 'loading' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            )}
            {verificationStatus === 'verified' && (
              <IconCircleCheck className="h-12 w-12 text-green-600" />
            )}
            {verificationStatus === 'failed' && (
              <IconCircleX className="h-12 w-12 text-destructive" />
            )}
          </div>

          <CardTitle>
            {verificationStatus === 'loading' && (
              <TranslateText value="settings.account.emails.verifying" />
            )}
            {verificationStatus === 'verified' && (
              <TranslateText value="settings.account.emails.verificationSuccess" />
            )}
            {verificationStatus === 'failed' && (
              <TranslateText value="settings.account.emails.verificationFailed" />
            )}
          </CardTitle>

          <CardDescription>
            {verificationStatus === 'loading' && (
              <TranslateText value="settings.account.emails.verifyingDescription" />
            )}
            {verificationStatus === 'verified' && (
              <TranslateText value="settings.account.emails.verificationSuccessDescription" />
            )}
            {verificationStatus === 'failed' && error && (
              <span className="text-destructive">{error}</span>
            )}
          </CardDescription>
        </CardHeader>

        {verificationStatus === 'failed' && (
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push('/dashboard/settings')}
            >
              <TranslateText value="settings.account.emails.backToSettings" />
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}