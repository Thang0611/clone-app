import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Download Monitor',
  description: 'Real-time monitoring dashboard for Udemy course downloads',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
