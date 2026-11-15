import NextLink from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paytm-sky text-paytm-text flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-paytm-border shadow-sm text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-paytm-navy">
          <AlertCircle className="w-6 h-6 text-paytm-cyan" />
        </div>
        <h1 className="text-xl font-bold text-paytm-navy mb-2">Page Not Found</h1>
        <p className="text-xs text-paytm-muted mb-6">
          The requested medical emergency page or journey record could not be found.
        </p>
        <NextLink
          href="/"
          className="inline-flex items-center gap-2 bg-paytm-navy text-white px-4 py-2.5 rounded text-xs font-bold hover:bg-opacity-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Emergency Counter</span>
        </NextLink>
      </div>
    </div>
  );
}

