import KanbanList from './_components/kanban';
import TrackerPanel from './_components/tracker';

const KanbanPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <TrackerPanel />
      <div className="flex-1 overflow-auto">
        <KanbanList />
      </div>
    </div>
  );
};

export default KanbanPage;
