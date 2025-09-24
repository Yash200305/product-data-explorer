export type Paginated<T> = { items: T[]; total: number };

export async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

export async function getPaginated<T>(url: string, params: Record<string, string | number>): Promise<Paginated<T>> {
  const qs = new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => {
    acc[k] = String(v);
    return acc;
  }, {} as Record<string, string>)).toString();
  return getJSON<Paginated<T>>(`${url}?${qs}`);
}

export async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}
