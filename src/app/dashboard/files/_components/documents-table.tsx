'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Doc } from '@/convex/_generated/dataModel';
import { IconLoader2 } from '@tabler/icons-react';
import { PaginationStatus } from 'convex/react';
import { DocumentRow } from './document-row';

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
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">
                  <TranslateText value="documents.name" />
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold">
                  <TranslateText value="documents.shared" />
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold">
                  <TranslateText value="documents.createdAt" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            {documents.length === 0 ? (
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="h-32 text-muted-foreground text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm">
                        <TranslateText value="documents.noDocuments" />
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {documents.map(document => (
                  <DocumentRow key={document._id} document={document} />
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}
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
    </div>
  );
};

export default DocumentsTable;
