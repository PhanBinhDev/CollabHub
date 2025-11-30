import BoardClientPage from './client-page';

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const resolvedParams = await params;

  return <BoardClientPage boardId={resolvedParams.boardId} />;
};

export default BoardIdPage;
