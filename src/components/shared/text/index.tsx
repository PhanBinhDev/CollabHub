import { Inter, Kalam, Roboto } from 'next/font/google';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { cn, rgbToHex } from '@/lib/utils';
import { TextLayer } from '@/types/canvas';
import { useMutation } from '@liveblocks/react';
import { useEffect, useRef, useState } from 'react';

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const getFontClass = (fontFamily?: string) => {
  switch (fontFamily) {
    case 'Inter':
      return inter.className;
    case 'Roboto':
      return roboto.className;
    case 'Kalam':
    default:
      return kalam.className;
  }
};

export const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TextProps) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    value,
    fontSize = 24,
    fontFamily = 'Kalam',
    fontWeight = 400,
    textAlign = 'center',
    italic = false,
    underline = false,
  } = layer;

  const contentRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  const [isEditing, setIsEditing] = useState(false);

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers');
    liveLayers.get(id)?.set('value', newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={e => !isEditing && onPointerDown(e, id)}
      onDoubleClick={handleDoubleClick}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
      }}
    >
      <ContentEditable
        innerRef={contentRef}
        html={value || 'Text'}
        onChange={handleContentChange}
        onBlur={handleBlur}
        className={cn(
          'w-full h-full flex items-center outline-none drop-shadow-md px-2 py-1',
          getFontClass(fontFamily),
          {
            'cursor-pointer': !isEditing,
            'cursor-text': isEditing,
            'justify-start': textAlign === 'left',
            'justify-center': textAlign === 'center',
            'justify-end': textAlign === 'right',
            'text-left': textAlign === 'left',
            'text-center': textAlign === 'center',
            'text-right': textAlign === 'right',
            italic: italic,
            underline: underline,
          },
        )}
        style={{
          color: fill ? rgbToHex(fill) : '#000',
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          lineHeight: '1.4',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      ></ContentEditable>
    </foreignObject>
  );
};
