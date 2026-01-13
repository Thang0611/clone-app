"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * Next.js Error Page
 * Automatically catches errors in app router
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardBody className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Oops! Có lỗi xảy ra
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Đã xảy ra lỗi không mong muốn. Chúng tôi đang khắc phục vấn đề này.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 font-medium">
                  🔍 Chi tiết lỗi (Development only)
                </summary>
                <div className="mt-3 p-4 bg-slate-100 rounded-lg">
                  <p className="text-sm text-red-600 font-semibold mb-2">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-slate-500 mb-2">
                      Error Digest: {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <pre className="text-xs overflow-auto text-slate-700">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            <div className="space-y-3">
              <Button onClick={reset} className="w-full" size="lg">
                <RefreshCw className="w-5 h-5 mr-2" />
                Thử lại
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                <Home className="w-5 h-5 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
