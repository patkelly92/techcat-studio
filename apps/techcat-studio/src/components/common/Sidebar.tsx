"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import classNames from 'classnames';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Projects', href: '/projects' },
  { name: 'Generate', href: '/generate' },
  { name: 'Documents', href: '/documents' },
  { name: 'Feedback', href: '/feedback' },
  { name: 'Settings', href: '/settings' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-30 bg-black/50 transition-opacity sm:hidden',
          { 'opacity-100': isOpen, 'opacity-0 pointer-events-none': !isOpen }
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-lg transform transition-transform sm:static sm:translate-x-0',
          { 'translate-x-0': isOpen, '-translate-x-full sm:translate-x-0': !isOpen }
        )}
      >
        <button
          aria-label="Close sidebar"
          className="absolute top-4 right-4 sm:hidden"
          onClick={onClose}
        >
          <FiX className="h-6 w-6" />
        </button>
        <nav className="mt-8 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={classNames(
                  'rounded-md px-3 py-2 text-sm',
                  active
                    ? 'bg-gray-200 dark:bg-zinc-700 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
