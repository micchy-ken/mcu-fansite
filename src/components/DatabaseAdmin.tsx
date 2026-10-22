import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, Save, RotateCcw, Download, Check, AlertCircle, Database, Sparkles, RefreshCw, X, Upload
} from 'lucide-react';
import { mcuItems, McuItem } from '../mcuData';
import { mcuExtraDataMap, ExtraItemData, charactersDb } from '../mcuExtraData';
import { UserReviewsState } from '../types';

const OFFICIAL_MCU_PRESETS = mcuItems.map(item => {
  const extra = mcuExtraDataMap[item.id] || {
    heroIcon: '🎬',
    heroIconName: 'Film',
    accentColor: '#ef4444',
    characterIds: []
  };
  return {
    ...item,
    heroIcon: extra.heroIcon,
    accentColor: extra.accentColor,
    characterIds: extra.characterIds
  };
});

interface DatabaseAdminProps {
  items: McuItem[];
  extraMap: Record<string, ExtraItemData>;
  onUpdateDb: (updatedItems: McuItem[], updatedExtraMap: Record<string, ExtraItemData>) => void;
  onResetDb: () => void;
  reviews: UserReviewsState;
  onUpdateReviews: (updatedReviews: UserReviewsState) => void;
  onSyncMasterData?: () => void;
}

