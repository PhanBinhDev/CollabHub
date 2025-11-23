/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CircularProgress } from '@/components/shared/circular-progress';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import EmailsManagement from '@/features/dashboard/components/emails-management';
import SessionsManagement from '@/features/dashboard/components/sessions-management';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { getInitials } from '@/utils';
import { useClerk, useSession, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AccountSettings = () => {
  const { openModal } = useModal();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const { dict } = useClientDictionary();

  const convexUser = useQuery(api.users.currentUser);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveProfileImage = useMutation(api.storage.saveProfileImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (convexUser) {
      form.reset({
        firstName: convexUser.firstName || '',
        lastName: convexUser.lastName || '',
        bio: convexUser.bio || '',
        phone: convexUser.phone || '',
      });
    }
  }, [convexUser, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (clerkUser) {
        await clerkUser.update({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
        });
      }

      await updateUser({
        bio: data.bio?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
      });

      toast.success(dict?.settings.account.profile.updateSuccess);
      form.reset(data);
    } catch (error) {
      toast.error(dict?.settings.account.profile.updateFailure);
      console.error(error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(dict?.settings.account.profile.imageLimitSize);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(dict?.settings.account.profile.imageFormats);
      return;
    }

    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(10);
      const postUrl = await generateUploadUrl();
      setUploadProgress(30);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const percentComplete = 30 + (e.loaded / e.total) * 50;
          setUploadProgress(percentComplete);
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', postUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      const json: any = await uploadPromise;
      const { storageId } = json;
      setUploadProgress(90);
      await saveProfileImage({ storageId });
      setUploadProgress(100);
      toast.success(dict?.settings.account.profile.updateSuccess);

      if (imageInput.current) {
        imageInput.current.value = '';
      }
    } catch (error) {
      toast.error(dict?.settings.account.profile.updateFailure);
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    openModal('REMOVE_AVATAR');
  };

  const handleDeleteAccount = () => {
    openModal('REMOVE_ACCOUNT');
  };

  const handleSignOut = async () => {
    await signOut({
      sessionId: session?.id,
    });
  };

  if (convexUser === undefined || !isLoaded || !sessionLoaded) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const fullName =
    [convexUser?.firstName, convexUser?.lastName].filter(Boolean).join(' ') ||
    convexUser?.email ||
    'User';

  return (
    <div className="space-y-6">
      {/* My Profile */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText value="settings.account.profile.title" />
          </CardTitle>
          <CardDescription>
            <TranslateText value="settings.account.profile.description" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-start gap-4">
            <div className="relative">
              {isUploading ? (
                <CircularProgress
                  value={uploadProgress}
                  size={80}
                  strokeWidth={3}
                />
              ) : (
                <Avatar className="h-20 w-20">
                  <AvatarImage src={convexUser?.imageUrl} alt={fullName} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => imageInput.current?.click()}
                  disabled={isUploading}
                >
                  <IconUpload className="h-4 w-4 mr-2" />
                  <TranslateText value="settings.account.profile.changeImage" />
                </Button>
                {convexUser?.imageUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    <TranslateText value="settings.account.profile.removeImage" />
                  </Button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={handleImageSelect}
                className="hidden"
              />

              <p className="text-xs text-muted-foreground">
                <TranslateText value="settings.account.profile.imageFormats" />
              </p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslateText value="settings.account.profile.firstName" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslateText value="settings.account.profile.lastName" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslateText value="settings.account.profile.bio" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          dict?.settings.account.profile.bioPlaceholder
                        }
                        className="resize-none"
                        rows={3}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslateText value="settings.account.profile.phone" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  <TranslateText value="settings.account.profile.email" />
                </Label>
                <Input
                  id="email"
                  value={convexUser?.email || ''}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  <TranslateText value="settings.account.profile.emailReadonly" />
                </p>
              </div>

              {/* Submit Buttons */}
              {form.formState.isDirty && (
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    loading={form.formState.isSubmitting}
                  >
                    <TranslateText value="settings.account.saveChanges" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    <TranslateText value="common.cancel" />
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <EmailsManagement />
      <SessionsManagement />
      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            <TranslateText value="settings.account.danger.title" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>
                <TranslateText value="settings.account.danger.logoutAll" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.account.danger.logoutAllDesc" />
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <TranslateText value="settings.account.danger.logoutButton" />
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-destructive">
                <TranslateText value="settings.account.danger.deleteAccount" />
              </Label>
              <p className="text-sm text-muted-foreground">
                <TranslateText value="settings.account.danger.deleteAccountDesc" />
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
            >
              <TranslateText value="settings.account.danger.deleteButton" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
