'use client';

import CanvasLoading from '@/components/shared/canvas-loading';
import NotFound from '@/components/shared/not-found';
import { MAX_LAYERS } from '@/constants/app';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  getUserColor,
  pointerEventToCanvasPoint,
  resizeBounds,
} from '@/lib/utils';
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from '@/types/canvas';
import { LiveObject } from '@liveblocks/client';
import { useOthersMapped } from '@liveblocks/react';
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useRoom,
  useStorage,
} from '@liveblocks/react/suspense';
import { useQuery } from 'convex/react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CursorsPresence from './cursors-presence';
import Info from './info';
import LayerPreview from './layer-preview';
import Participants from './participants';
import SelectionBox from './selection-box';
import Toolbar from './toolbar';

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage(root => {
    return root.layerIds;
  });

  const room = useRoom();
  const [status, setStatus] = useState(room.getStatus());
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point,
    ) => {
      const layers = storage.get('layers');

      if (layers.size >= MAX_LAYERS) return;

      const liveLayerId = storage.get('layerIds');

      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedColor,
      });

      liveLayerId.push(layerId);
      layers.set(layerId, layer);

      setMyPresence(
        { selection: [layerId] },
        {
          addToHistory: true,
        },
      );
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor],
  );

  const resizeLayer = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get('layers');
      const layers = liveLayers.get(self.presence.selection[0]);

      if (layers) {
        layers.update(bounds);
      }
    },
    [canvasState],
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera(camera => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, camera, resizeLayer],
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer],
  );

  const selections = useOthersMapped(others => others.presence.selection);

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      )
        return;

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection?.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          {
            addToHistory: true,
          },
        );
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [setCanvasState, camera, history, canvasState.mode],
  );

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connecttionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = getUserColor(connecttionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  useEffect(() => {
    const unsubscribe = room.subscribe('status', setStatus);
    return () => unsubscribe();
  }, [room]);

  const isLoading = status !== 'connected';

  const board = useQuery(api.boards.getDetails, {
    id: boardId as Id<'boards'>,
  });

  if (isLoading || board === undefined) {
    return <CanvasLoading />;
  }

  if (!board) {
    return <NotFound />;
  }

  return (
    <main className="h-full w-full bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
        canEdit={board.isOwner || board.userRole === 'editor'}
      />
      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds?.map(layerId => (
            <LayerPreview
              key={layerId}
              layerId={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}

          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />

          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
