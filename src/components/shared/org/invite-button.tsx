'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { OrganizationProfile } from '@clerk/nextjs';
import { DialogContent } from '@radix-ui/react-dialog';

const InviteOrgButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <TranslateText value="org.invite" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none outline-0 max-w-3xl">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};

export default InviteOrgButton;
