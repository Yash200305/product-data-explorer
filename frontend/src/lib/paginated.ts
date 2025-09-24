export type PageResult<T> = { items: T[]; total: number };

// Pick the variant that matches your backend and use it across pages:

// Variant A: API returns array + X-Total-Count header
export async function fetchPageA<T>(path: string, params: Record<string, string | number>): Promise<PageResult<T>> {
  const qs = new URLSearchParams(Object.entries(params).reduce((a, [k, v]) => {
    a[k] = String(v);
    return a;
  }, {} as Record<string, string>)).toString();

  const res = await fetch(`${path}?${qs}`);
  if (!res.ok) throw new Error(`GET ${path} failed ${res.status}`);

  const items = (await res.json()) as T[];
  const totalHeader = res.headers.get('X-Total-Count') ?? res.headers.get('x-total-count');
  const total = totalHeader ? parseInt(totalHeader, 10) : items.length;
  return { items, total };
}

// Variant B: API returns { item, totalCount }
export async function fetchPageB<T>(path: string, params: Record<string, string | number>): Promise<PageResult<T>> {
  const qs = new URLSearchParams(Object.entries(params).reduce((a, [k, v]) => {
    a[k] = String(v);
    return a;
  }, {} as Record<string, string>)).toString();

  const res = await fetch(`${path}?${qs}`);
  if (!res.ok) throw new Error(`GET ${path} failed ${res.status}`);

  const raw = (await res.json()) as { item: T[]; totalCount: number };
  return { items: raw.item, total: raw.totalCount };
}

// Variant C: API returns { data, meta: { total } }
export async function fetchPageC<T>(path: string, params: Record<string, string | number>): Promise<PageResult<T>> {
  const qs = new URLSearchParams(Object.entries(params).reduce((a, [k, v]) => {
    a[k] = String(v);
    return a;
  }, {} as Record<string, string>)).toString();

  const res = await fetch(`${path}?${qs}`);
  if (!res.ok) throw new Error(`GET ${path} failed ${res.status}`);

  const env = (await res.json()) as { data: T[]; meta: { total: number } };
  return { items: env.data, total: env.meta.total };
}
