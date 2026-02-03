"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Download, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Enrollment {
    id: number;
    course_id: number | null;
    access_type: string;
    drive_link: string | null;
    bunny_video_id: string | null;
    expires_at: string | null;
    created_at: string;
    course: {
        id: number;
        name: string;
        thumbnail: string | null;
        category: string | null;
        author: string | null;
    } | null;
    order: {
        id: number;
        order_code: string;
        created_at: string;
    } | null;
}

export default function MyCoursesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const backendUserId = (session?.user as any)?.backendUserId;

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/my-courses");
        }
    }, [status, router]);

    // Fetch enrollments
    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!backendUserId) return;

            setIsLoading(true);
            setError(null);

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/v1/users/${backendUserId}/enrollments`);

                if (!response.ok) {
                    throw new Error("Không thể tải danh sách khóa học");
                }

                const data = await response.json();
                setEnrollments(data.enrollments || []);
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra");
            } finally {
                setIsLoading(false);
            }
        };

        if (backendUserId) {
            fetchEnrollments();
        }
    }, [backendUserId]);

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Khóa học của tôi</h1>
                    <p className="text-slate-600">Quản lý và truy cập các khóa học bạn đã mua</p>
                </div>

                {/* Content */}
                {error ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có khóa học nào</h3>
                        <p className="text-slate-600 mb-6">Bạn chưa mua khóa học nào. Hãy khám phá các khóa học hấp dẫn!</p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                        >
                            <BookOpen className="w-5 h-5" />
                            Xem khóa học
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative">
                                    {enrollment.course?.thumbnail ? (
                                        <img
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.name || "Course"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-indigo-300" />
                                        </div>
                                    )}

                                    {/* Access Type Badge */}
                                    <div className="absolute top-3 right-3">
                                        {enrollment.access_type === "lifetime" ? (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Vĩnh viễn
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {enrollment.expires_at ? new Date(enrollment.expires_at).toLocaleDateString("vi-VN") : "Tạm thời"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                                        {enrollment.course?.name || "Khóa học"}
                                    </h3>

                                    {enrollment.course?.author && (
                                        <p className="text-sm text-slate-500 mb-3">{enrollment.course.author}</p>
                                    )}

                                    {/* Category */}
                                    {enrollment.course?.category && (
                                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg mb-3">
                                            {enrollment.course.category}
                                        </span>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        {enrollment.drive_link && (
                                            <a
                                                href={enrollment.drive_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Tải xuống
                                            </a>
                                        )}
                                        {enrollment.bunny_video_id && (
                                            <a
                                                href={`/watch/${enrollment.id}`}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Xem online
                                            </a>
                                        )}
                                        {!enrollment.drive_link && !enrollment.bunny_video_id && (
                                            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-500 text-sm rounded-lg">
                                                <Clock className="w-4 h-4" />
                                                Đang xử lý
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Info */}
                                    {enrollment.order && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                            <span>Mã đơn: {enrollment.order.order_code}</span>
                                            <span>{new Date(enrollment.created_at).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
