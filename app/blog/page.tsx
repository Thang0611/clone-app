"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, ArrowRight, Search, Tag } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Mock blog posts
const BLOG_POSTS = [
  {
    id: 1,
    title: "Top 10 Khóa Học Udemy Phổ Biến Nhất 2026",
    excerpt: "Khám phá những khóa học được yêu thích nhất trên Udemy trong năm 2026, từ lập trình đến design và marketing.",
    content: "Trong năm 2026, xu hướng học online ngày càng phát triển mạnh mẽ...",
    author: "Admin",
    date: "2026-01-13",
    readTime: "5 phút",
    category: "Xu hướng",
    thumbnail: "https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Top+10+Courses",
    tags: ["Udemy", "Top List", "2026"],
  },
  {
    id: 2,
    title: "Hướng Dẫn Tải Khóa Học Về Google Drive",
    excerpt: "Chi tiết từng bước để tải khóa học Udemy, Unica, Gitiho về Google Drive một cách nhanh chóng và tiện lợi.",
    content: "Bước 1: Nhập link khóa học vào form...",
    author: "Support Team",
    date: "2026-01-12",
    readTime: "8 phút",
    category: "Hướng dẫn",
    thumbnail: "https://via.placeholder.com/800x450/7C3AED/FFFFFF?text=Tutorial",
    tags: ["Tutorial", "Google Drive", "How To"],
  },
  {
    id: 3,
    title: "So Sánh Udemy vs Unica vs Gitiho - Nền Tảng Nào Tốt Hơn?",
    excerpt: "Phân tích chi tiết ưu nhược điểm của 3 nền tảng học online hàng đầu Việt Nam và quốc tế.",
    content: "Udemy là nền tảng học online lớn nhất thế giới với hơn 200,000 khóa học...",
    author: "Nguyễn Văn A",
    date: "2026-01-10",
    readTime: "10 phút",
    category: "So sánh",
    thumbnail: "https://via.placeholder.com/800x450/EC4899/FFFFFF?text=Comparison",
    tags: ["Udemy", "Unica", "Gitiho", "Comparison"],
  },
  {
    id: 4,
    title: "5 Lý Do Nên Học Lập Trình Python Trong 2026",
    excerpt: "Python tiếp tục là ngôn ngữ lập trình phổ biến nhất. Tìm hiểu lý do tại sao bạn nên học Python ngay hôm nay.",
    content: "Python là ngôn ngữ dễ học, ứng dụng rộng rãi trong AI, Data Science...",
    author: "Tech Writer",
    date: "2026-01-08",
    readTime: "6 phút",
    category: "Lập trình",
    thumbnail: "https://via.placeholder.com/800x450/06B6D4/FFFFFF?text=Python+2026",
    tags: ["Python", "Programming", "Career"],
  },
  {
    id: 5,
    title: "Cách Tối Ưu Chi Phí Học Online",
    excerpt: "Mẹo tiết kiệm hàng triệu đồng khi mua khóa học online mà vẫn đảm bảo chất lượng học tập.",
    content: "Thay vì mua khóa học giá gốc hàng triệu, bạn có thể tiết kiệm 99%...",
    author: "Admin",
    date: "2026-01-05",
    readTime: "7 phút",
    category: "Tiết kiệm",
    thumbnail: "https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=Save+Money",
    tags: ["Money Saving", "Tips", "Budget"],
  },
  {
    id: 6,
    title: "Top Khóa Học Design Đáng Học Nhất",
    excerpt: "Danh sách các khóa học thiết kế đồ họa, UI/UX và motion graphics được đánh giá cao nhất.",
    content: "Thiết kế đồ họa là kỹ năng quan trọng trong thời đại digital...",
    author: "Design Team",
    date: "2026-01-03",
    readTime: "9 phút",
    category: "Thiết kế",
    thumbnail: "https://via.placeholder.com/800x450/10B981/FFFFFF?text=Design+Courses",
    tags: ["Design", "UI/UX", "Graphics"],
  },
];

const CATEGORIES = ["Tất cả", "Xu hướng", "Hướng dẫn", "So sánh", "Lập trình", "Thiết kế", "Tiết kiệm"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Blog & Tin tức
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cập nhật tin tức, hướng dẫn và mẹo học online hiệu quả
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-100 shadow"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-slate-600">
          <p className="text-lg font-medium">
            {filteredPosts.length} bài viết
          </p>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-slate-600">
              Thử thay đổi từ khóa hoặc danh mục tìm kiếm
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-900">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <CardBody className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 min-h-[56px] group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc thêm
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Muốn nhận tin tức mới nhất?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay để nhận thông báo về khóa học mới, ưu đãi đặc biệt và tips học tập
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <Button size="lg" variant="secondary">
              Đăng ký
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
