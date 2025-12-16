'use client';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { usePaginatedQuery } from 'convex/react';
import { useSearchParams } from 'next/navigation';
import DocumentsTable from './_components/documents-table';
import TemplatesGallery from './_components/templates-gallery';

const FilesPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const { organization } = useOrganization();
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search: search ?? undefined, orgId: organization?.id ?? '' },
    { initialNumItems: 5 },
  );

  return (
    <>
      <TemplatesGallery />
      <DocumentsTable documents={results} loadMore={loadMore} status={status} />
    </>
  );
};

export default FilesPage;
