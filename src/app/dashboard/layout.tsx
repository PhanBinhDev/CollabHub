'use client';

import { DashboardHeader } from '@/features/dashboard/components/header';
import { Sidebar } from '@/features/dashboard/components/sidebar';

const LayoutAuthenticated = ({ children }: IChildren) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default LayoutAuthenticated;
