type AppBootStep =
  | 'initializing'
  | 'verifying_session'
  | 'loading_company'
  | 'syncing_data'
  | 'ready';

type AppStateListener = (step: AppBootStep, message: string, progress: number) => void;

class AppStateManagerClass {
  private listeners: Set<AppStateListener> = new Set();
  private currentStep: AppBootStep = 'initializing';
  private currentMessage = 'Preparing Workspace...';
  private currentProgress = 15;

  public setBootPhase(step: AppBootStep, message: string, progress: number) {
    this.currentStep = step;
    this.currentMessage = message;
    this.currentProgress = progress;
    this.notify();
  }

  public getStatus() {
    return {
      step: this.currentStep,
      message: this.currentMessage,
      progress: this.currentProgress,
      isReady: this.currentStep === 'ready',
    };
  }

  public subscribe(listener: AppStateListener): () => void {
    this.listeners.add(listener);
    listener(this.currentStep, this.currentMessage, this.currentProgress);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentStep, this.currentMessage, this.currentProgress));
  }
}

export const AppStateManager = new AppStateManagerClass();
