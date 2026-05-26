import { motion } from 'motion/react';
import { Film, Tv, Calendar, Flame, Check, MessageSquare, Star, Heart } from 'lucide-react';
import { McuItem } from '../mcuData';
import { UserReview } from '../types';
import { mcuExtraDataMap, charactersDb } from '../mcuExtraData';

interface McuCardProps {
  item: McuItem;
  review?: UserReview;
  orderType: 'release' | 'chrono';
  onSelect: (item: McuItem) => void;
  onToggleWatched: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onCharacterClick?: (characterId: string) => void;
  selectedCharacterId?: string | null;
  customExtra?: any;
}

export default function McuCard({ 
  item, 
  review, 
  orderType, 
  onSelect, 
  onToggleWatched, 
  onToggleFavorite, 
  onCharacterClick,
  selectedCharacterId,
  customExtra
}: McuCardProps) {
  const isWatched = review?.watched || false;
  const isFavorite = review?.isFavorite || false;
  const userRating = review?.rating || 0;
  const hasNotes = review?.notes && review.notes.trim().length > 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const isUpcoming = item.releaseDate > todayStr;

  const extra = customExtra || mcuExtraDataMap[item.id] || {
    heroIcon: '🎬',
    heroIconName: 'Film',
    accentColor: '#64748b',
    characterIds: []
  };

  // Render Importance elements: 3 levels
  const getImportanceBadge = (importance: 3 | 2 | 1) => {
    switch (importance) {
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <Flame className="w-3 h-3 fill-current text-red-500" /> 必須級 ★★★
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            推奨 ★★
          </span>
        );
      case 1:
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            補足 ★
          </span>
        );
    }
  };

  const formattedDate = new Date(item.releaseDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      whileHover={isUpcoming ? { y: -1 } : { y: -3 }}
      style={{
        borderColor: isUpcoming
          ? 'rgba(71,85,105,0.4)'
          : isWatched 
            ? '#10b981' 
            : `${extra.accentColor}30`,
        boxShadow: isUpcoming
          ? 'none'
          : isWatched 
            ? `0 4px 20px -5px rgba(16,185,129,0.2)` 
            : `0 4px 20px -5px ${extra.accentColor}20`
      }}
      className={`group relative bg-slate-900 rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isUpcoming
          ? 'opacity-75 border-dashed border-slate-700 hover:border-slate-600'
          : isWatched 
            ? 'border-emerald-500/50' 
            : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Decorative colored top line based on type */}
      <div className="h-1 w-full" style={{ backgroundColor: extra.accentColor }} />

      {/* Clean Structured Header Row (Guarantees zero overlapping) */}
      <div className="px-4 py-3 flex items-center justify-between gap-1.5 border-b border-slate-850/40 bg-slate-950/20">
        {/* Left: Index Badge & Hero Icon Motif */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800 shadow-xs whitespace-nowrap shrink-0">
            {orderType === 'chrono' ? `劇中順 ${item.chronoOrder}` : `公開順 ${item.releaseOrder}`}
          </div>
          <div 
            className="text-xs px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-center shadow-xs shrink-0"
            title="ヒーローモチーフ"
          >
            {extra.heroIcon}
          </div>
        </div>

        {/* Right: Watched Checker & Favorite Badges or Upcoming Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isUpcoming ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-950/40 text-sky-400 border border-sky-900/30 text-[10px] font-mono font-bold shadow-xs select-none">
              <Calendar className="w-3 h-3 text-sky-400" /> 公開予定
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className={`flex items-center justify-center p-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-950/50 border-rose-500/45 text-rose-400 hover:bg-rose-950/70'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-rose-455'
                }`}
                title={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatched(item.id);
                }}
                className={`flex items-center justify-center p-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
                  isWatched
                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
                title={isWatched ? '鑑賞済み(クリックで未鑑賞に)' : '未鑑賞(クリックで鑑賞済みに)'}
              >
                <Check className="w-3 h-3 stroke-[3px]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between h-auto min-h-[220px]" onClick={() => onSelect(item)}>
        <div>
          {/* Metadata: Type, Date and Phase */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400 font-mono mb-2 pt-1">
            <span className="flex items-center gap-1 text-slate-400">
              {item.type === 'movie' ? (
                <Film className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Tv className="w-3.5 h-3.5 text-amber-500" />
              )}
              {item.type === 'movie' ? '映画' : item.type === 'special' ? '特別編' : 'ドラマ'}
            </span>
            <span>•</span>
            <span className="bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
              PHASE {item.phase}
            </span>
            <span>•</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium font-sans ${isUpcoming ? 'text-sky-400 font-semibold' : 'text-slate-400 font-mono'}`}>
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              {formattedDate}{isUpcoming ? ' (予定)' : ''}
            </span>
          </div>

          {/* Titles */}
          <h4 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-white transition-colors mt-1 flex items-center gap-1.5">
            <span className="line-clamp-1">{item.titleJa}</span>
          </h4>
          <p className="text-xs text-slate-500 font-mono italic truncate mt-0.5">
            {item.titleEn}
          </p>

          {/* Chrono Period or Setting info */}
          <div className="mt-3 text-[11px] bg-slate-950 border border-slate-850 px-2 py-1.5 rounded-lg text-slate-400">
            <span className="text-[9px] uppercase text-slate-500 block font-bold font-mono">劇中での設定年代</span>
            <span className="line-clamp-1 mt-0.5 text-slate-300 font-medium">{item.chronoSetting}</span>
          </div>

          {/* Characters (登場人物リンク) */}
          {extra.characterIds.length > 0 && (
            <div className="mt-3.5">
              <span className="text-[9px] uppercase text-slate-500 block font-bold font-mono mb-1">主要な登場キャラクター</span>
              <div className="flex flex-wrap gap-1">
                {extra.characterIds.slice(0, 4).map(charId => {
                  const char = charactersDb[charId];
                  if (!char) return null;
                  const isSelected = selectedCharacterId === charId;
                  
                  return (
                    <button
                      key={charId}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCharacterClick) {
                          onCharacterClick(charId);
                        }
                      }}
                      style={{
                        borderColor: isSelected ? extra.accentColor : ''
                      }}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-800 text-white font-bold border-red-500' 
                          : 'bg-slate-950/60 text-slate-400 border-slate-850 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      title={`${char.nameJa}の登場作品を絞り込む`}
                    >
                      <span className="text-[10px]">{char.emoji}</span>
                      <span className="truncate max-w-[80px]">{char.heroNameJa || char.nameJa}</span>
                    </button>
                  );
                })}
                {extra.characterIds.length > 4 && (
                  <span className="text-[9px] text-slate-500 self-center px-1 font-mono">
                    +{extra.characterIds.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Short Synopsis */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
            {item.synopsis}
          </p>
        </div>

        {/* Footer Area */}
        <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getImportanceBadge(item.importance)}
          </div>

          {/* User's private review rating or notes indicators */}
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400">
            {userRating > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                {userRating}
              </span>
            )}
            {hasNotes && (
              <span className="p-1 rounded bg-slate-950 border border-slate-850 text-slate-400" title="感想記入あり">
                <MessageSquare className="w-3 h-3 text-slate-400" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
