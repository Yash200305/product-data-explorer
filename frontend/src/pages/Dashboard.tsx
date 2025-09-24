import { Button, Stack, TextField, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { postJSON } from '../lib/api';
import { useSnackbar } from 'notistack';

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [categoryUrl, setCategoryUrl] = useState('https://www.worldofbooks.com/');
  const [listingUrl, setListingUrl] = useState('');

  const scrapeNavigation = useMutation({
    mutationFn: () => postJSON('/api/scrape/navigation'),
    onSuccess: () => enqueueSnackbar('Navigation scrape started/completed', { variant: 'success' }),
    onError: (e: unknown) => enqueueSnackbar(String(e), { variant: 'error' }),
  });

  const scrapeCategory = useMutation({
    mutationFn: () => postJSON('/api/scrape/category', { url: categoryUrl }),
    onSuccess: () => enqueueSnackbar('Category scrape started/completed', { variant: 'success' }),
    onError: (e: unknown) => enqueueSnackbar(String(e), { variant: 'error' }),
  });

  const scrapeProducts = useMutation({
    mutationFn: () => postJSON('/api/scrape/products', { listingUrl }),
    onSuccess: () => enqueueSnackbar('Products scrape started/completed', { variant: 'success' }),
    onError: (e: unknown) => enqueueSnackbar(String(e), { variant: 'error' }),
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Scrape Controls</Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          onClick={() => scrapeNavigation.mutate()}
          disabled={scrapeNavigation.isPending}
        >
          {scrapeNavigation.isPending ? 'Scraping…' : 'Scrape Navigation'}
        </Button>

        <TextField
          size="small"
          label="Category Page URL"
          value={categoryUrl}
          onChange={(e) => setCategoryUrl(e.target.value)}
          sx={{ minWidth: 360 }}
        />
        <Button
          variant="contained"
          onClick={() => scrapeCategory.mutate()}
          disabled={scrapeCategory.isPending || !categoryUrl}
        >
          {scrapeCategory.isPending ? 'Scraping…' : 'Scrape Categories'}
        </Button>

        <TextField
          size="small"
          label="Listing URL"
          value={listingUrl}
          onChange={(e) => setListingUrl(e.target.value)}
          sx={{ minWidth: 360 }}
        />
        <Button
          variant="contained"
          onClick={() => scrapeProducts.mutate()}
          disabled={scrapeProducts.isPending || !listingUrl}
        >
          {scrapeProducts.isPending ? 'Scraping…' : 'Scrape Products'}
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Use these controls to trigger backend scrapers and then view results in the tabs. Errors will appear as toasts.
      </Typography>
    </Paper>
  );
}
