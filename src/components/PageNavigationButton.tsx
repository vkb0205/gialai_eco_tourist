import { ArrowRight } from 'lucide-react';
import { type ReactNode } from 'react';

type PageNavigationButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

const fluidEase = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

export default function PageNavigationButton({ children, onClick }: PageNavigationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`reveal group inline-flex items-center gap-4 rounded-full bg-[#173d2b] py-3 pl-7 pr-3 font-black text-[#f7f5eb] shadow-[0_18px_48px_rgba(23,61,43,0.18)] transition-all duration-700 ${fluidEase} hover:-translate-y-1 hover:bg-[#214d36] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#c28a36]/30`}
    >
      {children}
      <span className={`grid h-11 w-11 place-items-center rounded-full bg-[#c28a36] text-[#14251c] transition-transform duration-700 ${fluidEase} group-hover:translate-x-1 group-hover:-translate-y-[1px]`}>
        <ArrowRight size={18} strokeWidth={1.75} />
      </span>
    </button>
  );
}
