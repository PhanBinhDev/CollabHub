'use client';

import { Doc } from '@/convex/_generated/dataModel';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/shared/table/data-table-column-header';
import TranslateText from '@/components/shared/translate/translate-text';
import UserAvatar from '@/components/shared/user-avatar';
import moment from 'moment';

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
    accessorKey: 'author',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label={<TranslateText value="documents.columns.owner" />}
      />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const author = row.getValue('author') as {
        firstName?: string;
        lastName?: string;
        email?: string;
        imageUrl?: string;
        username?: string;
      } | null;

      if (!author) {
        return <span className="truncate text-muted-foreground">Unknown</span>;
      }

      return (
        <div className="flex items-center gap-2 truncate">
          {author.imageUrl && (
            <UserAvatar
              src={author.imageUrl}
              name={author.firstName || author.username}
              size={10}
            />
          )}
        </div>
      );
    },
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

      // display date in format time, eg: 12h30 PM, Jun 15, 2023 and lang based on user locale
      return <span>{moment(createdAt).format('LT, LL')}</span>;
    },
  },
];
