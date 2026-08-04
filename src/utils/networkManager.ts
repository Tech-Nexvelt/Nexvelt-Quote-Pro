import { logger } from './logger';

export type NetworkQuality = 'excellent' | 'good' | 'poor' | 'offline';

export interface NetworkState {
  isOnline: boolean;
  quality: NetworkQuality;
  isLowDataMode: boolean;
  effectiveType?: string;
  rttMs?: number;
  downlinkMbps?: number;
}

type NetworkListener = (state: NetworkState) => void;

class NetworkManagerClass {
  private listeners: Set<NetworkListener> = new Set();
  private currentState: NetworkState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    quality: 'excellent',
    isLowDataMode: false,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleConnectionChange);
      window.addEventListener('offline', this.handleConnectionChange);

      const nav = navigator as any;
      if (nav.connection) {
        nav.connection.addEventListener('change', this.handleConnectionChange);
      }

      this.updateState();
    }
  }

  private handleConnectionChange = () => {
    this.updateState();
    this.notifyListeners();
  };

  private updateState() {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const connection = nav?.connection;

    let quality: NetworkQuality = isOnline ? 'excellent' : 'offline';
    let isLowDataMode = false;
    let effectiveType: string | undefined = undefined;
    let rttMs: number | undefined = undefined;
    let downlinkMbps: number | undefined = undefined;

    if (!isOnline) {
      quality = 'offline';
    } else if (connection) {
      effectiveType = connection.effectiveType;
      rttMs = connection.rtt;
      downlinkMbps = connection.downlink;
      isLowDataMode = connection.saveData || effectiveType === '2g' || effectiveType === 'slow-2g';

      if (effectiveType === '2g' || effectiveType === 'slow-2g' || (rttMs && rttMs > 800)) {
        quality = 'poor';
      } else if (effectiveType === '3g' || (rttMs && rttMs > 300)) {
        quality = 'good';
      } else {
        quality = 'excellent';
      }
    }

    this.currentState = {
      isOnline,
      quality,
      isLowDataMode,
      effectiveType,
      rttMs,
      downlinkMbps,
    };

    logger.info('Network state updated', { state: this.currentState });
  }

  public getState(): NetworkState {
    return this.currentState;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentState));
  }

  /**
   * Exponential backoff retry strategy for failed network requests
   */
  public async autoRetryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 5,
    delaysMs = [1000, 2000, 5000, 10000, 30000]
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) {
          logger.error('Auto retry exceeded maximum attempts', { attempt, maxRetries, error: err });
          throw err;
        }

        const delay = delaysMs[Math.min(attempt - 1, delaysMs.length - 1)];
        logger.warn(`Operation failed. Retrying attempt ${attempt}/${maxRetries} after ${delay}ms...`, { error: err });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('Operation failed after retries');
  }
}

export const NetworkManager = new NetworkManagerClass();
