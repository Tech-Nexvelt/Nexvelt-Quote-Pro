export type SyncStateStatus = 'idle' | 'syncing' | 'synced' | 'failed';

export interface SyncState {
  status: SyncStateStatus;
  pendingCount: number;
  lastSyncedAt?: string;
  errorMessage?: string;
}

type SyncListener = (state: SyncState) => void;

class SyncManagerClass {
  private listeners: Set<SyncListener> = new Set();
  private state: SyncState = {
    status: 'idle',
    pendingCount: 0,
    lastSyncedAt: new Date().toISOString(),
  };

  public setSyncing(pendingCount = 1) {
    this.state = {
      ...this.state,
      status: 'syncing',
      pendingCount,
    };
    this.notify();
  }

  public setSynced() {
    this.state = {
      status: 'synced',
      pendingCount: 0,
      lastSyncedAt: new Date().toISOString(),
    };
    this.notify();
  }

  public setFailed(errorMsg: string) {
    this.state = {
      ...this.state,
      status: 'failed',
      errorMessage: errorMsg,
    };
    this.notify();
  }

  public getState(): SyncState {
    return this.state;
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const SyncManager = new SyncManagerClass();
