import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateOrganization } from '@clerk/nextjs';
import { IconPlus } from '@tabler/icons-react';

const CreateOrgBtn = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconPlus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-0 bg-transparent! border-none max-w-[434px]! outline-none! ring-0!"
        showCloseButton={false}
      >
        <DialogTitle className="hidden" />
        <CreateOrganization skipInvitationScreen />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrgBtn;
