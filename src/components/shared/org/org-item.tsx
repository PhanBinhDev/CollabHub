'use client';

import { cn } from '@/lib/utils';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';

interface OrgItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const OrgItem = ({ id, name, imageUrl }: OrgItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({
      organization: id,
    });
  };

  return (
    <div className="aspect-square relative size-8" onClick={onClick}>
      <Image
        fill
        src={imageUrl}
        alt={name}
        className={cn(
          'rounded-md cursor-pointer opacity-75 hover:opacity-100 transition',
          isActive && 'opacity-100',
        )}
      />
    </div>
  );
};
