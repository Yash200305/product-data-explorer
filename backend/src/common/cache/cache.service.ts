// cache.service.ts
import { Injectable } from '@nestjs/common';
type Entry<T> = { data: T; expiry: number };

@Injectable()
export class CacheService {
  private store = new Map<string, Entry<any>>();

  set<T>(key: string, data: T, ttlMs = 1000 * 60 * 10) {
    this.store.set(key, { data, expiry: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const hit = this.store.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiry) {
      this.store.delete(key);
      return null;
    }
    return hit.data as T;
  }

  del(key: string) {
    this.store.delete(key);
  }
}
