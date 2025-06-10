/**
 * Система кэширования API запросов
 * Поддерживает TTL (время жизни кэша) и автоматическую очистку устаревших данных
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // время жизни в миллисекундах
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: number | null = null;

  constructor() {
    // Запускаем очистку кэша каждые 5 минут
    this.startCleanupInterval();
  }

  /**
   * Генерирует ключ кэша из параметров
   */
  private generateKey(baseUrl: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== null && params[key] !== undefined) {
          result[key] = params[key];
        }
        return result;
      }, {} as Record<string, any>);

    return `${baseUrl}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Получает данные из кэша если они актуальны
   */
  get<T>(baseUrl: string, params: Record<string, any> = {}): T | null {
    const key = this.generateKey(baseUrl, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Данные устарели, удаляем из кэша
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Сохраняет данные в кэш
   */
  set<T>(
    baseUrl: string, 
    params: Record<string, any> = {}, 
    data: T, 
    ttl: number = 5 * 60 * 1000 // по умолчанию 5 минут
  ): void {
    const key = this.generateKey(baseUrl, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Удаляет данные из кэша
   */
  delete(baseUrl: string, params: Record<string, any> = {}): void {
    const key = this.generateKey(baseUrl, params);
    this.cache.delete(key);
  }

  /**
   * Очищает весь кэш
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Очищает устаревшие записи из кэша
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      // API Cache: очищены устаревшие записи
    }
  }

  /**
   * Запускает интервал очистки кэша
   */
  private startCleanupInterval(): void {
    // Проверяем, что код выполняется в браузере
    if (typeof window !== 'undefined' && typeof window.setInterval === 'function') {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, 5 * 60 * 1000); // каждые 5 минут
    }
  }

  /**
   * Останавливает интервал очистки кэша
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval && typeof window !== 'undefined') {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Получает статистику кэша
   */
  getStats(): { totalEntries: number; validEntries: number; expiredEntries: number } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach(entry => {
      if (now - entry.timestamp <= entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }
}

// Создаем единственный экземпляр кэша для всего приложения
export const apiCache = new ApiCache();

// Типы для TypeScript
export interface CachedApiResponse<T> {
  data: T;
  fromCache: boolean;
}

/**
 * Утилитарная функция для работы с кэшированными запросами
 */
export async function cachedFetch<T>(
  url: string,
  params: Record<string, any> = {},
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<CachedApiResponse<T>> {
  // Пытаемся получить данные из кэша
  const cachedData = apiCache.get<T>(url, params);
  
  if (cachedData) {
    return {
      data: cachedData,
      fromCache: true
    };
  }

  // Данных в кэше нет, делаем запрос
  try {
    const data = await fetcher();
    
    // Сохраняем результат в кэш
    apiCache.set(url, params, data, ttl);
    
    return {
      data,
      fromCache: false
    };
  } catch (error) {
    // В случае ошибки не кэшируем результат
    throw error;
  }
} 