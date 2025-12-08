'use client';
import { ChangeLanguage } from '@/components/shared/change-language';
import UserAvatar from '@/components/shared/user-avatar';
import { Separator } from '@/components/ui/separator';
import { MAX_USERS_SHOW } from '@/constants/app';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { getUserColor } from '@/lib/utils';
import { useOthers, useSelf } from '@liveblocks/react';

const Participants = () => {
  const { dict } = useClientDictionary();
  const others = useOthers();
  const self = useSelf();
  const hasMore = others.length > MAX_USERS_SHOW;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-2 flex items-center">
      <div className="flex gap-x-2 items-center">
        {self && (
          <UserAvatar
            src={self.info.picture}
            name={`${self.info.name} (${dict?.whiteboard.you})`}
            borderColor="#2563eb"
            size={8}
          />
        )}

        {others.slice(0, MAX_USERS_SHOW).map(({ connectionId, info }) => (
          <UserAvatar
            key={connectionId}
            name={info.name || 'Anonymous'}
            src={info.picture}
            borderColor={getUserColor(connectionId)}
            size={8}
          />
        ))}

        {hasMore && (
          <UserAvatar
            name={`${others.length - MAX_USERS_SHOW} ${dict?.common.more}`}
            fallback={`+${others.length - MAX_USERS_SHOW}`}
            size={8}
          />
        )}

        <Separator orientation="vertical" className="!h-8" />

        <ChangeLanguage />
      </div>
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 w-[100px] flex items-center" />
  );
};

export default Participants;
