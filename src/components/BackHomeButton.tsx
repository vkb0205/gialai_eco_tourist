import { ArrowLeft } from 'lucide-react';

type BackHomeButtonProps = {
  onClick: () => void;
};

const fluidEase = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

export default function BackHomeButton({ onClick }: BackHomeButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`reveal group inline-flex items-center gap-3 rounded-full bg-[#edf2e9] py-2 pl-3 pr-5 text-sm font-black text-[#173d2b] ring-1 ring-[#173d2b]/8 transition-all duration-700 ${fluidEase} hover:-translate-x-1 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#c28a36]/30`}>
      <span className={`grid h-8 w-8 place-items-center rounded-full bg-[#173d2b] text-[#f7f5eb] transition-transform duration-700 ${fluidEase} group-hover:-translate-x-0.5`}><ArrowLeft size={15} strokeWidth={1.6} /></span>
      Trang chủ
    </button>
  );
}
