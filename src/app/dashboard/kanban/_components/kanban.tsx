'use client';

import { DragDropType } from '@/constants/app';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';

const KanbanList = () => {
  // const item = useQuery(api.kanban.getStages, {
  //   projectId: 'exampleProjectId',
  // });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragType = active.data.current?.type;

    if (dragType === DragDropType.KANBAN_COLUMN) {
      // setActiveColumnId(stages.find(col => col.id === active.id) || null);
      return;
    }
    if (dragType === DragDropType.KANBAN_CARD) {
      // setActiveCardId(active.data.current?.activity || null);
      return;
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dragType = active.data.current?.type;
    // const overType = over.data.current?.type;

    if (dragType === DragDropType.KANBAN_COLUMN) {
      // Handle column drag over logic
    }

    if (dragType === DragDropType.KANBAN_CARD) {
      // Handle card drag over logic
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      // onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <div className="overflow-x-auto overflow-y-hidden flex-1 flex">
        <SortableContext items={[]} strategy={horizontalListSortingStrategy}>
          <div className="flex h-full py-4 gap-4 nowrap min-w-full flex-1">
            {/* {stages.map(stage => ()} */}
          </div>
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>
          {/* {activeColumnId && <KanbanColumnDragOverlay columnId={activeColumnId} />} */}
          {/* {activeCardId && <KanbanCardDragOverlay cardId={activeCardId} />} */}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default KanbanList;
