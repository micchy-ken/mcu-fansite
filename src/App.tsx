import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, ListOrdered, Calendar, 
  MessageSquare, Flame, Tv, Film, RotateCcw, Award, CheckSquare, Check, 
  Grid, List, Sparkles, Star, Heart, FileText, ChevronRight, UserMinus, Database, HelpCircle,
  Sun, Moon, X
} from 'lucide-react';
import { mcuItems, McuItem } from './mcuData';
import { UserReviewsState, FilterState, SortOrder, UserReview } from './types';
import { mcuExtraDataMap, charactersDb, ExtraItemData } from './mcuExtraData';
import StatsSection from './components/StatsSection';
import McuCard from './components/McuCard';
import DetailModal from './components/DetailModal';
import DatabaseAdmin from './components/DatabaseAdmin';
import HelpPage from './components/HelpPage';

const CURRENT_MCU_DATA_VERSION = '2026.10-v4';

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
  const [showUpdateNotice, setShowUpdateNotice] = useState<boolean>(false);

  // Theme states
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('mcu_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('mcu_theme', theme);
  }, [theme]);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    phase: 'all',
    importance: 'all',
    watchedStatus: 'all',
  });

  // --- DATABASE LOCAL STORAGE & VERSION MIGRATION ---
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('mcu_db_version');
      const storedItems = localStorage.getItem('mcu_custom_db_items');
      const storedExtra = localStorage.getItem('mcu_custom_db_extra');

      if (storedVersion !== CURRENT_MCU_DATA_VERSION) {
        let customUserItems: McuItem[] = [];
        let customUserExtra: Record<string, ExtraItemData> = {};

        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems) as McuItem[];
            const canonicalIds = new Set(mcuItems.map(x => x.id));
            customUserItems = parsed.filter(item => !canonicalIds.has(item.id));
          } catch (e) {
            console.error('Failed to parse stored items during migration:', e);
          }
        }

        if (storedExtra) {
          try {
            const parsedExtra = JSON.parse(storedExtra);
            Object.keys(parsedExtra).forEach(k => {
              if (!mcuExtraDataMap[k]) {
                customUserExtra[k] = parsedExtra[k];
              }
            });
          } catch (e) {
            console.error('Failed to parse stored extra map during migration:', e);
          }
        }

        const mergedItems = [...mcuItems, ...customUserItems].sort(
          (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
        const mergedExtra = { ...mcuExtraDataMap, ...customUserExtra };

        setDbItems(mergedItems);
        setExtraMap(mergedExtra);

        localStorage.setItem('mcu_custom_db_items', JSON.stringify(mergedItems));
        localStorage.setItem('mcu_custom_db_extra', JSON.stringify(mergedExtra));
        localStorage.setItem('mcu_db_version', CURRENT_MCU_DATA_VERSION);
        setShowUpdateNotice(true);
      } else {
        let finalItems: McuItem[] = [...mcuItems];
        let finalExtra: Record<string, ExtraItemData> = { ...mcuExtraDataMap };

        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as McuItem[];
          const storedIds = new Set(parsedItems.map((item: any) => item.id));
          const missingItems = mcuItems.filter((item: any) => !storedIds.has(item.id));
          finalItems = [...parsedItems, ...missingItems];
        }

        if (storedExtra) {
          const parsedExtra = JSON.parse(storedExtra);
          finalExtra = { ...mcuExtraDataMap, ...parsedExtra };
        }

        finalItems.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

        setDbItems(finalItems);
        setExtraMap(finalExtra);
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
      localStorage.setItem('mcu_db_version', CURRENT_MCU_DATA_VERSION);
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
    const current = reviews[itemId] || {
      watched: false,
      rating: 0,
      watchedDate: '',
      notes: '',
      isFavorite: false,
      updatedAt: new Date().toISOString(),
    };

    const nextWatched = !current.watched;
    const updatedItem: UserReview = {
      ...current,
      watched: nextWatched,
      watchedDate: nextWatched ? (current.watchedDate || new Date().toISOString().split('T')[0]) : '',
      updatedAt: new Date().toISOString(),
    };

    handleSaveItemReview(itemId, updatedItem);
  };

  const handleToggleFavorite = (itemId: string) => {
    const current = reviews[itemId] || {
      watched: false,
      rating: 0,
      watchedDate: '',
      notes: '',
      isFavorite: false,
      updatedAt: new Date().toISOString(),
    };

    const updatedItem: UserReview = {
      ...current,
      isFavorite: !current.isFavorite,
      updatedAt: new Date().toISOString(),
    };

    handleSaveItemReview(itemId, updatedItem);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      phase: 'all',
      importance: 'all',
      watchedStatus: 'all',
    });
    setSelectedCharacterId(null);
  };

  // --- FILTERED & SORTED ITEMS ---
  const filteredItems = useMemo(() => {
    return dbItems.filter(item => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchTitleJa = item.titleJa.toLowerCase().includes(query);
        const matchTitleEn = item.titleEn.toLowerCase().includes(query);
        const matchSynopsis = item.synopsis.toLowerCase().includes(query);
        const matchDirector = item.directorOrCreator.toLowerCase().includes(query);
        if (!matchTitleJa && !matchTitleEn && !matchSynopsis && !matchDirector) {
          return false;
        }
      }

      // Type filter
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      // Phase filter
      if (filters.phase !== 'all' && item.phase !== filters.phase) {
        return false;
      }

      // Importance filter
      if (filters.importance !== 'all' && item.importance !== filters.importance) {
        return false;
      }

      // Watched status filter
      if (filters.watchedStatus === 'watched' && !reviews[item.id]?.watched) {
        return false;
      }
      if (filters.watchedStatus === 'unwatched' && reviews[item.id]?.watched) {
        return false;
      }
      if (filters.watchedStatus === 'favorite' && !reviews[item.id]?.isFavorite) {
        return false;
      }

      // Character filter
      if (selectedCharacterId) {
        const extra = extraMap[item.id] || mcuExtraDataMap[item.id];
        if (!extra || !extra.characterIds.includes(selectedCharacterId)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'chrono') {
        return a.chronoOrder - b.chronoOrder;
      }
      // Default: release order (YYYY-MM-DD date parsing)
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
    });
  }, [dbItems, filters, sortOrder, reviews, selectedCharacterId, extraMap]);

  // List of items that have reviews, notes, or stars for My Reviews tab
  const reviewedItemsList = useMemo(() => {
    return dbItems.filter(item => {
      const rev = reviews[item.id];
      if (!rev) return false;
      const hasRating = rev.rating > 0;
      const hasNotes = rev.notes && rev.notes.trim().length > 0;
      const isFav = rev.isFavorite;
      const isWatched = rev.watched;

      if (!hasRating && !hasNotes && !isFav && !isWatched) return false;

      if (reviewTabSubFilter === 'favorites' && !isFav) return false;
      if (reviewTabSubFilter === 'notes' && !hasNotes) return false;

      if (reviewSearchQuery.trim()) {
        const q = reviewSearchQuery.toLowerCase().trim();
        const mTitle = item.titleJa.toLowerCase().includes(q) || item.titleEn.toLowerCase().includes(q);
        const mNotes = rev.notes.toLowerCase().includes(q);
        return mTitle || mNotes;
      }

      return true;
    }).sort((a, b) => {
      const revA = reviews[a.id];
      const revB = reviews[b.id];
      const dateA = revA?.updatedAt ? new Date(revA.updatedAt).getTime() : 0;
      const dateB = revB?.updatedAt ? new Date(revB.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [dbItems, reviews, reviewTabSubFilter, reviewSearchQuery]);

  const selectedCharObj = selectedCharacterId ? charactersDb[selectedCharacterId] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      
      {/* UPDATE NOTICE BANNER */}
      {showUpdateNotice && (
        <div className="bg-gradient-to-r from-red-650 via-rose-600 to-amber-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg relative z-20">
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          <span>MCU全66作品マスターデータベースを最新バージョン ({CURRENT_MCU_DATA_VERSION}) に更新しました！</span>
          <button
            type="button"
            onClick={() => setShowUpdateNotice(false)}
            className="ml-3 underline hover:text-slate-200 cursor-pointer text-[11px]"
          >
            閉じる
          </button>
        </div>
      )}

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('list')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/50 text-white font-extrabold text-xl font-display">
              🛡️
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-50 flex items-center gap-2">
                MCU 鑑賞ガイド
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 rounded-full font-mono font-bold">
                  Phase 1-6
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                時系列トラッカー ＆ 感想メモ
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>全作品一覧 ({dbItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-reviews')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-reviews'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>マイ感想・メモ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('db-admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'db-admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB管理・カスタマイズ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'help'
                  ? 'bg-slate-800 text-slate-100 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>使い方・ガイド</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-850 transition-colors ml-1 cursor-pointer"
              title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* TAB 1: ALL WORKS LIST & TRACKER */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            
            {/* PROGRESS STATS SECTION */}
            <StatsSection items={dbItems} reviews={reviews} />

            {/* FILTER & SORT CONTROLS BAR */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-850 shadow-xl space-y-4">
              
              {/* Row 1: Search Box & Sort Order Selector */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="作品タイトル、登場人物、あらすじを検索..."
                    className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-red-500 transition-colors"
                  />
                  {filters.searchQuery && (
                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, searchQuery: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Order Selector (Release Date vs In-Universe Chrono) */}
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 font-bold px-2 uppercase">並び順:</span>
                  <button
                    type="button"
                    onClick={() => setSortOrder('release')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortOrder === 'release'
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    公開順 (Release)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('chrono')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortOrder === 'chrono'
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    劇中時系列順 (Chrono)
                  </button>
                </div>
              </div>

              {/* Row 2: Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-850">
                
                {/* Type Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-mono px-1">種別:</span>
                  {(['all', 'movie', 'drama'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilters({ ...filters, type: t })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                        filters.type === t ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t === 'all' ? 'すべて' : t === 'movie' ? '映画' : 'ドラマ/SP'}
                    </button>
                  ))}
                </div>

                {/* Phase Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-mono px-1">Phase:</span>
                  {(['all', 1, 2, 3, 4, 5, 6] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFilters({ ...filters, phase: p })}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold cursor-pointer transition-all ${
                        filters.phase === p ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p === 'all' ? '全' : `P${p}`}
                    </button>
                  ))}
                </div>

                {/* Watched Status Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-mono px-1">状態:</span>
                  {(['all', 'watched', 'unwatched', 'favorite'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilters({ ...filters, watchedStatus: s })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                        filters.watchedStatus === s ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s === 'all' ? 'すべて' : s === 'watched' ? '✓ 鑑賞済' : s === 'unwatched' ? '未鑑賞' : '♥ お気に入り'}
                    </button>
                  ))}
                </div>

                {/* Importance Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-mono px-1">重要度:</span>
                  {(['all', 3, 2, 1] as const).map(imp => (
                    <button
                      key={imp}
                      type="button"
                      onClick={() => setFilters({ ...filters, importance: imp })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                        filters.importance === imp ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {imp === 'all' ? 'すべて' : imp === 3 ? '★★★ 必須' : imp === 2 ? '★★ 推奨' : '★ 補足'}
                    </button>
                  ))}
                </div>

                {/* Reset Filters Button */}
                {(filters.searchQuery || filters.type !== 'all' || filters.phase !== 'all' || filters.importance !== 'all' || filters.watchedStatus !== 'all' || selectedCharacterId) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-bold border border-slate-700 transition-colors ml-auto cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> フィルター解除
                  </button>
                )}
              </div>

              {/* Active Character Filter Banner */}
              {selectedCharObj && (
                <div className="p-2.5 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-base">{selectedCharObj.emoji}</span>
                    <span>「<strong className="text-red-400">{selectedCharObj.heroNameJa || selectedCharObj.nameJa}</strong>」が出演する作品で絞り込み中</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCharacterId(null)}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-mono cursor-pointer"
                  >
                    解除 ✕
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS COUNT & VIEW MODE SWITCH */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-mono text-slate-400">
                該当作品: <strong className="text-slate-100 font-bold">{filteredItems.length}</strong> / {dbItems.length} 件
              </p>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-850">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'grid' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="グリッド表示"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'timeline' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="タイムライン表示"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* GRID VIEW */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filteredItems.map(item => (
                    <McuCard
                      key={item.id}
                      item={item}
                      review={reviews[item.id]}
                      orderType={sortOrder}
                      onSelect={(selected) => setSelectedItem(selected)}
                      onToggleWatched={handleToggleWatched}
                      onToggleFavorite={handleToggleFavorite}
                      onCharacterClick={(charId) => setSelectedCharacterId(charId)}
                      selectedCharacterId={selectedCharacterId}
                      customExtra={extraMap[item.id]}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* TIMELINE VIEW */
              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                {filteredItems.map((item, idx) => {
                  const isWatched = reviews[item.id]?.watched;
                  const isFav = reviews[item.id]?.isFavorite;
                  const extra = extraMap[item.id] || mcuExtraDataMap[item.id] || { heroIcon: '🎬', accentColor: '#ef4444' };

                  return (
                    <div key={item.id} className="relative group cursor-pointer" onClick={() => setSelectedItem(item)}>
                      {/* Timeline node */}
                      <div 
                        className={`absolute -left-[31px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                          isWatched ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {isWatched ? '✓' : idx + 1}
                      </div>

                      <div className="bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-xl p-4 transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{extra.heroIcon}</span>
                            <h4 className="font-bold text-slate-200 text-sm group-hover:text-red-400 transition-colors">
                              {item.titleJa}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                              Phase {item.phase}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500">{item.releaseDate}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.synopsis}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-500 space-y-3">
                <Search className="w-10 h-10 mx-auto text-slate-700" />
                <p className="text-sm font-bold text-slate-400">条件に該当する作品が見つかりませんでした。</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                >
                  フィルターをリセットする
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: MY REVIEWS & MEMOS */}
        {activeTab === 'my-reviews' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    マイ感想 ＆ 鑑賞記録ノート
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    あなたがレビューや星評価、メモを記録した作品（全 {reviewedItemsList.length} 件）の一覧です。
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="感想メモからキーワード検索..."
                    className="bg-slate-950 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-800 outline-none focus:border-red-500 flex-1 sm:w-64"
                  />
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 shrink-0">
                    <button
                      type="button"
                      onClick={() => setReviewTabSubFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${reviewTabSubFilter === 'all' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                    >
                      すべて
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewTabSubFilter('favorites')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${reviewTabSubFilter === 'favorites' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                    >
                      ♥ お気に入り
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewTabSubFilter('notes')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${reviewTabSubFilter === 'notes' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                    >
                      メモあり
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviewed Works Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {reviewedItemsList.map(item => {
                  const rev = reviews[item.id];
                  const extra = extraMap[item.id] || mcuExtraDataMap[item.id] || { heroIcon: '🎬', accentColor: '#ef4444' };

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{extra.heroIcon}</span>
                            <span className="font-bold text-slate-200 text-sm">{item.titleJa}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            {rev?.rating > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                {rev.rating}
                              </span>
                            )}
                            {rev?.isFavorite && (
                              <Heart className="w-4 h-4 fill-current text-rose-500" />
                            )}
                          </div>
                        </div>

                        {rev?.notes ? (
                          <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                            「{rev.notes}」
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 italic">メモ記入なし</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                        <span>観た日: {rev?.watchedDate || '未入力'}</span>
                        <span>最終更新: {rev?.updatedAt ? new Date(rev.updatedAt).toLocaleDateString('ja-JP') : '-'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {reviewedItemsList.length === 0 && (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="text-xs">まだレビューやメモの記録がありません。作品カードをクリックして感想を残してみましょう！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE ADMIN */}
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

        {/* TAB 4: HELP & GUIDE */}
        {activeTab === 'help' && (
          <HelpPage />
        )}

      </main>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          review={reviews[selectedItem.id]}
          onClose={() => setSelectedItem(null)}
          onSaveReview={handleSaveItemReview}
          onCharacterClick={(charId) => {
            setSelectedItem(null);
            setSelectedCharacterId(charId);
            setActiveTab('list');
          }}
          customExtra={extraMap[selectedItem.id]}
          fullExtraMap={extraMap}
        />
      )}

    </div>
  );
}
