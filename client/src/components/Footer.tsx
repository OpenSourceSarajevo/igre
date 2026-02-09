import { Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-8 pb-8 px-4 border-t border-[var(--header-border)] bg-transparent sm:mt-10 sm:pt-6 sm:pb-6">
      <div className="max-w-[600px] mx-auto text-center text-[0.85rem] text-[var(--text)] opacity-60">
        <p className="my-[0.4rem] tracking-[0.02em]">
          &copy; {currentYear} &nbsp;
          <a
            href="https://github.com/OpenSourceSarajevo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text)] no-underline font-semibold border-b border-transparent transition-all duration-200 hover:border-b-[var(--text)] hover:opacity-80"
          >
            Open Source Sarajevo
          </a>
        </p>

        <div className="flex gap-6 justify-center items-center mt-4 opacity-70">
          <a
            href="https://github.com/OpenSourceSarajevo/igre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text)] no-underline font-semibold border-b border-transparent transition-all duration-200 hover:border-b-[var(--text)] hover:opacity-80 text-[0.8rem] uppercase tracking-[0.05em] flex items-center gap-[6px]"
          >
            <Github size={16} />
            GitHub
          </a>

        </div>
      </div>
    </footer>
  );
}