import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../store/useAuthStore';

describe('Security & Authentication Store Test Suite', () => {
  it('should initialize auth state as unauthenticated by default', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('should clear authentication state on logout', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        email: 'test@firm.com',
        ownerName: 'Test Owner',
        companyName: 'Test Company',
      },
    });

    await useAuthStore.getState().logout();
    const updatedState = useAuthStore.getState();

    expect(updatedState.isAuthenticated).toBe(false);
    expect(updatedState.user).toBeNull();
  });
});
