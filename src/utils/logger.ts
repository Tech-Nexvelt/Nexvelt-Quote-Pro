import { getCorrelationId } from './correlation';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlation_id: string;
  context?: Record<string, any>;
}

export interface StructuredAuditPayload {
  eventName: string;
  userId?: string;
  companyId?: string;
  executionTimeMs?: number;
  result: 'success' | 'failure';
  details?: Record<string, any>;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  error: (message: string, context?: Record<string, any>) => {
    log('error', message, context);
  },
  debug: (message: string, context?: Record<string, any>) => {
    log('debug', message, context);
  },
  audit: (payload: StructuredAuditPayload) => {
    const forceEnable = import.meta.env.VITE_ENABLE_LOGGER === 'true';
    if (!forceEnable) return;

    const entry = {
      timestamp: new Date().toISOString(),
      correlation_id: getCorrelationId(),
      event_name: payload.eventName,
      user_id: payload.userId || 'anonymous',
      company_id: payload.companyId || 'unassigned',
      execution_time_ms: payload.executionTimeMs || 0,
      result: payload.result,
      details: payload.details || {},
    };
    console.log(`[NQP-AUDIT] [${entry.timestamp}] [${entry.correlation_id}] [${entry.event_name}] Result=${entry.result.toUpperCase()}`, entry);
  },
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const forceEnable = import.meta.env.VITE_ENABLE_LOGGER === 'true';

  // Silence verbose info and debug logs by default to keep developer console clean
  if (!forceEnable && (level === 'info' || level === 'debug')) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    correlation_id: getCorrelationId(),
    context,
  };

  if (level === 'error') {
    console.error(`[NQP-LOGGER] [${entry.timestamp}] [${entry.correlation_id}]`, message, context || '');
  } else if (level === 'warn') {
    console.warn(`[NQP-LOGGER] [${entry.timestamp}] [${entry.correlation_id}]`, message, context || '');
  } else if (forceEnable) {
    console.log(`[NQP-LOGGER] [${entry.timestamp}] [${entry.correlation_id}]`, message, context || '');
  }
}
