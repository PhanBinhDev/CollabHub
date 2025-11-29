'use client';

import { Board } from '@/convex/boards';
import Link from 'next/link';

interface BoardCardProps {
  board: Board;
}

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <Link href={`/whiteboard/${board._id}`}>
      <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50"></div>
      </div>
    </Link>
  );
};

export default BoardCard;
