// Production Telemetry Aggregator Module for Nexvelt Quote Pro

export interface TelemetryMetrics {
  onboardingSuccessCount: number;
  onboardingFailureCount: number;
  retryCount: number;
  totalCompletionTimeMs: number;
  avgCompletionTimeMs: number;
  routeGuardRedirects: number;
  rpcExecutionTimeMs: number;
  lastEventTimestamp: string | null;
}

class TelemetryTracker {
  private metrics: TelemetryMetrics = {
    onboardingSuccessCount: 0,
    onboardingFailureCount: 0,
    retryCount: 0,
    totalCompletionTimeMs: 0,
    avgCompletionTimeMs: 0,
    routeGuardRedirects: 0,
    rpcExecutionTimeMs: 0,
    lastEventTimestamp: null,
  };

  recordOnboardingSuccess(executionTimeMs: number, rpcTimeMs?: number) {
    this.metrics.onboardingSuccessCount += 1;
    this.metrics.totalCompletionTimeMs += executionTimeMs;
    this.metrics.avgCompletionTimeMs = Math.round(
      this.metrics.totalCompletionTimeMs / this.metrics.onboardingSuccessCount
    );
    if (rpcTimeMs) {
      this.metrics.rpcExecutionTimeMs = rpcTimeMs;
    }
    this.metrics.lastEventTimestamp = new Date().toISOString();
  }

  recordOnboardingFailure() {
    this.metrics.onboardingFailureCount += 1;
    this.metrics.lastEventTimestamp = new Date().toISOString();
  }

  recordRetry() {
    this.metrics.retryCount += 1;
  }

  recordRouteGuardRedirect(route: string) {
    this.metrics.routeGuardRedirects += 1;
    console.log(`[NQP-TELEMETRY] Route Guard Redirect recorded for: ${route}`);
  }

  getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }
}

export const telemetry = new TelemetryTracker();
