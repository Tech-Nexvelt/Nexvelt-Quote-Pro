let currentCorrelationId: string | null = null;

export const getCorrelationId = (): string => {
  if (!currentCorrelationId) {
    currentCorrelationId = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return currentCorrelationId;
};

export const setCorrelationId = (id: string): void => {
  currentCorrelationId = id;
};

export const clearCorrelationId = (): void => {
  currentCorrelationId = null;
};
