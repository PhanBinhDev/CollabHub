/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { addEmail } from '@/app/actions/account';
import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useReverification, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export const ModalAddEmail = () => {
  const { closeModal, isModalOpen } = useModal();
  const { user } = useUser();
  const { dict } = useClientDictionary();

  const [isVerifying, setIsVerifying] = useState(false);

  const createEmailAddress = useReverification(addEmail);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleClose = () => {
    emailForm.reset();
    setIsVerifying(false);
    closeModal('ADD_EMAIL');
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    try {
      const res = await createEmailAddress(data.email);

      if (!res.success) {
        toast.error(dict?.settings.account.emails.addError);
        return;
      }

      await user?.reload();

      const emailAddress = user?.emailAddresses.find(
        a => a.id === res.email?.id,
      );

      if (!emailAddress) {
        toast.error(dict?.settings.account.emails.addError);
        return;
      }

      setIsVerifying(true);
      emailForm.reset();

      // Create email link flow
      const { startEmailLinkFlow } = emailAddress.createEmailLinkFlow();

      // Get current protocol and host
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Send the user an email with the verification link
      await startEmailLinkFlow({
        redirectUrl: `${protocol}//${host}/dashboard/settings/verify-email`,
      });

      toast.success(dict?.settings.account.emails.verificationSent);
      closeModal('ADD_EMAIL');
    } catch (err: any) {
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        toast.error(dict?.settings.account.emails.emailExists);
      } else {
        toast.error(dict?.settings.account.emails.addError);
      }
    }
  };

  const handleReset = () => {
    setIsVerifying(false);
    emailForm.reset();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen('ADD_EMAIL')}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <TranslateText
              value={
                isVerifying
                  ? 'settings.account.emails.checkEmailTitle'
                  : 'settings.account.emails.addTitle'
              }
            />
          </DialogTitle>
          <DialogDescription>
            <TranslateText
              value={
                isVerifying
                  ? 'settings.account.emails.checkEmailDescription'
                  : 'settings.account.emails.addDescription'
              }
            />
          </DialogDescription>
        </DialogHeader>

        {!isVerifying ? (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslateText value="settings.account.profile.email" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  <TranslateText value="common.cancel" />
                </Button>
                <Button
                  type="submit"
                  loading={emailForm.formState.isSubmitting}
                >
                  <TranslateText value="common.continue" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <IconMail className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  <TranslateText value="settings.account.emails.checkInbox" />
                </p>
                <p className="text-xs text-muted-foreground">
                  {emailForm.getValues('email')}
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                <TranslateText value="settings.account.emails.tryAnotherEmail" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleClose}>
                <TranslateText value="common.close" />
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
