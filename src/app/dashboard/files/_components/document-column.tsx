'use client';

import { Doc } from '@/convex/_generated/dataModel';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header';
import TranslateText from '@/components/shared/translate/translate-text';

export const columns: ColumnDef<Doc<'documents'>>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label={<TranslateText value="documents.columns.title" />}
      />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'preview',
    header: () => (
      <div className="text-left px-2">
        <TranslateText value="documents.columns.preview" />
      </div>
    ),
    cell: () => <div className="size-30 bg-slate-200 rounded-md"></div>,
  },
  {
    accessorKey: 'authorId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label={<TranslateText value="documents.columns.owner" />}
      />
    ),
    cell: ({ row }) => <span>{row.getValue('authorId')}</span>,
  },
  {
    accessorKey: '_creationTime',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label={<TranslateText value="documents.columns.createdAt" />}
      />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('_creationTime') as string;
      console.log('createdAt', createdAt);

      return <span>{new Date(createdAt).toLocaleDateString()}</span>;
    },
  },
];
