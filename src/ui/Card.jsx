export const Card = ({ children, title, className = "" }) => (
  <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-4 ${className}`}>
    {title && <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{title}</h4>}
    {children}
  </div>
);