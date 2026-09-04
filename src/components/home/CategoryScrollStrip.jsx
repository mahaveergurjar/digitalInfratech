import { Link } from 'react-router-dom';
import { quickCategories } from '../../data/siteContent';

const catColors = [
  'from-yellow-100 to-amber-100 border-yellow-200 text-yellow-700',
  'from-blue-100 to-cyan-100 border-blue-200 text-blue-700',
  'from-orange-100 to-red-100 border-orange-200 text-orange-700',
  'from-amber-100 to-yellow-100 border-amber-200 text-amber-800',
  'from-sky-100 to-blue-100 border-sky-200 text-sky-700',
  'from-emerald-100 to-green-100 border-emerald-200 text-emerald-700',
  'from-indigo-100 to-violet-100 border-indigo-200 text-indigo-700',
  'from-pink-100 to-rose-100 border-pink-200 text-pink-700',
  'from-teal-100 to-cyan-100 border-teal-200 text-teal-700',
  'from-orange-100 to-amber-100 border-orange-200 text-orange-700',
  'from-violet-100 to-purple-100 border-violet-200 text-violet-700',
  'from-green-100 to-emerald-100 border-green-200 text-green-700',
];

export default function CategoryScrollStrip() {
  return (
    <section className="card-premium p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="kicker">🗂️ Categories</span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">Shop &amp; book by category</h2>
        </div>
        <Link to="/products" className="text-sm font-bold text-orange-600 hover:text-orange-700 no-underline border border-orange-200 rounded-xl px-3 py-1.5 hover:bg-orange-50 transition-all">
          View all →
        </Link>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-1">
        {quickCategories.map((cat, i) => (
          <Link
            key={cat.id}
            to={cat.to}
            className={`flex flex-col items-center gap-2.5 min-w-[5.5rem] sm:min-w-[6.5rem] no-underline group`}
          >
            <span
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br border group-hover:scale-110 group-hover:shadow-md transition-all ${catColors[i % catColors.length]}`}
            >
              {cat.icon}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 text-center leading-tight group-hover:text-orange-600 transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
