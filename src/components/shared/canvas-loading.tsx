import Info from '@/features/whiteboard/components/info';
import Participants from '@/features/whiteboard/components/participants';
import Toolbar from '@/features/whiteboard/components/toolbar';
import Spinner from './spinner';

const CanvasLoading = () => {
  return (
    <main className="w-full h-screen relative flex items-center justify-center bg-neutral-100 touch-none">
      <Spinner size={24} className="text-muted-foreground" />

      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};

export default CanvasLoading;
