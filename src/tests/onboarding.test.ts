import { describe, it, expect } from 'vitest';
import { OnboardingService } from '@/services/onboarding.service';
import { telemetry } from '@/utils/telemetry';

describe('Onboarding Enterprise Test Suite', () => {
  it('should provision onboarding setup and maintain idempotency', async () => {
    const payload = {
      userId: 'test-user-uuid-101',
      email: 'testowner@nexvelt.com',
      companyName: 'Test Furniture Workshop',
      ownerName: 'Test Owner',
      phone: '+91 99999 88888',
      businessType: 'Furniture Dealer',
    };

    const res1 = await OnboardingService.completeInitialSetup(payload);
    const res2 = await OnboardingService.completeInitialSetup(payload);

    expect(res1.company.id).toBe(res2.company.id);
  });

  it('should verify tenant health status after onboarding', async () => {
    const healthStatus = await OnboardingService.checkOnboardingStatus('test-user-uuid-101');
    expect(healthStatus.isComplete).toBe(true);
  });

  it('should record telemetry success metrics', () => {
    const metrics = telemetry.getMetrics();
    expect(metrics.onboardingSuccessCount).toBeGreaterThanOrEqual(1);
  });
});
