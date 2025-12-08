import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { CanvasMode, CanvasState, LayerType } from '@/types/canvas';
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCircle,
  IconNote,
  IconPencil,
  IconPointer,
  IconRectangle,
  IconTypography,
} from '@tabler/icons-react';
import ToolButton from './tool-button';

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canEdit: boolean;
}

const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
  canEdit,
}: ToolbarProps) => {
  const { dict } = useClientDictionary();

  if (!canEdit) return null;

  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 shadow-md rounded-md">
      <div className="bg-white rounded-md p-1.5 gap-y-1 flex flex-col items-center shadow-md">
        <ToolButton
          label={dict?.whiteboard.toolbar.pointer}
          icon={IconPointer}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.typography}
          icon={IconTypography}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.stickyNote}
          icon={IconNote}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.rectangle}
          icon={IconRectangle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.ellipse}
          icon={IconCircle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.pen}
          icon={IconPencil}
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          isActive={canvasState.mode === CanvasMode.Pencil}
        />
      </div>
      <div className="bg-white rounded-md flex flex-col items-center shadow-md p-1.5">
        <ToolButton
          label={dict?.whiteboard.toolbar.undo}
          icon={IconArrowBackUp}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label={dict?.whiteboard.toolbar.redo}
          icon={IconArrowForwardUp}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
  );
};

export default Toolbar;
