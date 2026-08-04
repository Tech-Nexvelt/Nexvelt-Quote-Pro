import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-6 font-sans">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              An unexpected error occurred while rendering this component. Please click below to reload the workspace.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
