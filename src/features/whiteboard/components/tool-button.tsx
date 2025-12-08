'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TablerIcon } from '@tabler/icons-react';

interface ToolButtonProps {
  label: string | undefined;
  icon: TablerIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isDisabled}
          onClick={onClick}
          size={'icon'}
          variant={isActive ? 'boardActive' : 'board'}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {label || ''}
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolButton;
