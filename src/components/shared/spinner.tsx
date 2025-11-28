import { IconLoader } from '@tabler/icons-react';

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size = 24 }: SpinnerProps) => {
  return <IconLoader className="animate-spin" size={size} />;
};

export default Spinner;
