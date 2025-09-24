import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { Repository } from 'typeorm';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductDetail } from '../product/entities/product-detail.entity';

// No experiments or setGlobalConfig used here; main.ts sets global config once.

type NavInput = { title: string; slug: string; lastScrapedAt?: Date | null };
type CatInput = { title: string; slug: string; navigationId?: number; lastScrapedAt?: Date | null };
type ProdInput = {
  sourceId: string;
  title: string;
  price: string;
  currency: string;
  imageUrl: string | null;
  sourceUrl: string;
  lastScrapedAt?: Date | null;
};
type DetailInput = {
  description: string | null;
  ratingsAvg: string | null;
  specs: Record<string, unknown> | null;
  reviewsCount: number;
};

function toNav(i: NavInput): Partial<Navigation> {
  return { title: i.title, slug: i.slug, lastScrapedAt: i.lastScrapedAt ?? null };
}
function toCategory(i: CatInput): Partial<Category> {
  return { title: i.title, slug: i.slug, navigationId: i.navigationId, lastScrapedAt: i.lastScrapedAt ?? null };
}
function toProduct(i: ProdInput): Partial<Product> {
  return {
    sourceId: i.sourceId,
    title: i.title,
    price: i.price,
    currency: i.currency,
    imageUrl: i.imageUrl,
    sourceUrl: i.sourceUrl,
    lastScrapedAt: i.lastScrapedAt ?? null,
  };
}
function toDetail(i: DetailInput): Partial<ProductDetail> {
  return { description: i.description, ratingsAvg: i.ratingsAvg, specs: i.specs, reviewsCount: i.reviewsCount };
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @InjectRepository(Navigation) private readonly navRepo: Repository<Navigation>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
    @InjectRepository(Product) private readonly prodRepo: Repository<Product>,
    @InjectRepository(ProductDetail) private readonly detailRepo: Repository<ProductDetail>,
  ) {}

  async scrapeNavigation(baseUrl = 'https://www.worldofbooks.com/'): Promise<Navigation[]> {
    const out: Navigation[] = [];

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 15,
      maxRequestRetries: 1,
      navigationTimeoutSecs: 30,
      requestHandlerTimeoutSecs: 60,
      requestHandler: async ({ page, request, log }) => {
        log.debug(`Scraping: ${request.url}`);
        try {
          await page.goto(request.url, { waitUntil: 'domcontentloaded' });

          const hasNav = await page.$('nav a').then(Boolean).catch(() => false);
          if (!hasNav) {
            log.warning('No nav links found on page');
            return;
          }

          const links =
            (await page
              .$$eval('nav a', (els) =>
                els.map((a: any) => ({
                  title: (a.textContent || '').trim(),
                  href: a.href,
                })),
              )
              .catch((e) => {
                log.error(`$$eval failed: ${String(e)}`);
                return [];
              })) || [];

          for (const l of links) {
            if (!l?.title || !l?.href) continue;

            let slug = '';
            try {
              slug = new URL(l.href).pathname.replace(/^\/|\/$/g, '');
            } catch {
              log.warning(`Invalid nav URL: ${l.href}`);
              continue;
            }

            const now = new Date();
            try {
              let nav = await this.navRepo.findOne({ where: { slug } });
              const payload = toNav({ title: l.title, slug, lastScrapedAt: now });

              if (!nav) nav = this.navRepo.create(payload);
              else Object.assign(nav, payload);

              nav = await this.navRepo.save(nav);
              out.push(nav);
            } catch (dbErr) {
              log.error(`DB upsert failed for nav slug=${slug}: ${String(dbErr)}`);
            }
          }
        } catch (err) {
          log.error(`Navigation handler error: ${String(err)}`);
        }
      },
      failedRequestHandler: ({ request, log }, error) => {
        log.error(`Navigation request failed: ${request.url} error=${String(error)}`);
      },
    });

    await crawler.run([baseUrl]);
    return out;
  }

  async scrapeCategory(url: string, navigationId?: number): Promise<Category[]> {
    const out: Category[] = [];

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 30,
      maxRequestRetries: 1,
      navigationTimeoutSecs: 45,
      requestHandlerTimeoutSecs: 75,
      requestHandler: async ({ page, request, log }) => {
        log.debug(`Scraping categories: ${request.url}`);
        try {
          await page.goto(request.url, { waitUntil: 'domcontentloaded' });

          const hasCat = await page.$('a[href*="/category/"]').then(Boolean).catch(() => false);
          if (!hasCat) {
            log.warning('No category links found on page');
            return;
          }

          const links =
            (await page
              .$$eval('a[href*="/category/"]', (els) =>
                els.map((a: any) => ({
                  title: (a.textContent || '').trim(),
                  href: a.href,
                })),
              )
              .catch((e) => {
                log.error(`$$eval failed: ${String(e)}`);
                return [];
              })) || [];

          for (const l of links) {
            if (!l?.title || !l?.href) continue;

            let slug = '';
            try {
              slug = new URL(l.href).pathname.replace(/^\/|\/$/g, '');
            } catch {
              log.warning(`Invalid category URL: ${l.href}`);
              continue;
            }

            const now = new Date();
            try {
              let cat = await this.catRepo.findOne({ where: { slug } });
              const payload = toCategory({ title: l.title, slug, navigationId, lastScrapedAt: now });

              if (!cat) cat = this.catRepo.create(payload);
              else Object.assign(cat, payload);

              cat = await this.catRepo.save(cat);
              out.push(cat);
            } catch (dbErr) {
              log.error(`DB upsert failed for category slug=${slug}: ${String(dbErr)}`);
            }
          }
        } catch (err) {
          log.error(`Category handler error: ${String(err)}`);
        }
      },
      failedRequestHandler: ({ request, log }, error) => {
        log.error(`Category request failed: ${request.url} error=${String(error)}`);
      },
    });

    await crawler.run([url]);
    return out;
  }

  async scrapeProducts(listingUrl: string): Promise<Product[]> {
    const out: Product[] = [];

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 120,
      maxRequestRetries: 1,
      navigationTimeoutSecs: 45,
      requestHandlerTimeoutSecs: 90,
      requestHandler: async ({ page, request, log, infiniteScroll }) => {
        log.debug(`Scraping products: ${request.url}`);
        try {
          await page.goto(request.url, { waitUntil: 'domcontentloaded' });

          // Optionally scroll:
          // await infiniteScroll({ timeoutSecs: 30 }).catch(() => log.warning('infiniteScroll timed out'));

          const hasCards = await page.$('[data-product-id], .product-card').then(Boolean).catch(() => false);
          if (!hasCards) {
            log.warning('No product cards found on page');
            return;
          }

          const cards =
            (await page
              .$$eval('[data-product-id], .product-card', (els) =>
                els.map((el: any) => {
                  const sourceId = el.getAttribute?.('data-product-id') || el.dataset?.productId;
                  const title =
                    el.querySelector?.('h2, .title')?.textContent?.trim() ||
                    el.querySelector?.('[itemprop="name"]')?.textContent?.trim() ||
                    '';
                  const priceText =
                    el.querySelector?.('.price, [itemprop="price"]')?.textContent?.trim() ||
                    el.querySelector?.('[data-price]')?.getAttribute?.('data-price') ||
                    '';
                  const imageUrl = el.querySelector?.('img')?.src || null;
                  const link = el.querySelector?.('a')?.href || null;
                  return { sourceId, title, priceText, imageUrl, link };
                }),
              )
              .catch((e) => {
                log.error(`$$eval failed: ${String(e)}`);
                return [];
              })) || [];

          for (const p of cards) {
            if (!p?.sourceId || !p?.title || !p?.link) continue;

            const priceNum = parseFloat(String(p.priceText ?? '0').replace(/[^\d.]/g, '')) || 0;
            const priceStr = priceNum.toFixed(2);
            const now = new Date();

            try {
              let prod = await this.prodRepo.findOne({ where: { sourceId: p.sourceId } });
              const payload = toProduct({
                sourceId: p.sourceId,
                title: p.title,
                price: priceStr,
                currency: 'GBP',
                imageUrl: p.imageUrl,
                sourceUrl: p.link,
                lastScrapedAt: now,
              });

              if (!prod) prod = this.prodRepo.create(payload);
              else Object.assign(prod, payload);

              prod = await this.prodRepo.save(prod);
              out.push(prod);
            } catch (dbErr) {
              log.error(`DB upsert failed for product sourceId=${p.sourceId}: ${String(dbErr)}`);
            }
          }
        } catch (err) {
          log.error(`Products handler error: ${String(err)}`);
        }
      },
      failedRequestHandler: ({ request, log }, error) => {
        log.error(`Products request failed: ${request.url} error=${String(error)}`);
      },
    });

    await crawler.run([listingUrl]);
    return out;
  }

  async scrapeProductDetail(productUrl: string): Promise<ProductDetail | null> {
    let saved: ProductDetail | null = null;

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 1,
      maxRequestRetries: 1,
      navigationTimeoutSecs: 45,
      requestHandlerTimeoutSecs: 90,
      requestHandler: async ({ page, request, log }) => {
        log.debug(`Scraping product detail: ${request.url}`);
        try {
          await page.goto(request.url, { waitUntil: 'domcontentloaded' });

          const description = await page
            .$eval('.product-description, #description, [itemprop="description"]', (el: any) =>
              (el.textContent || '').trim(),
            )
            .catch(() => null);

          const ratingsAvg = await page
            .$eval('.rating, .stars, [itemprop="ratingValue"]', (el: any) => {
              const val = el.getAttribute?.('data-rating') || el.textContent || '';
              const num = parseFloat(String(val).replace(/[^\d.]/g, ''));
              return Number.isFinite(num) ? String(num) : null;
            })
            .catch(() => null);

          const specsList = await page
            .$$eval('.specs li, .metadata li, .product-specs li', (els) =>
              els.map((li: any) => (li.textContent || '').trim()).filter(Boolean),
            )
            .catch(() => []);

          const payload = toDetail({
            description,
            ratingsAvg,
            specs: specsList.length ? { list: specsList } : null,
            reviewsCount: 0,
          });

          try {
            const detail = this.detailRepo.create(payload);
            saved = await this.detailRepo.save(detail);
          } catch (dbErr) {
            log.error(`DB insert failed for product detail: ${String(dbErr)}`);
          }
        } catch (err) {
          log.error(`Product detail handler error: ${String(err)}`);
        }
      },
      failedRequestHandler: ({ request, log }, error) => {
        log.error(`Product detail request failed: ${request.url} error=${String(error)}`);
      },
    });

    await crawler.run([productUrl]);
    return saved;
  }
}
