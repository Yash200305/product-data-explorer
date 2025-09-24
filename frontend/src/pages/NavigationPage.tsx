import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import DataTable from '../components/DataTable';
import type { Navigation } from '../types';
import type { PageResult } from '../lib/paginated';
import { fetchPageA /* or B/C */ } from '../lib/paginated';

export default function NavigationPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data } = useQuery<PageResult<Navigation>, Error>({
    queryKey: ['navigation', page, pageSize, search],
    queryFn: () => fetchPageA<Navigation>('/api/navigation', { page: page + 1, pageSize, search }),
    keepPreviousData: true,
  });

  return (
    <DataTable<Navigation>
      rows={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(n) => { setPage(0); setPageSize(n); }}
      columns={[
        { key: 'id', header: 'ID', width: 80 },
        { key: 'title', header: 'Title' },
        { key: 'slug', header: 'Slug' },
        { key: 'lastScrapedAt', header: 'Last Scraped' },
      ]}
      search={search}
      onSearchChange={(s) => { setPage(0); setSearch(s); }}
    />
  );
}
