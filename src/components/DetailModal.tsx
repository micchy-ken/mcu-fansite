import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Check, Star, Heart, Calendar, Link, Sparkles, AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import { McuItem } from '../mcuData';
import { UserReview } from '../types';
import { mcuExtraDataMap, charactersDb } from '../mcuExtraData';

interface DetailModalProps {
  item: McuItem;
  review?: UserReview;
  onClose: () => void;
  onSaveReview: (itemId: string, review: UserReview) => void;
  onCharacterClick?: (characterId: string) => void;
  customExtra?: any;
  fullExtraMap?: Record<string, any>;
}

export default function DetailModal({ item, review, onClose, onSaveReview, onCharacterClick, customExtra, fullExtraMap }: DetailModalProps) {
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState(0);
  const [watchedDate, setWatchedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isUpcoming = item.releaseDate > todayStr;

  const extra = customExtra || mcuExtraDataMap[item.id] || {
    heroIcon: '🎬',
    heroIconName: 'Film',
    accentColor: '#64748b',
    characterIds: []
  };

  // Synchronize state when the modal opens or item changes
  useEffect(() => {
    if (review) {
      setWatched(review.watched);
      setRating(review.rating);
      setWatchedDate(review.watchedDate || '');
      setNotes(review.notes || '');
      setIsFavorite(review.isFavorite || false);
    } else {
      setWatched(false);
      setRating(0);
      setWatchedDate('');
      setNotes('');
      setIsFavorite(false);
    }
    setIsSaved(false);
  }, [item, review]);

  // Handle auto-watched toggle
  const handleWatchedToggle = () => {
    const nextWatched = !watched;
    setWatched(nextWatched);
    if (nextWatched && !watchedDate) {
      // Prefill today's date
      const today = new Date().toISOString().split('T')[0];
      setWatchedDate(today);
    }
  };

  const handleSave = () => {
    const updatedReview: UserReview = {
      watched,
      rating: watched ? rating : 0, // rating is only relevant if watched
      watchedDate: watched ? watchedDate : '',
      notes,
      isFavorite,
      updatedAt: new Date().toISOString(),
    };
    onSaveReview(item.id, updatedReview);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  // Generate Google Search query link for spoiler-filled review
  const spoilerSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.titleJa + ' ネタバレ 解説 考察 結末')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
      />

      {/* Modal Content container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.35 }}
        style={{ borderColor: `${extra.accentColor}30` }}
        className="relative bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Decorative Top Accent */}
        <div className="h-2 w-full" style={{ backgroundColor: extra.accentColor }} />

        {/* Modal Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl bg-slate-950 text-slate-100 p-1.5 rounded-lg border border-slate-800">
                {extra.heroIcon}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850 font-mono tracking-wider">
                {item.type === 'movie' ? '映画' : item.type === 'special' ? '特別編' : 'ドラマシリーズ'}
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-400 px-1.5 py-0.5 bg-slate-950/60 rounded border border-slate-850">
                PHASE {item.phase}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                • {item.durationOrEpisodes}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-display mt-2">
              {item.titleJa}
            </h3>
            <p className="text-xs text-slate-500 font-mono italic mt-0.5">
              {item.titleEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Grid: Synopsis & Importance */}
          <div className="grid grid-cols-1 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> あらすじ
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-850 italic">
                {item.synopsis}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">監督 / クリエイター</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">{item.directorOrCreator}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">初公開日 (米国)</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block font-mono">{item.releaseDate}</span>
              </div>
            </div>
          </div>

          {/* Interactive Characters Network (重要度の前、または直後に追加) */}
          {extra.characterIds.length > 0 && (
            <div className="border border-slate-850 rounded-xl p-4 bg-slate-950">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2.5">
                主要登場キャスト & ヒーロー（クリックで他出演作を相互参照）
              </h4>
              <div className="flex flex-wrap gap-2">
                {extra.characterIds.map(charId => {
                  const char = charactersDb[charId];
                  if (!char) return null;
                  
                  // 他の作品でこのキャラクターが出ている数を計算する想定
                  const appearances = Object.values(fullExtraMap || mcuExtraDataMap).filter(m => m.characterIds.includes(charId)).length;

                  return (
                    <button
                      key={charId}
                      onClick={() => {
                        if (onCharacterClick) {
                          onCharacterClick(charId);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-slate-900 text-slate-300 border border-slate-800 hover:border-red-500 hover:bg-slate-800/80 hover:text-white transition-all cursor-pointer group/char"
                      title={`${char.nameJa}が出演する他の作品を表示します`}
                    >
                      <span className="text-sm">{char.emoji}</span>
                      <div className="text-left">
                        <span className="font-semibold block leading-tight text-slate-200 group-hover/char:text-red-400">{char.heroNameJa || char.nameJa}</span>
                        {char.heroNameJa && (
                          <span className="text-[9px] text-slate-500 block leading-none">{char.nameJa}</span>
                        )}
                      </div>
                      <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500 font-mono group-hover/char:border-red-500/30 group-hover/char:text-red-400">
                        {appearances}作品
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Importance level detailed box */}
          <div className="border border-slate-850 rounded-xl p-4 bg-slate-950">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              シリーズとしての重要度評価
              {item.importance === 3 && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                  必須 / 根幹作品
                </span>
              )}
              {item.importance === 2 && (
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                  個別キャラ理解
                </span>
              )}
              {item.importance === 1 && (
                <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                  補足スピンオフ
                </span>
              )}
            </h4>

            {/* Render stars */}
            <div className="flex gap-1 my-2">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  style={{ color: star <= item.importance ? extra.accentColor : '#1e293b' }}
                  className={`w-5 h-5 ${
                    star <= item.importance
                      ? 'fill-current'
                      : ''
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">重要度解説: </span>
              {item.importanceReason}
            </p>
          </div>

          {/* External Links Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              関連サイトリンク
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Official Site */}
              <a
                href={item.officialUrl || 'https://marvel.disney.co.jp/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-300 transition-all font-medium text-xs text-left"
              >
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-slate-400">
                    <Link className="w-3.5 h-3.5" />
                  </div>
                  公式サイトで調べる (marvel.co.jp)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              {/* Spoiler/Explanation site search query */}
              <a
                href={spoilerSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-red-900/40 hover:border-red-700 bg-red-950/20 hover:bg-red-950/40 text-slate-300 transition-all font-medium text-xs text-left"
              >
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-950/40 flex items-center justify-center text-red-500">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>著名解説サイトで探る <strong className="text-red-400 font-semibold font-mono">※ネタバレ有</strong></span>
                </span>
                <ChevronRight className="w-4 h-4 text-red-500" />
              </a>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>「著名解説サイトで探る」をクリックすると、その作品のネタバレ考察・隠されたイースターエッグの解説記事をGoogle検索します。</span>
            </p>
          </div>

          {/* User Review & Status Section */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              マイ鑑賞記録 & レビュー
            </h4>

            {isUpcoming ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-sky-950/40 text-left space-y-3">
                <div className="flex items-center gap-2 text-sky-450 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>公開予定（未来の時間軸）の作品です</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  この作品は米国公開予定日が <strong className="text-slate-350 font-mono">{item.releaseDate}</strong> となっており、まだリリースされていない未来の作品です。
                  公開日を迎えると、あなたの鑑賞完了バーや統計率（進捗率）の分母に自動的として追加され、
                  こちらのフォームから鑑賞チェック、お気に入り設定、評価星（1〜5）、感想メモの保存ができるようになります。
                </p>
                <div className="inline-flex items-center gap-1.5 text-[10px] bg-sky-950/40 text-sky-400 border border-sky-900/40 px-2 py-0.5 rounded font-bold font-mono">
                  公開までしばしお待ちください！
                </div>
              </div>
            ) : (
              <>
                {/* Quick checkbox list & Heart favorite */}
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none bg-slate-950 border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={watched}
                      onChange={handleWatchedToggle}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      watched ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-800 bg-slate-900'
                    }`}>
                      {watched && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <span className="text-xs font-bold text-slate-300">この作品を観た！</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-950/30 border-rose-900/50 text-rose-400 shadow-sm' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
                    <span>お気に入りに追加</span>
                  </button>
                </div>

                {/* Ratings & Watched Date (enabled if watched is true) */}
                {watched && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850"
                  >
                    {/* Star rating selector */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-1">評価を選択</span>
                      <div className="flex items-center gap-1 mt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button;button"
                            onClick={() => setRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= rating ? 'fill-current text-amber-500' : 'text-slate-800'
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && <span className="ml-2 text-xs font-bold text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{rating} / 5</span>}
                      </div>
                    </div>

                    {/* Calendar Date selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        観た日
                      </label>
                      <input
                        type="date"
                        value={watchedDate}
                        onChange={(e) => setWatchedDate(e.target.value)}
                        className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-lg p-2 focus:border-slate-700 outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Thoughts notes text area */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">
                    作品への感想・メモ
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="感想、覚えておきたい劇中の重要な伏線やマルチバースへの派生展開など、自由に記入してください。ネタバレ感想も大歓迎です！"
                    rows={4}
                    className="w-full bg-slate-950 hover:bg-slate-900/50 focus:bg-slate-950 text-slate-200 text-sm border border-slate-800 rounded-xl p-3.5 outline-none transition-all placeholder:text-slate-600 focus:border-slate-700"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer (Action Panel) */}
        <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between">
          <span className="text-[10px] text-slate-600 font-mono">
            {isUpcoming ? 'ステータス: 未公開（今後の公開予定）' : `最終更新: ${review?.updatedAt ? new Date(review.updatedAt).toLocaleDateString('ja-JP') : '記録なし'}`}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 cursor-pointer transition-colors"
            >
              閉じる
            </button>
            {!isUpcoming && (
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white hover:bg-red-500'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" />
                    保存しました！
                  </>
                ) : (
                  '鑑賞記録を保存する'
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
