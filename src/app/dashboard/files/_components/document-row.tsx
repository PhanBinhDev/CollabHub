import TranslateText from '@/components/shared/translate/translate-text';
import { TableCell, TableRow } from '@/components/ui/table';
import { Doc } from '@/convex/_generated/dataModel';
import { IconBuilding, IconFileText, IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface DocumentRowProps {
  document: Doc<'documents'>;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(`/documents/${document._id}`)}
    >
      <TableCell className="w-12">
        <IconFileText className="size-5 text-blue-500" />
      </TableCell>
      <TableCell className="font-medium">{document.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        <div className="flex items-center gap-2">
          {document.orgId ? (
            <>
              <IconBuilding className="size-4" />
              <TranslateText value="documents.organization" />
            </>
          ) : (
            <>
              <IconUser className="size-4" />
              <TranslateText value="documents.personal" />
            </>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document._creationTime), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell className="w-12">{/* Document Menu here */}</TableCell>
    </TableRow>
  );
};
