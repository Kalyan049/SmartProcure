import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-surface-page">
          <div className="w-full max-w-md bg-white rounded-md border border-red-200 p-8 shadow-card text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-semantic-error flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              An unexpected error occurred
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 mb-6 leading-relaxed">
              The application encountered an issue while rendering this view. Your session and
              stored procurement data remain safe.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-50 border border-surface-border rounded-sm text-left text-xs font-mono text-text-muted mb-6 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                isFullWidth
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" />}
                isFullWidth
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
