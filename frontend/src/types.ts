export type Navigation = {
    id: number;
    title: string;
    slug: string;
    lastScrapedAt?: string | null;
  };
  
  export type Category = {
    id: number;
    title: string;
    slug: string;
    navigationId?: number | null;
    lastScrapedAt?: string | null;
  };
  
  export type Product = {
    id: number;
    sourceId: string;
    title: string;
    price: string;
    currency: string;
    imageUrl?: string | null;
    sourceUrl: string;
    lastScrapedAt?: string | null;
  };
  
  export type ProductDetail = {
    id: number;
    description?: string | null;
    ratingsAvg?: string | null;
    specs?: Record<string, unknown> | null;
    reviewsCount: number;
  };
  