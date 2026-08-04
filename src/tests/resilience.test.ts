import { describe, it, expect, vi } from 'vitest';
import { NetworkManager } from '../utils/networkManager';
import { AppStateManager } from '../utils/appStateManager';
import { SyncManager } from '../utils/syncManager';

describe('Enterprise Application States & Resilience Test Suite', () => {
  it('should initialize NetworkManager and report online status', () => {
    const state = NetworkManager.getState();
    expect(state.isOnline).toBe(true);
    expect(state.quality).toBe('excellent');
  });

  it('should execute autoRetryWithBackoff successfully on first try', async () => {
    const operation = vi.fn().mockResolvedValue('success_data');
    const result = await NetworkManager.autoRetryWithBackoff(operation, 3, [10, 20]);
    expect(result).toBe('success_data');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry failed operations up to maxRetries before throwing error', async () => {
    const failingOperation = vi.fn().mockRejectedValue(new Error('Network timeout'));
    await expect(
      NetworkManager.autoRetryWithBackoff(failingOperation, 3, [10, 20])
    ).rejects.toThrow('Network timeout');
    expect(failingOperation).toHaveBeenCalledTimes(3);
  });

  it('should track AppStateManager boot phase transitions', () => {
    AppStateManager.setBootPhase('verifying_session', 'Connecting Securely...', 40);
    const status = AppStateManager.getStatus();
    expect(status.step).toBe('verifying_session');
    expect(status.message).toBe('Connecting Securely...');
    expect(status.progress).toBe(40);
  });

  it('should track SyncManager status changes', () => {
    SyncManager.setSyncing(3);
    expect(SyncManager.getState().status).toBe('syncing');
    expect(SyncManager.getState().pendingCount).toBe(3);

    SyncManager.setSynced();
    expect(SyncManager.getState().status).toBe('synced');
    expect(SyncManager.getState().pendingCount).toBe(0);
  });
});
