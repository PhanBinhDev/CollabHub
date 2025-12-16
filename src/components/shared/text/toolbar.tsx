/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, LayerType, TextLayer } from '@/types/canvas';
import { useMutation, useSelf, useStorage } from '@liveblocks/react';
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconMinus,
  IconPlus,
  IconUnderline,
} from '@tabler/icons-react';
import { memo } from 'react';

interface TextToolbarProps {
  camera: Camera;
}

const TextToolbar = ({ camera }: TextToolbarProps) => {
  const selection = useSelf(state => state.presence.selection);

  const selectedLayer = useStorage(root => {
    if (!selection || selection.length !== 1) return null;
    const layer = root.layers.get(selection[0]);
    return layer?.type === LayerType.Text ? layer : null;
  });

  const updateTextProperty = useMutation(
    ({ storage }, property: keyof TextLayer, value: any) => {
      if (!selection || selection.length === 0) return;

      const liveLayers = storage.get('layers');
      selection.forEach((layerId: string) => {
        const layer = liveLayers.get(layerId);
        if (layer && layer.get('type') === LayerType.Text) {
          layer.set(property as any, value);
        }
      });
    },
    [selection],
  );

  const changeFontSize = useMutation(
    ({ storage }, delta: number) => {
      if (!selection || selection.length === 0) return;

      const liveLayers = storage.get('layers');
      selection.forEach((layerId: string) => {
        const layer = liveLayers.get(layerId);
        if (layer && layer.get('type') === LayerType.Text) {
          const currentSize = layer.get('fontSize' as any) || 24;
          const newSize = Math.max(8, Math.min(96, currentSize + delta));
          layer.set('fontSize' as any, newSize);
        }
      });
    },
    [selection],
  );
  const toggleTextStyle = useMutation(
    ({ storage }, property: 'italic' | 'underline') => {
      if (!selection || selection.length === 0) return;
      const liveLayers = storage.get('layers');
      selection.forEach((layerId: string) => {
        const layer = liveLayers.get(layerId);
        if (layer && layer.get('type') === LayerType.Text) {
          const current = layer.get(property as any) || false;
          layer.set(property as any, !current);
        }
      });
    },
    [selection],
  );
  if (!selectedLayer) return null;
  const fontSize = selectedLayer.fontSize || 24;
  const fontFamily = selectedLayer.fontFamily || 'Kalam';
  const fontWeight = selectedLayer.fontWeight || 400;
  const textAlign = selectedLayer.textAlign || 'center';
  const italic = selectedLayer.italic || false;
  const underline = selectedLayer.underline || false;
  const x = camera.x + selectedLayer.x + selectedLayer.width / 2;
  const y = camera.y + selectedLayer.y;

  return (
    <div
      className="absolute p-2 rounded-md bg-white shadow-md border flex gap-2 select-none items-center"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      <Select
        value={fontFamily}
        onValueChange={value => updateTextProperty('fontFamily', value as any)}
      >
        <SelectTrigger className="w-28 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Kalam">Kalam</SelectItem>
          <SelectItem value="Inter">Inter</SelectItem>
          <SelectItem value="Roboto">Roboto</SelectItem>
          <SelectItem value="Arial">Arial</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={fontWeight.toString()}
        onValueChange={value => updateTextProperty('fontWeight', Number(value))}
      >
        <SelectTrigger className="w-24 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="400">Regular</SelectItem>
          <SelectItem value="500">Medium</SelectItem>
          <SelectItem value="600">Semibold</SelectItem>
          <SelectItem value="700">Bold</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center border-l pl-2 ml-2">
        {/* Font Size */}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => changeFontSize(-2)}
        >
          <IconMinus size={16} />
        </Button>
        <span className="text-sm w-8 text-center">{fontSize}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => changeFontSize(2)}
        >
          <IconPlus size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-l pl-2 ml-2">
        {/* Text Styles */}
        <Button
          size="icon"
          variant={fontWeight >= 700 ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() =>
            updateTextProperty('fontWeight', fontWeight >= 700 ? 400 : 700)
          }
        >
          <IconBold size={16} />
        </Button>
        <Button
          size="icon"
          variant={italic ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() => toggleTextStyle('italic')}
        >
          <IconItalic size={16} />
        </Button>
        <Button
          size="icon"
          variant={underline ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() => toggleTextStyle('underline')}
        >
          <IconUnderline size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-l pl-2 ml-2">
        {/* Text Align */}
        <Button
          size="icon"
          variant={textAlign === 'left' ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() => updateTextProperty('textAlign', 'left')}
        >
          <IconAlignLeft size={16} />
        </Button>
        <Button
          size="icon"
          variant={textAlign === 'center' ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() => updateTextProperty('textAlign', 'center')}
        >
          <IconAlignCenter size={16} />
        </Button>
        <Button
          size="icon"
          variant={textAlign === 'right' ? 'default' : 'ghost'}
          className="h-8 w-8"
          onClick={() => updateTextProperty('textAlign', 'right')}
        >
          <IconAlignRight size={16} />
        </Button>
      </div>
    </div>
  );
};

TextToolbar.displayName = 'TextToolbar';

export default memo(TextToolbar);
