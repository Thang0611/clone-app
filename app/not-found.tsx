import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

/**
 * Next.js 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardBody className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
              <FileQuestion className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-6xl font-bold text-indigo-600 mb-3">404</h1>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Không tìm thấy trang
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link href="/">
              <Button size="lg" className="w-full">
                <Home className="w-5 h-5 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
