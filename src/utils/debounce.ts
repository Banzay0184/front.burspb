/**
 * Утилита для дебаунсинга функций
 * Современная альтернатива lodash.debounce для Vue 3 и TypeScript
 */

export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
  pending(): boolean;
};

/**
 * Создает дебаунсированную версию функции
 * @param func - функция для дебаунсинга
 * @param delay - задержка в миллисекундах
 * @param options - дополнительные опции
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: {
    leading?: boolean;  // вызвать функцию сразу при первом вызове
    trailing?: boolean; // вызвать функцию после окончания задержки (по умолчанию true)
    maxWait?: number;   // максимальное время ожидания
  } = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: number | null = null;
  let maxTimeoutId: number | null = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T>;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func.apply(null, args);
    return result;
  }

  function startTimer(pendingFunc: () => void, wait: number): number {
    return window.setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: number): void {
    clearTimeout(id);
  }

  function leadingEdge(time: number): ReturnType<T> {
    // Сброс любого `maxWait` таймера
    lastInvokeTime = time;
    // Запуск trailing edge таймера
    timeoutId = startTimer(timerExpired, delay);
    // Вызов функции на leading edge
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Либо это первый вызов, либо активность возобновилась,
    // либо превышен `maxWait` таймер, либо время debounce истекло
    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Перезапуск таймера
    timeoutId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> {
    timeoutId = null;

    // Вызов функции только если у нас есть `lastArgs`, что означает,
    // что `debounced` была вызвана хотя бы один раз
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== null) {
      cancelTimer(timeoutId);
    }
    if (maxTimeoutId !== null) {
      cancelTimer(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = 0;
    timeoutId = null;
    maxTimeoutId = null;
  }

  function flush(): ReturnType<T> {
    return timeoutId === null ? result : trailingEdge(Date.now());
  }

  function pending(): boolean {
    return timeoutId !== null;
  }

  function debounced(...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Обработка вызовов в горячем цикле
        timeoutId = startTimer(timerExpired, delay);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === null) {
      timeoutId = startTimer(timerExpired, delay);
    }
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced as DebouncedFunction<T>;
}

/**
 * Создает тротлированную версию функции
 * @param func - функция для тротлинга
 * @param delay - задержка в миллисекундах
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  return debounce(func, delay, {
    leading: true,
    trailing: true,
    maxWait: delay
  });
} 