import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import type { Product, ProductDetail } from '../types';
import type { PageResult } from '../lib/paginated';
import { fetchPageA /* or B/C */ } from '../lib/paginated';
import { Drawer, Box, Typography, Divider, CircularProgress } from '@mui/material';

async function fetchDetail(productId: number): Promise<ProductDetail> {
  const res = await fetch(`/api/products/${productId}/detail`);
  if (!res.ok) throw new Error(`GET /api/products/${productId}/detail failed ${res.status}`);
  return (await res.json()) as ProductDetail;
}

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data } = useQuery<PageResult<Product>, Error>({
    queryKey: ['products', page, pageSize, search],
    queryFn: () => fetchPageA<Product>('/api/products', { page: page + 1, pageSize, search }),
    keepPreviousData: true,
  });

  const rows = useMemo(() => data?.items ?? [], [data]);

  const loadDetail = async (id: number) => {
    setLoadingDetail(true);
    setDetail(null);
    setOpen(true);
    setSelectedId(id);
    try {
      const d = await fetchDetail(id);
      setDetail(d);
    } catch {
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <DataTable<Product>
        rows={rows}
        total={data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPage(0); setPageSize(n); }}
        columns={[
          { key: 'id', header: 'ID', width: 70 },
          { key: 'title', header: 'Title' },
          { key: 'price', header: 'Price', width: 120, render: (r) => `${r.price} ${r.currency}` },
          { key: 'sourceId', header: 'Source ID', width: 150 },
          { key: 'lastScrapedAt', header: 'Last Scraped', width: 180 },
          { key: 'sourceUrl', header: 'Source URL', render: (r) => <a href={r.sourceUrl} target="_blank" rel="noreferrer">Open</a> },
        ]}
        search={search}
        onSearchChange={(s) => { setPage(0); setSearch(s); }}
      />
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 420, p: 2 }}>
          <Typography variant="h6" gutterBottom>Product Detail</Typography>
          <Divider sx={{ mb: 2 }} />
          {!selectedId && <Typography>Select a product...</Typography>}

          {selectedId && loadingDetail && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} /> <Typography>Loading...</Typography>
            </Box>
          )}

          {selectedId && !loadingDetail && !detail && (
            <Typography color="text.secondary">No detail available.</Typography>
          )}

          {detail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">Ratings: {detail.ratingsAvg ?? 'N/A'}</Typography>
              <Typography variant="body2">Reviews: {detail.reviewsCount}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Description</Typography>
              <Typography variant="body2" color="text.secondary">{detail.description ?? '—'}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Specs</Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.specs ? JSON.stringify(detail.specs, null, 2) : '—'}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
