import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, ListOrdered, Calendar, 
  MessageSquare, Flame, Tv, Film, RotateCcw, Award, CheckSquare, Check, 
  Grid, List, Sparkles, Star, Heart, FileText, ChevronRight, UserMinus, Database, HelpCircle
} from 'lucide-react';
import { mcuItems, McuItem } from './mcuData';
import { UserReviewsState, FilterState, SortOrder, UserReview } from './types';
import { mcuExtraDataMap, charactersDb, ExtraItemData } from './mcuExtraData';
import StatsSection from './components/StatsSection';
import McuCard from './components/McuCard';
import DetailModal from './components/DetailModal';
import DatabaseAdmin from './components/DatabaseAdmin';
import HelpPage from './components/HelpPage';

export default function App() {
  // --- STATES ---
  const [reviews, setReviews] = useState<UserReviewsState>({});
  const [sortOrder, setSortOrder] = useState<SortOrder>('release');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [activeTab, setActiveTab] = useState<'list' | 'my-reviews' | 'db-admin' | 'help'>('list');
  const [reviewTabSubFilter, setReviewTabSubFilter] = useState<'all' | 'favorites' | 'notes'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<McuItem | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  
  // Dynamic database states
  const [dbItems, setDbItems] = useState<McuItem[]>([]);
  const [extraMap, setExtraMap] = useState<Record<string, ExtraItemData>>({});

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    phase: 'all',
    importance: 'all',
    watchedStatus: 'all',
  });

  // --- DATABASE LOCAL STORAGE HANDLING ---
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('mcu_custom_db_items');
      const storedExtra = localStorage.getItem('mcu_custom_db_extra');
      if (storedItems) {
        setDbItems(JSON.parse(storedItems));
      } else {
        setDbItems(mcuItems);
      }
      if (storedExtra) {
        setExtraMap(JSON.parse(storedExtra));
      } else {
        setExtraMap(mcuExtraDataMap);
      }
    } catch (e) {
      console.error('Failed to load custom database:', e);
      setDbItems(mcuItems);
      setExtraMap(mcuExtraDataMap);
    }
  }, []);

  const handleUpdateDb = (updatedItems: McuItem[], updatedExtra: Record<string, ExtraItemData>) => {
    setDbItems(updatedItems);
    setExtraMap(updatedExtra);
    try {
      localStorage.setItem('mcu_custom_db_items', JSON.stringify(updatedItems));
      localStorage.setItem('mcu_custom_db_extra', JSON.stringify(updatedExtra));
    } catch (e) {
      console.error('Failed to save custom DB:', e);
    }
  };

  const handleResetDb = () => {
    setDbItems(mcuItems);
    setExtraMap(mcuExtraDataMap);
    try {
      localStorage.removeItem('mcu_custom_db_items');
      localStorage.removeItem('mcu_custom_db_extra');
    } catch (e) {
      console.error('Failed to reset DB:', e);
    }
  };

  // --- LOCAL STORAGE HANDLING ---
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mcu_user_reviews');
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load reviews from localStorage:', e);
    }
  }, []);

  const saveReviews = (updatedReviews: UserReviewsState) => {
    setReviews(updatedReviews);
    try {
      localStorage.setItem('mcu_user_reviews', JSON.stringify(updatedReviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage:', e);
    }
  };

  const handleSaveItemReview = (itemId: string, itemReview: UserReview) => {
    const updated = {
      ...reviews,
      [itemId]: itemReview,
    };
    saveReviews(updated);
  };

  const handleToggleWatched = (itemId: string) => {
    const currentReview = reviews[itemId];
    const updatedReview: UserReview = currentReview
      ? {
          ...currentReview,
          watched: !currentReview.watched,
          updatedAt: new Date().toISOString(),
        }
      : {
          watched: true,
          rating: 0,
          watchedDate: new Date().toISOString().split('T')[0],
          notes: '',
          isFavorite: false,
          updatedAt: new Date().toISOString(),
        };

    const updated = {
      ...reviews,
      [itemId]: updatedReview,
    };
    saveReviews(updated);
  };

  const handleToggleFavorite = (itemId: string) => {
    const currentReview = reviews[itemId];
    const updatedReview: UserReview = currentReview
      ? {
          ...currentReview,
          isFavorite: !currentReview.isFavorite,
          updatedAt: new Date().toISOString(),
        }
      : {
          watched: false,
          rating: 0,
          watchedDate: '',
          notes: '',
          isFavorite: true,
          updatedAt: new Date().toISOString(),
        };

    const updated = {
      ...reviews,
      [itemId]: updatedReview,
    };
    saveReviews(updated);
  };

  const handleResetAll = () => {
    if (window.confirm('すべての鑑賞記録と感想を削除してもよろしいですか？この操作は取り消せません。')) {
      saveReviews({});
    }
  };

  // --- FILTER & SORT LOGIC ---
  const processedItems = useMemo(() => {
    // 1. Filter
    let items = [...dbItems];

    if (filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      items = items.filter(
        item => 
          item.titleJa.toLowerCase().includes(q) || 
          item.titleEn.toLowerCase().includes(q) || 
          item.synopsis.toLowerCase().includes(q) ||
          item.directorOrCreator.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      if (filters.type === 'movie') {
        items = items.filter(item => item.type === 'movie');
      } else {
        items = items.filter(item => item.type === 'drama' || item.type === 'special');
      }
    }

    if (filters.phase !== 'all') {
      items = items.filter(item => item.phase === filters.phase);
    }

    if (filters.importance !== 'all') {
      items = items.filter(item => item.importance === filters.importance);
    }

    if (filters.watchedStatus !== 'all') {
      items = items.filter(item => {
        const rev = reviews[item.id];
        if (filters.watchedStatus === 'watched') {
          return rev?.watched;
        } else if (filters.watchedStatus === 'unwatched') {
          return !rev?.watched;
        } else if (filters.watchedStatus === 'favorite') {
          return rev?.isFavorite;
        }
        return true;
      });
    }

    // Filter by selected character (Dynamic interactive network)
    if (selectedCharacterId) {
      items = items.filter(item => {
        const ext = extraMap[item.id];
        return ext ? ext.characterIds.includes(selectedCharacterId) : false;
      });
    }

    // 2. Sort
    items.sort((a, b) => {
      if (sortOrder === 'chrono') {
        return a.chronoOrder - b.chronoOrder;
      }
      return a.releaseOrder - b.releaseOrder;
    });

    return items;
  }, [filters, sortOrder, reviews, selectedCharacterId, dbItems, extraMap]);

  // Review summaries for the Thoughts Hub (including favorites!)
  const reviewItems = useMemo(() => {
    return dbItems.filter(item => {
      const rev = reviews[item.id];
      return rev && (rev.notes.trim().length > 0 || rev.rating > 0 || rev.isFavorite);
    });
  }, [reviews, dbItems]);

  // Sub-counts for rendering pills
  const favoriteItemsCount = useMemo(() => {
    return dbItems.filter(item => reviews[item.id]?.isFavorite).length;
  }, [reviews, dbItems]);

  const notesAndRatingCount = useMemo(() => {
    return dbItems.filter(item => {
      const rev = reviews[item.id];
      return rev && (rev.notes.trim().length > 0 || rev.rating > 0);
    }).length;
  }, [reviews, dbItems]);

  // Filtered review/favorite items for display in the tab
  const displayedReviewItems = useMemo(() => {
    let list = reviewItems.filter(item => {
      const rev = reviews[item.id];
      if (!rev) return false;
      if (reviewTabSubFilter === 'favorites') {
        return rev.isFavorite;
      }
      if (reviewTabSubFilter === 'notes') {
        return rev.notes.trim().length > 0 || rev.rating > 0;
      }
      return true;
    });

    if (reviewSearchQuery.trim()) {
      const q = reviewSearchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const rev = reviews[item.id];
        const titleJaMatch = item.titleJa?.toLowerCase().includes(q);
        const titleEnMatch = item.titleEn?.toLowerCase().includes(q);
        const notesMatch = rev?.notes?.toLowerCase().includes(q) || false;
        const synopsisMatch = item.synopsis?.toLowerCase().includes(q);
        return titleJaMatch || titleEnMatch || notesMatch || synopsisMatch;
      });
    }

    return list;
  }, [reviewItems, reviews, reviewTabSubFilter, reviewSearchQuery]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      phase: 'all',
      importance: 'all',
      watchedStatus: 'all',
    });
    setSelectedCharacterId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Brand Header */}
      <header className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-850">
        {/* Cinematic ambient background */}
        <div className="absolute inset-0 bg-radial-gradient-soft opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-bold tracking-widest uppercase">
                  MARVEL CINEMATIC UNIVERSE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  MULTIVERSE CHRONICLE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
                MCU鑑賞ガイド <span className="text-red-500">&</span> 時系列トラッカー
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                映画とドラマを劇中時系列（イン・ユニバース時間軸）や公開順に並べ替え、
                あらすじ・重要レベルを確認しながらあなたの鑑賞状況・レビューをプライベートに記録できます。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                title="鑑賞状況と感想をすべて初期化する"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                データの全初期化
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Section */}
        <StatsSection items={dbItems} reviews={reviews} />

        {/* View Selection Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 mb-6 gap-x-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-red-650 text-white font-extrabold bg-slate-900/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-red-650" />
            タイムライン & 作品一覧 ({processedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'my-reviews'
                ? 'border-red-650 text-white font-extrabold bg-slate-900/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            マイ感想 ＆ お気に入り ({reviewItems.length})
          </button>
          <button
            onClick={() => setActiveTab('db-admin')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'db-admin'
                ? 'border-red-650 text-white font-extrabold bg-slate-900/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-amber-500" />
            データベース管理・作品登録
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'border-red-650 text-white font-extrabold bg-slate-900/30 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-450" />
            ご利用ガイド & ヘルプ
          </button>
        </div>

        {/* --- TAB CONTENT: LIST --- */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            
            {/* Control & Filter Suite Card */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-850 shadow-xl space-y-4">
              
              {/* Row 1: Search & Sorting Order */}
              <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
                
                {/* Clean Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="作品タイトル、あらすじ、監督から検索..."
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-500 border border-slate-800 focus:border-red-600/50 outline-none transition-all"
                  />
                </div>

                {/* Sort order toggle buttons (Chronological or Publication date) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setSortOrder('release')}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sortOrder === 'release'
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      公開順 (デフォルト)
                    </button>
                    <button
                      onClick={() => setSortOrder('chrono')}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sortOrder === 'chrono'
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                      歴史順 (劇中時系列)
                    </button>
                  </div>

                  {/* Layout selector (Grid or Timeline) & Grid Columns Choice */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Grid Columns selector (shown only when viewMode is 'grid') */}
                    {viewMode === 'grid' && (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 animate-fade-in">
                        <span className="text-[10px] text-slate-500 font-bold px-2 font-mono uppercase">グリッド列数:</span>
                        {[1, 2, 3, 4, 5].map(cols => (
                          <button
                            key={cols}
                            onClick={() => setGridCols(cols as any)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              gridCols === cols
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                            title={`${cols}列表示`}
                          >
                            {cols}列
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Layout switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer ${
                          viewMode === 'grid' ? 'bg-slate-800 text-white' : ''
                        }`}
                        title="グリッド表示"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('timeline')}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer ${
                          viewMode === 'timeline' ? 'bg-slate-800 text-white' : ''
                        }`}
                        title="タイムライン表示"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Advanced filtering select lists */}
              <div className="pt-3 border-t border-slate-850 flex flex-wrap gap-3 items-center">
                
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono shrink-0 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  絞り込み:
                </div>

                {/* Type Filter */}
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="all">種類：すべて</option>
                  <option value="movie">種類：映画のみ</option>
                  <option value="drama">種類：ドラマ/特別編のみ</option>
                </select>

                {/* Phase Filter */}
                <select
                  value={filters.phase}
                  onChange={(e) => setFilters({ ...filters, phase: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="all">フェーズ：すべて</option>
                  <option value={1}>フェーズ 1</option>
                  <option value={2}>フェーズ 2</option>
                  <option value={3}>フェーズ 3</option>
                  <option value={4}>フェーズ 4</option>
                  <option value={5}>フェーズ 5</option>
                  <option value={6}>フェーズ 6</option>
                </select>

                {/* Importance Filter */}
                <select
                  value={filters.importance}
                  onChange={(e) => setFilters({ ...filters, importance: e.target.value === 'all' ? 'all' : Number(e.target.value) as any })}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="all">重要度：すべて</option>
                  <option value={3}>重要度：★★★ 必須級のみ</option>
                  <option value={2}>重要度：★★ 以上（推奨含）</option>
                  <option value={1}>重要度：★ 補足スピンオフのみ</option>
                </select>

                {/* Watching Status Filter */}
                <select
                  value={filters.watchedStatus}
                  onChange={(e) => setFilters({ ...filters, watchedStatus: e.target.value as any })}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="all">鑑賞状況：すべて</option>
                  <option value="watched">鑑賞状況：鑑賞済み</option>
                  <option value="unwatched">鑑賞状況：未鑑賞のみ</option>
                  <option value="favorite">お気に入り登録のみ</option>
                </select>

                {/* Character Filter Indicator (Dynamic Interactive Network) */}
                {selectedCharacterId && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">登場:</span>
                    <span className="font-semibold text-red-400 flex items-center gap-1">
                      <span>{charactersDb[selectedCharacterId]?.emoji}</span>
                      <span>{charactersDb[selectedCharacterId]?.heroNameJa || charactersDb[selectedCharacterId]?.nameJa}</span>
                    </span>
                    <button
                      onClick={() => setSelectedCharacterId(null)}
                      className="ml-1 p-0.5 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 transition-colors font-bold cursor-pointer"
                      title="キャラクター絞り込みを解除"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Clear Filters Button */}
                {(filters.searchQuery || filters.type !== 'all' || filters.phase !== 'all' || filters.importance !== 'all' || filters.watchedStatus !== 'all' || selectedCharacterId) && (
                  <button
                    onClick={handleResetFilters}
                    className="ml-auto text-xs text-red-500 font-bold hover:text-red-400 hover:underline flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-red-950/20 cursor-pointer"
                  >
                    フィルター条件クリア
                  </button>
                )}
              </div>

            </div>

            {/* --- WORK FEED & GRID RENDER --- */}
            {processedItems.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-12 border border-slate-850 text-center space-y-3 shadow-xl">
                <p className="text-slate-400 text-sm font-medium">該当する作品が見つかりませんでした。</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-850 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  フィルターをリセットする
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Bento Grid representation */
              <div className={
                gridCols === 1 ? "grid grid-cols-1 max-w-2xl mx-auto gap-6" :
                gridCols === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-6" :
                gridCols === 4 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
                gridCols === 5 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" :
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              }>
                <AnimatePresence mode="popLayout">
                  {processedItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                    >
                      <McuCard
                        item={item}
                        review={reviews[item.id]}
                        orderType={sortOrder}
                        onSelect={(v) => setSelectedItem(v)}
                        onToggleWatched={handleToggleWatched}
                        onToggleFavorite={handleToggleFavorite}
                        onCharacterClick={(charId) => setSelectedCharacterId(charId)}
                        selectedCharacterId={selectedCharacterId}
                        customExtra={extraMap[item.id]}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Timeline stream flow representation */
              <div className="relative max-w-4xl mx-auto px-1 sm:px-6">
                {/* Visual chronological timeline pipeline */}
                <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 md:hidden" />

                <div className="space-y-8 relative">
                  {processedItems.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const review = reviews[item.id];
                    const isWatched = review?.watched;
                    const isFav = review?.isFavorite;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.3 }}
                        className={`flex flex-col md:flex-row items-stretch md:items-center relative ${
                          isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Node Ring */}
                        <div className={`absolute z-10 w-4 h-4 rounded-full border-4 ${
                          isWatched ? 'bg-emerald-500 border-emerald-100' : 'bg-slate-300 border-white'
                        } left-4 sm:left-1/2 -translate-x-1/2 hidden md:block`} />
                        <div className={`absolute z-10 w-4 h-4 rounded-full border-4 ${
                          isWatched ? 'bg-emerald-500 border-emerald-100' : 'bg-slate-300 border-white'
                        } left-6 -translate-x-1/2 md:hidden`} />

                        {/* Content Card container (spaced dynamically left or right) */}
                        <div className="w-full md:w-[46%] ml-12 md:ml-0">
                          <McuCard
                            item={item}
                            review={review}
                            orderType={sortOrder}
                            onSelect={(v) => setSelectedItem(v)}
                            onToggleWatched={handleToggleWatched}
                            onToggleFavorite={handleToggleFavorite}
                            onCharacterClick={(charId) => setSelectedCharacterId(charId)}
                            selectedCharacterId={selectedCharacterId}
                            customExtra={extraMap[item.id]}
                          />
                        </div>

                        {/* Middle Space Label (chronological date context / phase tag) */}
                        <div className={`hidden md:flex flex-col justify-center w-[8%] items-center text-center font-mono text-[10px] text-slate-400 font-bold ${
                          isEven ? 'order-1' : 'order-1'
                        }`}>
                          <span className="text-slate-800">
                            P{item.phase}
                          </span>
                          <span className="text-[9px] mt-0.5 whitespace-nowrap bg-slate-100 text-slate-600 px-1 py-0.5 rounded scale-90">
                            {sortOrder === 'chrono' ? `#${item.chronoOrder}` : `#${item.releaseOrder}`}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: MY REVIEWS & FAVORITES --- */}
        {activeTab === 'my-reviews' && (
          <div className="space-y-6">
            <div className="bg-red-955/20 p-4 rounded-xl border border-red-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 fill-current animate-pulse-slow" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">マイ感想 ＆ お気に入り作品</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    あなたがお気に入りマークした作品や、感想・スコアを入力した作品のアーカイブです。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Micro pills to toggle subset */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-850/60 w-fit">
                <button
                  type="button"
                  onClick={() => setReviewTabSubFilter('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    reviewTabSubFilter === 'all'
                      ? 'bg-red-650 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>すべて ({reviewItems.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTabSubFilter('favorites')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    reviewTabSubFilter === 'favorites'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-605/10'
                      : 'text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>お気に入り ({favoriteItemsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTabSubFilter('notes')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    reviewTabSubFilter === 'notes'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>感想・スコア ({notesAndRatingCount})</span>
                </button>
              </div>

              {/* Incremental Real-time Filter Search in this tab */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="感想、邦題/英題、あらすじ等で検索..."
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-900 border border-slate-850 focus:border-red-650/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden transition-all shadow-inner"
                />
                {reviewSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setReviewSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-black cursor-pointer bg-slate-850 hover:bg-slate-700 w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    title="クリア"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {displayedReviewItems.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-12 border border-slate-850 text-center text-slate-500 space-y-3">
                <p className="text-sm font-medium">
                  {reviewSearchQuery ? '検索条件に一致する作品が見つかりませんでした。' : '該当する作品はまだ登録されていません。'}
                </p>
                <p className="text-xs text-slate-400">
                  {reviewSearchQuery 
                    ? 'キーワードのスペルやフィルター条件を変更してお試しください。' 
                    : '各作品カードの詳細から「お気に入り（♥）」にチェックを入れるか、星評価・感想を記入してください！'}
                </p>
                {reviewSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setReviewSearchQuery('')}
                    className="mt-2 inline-flex items-center gap-1 px-4 py-2 bg-slate-850 hover:bg-slate-800 text-red-400 hover:text-red-300 text-xs font-bold rounded-xl border border-slate-800 transition-all cursor-pointer"
                  >
                    検索条件をクリア
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedReviewItems.map(item => {
                  const rev = reviews[item.id];
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      whileHover={{ scale: 1.01 }}
                      className="bg-slate-900 rounded-2xl border border-slate-850 p-5 hover:border-slate-800 shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Title header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            PHASE {item.phase} • {item.type === 'movie' ? '映画' : 'ドラマ'}
                          </span>
                          <div className="flex gap-1.5">
                            {rev?.isFavorite && (
                              <div className="p-1 rounded bg-rose-950/40 text-rose-450 border border-rose-900/30">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                              </div>
                            )}
                            {rev?.rating && rev.rating > 0 ? (
                              <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5 bg-amber-950/40 px-1.5 rounded border border-amber-900/30">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {rev.rating}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-200 group-hover:text-red-500">
                          {item.titleJa}
                        </h4>

                        {/* Time of watch if available */}
                        {rev?.watchedDate && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            鑑賞日: {rev.watchedDate}
                          </div>
                        )}

                        {/* Note snippet */}
                        {rev?.notes ? (
                          <div className="mt-3 text-xs text-slate-400 bg-slate-950 border border-slate-850 p-3 rounded-lg leading-relaxed whitespace-pre-wrap line-clamp-4">
                            {rev.notes}
                          </div>
                        ) : rev?.isFavorite ? (
                          <p className="text-xs text-rose-400 font-medium italic mt-3 flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-current text-rose-500" /> お気に入りに追加しました！
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 italic mt-3">星のみの評価を入力しました。</p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-850 text-[10px] text-slate-500 text-right flex justify-between items-center">
                        <span className="font-mono">
                          更新日: {rev?.updatedAt ? new Date(rev.updatedAt).toLocaleDateString('ja-JP') : '-'}
                        </span>
                        <span className="text-red-500 font-bold hover:underline flex items-center gap-0.5 text-xs">
                          鑑賞状況・感想を編集する <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: DATABASE CUSTOMIZER & ADMIN --- */}
        {activeTab === 'db-admin' && (
          <DatabaseAdmin
            items={dbItems}
            extraMap={extraMap}
            onUpdateDb={handleUpdateDb}
            onResetDb={handleResetDb}
            reviews={reviews}
            onUpdateReviews={saveReviews}
          />
        )}

        {/* --- TAB CONTENT: HELP & GUIDE --- */}
        {activeTab === 'help' && (
          <HelpPage />
        )}

      </main>

      {/* --- MOUNT INTERACTIVE DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            review={reviews[selectedItem.id]}
            onClose={() => setSelectedItem(null)}
            onSaveReview={handleSaveItemReview}
            onCharacterClick={(charId) => {
              setSelectedCharacterId(charId);
              setSelectedItem(null);
            }}
            customExtra={extraMap[selectedItem.id]}
            fullExtraMap={extraMap}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p>© 2026 MCU Timeline Companion & Tracker. All rights reserved.</p>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto">
            ※当アプリケーションはファンによる個人利用目的の非公式サイトです。
            劇中設定や時系列、重要度は公式見解に基づきつつ、シリーズを楽しむための推奨情報となっています。
          </p>
        </div>
      </footer>
    </div>
  );
}

