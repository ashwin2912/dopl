import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-widest uppercase">
              Portfolio v2.4
            </span>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <a
            className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="https://github.com/ashwin2912"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <a
            className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="https://www.linkedin.com/in/ashwindhanasamy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
            href="https://drive.google.com/file/d/1klg1XSALJdbMhl3onyFzifbg7boa5QNN/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV
          </a>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
            SYSTEM STATUS: OPTIMAL
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