export default function DatabaseAdmin({ items, extraMap, onUpdateDb, onResetDb, reviews, onUpdateReviews }: DatabaseAdminProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

  // Backup & Import manager states
  const [backupTab, setBackupTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [activeExportType, setActiveExportType] = useState<'all' | 'db' | 'reviews'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitleJa, setFormTitleJa] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formType, setFormType] = useState<'movie' | 'drama' | 'special'>('movie');
  const [formReleaseDate, setFormReleaseDate] = useState('');

  const [formChronoOrder, setFormChronoOrder] = useState<number>(1);
  const [formChronoSetting, setFormChronoSetting] = useState('');
  const [formPhase, setFormPhase] = useState<number>(1);
  const [formImportance, setFormImportance] = useState<1 | 2 | 3>(3);
  const [formImportanceReason, setFormImportanceReason] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formDirector, setFormDirector] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');
  const [formExplanationUrlQuery, setFormExplanationUrlQuery] = useState('');

  // Extra details states
  const [formHeroIcon, setFormHeroIcon] = useState('🎬');
  const [formAccentColor, setFormAccentColor] = useState('#ef4444');
  const [formCharacterIds, setFormCharacterIds] = useState<string[]>([]);

  // AI Search states
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  // Live Official MCU Sync states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [selectedSyncIds, setSelectedSyncIds] = useState<string[]>([]);

  const handleFetchOfficialMcu = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const response = await fetch('/api/fetch-official-mcu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || `HTTP error! status: ${response.status}`;
        const errSol = errData.solution ? ` (${errData.solution})` : '';
        throw new Error(`${errMsg}${errSol}`);
      }
      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        setFetchedItems(data.items);
        const idsToSelect: string[] = [];
        data.items.forEach((fetched: any) => {
          const existing = items.find(x => x.id === fetched.id);
          if (!existing) {
            idsToSelect.push(fetched.id);
          } else {
            const hasDiff = 
              existing.releaseDate !== fetched.releaseDate ||
              existing.titleJa !== fetched.titleJa ||
              existing.durationOrEpisodes !== fetched.durationOrEpisodes ||
              (fetched.directorOrCreator && existing.directorOrCreator !== fetched.directorOrCreator);
            if (hasDiff) {
              idsToSelect.push(fetched.id);
            }
          }
        });
        setSelectedSyncIds(idsToSelect);
        setShowSyncModal(true);
      } else {
        throw new Error('フェッチされたデータ形式が正しくありません。');
      }
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || 'データ取得に失敗しました。');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePresetSync = () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      setFetchedItems(OFFICIAL_MCU_PRESETS);
      const idsToSelect: string[] = [];
      OFFICIAL_MCU_PRESETS.forEach((fetched: any) => {
        const existing = items.find(x => x.id === fetched.id);
        if (!existing) {
          idsToSelect.push(fetched.id);
        } else {
          const hasDiff = 
            existing.releaseDate !== fetched.releaseDate ||
            existing.titleJa !== fetched.titleJa ||
            existing.durationOrEpisodes !== fetched.durationOrEpisodes ||
            (fetched.directorOrCreator && existing.directorOrCreator !== fetched.directorOrCreator);
          if (hasDiff) {
            idsToSelect.push(fetched.id);
          }
        }
      });
      setSelectedSyncIds(idsToSelect);
      setShowSyncModal(true);
    } catch (err: any) {
      console.error(err);
      setSyncError('プリセットデータの解析中にエラーが発生しました。');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleApplySync = () => {
    let updatedItems = [...items];
    let updatedExtraMap = { ...extraMap };
    let appliedCount = 0;

    fetchedItems.forEach((fetched: any) => {
      if (!selectedSyncIds.includes(fetched.id)) return;
      appliedCount++;

      const itemData: McuItem = {
        id: fetched.id,
        titleJa: fetched.titleJa,
        titleEn: fetched.titleEn || fetched.titleJa,
        type: fetched.type as any,
        releaseDate: fetched.releaseDate,
        
        chronoOrder: Number(fetched.chronoOrder),
        chronoSetting: fetched.chronoSetting,
        phase: Number(fetched.phase),
        importance: Number(fetched.importance) as any,
        importanceReason: fetched.importanceReason,
        synopsis: fetched.synopsis,
        directorOrCreator: fetched.directorOrCreator,
        durationOrEpisodes: fetched.durationOrEpisodes,
        officialUrl: fetched.officialUrl || undefined,
        explanationUrlQuery: fetched.explanationUrlQuery
      };

      const extraData: ExtraItemData = {
        heroIcon: fetched.heroIcon || '🍿',
        heroIconName: fetched.type === 'movie' ? 'Film' : 'Tv',
        accentColor: fetched.accentColor || '#ef4444',
        characterIds: fetched.characterIds || []
      };

      const existingIndex = updatedItems.findIndex(x => x.id === fetched.id);
      if (existingIndex > -1) {
        updatedItems[existingIndex] = itemData;
      } else {
        updatedItems.push(itemData);
      }
      updatedExtraMap[fetched.id] = extraData;
    });

    onUpdateDb(updatedItems, updatedExtraMap);
    setShowSyncModal(false);
    alert(`公式スケジュール情報から、指定された ${appliedCount} 件の作品情報を同期適用しました！`);
  };

  const handleToggleSyncId = (id: string) => {
    if (selectedSyncIds.includes(id)) {
      setSelectedSyncIds(selectedSyncIds.filter(x => x !== id));
    } else {
      setSelectedSyncIds([...selectedSyncIds, id]);
    }
  };

  const handleSearchMcuWorkWithAi = async () => {
    if (!aiSearchQuery.trim()) {
      alert('検索キーワード・作品名を入力してください');
      return;
    }
    
    setIsSearchingAi(true);

    try {
      const response = await fetch('/api/search-mcu-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (data.item) {
        const item = data.item;
        setFormId(item.id);
        setFormTitleJa(item.titleJa);
        setFormTitleEn(item.titleEn);
        setFormType(item.type);
        setFormReleaseDate(item.releaseDate);

        setFormChronoOrder(Number(item.chronoOrder));
        setFormChronoSetting(item.chronoSetting);
        setFormPhase(Number(item.phase));
        setFormImportance(Number(item.importance) as any);
        setFormImportanceReason(item.importanceReason);
        setFormSynopsis(item.synopsis);
        setFormDirector(item.directorOrCreator);
        setFormDuration(item.durationOrEpisodes);
        setFormOfficialUrl(item.officialUrl || '');
        setFormExplanationUrlQuery(item.explanationUrlQuery || '');
        setFormHeroIcon(item.heroIcon || '🎬');
        setFormAccentColor(item.accentColor || '#ef4444');
        setFormCharacterIds(item.characterIds || []);
        
        alert(`AIが作品「${item.titleJa}」の情報を収集しました！`);
      } else {
        throw new Error('AIが作品詳細情報を抽出できませんでした。');
      }
    } catch (err: any) {
      console.error(err);
      alert(`検索エラー: ${err.message || err}`);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleSelectWork = (id: string) => {
    const work = items.find(item => item.id === id);
    if (!work) return;

    setSelectedId(id);
    setIsAddingNew(false);
    setIsEditing(true);

    setFormId(work.id);
    setFormTitleJa(work.titleJa);
    setFormTitleEn(work.titleEn);
    setFormType(work.type);
    setFormReleaseDate(work.releaseDate);
    
    setFormChronoOrder(work.chronoOrder);
    setFormChronoSetting(work.chronoSetting || '');
    setFormPhase(work.phase);
    setFormImportance(work.importance);
    setFormImportanceReason(work.importanceReason);
    setFormSynopsis(work.synopsis);
    setFormDirector(work.directorOrCreator);
    setFormDuration(work.durationOrEpisodes);
    setFormOfficialUrl(work.officialUrl || '');
    setFormExplanationUrlQuery(work.explanationUrlQuery || '');

    const extra = extraMap[work.id] || {
      heroIcon: '🎬',
      heroIconName: 'Film',
      accentColor: '#64748b',
      characterIds: []
    };
    setFormHeroIcon(extra.heroIcon);
    setFormAccentColor(extra.accentColor);
    setFormCharacterIds(extra.characterIds || []);
  };

  const handlePrepareAddNew = () => {
    setIsAddingNew(true);
    setIsEditing(true);
    setSelectedId('');

    const maxChrono = items.reduce((max, item) => Math.max(max, item.chronoOrder), 0) + 1;
    const maxPhase = items.reduce((max, item) => Math.max(max, item.phase), 0) || 5;

    setFormId('');
    setFormTitleJa('');
    setFormTitleEn('');
    setFormType('movie');
    setFormReleaseDate(new Date().toISOString().split('T')[0]);
    
    setFormChronoOrder(maxChrono);
    setFormChronoSetting('');
    setFormPhase(maxPhase);
    setFormImportance(3);
    setFormImportanceReason('');
    setFormSynopsis('');
    setFormDirector('');
    setFormDuration('');
    setFormOfficialUrl('');
    setFormExplanationUrlQuery('');

    setFormHeroIcon('🎬');
    setFormAccentColor('#3b82f6');
    setFormCharacterIds([]);
  };

  const handleCharacterToggle = (charId: string) => {
    if (formCharacterIds.includes(charId)) {
      setFormCharacterIds(formCharacterIds.filter(id => id !== charId));
    } else {
      setFormCharacterIds([...formCharacterIds, charId]);
    }
  };

  const handleSave = () => {
    if (!formId.trim()) {
      alert('作品ID(英数字・アンダースコア)を入力してください。');
      return;
    }
    if (!formTitleJa.trim()) {
      alert('作品タイトル（日本語）を入力してください。');
      return;
    }

    const cleanId = formId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (isAddingNew && items.some(item => item.id === cleanId)) {
      alert(`ID "${cleanId}" はすでに使われています。別のIDを入力してください。`);
      return;
    }

    const savedItem: McuItem = {
      id: cleanId,
      titleJa: formTitleJa.trim(),
      titleEn: formTitleEn.trim() || formTitleJa.trim(),
      type: formType,
      releaseDate: formReleaseDate,
      
      chronoOrder: Number(formChronoOrder),
      chronoSetting: formChronoSetting.trim(),
      phase: Number(formPhase),
      importance: formImportance,
      importanceReason: formImportanceReason.trim(),
      synopsis: formSynopsis.trim(),
      directorOrCreator: formDirector.trim(),
      durationOrEpisodes: formDuration.trim() || '未定',
      officialUrl: formOfficialUrl.trim() || undefined,
      explanationUrlQuery: formExplanationUrlQuery.trim() || undefined
    };

    const savedExtra: ExtraItemData = {
      heroIcon: formHeroIcon.trim() || '🎬',
      heroIconName: formType === 'movie' ? 'Film' : 'Tv',
      accentColor: formAccentColor || '#ef4444',
      characterIds: formCharacterIds
    };

    let updatedItems: McuItem[] = [];
    if (isAddingNew) {
      updatedItems = [...items, savedItem];
    } else {
      updatedItems = items.map(item => item.id === selectedId ? savedItem : item);
    }

    const updatedExtraMap = {
      ...extraMap,
      [cleanId]: savedExtra
    };

    if (!isAddingNew && selectedId !== cleanId) {
      delete updatedExtraMap[selectedId];
    }

    onUpdateDb(updatedItems, updatedExtraMap);

    setSelectedId(cleanId);
    setIsAddingNew(false);
    setIsEditing(false);
    alert('データベースに変更を保存しました！');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('この作品をデータベースから削除してもよろしいですか？')) {
      return;
    }

    const updatedItems = items.filter(item => item.id !== id);
    const updatedExtraMap = { ...extraMap };
    delete updatedExtraMap[id];

    onUpdateDb(updatedItems, updatedExtraMap);
    setIsEditing(false);
    setSelectedId('');
    alert('作品を削除しました。');
  };

  const getExportData = () => {
    if (activeExportType === 'db') {
      return { mcuItems: items, mcuExtraDataMap: extraMap };
    }
    if (activeExportType === 'reviews') {
      return { reviews };
    }
    return {
      mcuItems: items,
      mcuExtraDataMap: extraMap,
      reviews
    };
  };

  const handleExportJson = () => {
    const data = getExportData();
    const jsonStr = JSON.stringify(data, null, 2);
    try {
      navigator.clipboard.writeText(jsonStr);
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 3000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      alert('クリップボードへのコピーに失敗しました。');
    }
  };

  const handleDownloadBackupFile = () => {
    const data = getExportData();
    const prefix = activeExportType === 'all' ? 'mcu_full_backup' : activeExportType === 'db' ? 'mcu_custom_database' : 'mcu_user_reviews';
    const timestampStr = new Date().toISOString().split('T')[0];
    const filename = `${prefix}_${timestampStr}.json`;

    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`ファイル保存に失敗しました: ${err.message || err}`);
    }
  };

  const processImportJson = (text: string) => {
    setImportError(null);
    setImportSuccessMessage(null);
    if (!text.trim()) {
      setImportError('JSONテキストを入力するか、ファイルをアップロードしてください。');
      return;
    }

    try {
      const parsed = JSON.parse(text);
      let importedDbCount = 0;
      let importedReviewsCount = 0;
      let targetDbItems: McuItem[] | null = null;
      let targetExtraMap: Record<string, ExtraItemData> | null = null;
      let targetReviews: UserReviewsState | null = null;

      if (parsed.mcuItems && Array.isArray(parsed.mcuItems)) {
        targetDbItems = parsed.mcuItems;
        importedDbCount = parsed.mcuItems.length;
      }
      if (parsed.mcuExtraDataMap && typeof parsed.mcuExtraDataMap === 'object') {
        targetExtraMap = parsed.mcuExtraDataMap;
      }

      const reviewsSource = parsed.reviews || parsed.mcu_user_reviews;

      if (reviewsSource && typeof reviewsSource === 'object' && !Array.isArray(reviewsSource)) {
        targetReviews = reviewsSource;
        importedReviewsCount = Object.keys(reviewsSource).length;
      }

      if (!targetDbItems && !targetReviews) {
        throw new Error('インポート対象のデータが見つかりませんでした。');
      }

      if (targetDbItems) {
        const cleanExtraMap = targetExtraMap || {};
        const mergedExtra = { ...extraMap };

        targetDbItems.forEach(item => {
          if (cleanExtraMap[item.id]) {
            mergedExtra[item.id] = cleanExtraMap[item.id];
          } else if (!mergedExtra[item.id]) {
            mergedExtra[item.id] = {
              heroIcon: '🎬',
              heroIconName: 'Film',
              accentColor: '#3b82f6',
              characterIds: []
            };
          }
        });

        const mergedItems = [...items];
        targetDbItems.forEach(item => {
          const idx = mergedItems.findIndex(x => x.id === item.id);
          if (idx > -1) {
            mergedItems[idx] = item;
          } else {
            mergedItems.push(item);
          }
        });

        onUpdateDb(mergedItems, mergedExtra);
      }

      if (targetReviews) {
        onUpdateReviews({
          ...reviews,
          ...targetReviews
        });
      }

      const successMsg = `インポート完了: 作品 ${importedDbCount}件 / レビュー ${importedReviewsCount}件`;
      setImportSuccessMessage(successMsg);
      setImportJsonText('');
      alert(successMsg);
    } catch (e: any) {
      console.error('Import process failed:', e);
      setImportError(`インポート失敗: ${e.message || 'JSONフォーマットが不正です。'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processImportJson(text);
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/30 text-red-500">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-bold text-slate-200">MCUデータベース・カスタマイザー</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              MCU作品の公開日、重要度、あらすじ、登場ヒーローの追加・編集が行えます。
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handlePrepareAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                新しい作品を追加
              </button>
              <button
                type="button"
                onClick={handlePresetSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold transition-all border border-amber-500/30 cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                公式プリセットから同期
              </button>
              <button
                type="button"
                onClick={handleFetchOfficialMcu}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isSyncing ? '取得中...' : '最新情報をAI検索同期 (要APIキー)'}
              </button>
              <button
                type="button"
                onClick={() => setShowJsonExport(!showJsonExport)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                エクスポート/インポート
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('初期状態に戻しますか？')) {
                    onResetDb();
                    setIsEditing(false);
                    setSelectedId('');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 text-slate-500 hover:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-900 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                初期状態に戻す
              </button>
            </div>

            {syncError && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Backup Panel */}
        {showJsonExport && (
          <div className="mt-5 p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 text-left">
            <div className="flex border-b border-slate-850 pb-2.5 gap-2">
              <button
                type="button"
                onClick={() => setBackupTab('export')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${backupTab === 'export' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'}`}
              >
                エクスポート (保存)
              </button>
              <button
                type="button"
                onClick={() => setBackupTab('import')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${backupTab === 'import' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'}`}
              >
                インポート (復元)
              </button>
            </div>

            {backupTab === 'export' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setActiveExportType('all')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${activeExportType === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      すべて
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveExportType('db')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${activeExportType === 'db' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      作品DBのみ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveExportType('reviews')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${activeExportType === 'reviews' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      感想のみ
                    </button>
                  </div>
                </div>

                <textarea
                  readOnly
                  value={JSON.stringify(getExportData(), null, 2)}
                  rows={6}
                  className="w-full bg-slate-900 text-[11px] font-mono text-emerald-400 border border-slate-850 rounded-xl p-3 outline-none"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {exportCopied ? 'コピー完了！' : 'クリップボードにコピー'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadBackupFile}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    JSONファイルで保存
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 bg-slate-900 rounded-2xl p-6 text-center cursor-pointer text-slate-400"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-xs font-bold text-slate-300">JSONファイルをアップロード</p>
                </div>

                <textarea
                  placeholder="またはJSONテキストを貼り付け..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 text-[11px] font-mono text-slate-300 border border-slate-850 rounded-xl p-3 outline-none"
                />

                {importError && (
                  <div className="p-3 bg-red-950/30 text-xs text-red-400 rounded-xl">
                    {importError}
                  </div>
                )}
                {importSuccessMessage && (
                  <div className="p-3 bg-emerald-950/30 text-xs text-emerald-400 rounded-xl">
                    {importSuccessMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => processImportJson(importJsonText)}
                    disabled={!importJsonText.trim()}
                    className="px-6 py-2 bg-amber-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    インポート実行
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Select work on left, Edit form on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Work list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            登録作品一覧 ({items.length}件)
          </h4>
          <div className="space-y-1.5">
            {items.map(item => {
              const isSelected = selectedId === item.id && !isAddingNew;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectWork(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/50 text-slate-100 font-bold'
                      : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate">{item.titleJa}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.releaseDate}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                    P{item.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Form Editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {isEditing ? (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-base font-bold text-slate-200">
                  {isAddingNew ? '新規作品の登録' : '作品情報の編集'}
                </h4>
                {!isAddingNew && selectedId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedId)}
                    className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg border border-red-900/30 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 削除
                  </button>
                )}
              </div>

              {/* AI Search helper */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-2">
                <input
                  type="text"
                  placeholder="キーワードでAI検索自動入力（例: アベンジャーズ Doomsday）"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  className="bg-slate-900 text-xs text-slate-200 p-2 rounded-lg border border-slate-800 flex-1 outline-none"
                />
                <button
                  type="button"
                  onClick={handleSearchMcuWorkWithAi}
                  disabled={isSearchingAi}
                  className="px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                >
                  {isSearchingAi ? '検索中...' : 'AIで自動入力'}
                </button>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">ID (英数字)</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">作品名 (日本語)</label>
                  <input
                    type="text"
                    value={formTitleJa}
                    onChange={(e) => setFormTitleJa(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">英語タイトル</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">種類</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  >
                    <option value="movie">映画 (Movie)</option>
                    <option value="drama">ドラマ (Drama)</option>
                    <option value="special">特別編 (Special)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">公開日 (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phase</label>
                  <input
                    type="number"
                    value={formPhase}
                    onChange={(e) => setFormPhase(Number(e.target.value))}
                    className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-xs">あらすじ</label>
                <textarea
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 outline-none"
                />
              </div>

              {/* Characters selection */}
              <div>
                <label className="text-slate-400 block mb-1 text-xs">登場キャラクター</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  {Object.values(charactersDb).map(char => {
                    const isChecked = formCharacterIds.includes(char.id);
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleCharacterToggle(char.id)}
                        className={`px-2 py-1 rounded text-[10px] border cursor-pointer ${
                          isChecked ? 'bg-red-600 text-white border-red-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {char.emoji} {char.heroNameJa || char.nameJa}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
              <Database className="w-8 h-8 text-slate-700" />
              <p>左側のリストから作品を選択するか、「新しい作品を追加」をクリックしてください。</p>
            </div>
          )}
        </div>
      </div>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-base font-bold text-slate-200">公式スケジュール同期プレビュー</h4>
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              適用したい項目にチェックを入れて「同期実行」をクリックしてください。
            </p>

            <div className="overflow-y-auto space-y-2 flex-1 custom-scrollbar pr-1">
              {fetchedItems.map((fetched: any) => {
                const isSelected = selectedSyncIds.includes(fetched.id);
                return (
                  <label
                    key={fetched.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer select-none ${
                      isSelected ? 'bg-slate-950 border-amber-500/50 text-slate-100' : 'bg-slate-950/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSyncId(fetched.id)}
                        className="rounded border-slate-800"
                      />
                      <div>
                        <span className="font-bold block">{fetched.titleJa}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{fetched.releaseDate}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      P{fetched.phase}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="border-t border-slate-800 pt-4 mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleApplySync}
                className="px-6 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                選択した {selectedSyncIds.length} 件を適用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
