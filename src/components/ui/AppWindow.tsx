import type { ReactNode } from "react";

/** Title bar with traffic lights and the hard ink shadow. */
export function AppWindow({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[18px] border-[1.5px] border-ink bg-white shadow-hard ${className}`}>
      <div className="flex items-center gap-2 border-b-[1.5px] border-ink bg-paper-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full border border-ink/30 bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full border border-ink/30 bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full border border-ink/30 bg-[#28c840]" />
        <span className="ml-3 font-mono text-[12px] text-ink-2">{title}</span>
      </div>
      {children}
    </div>
  );
}
