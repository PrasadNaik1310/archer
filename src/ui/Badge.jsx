export const Badge = ({ children, variant = 'default' }) => {
  const colors = {
    default: "bg-slate-800 text-slate-300",
    negative: "bg-red-500/10 text-red-400 border border-red-500/20",
    positive: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors[variant] || colors.default}`}>{children}</span>;
};

export default Badge;