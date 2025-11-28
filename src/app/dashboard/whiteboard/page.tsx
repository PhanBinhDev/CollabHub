'use client';
import BoardList from '@/features/whiteboard/components/board-list';
import { useOrganization } from '@clerk/nextjs';

const WhiteBoardPage = () => {
  const { organization } = useOrganization();

  if (!organization) {
    return <>Empty</>;
  }

  return <BoardList orgId={organization?.id} />;
};

export default WhiteBoardPage;
