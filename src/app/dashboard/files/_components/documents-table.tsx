'use client';

import { DataTable } from '@/components/shared/table/data-table';
import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { Doc } from '@/convex/_generated/dataModel';
import { IconLoader2 } from '@tabler/icons-react';
import { PaginationStatus } from 'convex/react';
import { columns } from './document-column';

interface DocumentsTableProps {
  documents: Doc<'documents'>[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentsTableProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-16 py-6 flex flex-col gap-5">
      {documents === undefined ? (
        <div className="flex justify-center items-center h-24">
          <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={documents}
            options={{
              paginations: true,
              paginationType: 'button-load-more',
              paginationButton: (
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMore(5)}
                    disabled={status !== 'CanLoadMore'}
                    className="gap-2"
                  >
                    {status === 'CanLoadMore' ? (
                      <TranslateText value="common.loadMore" />
                    ) : (
                      <TranslateText value="common.endOfResults" />
                    )}
                  </Button>
                </div>
              ),
            }}
          />
        </>
      )}
    </div>
  );
};

export default DocumentsTable;
