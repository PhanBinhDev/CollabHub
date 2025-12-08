'use client';

import { LayerType } from '@/types/canvas';
import { useStorage } from '@liveblocks/react';
import { memo } from 'react';
import Rectangle from './rectangle';

interface LayerPreviewProps {
  layerId: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const LayerPreview = ({
  layerId,
  onLayerPointerDown,
  selectionColor,
}: LayerPreviewProps) => {
  const layer = useStorage(root => root.layers.get(layerId));
  
  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={layerId}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );

    default:
      console.warn('LayerPreview: Unsupported layer type', layer.type);
      return null;
  }
};

LayerPreview.displayName = 'LayerPreview';

export default memo(LayerPreview);
