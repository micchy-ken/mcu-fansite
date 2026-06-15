import { motion } from 'motion/react';
import { Film, Tv, Award, CheckCircle2, Heart, TrendingUp } from 'lucide-react';
import { McuItem } from '../mcuData';
import { UserReviewsState } from '../types';

interface StatsSectionProps {
  items: McuItem[];
  reviews: UserReviewsState;
}

export default function StatsSection({ items, reviews }: StatsSectionProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter only released items for core percentage metrics (upcoming ones don't affect progress)
  const releasedItems = items.filter(item => item.releaseDate <= todayStr);
  const total = releasedItems.length;
  const watchedCount = releasedItems.filter(item => reviews[item.id]?.watched).length;
  const favoriteCount = Object.keys(reviews).filter(id => reviews[id]?.isFavorite).length;

  const movies = releasedItems.filter(item => item.type === 'movie');
  const watchedMovies = movies.filter(img => reviews[img.id]?.watched);

  const series = releasedItems.filter(item => item.type === 'drama' || item.type === 'special');
  const watchedSeries = series.filter(img => reviews[img.id]?.watched);

  const overallPercent = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
  const moviePercent = movies.length > 0 ? Math.round((watchedMovies.length / movies.length) * 100) : 0;
  const seriesPercent = series.length > 0 ? Math.round((watchedSeries.length / series.length) * 100) : 0;

  // Calculate breakdown per Phase (1 to 6)
  const phases = [1, 2, 3, 4, 5, 6];
  const phaseStats = phases.map(ph => {
    const phReleasedItems = releasedItems.filter(item => item.phase === ph);
    const phWatched = phReleasedItems.filter(item => reviews[item.id]?.watched);
    const phPercent = phReleasedItems.length > 0 ? Math.round((phWatched.length / phReleasedItems.length) * 100) : 0;
    return {
      phase: ph,
      total: phReleasedItems.length,
      watched: phWatched.length,
      percent: phPercent,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
      {/* Overall Progress Bento Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">PERSONAL PROGRESS</p>
            <h3 className="text-2xl font-bold text-slate-200 font-display mt-0.5">全体の鑑賞状況</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-red-950/40 text-red-500 border border-red-900/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2 my-4">
          <span className="text-5xl font-extrabold font-display text-slate-50 tracking-tight">
            {overallPercent}%
          </span>
          <span className="text-sm font-semibold text-slate-400">
            ({watchedCount} / {total} 作品)
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mb-2 border border-slate-850">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-red-600 rounded-full shadow-[0_0_8px_rgba(230,36,41,0.4)]"
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-mono mt-1">
          <span>START</span>
          <span className="flex items-center gap-1 text-red-500 font-medium">
            <Heart className="w-3.5 h-3.5 fill-current" /> お気に入り: {favoriteCount}作品
          </span>
          <span>MCU MASTER</span>
        </div>
      </motion.div>

      {/* Type Breakdown (Movies vs Series) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl flex flex-col justify-between"
      >
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">CATEGORY BREAKDOWN</p>
          <h3 className="text-2xl font-bold text-slate-200 font-display mt-0.5">映画・ドラマ別</h3>
        </div>

        <div className="space-y-4 my-4">
          {/* Movie progress */}
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Film className="w-4 h-4 text-slate-400" /> 映画 ({watchedMovies.length} / {movies.length})
              </span>
              <span className="font-mono text-xs font-semibold text-slate-400">{moviePercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${moviePercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              />
            </div>
          </div>

          {/* Series/Drama progress */}
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Tv className="w-4 h-4 text-slate-400" /> ドラマ等 ({watchedSeries.length} / {series.length})
              </span>
              <span className="font-mono text-xs font-semibold text-slate-400">{seriesPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${seriesPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 mt-2 bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
          <span>ディズニープラス独占作品も含めフルカバレッジ！</span>
        </div>
      </motion.div>

      {/* Phase Progression Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl flex flex-col justify-between"
      >
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-medium">PHASE PROGRESSION</p>
          <h3 className="text-2xl font-bold text-slate-200 font-display mt-0.5">フェーズ別進捗率</h3>
        </div>

        <div className="grid grid-cols-6 gap-2 my-4">
          {phaseStats.map(ph => (
            <div key={ph.phase} className="flex flex-col items-center">
              {/* Vertical Progress Bar */}
              <div className="w-4 bg-slate-950 h-20 rounded-full overflow-hidden relative flex flex-col justify-end border border-slate-850">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${ph.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-full bg-red-600 rounded-full shadow-[0_0_6px_rgba(230,36,41,0.3)]"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 mt-2">
                P{ph.phase}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {ph.watched}/{ph.total}
              </span>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 justify-center font-mono">
          <Award className="w-3.5 h-3.5 text-yellow-500" />
          <span>アベンジャーズ終結、マルチバースを完全制覇せよ</span>
        </div>
      </motion.div>
    </div>
  );
}
