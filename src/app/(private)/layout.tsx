'use client';
import { Inter } from 'next/font/google';
import { useAuthStore } from '@/store/auth';
import { redirect } from 'next/navigation';

//layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuthStore();
  if (!token) {
    redirect('/login');
  }
  return <section>{children}</section>;
}
