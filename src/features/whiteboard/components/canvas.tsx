/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CanvasLoading from '@/components/shared/canvas-loading';
import NotFound from '@/components/shared/not-found';
import TextToolbar from '@/components/shared/text/toolbar';
import { MAX_LAYERS, SELECTION_NET_THRESHOLD } from '@/constants/app';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  findIntersectingLayersWithRectangle,
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CursorsPresence from './cursors-presence';
import Info from './info';
import LayerPreview from './layer-preview';
import Participants from './participants';
import SelectionBox from './selection-box';
import SelectionToolbar from './selection-toolbar';
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
      } as any);

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

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
      SELECTION_NET_THRESHOLD
    ) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const translateLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get('layers');
      for (const layerId of self.presence.selection) {
        const layer = liveLayers.get(layerId);
        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [canvasState],
  );

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get('layers').toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current,
      );

      setMyPresence(
        {
          selection: ids,
        },
        {
          addToHistory: true,
        },
      );
    },
    [layerIds],
  );

  const unSelectLayer = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

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

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, camera, resizeLayer, translateLayer],
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayer();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer, unSelectLayer],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) return;

      // TODO: Add case for drawing

      setCanvasState({ mode: CanvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode, setCanvasState],
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

  const canEdit = board.isOwner || board.userRole === 'editor';

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
        canEdit={canEdit}
      />
      {canEdit && (
        <>
          <SelectionToolbar
            camera={camera}
            setLastUsedColor={setLastUsedColor}
          />

          <TextToolbar camera={camera} />
        </>
      )}

      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
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

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.current.x - canvasState.origin.x)}
                height={Math.abs(canvasState.current.y - canvasState.origin.y)}
              />
            )}

          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
