import { CssBaseline, Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import NavigationPage from './pages/NavigationPage';
import CategoryPage from './pages/CategoryPage';
import ProductsPage from './pages/ProductsPage';

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Product Data Explorer</Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="secondary">
            <Tab label="Dashboard" />
            <Tab label="Navigation" />
            <Tab label="Categories" />
            <Tab label="Products" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
        <Box hidden={tab !== 0}><Dashboard /></Box>
        <Box hidden={tab !== 1}><NavigationPage /></Box>
        <Box hidden={tab !== 2}><CategoryPage /></Box>
        <Box hidden={tab !== 3}><ProductsPage /></Box>
      </Container>
    </>
  );
}
