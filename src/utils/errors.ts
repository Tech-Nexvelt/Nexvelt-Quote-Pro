export type NQPErrorCode =
  | 'NQP-001' // Company Not Found
  | 'NQP-002' // Permission Denied
  | 'NQP-003' // Subscription Limit Reached
  | 'NQP-004' // Quotation Locked / Optimistic Concurrency Failure
  | 'NQP-005' // Invalid Workspace
  | 'NQP-006' // Customer Already Exists
  | 'NQP-007' // Storage Quota Exceeded
  | 'NQP-008' // Rate Limit Exceeded
  | 'NQP-009' // Invalid Database State
  | 'NQP-010'; // Internal Server Error

export class NQPError extends Error {
  public code: NQPErrorCode;
  public details?: Record<string, any>;

  constructor(code: NQPErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'NQPError';
    this.code = code;
    this.details = details;
  }
}
