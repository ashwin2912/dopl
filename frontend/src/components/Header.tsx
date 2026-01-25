import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded">
            <span className="material-symbols-outlined text-primary text-xl">
              dataset
            </span>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase">
            Index.sys
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-12">
          <Link
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            to="/blog"
          >
            Journal
          </Link>
          <a
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="#"
          >
            Archive
          </a>
          <a
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="#"
          >
            Identity
          </a>
          <a
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="#"
          >
            Signal
          </a>
        </nav>
        <button className="border border-slate-200 dark:border-white/10 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
          Contact
        </button>
      </div>
    </header>
  );
};

export default Header;
