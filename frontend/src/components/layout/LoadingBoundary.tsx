import React, { Suspense } from 'react';
import { LoadingSkeleton } from '../feedback/LoadingSkeleton';

export interface LoadingBoundaryProps {
  children: React.ReactNode;
}

export const LoadingFallback: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="w-48 h-8" />
        <LoadingSkeleton variant="text" className="w-80 h-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingSkeleton variant="card" className="h-36" />
        <LoadingSkeleton variant="card" className="h-36" />
        <LoadingSkeleton variant="card" className="h-36" />
      </div>
      <LoadingSkeleton variant="card" className="h-64" />
    </div>
  );
};

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({ children }) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};
