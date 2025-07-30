"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutShellProps {
  children: React.ReactNode;
}

const LayoutShell = ({ children }: LayoutShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default LayoutShell;
