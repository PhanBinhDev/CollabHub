'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDeleteLayer } from '@/hooks/use-delete-layer';
import { useSelectionBounds } from '@/hooks/use-selection-bounds';
import { Camera, Color, Layer } from '@/types/canvas';
import { LiveObject } from '@liveblocks/client';
import { useMutation, useSelf } from '@liveblocks/react';
import { IconTrash } from '@tabler/icons-react';
import { BringToFront, SendToBack } from 'lucide-react';
import { memo } from 'react';
import { ColorPicker } from './color-picker';

interface SelectionToolbarProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

const SelectionToolbar = ({
  camera,
  setLastUsedColor,
}: SelectionToolbarProps) => {
  const selection = useSelf(state => state.presence.selection);

  const selectionBounds = useSelectionBounds();
  const deleteLayer = useDeleteLayer();

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get('layers');

      setLastUsedColor(fill);

      (selection || []).forEach((layerId: string) => {
        const layer = liveLayers.get(layerId) as LiveObject<Layer>;
        if (layer) {
          layer.set('fill', fill);
        }
      });
    },
    [selection, setLastUsedColor],
  );

  const moveToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get('layerIds');
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayerIds.move(indices[i], i);
      }
    },
    [selection],
  );

  const moveToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get('layerIds');
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        liveLayerIds.move(
          indices[i],
          arr.length - 1 - (indices.length - 1 - i),
        );
      }
    },
    [selection],
  );

  if (!selectionBounds) return null;

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-2 rounded-md bg-white shadow-md border flex select-none"
      style={{
        transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
      }}
    >
      <ColorPicker onChange={setFill} />
      <div className="flex flex-col gap-y-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'board'} onClick={moveToFront}>
              <BringToFront size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TranslateText value="whiteboard.toolbar.bringToFront" />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'board'} onClick={moveToBack}>
              <SendToBack size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TranslateText value="whiteboard.toolbar.sendToBack" />
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'ghost'} onClick={deleteLayer}>
              <IconTrash size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TranslateText value="common.delete" />
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

SelectionToolbar.displayName = 'SelectionToolbar';

export default memo(SelectionToolbar);
