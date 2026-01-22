# GetCourses - Tải Khóa Học Online

Dự án Next.js để tải và quản lý khóa học online từ các nền tảng như Udemy, Coursera, LinkedIn Learning về Google Drive.

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Production Build

```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
├── app/              # Next.js App Router
│   ├── (routes)/    # Routes và pages
│   ├── api/         # API routes
│   └── layout.tsx   # Root layout
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities và helpers
├── types/           # TypeScript types
├── public/          # Static assets
├── docs/            # Documentation (xem docs/README.md)
└── scripts/         # Build và deployment scripts
```

## 📚 Documentation

Xem **[Documentation Index](./docs/README.md)** để biết tất cả tài liệu có sẵn.

### Quick Links
- **[Quick Start Guide](./docs/guides/QUICK_START.md)** - Bắt đầu nhanh
- **[Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)** - Hướng dẫn deploy
- **[Tracking Setup](./docs/tracking/TRACKING_SETUP.md)** - Setup Facebook Pixel & GTM
- **[API Documentation](./docs/guides/API_DOCS_VI.md)** - API docs (Vietnamese)

### Main Categories
- 📊 [Tracking](./docs/tracking/) - Facebook Pixel, GTM, event tracking
- 🚀 [Deployment](./docs/deployment/) - SSH, SSL, PM2, deployment
- 🔐 [Authentication](./docs/auth/) - Auth setup, login fixes
- 🔍 [SEO](./docs/seo/) - SEO optimization guides
- 🏭 [Production](./docs/production/) - Production config & analysis
- 🔧 [Fixes](./docs/fixes/) - Bug fixes documentation
- 👨‍💼 [Admin](./docs/admin/) - Admin dashboard docs
- ♻️ [Refactoring](./docs/refactoring/) - Code refactoring docs

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js v4
- **Tracking:** Facebook Pixel, Google Tag Manager
- **Deployment:** PM2, Nginx, SSL auto-renew

## 🔧 Environment Variables

Xem [ENV_FILES_EXPLAINED.md](./docs/production/ENV_FILES_EXPLAINED.md) để biết các biến môi trường cần thiết.

Các biến chính:
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID
- `NEXT_PUBLIC_META_PIXEL_ID` - Facebook Pixel ID
- `NEXTAUTH_SECRET` - NextAuth secret
- `DATABASE_URL` - Database connection string

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

## 📝 Notes

- Documentation được viết bằng tiếng Việt
- Tất cả tài liệu nằm trong thư mục `docs/`
- Xem `docs/README.md` để biết cấu trúc đầy đủ

---
**Last Updated:** 2024