'use client';

import { Doc } from '@/convex/_generated/dataModel';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header';

export const columns: ColumnDef<Doc<'documents'>>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'preview',
    header: () => <div className="text-left px-2">Preview</div>,
    cell: () => <div className="size-30 bg-slate-200 rounded-md"></div>,
  },
  {
    accessorKey: 'authorId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author ID" />
    ),
    cell: ({ row }) => <span>{row.getValue('authorId')}</span>,
  },
  {
    accessorKey: 'roomId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room ID" />
    ),
    cell: ({ row }) => <span>{row.getValue('roomId')}</span>,
  },
  {
    accessorKey: 'orgId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Org ID" />
    ),
    cell: ({ row }) => <span>{row.getValue('orgId')}</span>,
  },
];
