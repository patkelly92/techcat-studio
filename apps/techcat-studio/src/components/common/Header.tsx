"use client";

import { FiMenu } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white/80 px-4 dark:bg-zinc-900/80 backdrop-blur">
      <button
        aria-label="Open sidebar"
        className="sm:hidden"
        onClick={onMenuClick}
      >
        <FiMenu className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold">TechCat Studio</h1>
    </header>
  );
};

export default Header;
