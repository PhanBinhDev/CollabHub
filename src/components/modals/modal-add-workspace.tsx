'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconUpload, IconX } from '@tabler/icons-react';
import { useMutation } from 'convex/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
  description: z.string().max(500).optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

const ModalAddWorkspace = () => {
  const { closeModal, isModalOpen } = useModal();
  const { dict } = useClientDictionary();
  const imageInput = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // TODO: Replace with actual Convex mutations
  const createWorkspace = useMutation(api.workspaces.create);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = () => {
    form.reset();
    setImageFile(null);
    setImagePreview(null);
    closeModal('ADD_WORKSPACE');
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

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInput.current) {
      imageInput.current.value = '';
    }
  };

  const onSubmit = async (data: WorkspaceFormValues) => {
    try {
      let imageStorageId: string | undefined;

      // Upload image if selected
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile,
        });
        const json = await result.json();
        imageStorageId = json.storageId;
      }

      // Create workspace
      await createWorkspace({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        imageStorageId: imageStorageId as Id<'_storage'>,
      });

      toast.success(
        dict?.workspaces.createSuccess || 'Workspace created successfully',
      );
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(dict?.workspaces.createError || 'Failed to create workspace');
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen('ADD_WORKSPACE')}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <TranslateText value="workspaces.createTitle" />
          </DialogTitle>
          <DialogDescription>
            <TranslateText value="workspaces.createDescription" />
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Workspace Image */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={imagePreview ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {form.watch('name')?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => imageInput.current?.click()}
                >
                  <IconUpload className="h-4 w-4" />
                  <TranslateText value="workspaces.uploadImage" />
                </Button>

                {imagePreview && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleRemoveImage}
                  >
                    <IconX className="h-4 w-4" />
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
            </div>

            {/* Workspace Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <TranslateText value="workspaces.name" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dict?.workspaces.namePlaceholder || 'My Workspace'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <TranslateText value="workspaces.description" />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        dict?.workspaces.descriptionPlaceholder ||
                        'Describe your workspace...'
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                <TranslateText value="common.cancel" />
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                <TranslateText value="workspaces.create" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddWorkspace;
