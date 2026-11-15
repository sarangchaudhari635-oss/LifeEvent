"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paytm-sky text-paytm-text flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-red-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-paytm-navy mb-2">Something went wrong</h1>
        <p className="text-xs text-paytm-muted mb-6">
          An error occurred while loading this emergency session. You can try refreshing the view.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-paytm-navy text-white px-4 py-2.5 rounded text-xs font-bold hover:bg-opacity-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}

