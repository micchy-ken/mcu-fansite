import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, Save, RotateCcw, Download, Check, HelpCircle, AlertCircle, Database, ArrowUpRight, Sparkles, RefreshCw, X, Upload
} from 'lucide-react';
import { McuItem } from '../mcuData';
import { ExtraItemData, charactersDb } from '../mcuExtraData';
import { UserReviewsState } from '../types';

const OFFICIAL_MCU_PRESETS = [
  {
    id: 'captain_america_bnw',
    titleJa: 'キャプテン・アメリカ：ブレイブ・ニュー・ワールド',
    titleEn: 'Captain America: Brave New World',
    type: 'movie',
    releaseDate: '2025-02-14',
    chronoOrder: 47,
    chronoSetting: '2026年（サムが重責を担う新たなキャプテン・アメリカ時代）',
    phase: 5,
    importance: 3,
    importanceReason: 'サム・ウィルソンが新たなキャプテン・アメリカとして自立する映画。サディアス・ロス（レッドハルク）との直接対決が描かれる最重要作。',
    synopsis: 'キャプテン・アメリカを継承したサムは大統領との会談後、巨大な国際陰謀に引きずり込まれる。世界一危険な「レッドハルク」の誕生、そして新生アベンジャーズ再建への足がかりとなる一作！',
    directorOrCreator: 'ジュリアス・オナ',
    durationOrEpisodes: '1時間58分',
    officialUrl: 'https://marvel.disney.co.jp/movie/captain-america-bnw',
    explanationUrlQuery: 'キャプテンアメリカ ブレイブニューワールド ネタバレ 考察 レッドハルク',
    heroIcon: '🦅',
    accentColor: '#3b82f6',
    characterIds: ['sam_wilson', 'thaddeus_ross', 'bucky_barnes']
  },
  {
    id: 'daredevil_born_again',
    titleJa: 'デアデビル：ボーン・アゲイン',
    titleEn: 'Daredevil: Born Again',
    type: 'drama',
    releaseDate: '2025-03-04',
    chronoOrder: 48,
    chronoSetting: '2026年（ニューヨーク裏社会、市長となったキングピンとの法廷・肉体戦）',
    phase: 5,
    importance: 2,
    importanceReason: 'Netflix版から完全にアラインされMCU本流へ合流を果たした傑作アクションドラマ。',
    synopsis: '盲目の優秀な弁護士マット・マードックは、夜はクライムファイター「デアデビル」となる。ニューヨーク市長となり法を悪用するキングピンとの緊迫した攻防。',
    directorOrCreator: 'ダリオ・スカルダペイン',
    durationOrEpisodes: '全9話（シーズン1）',
    officialUrl: 'https://marvel.disney.co.jp/movie/daredevil-born-again',
    explanationUrlQuery: 'デアデビル ボーンアゲイン ネタバレ 考察 キングピン',
    heroIcon: '👿',
    accentColor: '#dc2626',
    characterIds: ['matt_murdock', 'kingpin']
  },
  {
    id: 'thunderbolts',
    titleJa: 'サンダーボルツ*',
    titleEn: 'Thunderbolts*',
    type: 'movie',
    releaseDate: '2025-05-02',
    chronoOrder: 49,
    chronoSetting: '2026年（過去に苦しんだはみ出し者たち・影の政府任務）',
    phase: 5,
    importance: 3,
    importanceReason: '傷だらけのアンチヒーローたちが不本意ながら最凶タスクチームを結成。今後のアベンジャーズへ派生する重要な伏線が満載。',
    synopsis: 'エレーナ、バッキー、USエージェント、ゴースト、タスクマスターらが招集され、生き残りを掛けた非公式危険ミッションへ投じられるアクションエンターテインメント！',
    directorOrCreator: 'ジェイク・シュライアー',
    durationOrEpisodes: '2時間12分',
    officialUrl: 'https://marvel.disney.co.jp/movie/thunderbolts',
    explanationUrlQuery: 'サンダーボルツ アスタリスク ネタバレ 考察 結末',
    heroIcon: '⚡',
    accentColor: '#10b981',
    characterIds: ['bucky_barnes', 'sam_wilson']
  },
  {
    id: 'fantastic_four_fs',
    titleJa: 'ファンタスティック・フォー：ファースト・ステップス',
    titleEn: 'The Fantastic Four: First Steps',
    type: 'movie',
    releaseDate: '2025-07-25',
    chronoOrder: 50,
    chronoSetting: '1960年代のレトロフューチャーな異次元パラレルワールド',
    phase: 6,
    importance: 3,
    importanceReason: 'フェーズ6の最重要開拓者。マルチバースを超えて全宇宙を支配せんとする神ギャラクタスとの激戦。',
    synopsis: '1960年代의 パラレル世界に生きる4人の宇宙英雄チーム。宇宙を喰らう魔神ギャラクタスとその使者シルバーサーファーから世界を救う。',
    directorOrCreator: 'マット・シャックマン',
    durationOrEpisodes: '2時間10分',
    officialUrl: 'https://marvel.disney.co.jp/movie/fantastic-four',
    explanationUrlQuery: 'ファンタスティックフォー ファーストステップス ネタバレ 考察 結末',
    heroIcon: '4️⃣',
    accentColor: '#0ea5e9',
    characterIds: ['reed_richards', 'doctor_doom']
  },
  {
    id: 'eyes_of_wakanda',
    titleJa: 'アイズ・オブ・ワカンダ（原題）',
    titleEn: 'Eyes of Wakanda',
    type: 'drama',
    releaseDate: '2025-08-06',
    chronoOrder: 51,
    chronoSetting: 'ワカンダ王国が数千年にわたり培ってきた高潔な歴史・過去',
    phase: 5,
    importance: 2,
    importanceReason: 'ワカンダ王国の歴代戦士たちの足跡を辿る初のハイクオリティ・アニメーションシリーズ。',
    synopsis: '世界中からビブラニウム回収という秘密指令を受けた歴代のワカンダ戦士たち。彼らの過去・誇り・過酷な戦いを描く。',
    directorOrCreator: 'ライアン・クーグラー（製作・監修）',
    durationOrEpisodes: '全4話',
    officialUrl: 'https://marvel.disney.co.jp/',
    explanationUrlQuery: 'アイズオブワカンダ 考察 ネタバレ',
    heroIcon: '🐆',
    accentColor: '#f59e0b',
    characterIds: ['shuri']
  },
  {
    id: 'ironheart',
    titleJa: 'アイアンハート',
    titleEn: 'Ironheart',
    type: 'drama',
    releaseDate: '2025-09-03',
    chronoOrder: 52,
    chronoSetting: '2026年（ブラックパンサー／ワカンダ・フォーエバーの直接の続編）',
    phase: 5,
    importance: 2,
    importanceReason: 'リリ・ウィリアムズが独自のアイアンマンスーツを発展、テクノロジーと魔術世界「ザ・フード」との戦い。',
    synopsis: 'MITの天才学生リリは、自家製の高性能アーマースーツを開発。かつてワカンダで宇宙的な戦いをくぐり抜けた彼女のシカゴを舞台にした活躍。',
    directorOrCreator: 'チナカ・ホッジ',
    durationOrEpisodes: '全6話',
    officialUrl: 'https://marvel.disney.co.jp/movie/ironheart',
    explanationUrlQuery: 'アイアンハート ドラマ ネタバレ 考察',
    heroIcon: '🦾',
    accentColor: '#ec4899',
    characterIds: ['riri_williams']
  },
  {
    id: 'wonder_man',
    titleJa: 'ワンダーマン（原題）',
    titleEn: 'Wonder Man',
    type: 'drama',
    releaseDate: '2025-12-17',
    chronoOrder: 53,
    chronoSetting: '2026年（ハリウッドの映画界、ヒーロー文化がビジネス化した世界）',
    phase: 5,
    importance: 1,
    importanceReason: 'ハリウッドのスタント・アクターであり、超人的パワーを手にした男のコミカルでユニークな異色のMCU作品。',
    synopsis: 'スタントマンであり俳優を夢見るサイモン・ウィリアムズは偶然超パワーを得てしまい、「ワンダーマン」として意図せず活躍していく。',
    directorOrCreator: 'デスティン・ダニエル・クレットン',
    durationOrEpisodes: '全8話',
    officialUrl: 'https://marvel.disney.co.jp/',
    explanationUrlQuery: 'ワンダーマン 考察 ドラマ',
    heroIcon: '🔋',
    accentColor: '#a855f7',
    characterIds: []
  },
  {
    id: 'avengers_doomsday',
    titleJa: 'アベンジャーズ：ドゥームズデイ',
    titleEn: 'Avengers: Doomsday',
    type: 'movie',
    releaseDate: '2026-05-01',
    chronoOrder: 54,
    chronoSetting: '2026〜2027年（マルチバース全体の破滅と衝突の幕開け）',
    phase: 6,
    importance: 3,
    importanceReason: 'ロバート・ダウニー・Jrがドクター・ドゥームとして奇跡の電撃復帰を遂げ、映画『アベンジャーズ』第5作として降臨。',
    synopsis: 'あらゆる次元を滅ぼさんとする皇帝ビクター・フォン・ドゥーム。ファンタスティックフォーやスパイダーマン、アベンジャーズが窮地に陥る史上最大級の一大決戦！',
    directorOrCreator: 'アンソニー＆ジョー・ルッソ',
    durationOrEpisodes: '2時間35分',
    officialUrl: 'https://marvel.disney.co.jp/movie/avengers-doomsday',
    explanationUrlQuery: 'アベンジャーズ ドゥームズデイ ネタバレ 考察 ドクタードゥーム',
    heroIcon: '🛡️',
    accentColor: '#ef4444',
    characterIds: ['doctor_doom', 'reed_richards', 'peter_parker', 'stephen_strange', 'bruce_banner', 'thor']
  },
  {
    id: 'spider_man_4',
    titleJa: 'スパイダーマン4（仮）',
    titleEn: 'Spider-Man 4 (MCU)',
    type: 'movie',
    releaseDate: '2026-07-24',
    chronoOrder: 55,
    chronoSetting: '2027年（記憶を失った孤独なピーター・パーカーが親愛なる隣人として奮闘する新章）',
    phase: 6,
    importance: 3,
    importanceReason: 'ピーター・パーカーの「忘却」のその後の新たな三部作第1弾。ドゥームズデイ直後のマルチバース情勢と密接に関係する超特大映画。',
    synopsis: '全世界から正体を忘れられ、一人ぼっちで闘い続けるピーター・パーカー。新たなる親愛なる隣人としての闘い、そして再会への道を拓く！',
    directorOrCreator: 'デスティン・ダニエル・クレットン',
    durationOrEpisodes: '2時間10分',
    officialUrl: 'https://marvel.disney.co.jp/',
    explanationUrlQuery: 'スパイダーマン4 キャスト マーベル ネタバレ 考察',
    heroIcon: '🕷️',
    accentColor: '#f43f5e',
    characterIds: ['peter_parker', 'stephen_strange']
  },
  {
    id: 'avengers_secret_wars',
    titleJa: 'アベンジャーズ：シークレット・ウォーズ',
    titleEn: 'Avengers: Secret Wars',
    type: 'movie',
    releaseDate: '2027-05-07',
    chronoOrder: 56,
    chronoSetting: '時空を超えあらゆる並行宇宙が融合した究極の世界「バトルワールド」',
    phase: 6,
    importance: 3,
    importanceReason: 'マルチバース・サーガ本当のグランドフィナーレ。デッドプールやウルヴァリン、スパイダーマン新旧、全ヒーローが生き残りを賭けて大激突する極限の3時間。',
    synopsis: 'インカージョンによりマルチバースが完璧に破壊され、ドゥームが築き上げたバトルワールド。全タイムラインの覇権、転移、そして生存を掛けた最終頂上戦争！',
    directorOrCreator: 'アンソニー＆ジョー・ルッソ',
    durationOrEpisodes: '2時間55分',
    officialUrl: 'https://marvel.disney.co.jp/movie/avengers-secret-wars',
    explanationUrlQuery: 'アベンジャーズ シークレットウォーズ ネタバレ 考察 結慢 新世界',
    heroIcon: '💀',
    accentColor: '#6366f1',
    characterIds: ['doctor_doom', 'reed_richards', 'peter_parker', 'deadpool', 'wolverine', 'thor', 'loki']
  }
];

interface DatabaseAdminProps {
  items: McuItem[];
  extraMap: Record<string, ExtraItemData>;
  onUpdateDb: (updatedItems: McuItem[], updatedExtraMap: Record<string, ExtraItemData>) => void;
  onResetDb: () => void;
  reviews: UserReviewsState;
  onUpdateReviews: (updatedReviews: UserReviewsState) => void;
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

  // Single AI Search & Collect states
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  const [aiSearchSuccess, setAiSearchSuccess] = useState(false);

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
        // Select newly added or updated IDs by default
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
      // Load curated official presets locally
      setFetchedItems(OFFICIAL_MCU_PRESETS);
      
      // Select newly added or updated IDs by default
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
      setSyncError('プリセットデータの解析中に予期せぬエラーが発生しました。');
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
    alert(`公式スケジュール情報から、指定された ${appliedCount} 件の作品情報を同期・上書き適用しました！`);
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
      alert('検索キーワード・作品名を入力してください（例: ブレイド MCU, スパイダーマン4, アーマーウォーズ）');
      return;
    }
    
    setIsSearchingAi(true);
    setAiSearchError(null);
    setAiSearchSuccess(false);

    try {
      const response = await fetch('/api/search-mcu-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || `HTTP error! status: ${response.status}`;
        const errSol = errData.solution ? ` (${errData.solution})` : '';
        throw new Error(`${errMsg}${errSol}`);
      }

      const data = await response.json();
      if (data.item) {
        const item = data.item;
        
        // Populate form states:
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
        
        setAiSearchSuccess(true);
        alert(`AIが作品「${item.titleJa}」の情報を収集しました！フォームに値が自動入力されました。ご確認ください。`);
      } else {
        throw new Error('AIが作品詳細情報を抽出できませんでした。キーワードを変更してお試しください。');
      }
    } catch (err: any) {
      console.error(err);
      setAiSearchError(err.message || 'データ検索または解析に失敗しました。');
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

    // Populate regular form fields
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

    // Populate extra fields
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

    // Generate maximum orders to make addition easy
    
    const maxChrono = items.reduce((max, item) => Math.max(max, item.chronoOrder), 0) + 1;
    const maxPhase = items.reduce((max, item) => Math.max(max, item.phase), 0) || 5;

    // Reset fields to defaults
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
      alert(`ID "${cleanId}" はすでに他の作品で使われています。別のIDを入力してください。`);
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
    if (!window.confirm('この作品をデータベースから完全に削除してもよろしいですか？')) {
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
      alert('クリップボードへのコピーに失敗しました。下記のエリアから手動で全選択コピーしてください。');
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
      alert(`ファイル保存の作成に失敗しました: ${err.message || err}`);
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
        const keys = Object.keys(reviewsSource);
        const looksLikeReviews = keys.length === 0 || keys.every(k => {
          const v = reviewsSource[k];
          return v && (typeof v.watched === 'boolean' || v.rating !== undefined || typeof v.notes === 'string');
        });
        if (looksLikeReviews) {
          targetReviews = reviewsSource;
          importedReviewsCount = keys.length;
        }
      } else if (!targetDbItems) {
        const keys = Object.keys(parsed);
        if (keys.length > 0) {
          const looksLikeRawReviews = keys.every(k => {
            const v = parsed[k];
            return v && (typeof v.watched === 'boolean' || v.rating !== undefined || typeof v.notes === 'string');
          });
          if (looksLikeRawReviews) {
            targetReviews = parsed as UserReviewsState;
            importedReviewsCount = keys.length;
          }
        }
      }

      if (!targetDbItems && !targetReviews) {
        throw new Error('インポート対象のデータが見つかりませんでした。エクスポートしたJSONファイルである必要があります。');
      }

      let confirmMsg = '以下のデータを既存データにマージして現在の環境にインポートしますか？\n\n';
      if (targetDbItems) {
        confirmMsg += `・作品データベース定義: ${importedDbCount} 件\n`;
      }
      if (targetReviews) {
        confirmMsg += `・マイ個人感想・鑑賞記録: ${importedReviewsCount} 件\n`;
      }
      confirmMsg += '\n※既に同じIDのアイテムが存在する場合はインポートデータで上書きされます。\n続行してよろしいですか？';

      if (!window.confirm(confirmMsg)) {
        return;
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

      let successMsg = 'データのインポートが正常に完了しました！\n';
      if (targetDbItems) successMsg += `・カスタム作品データベース: ${importedDbCount}件をインポートしました。\n`;
      if (targetReviews) successMsg += `・マイ感想・鑑賞履歴: ${importedReviewsCount}件を復元・マージしました。\n`;

      setImportSuccessMessage(successMsg);
      setImportJsonText('');
      alert(successMsg);
    } catch (e: any) {
      console.error('Import process failed:', e);
      setImportError(`インポートに失敗しました: ${e.message || 'JSONフォーマットが間違っているか、ファイルが破損している可能性があります。'}`);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError('JSONファイル（.json）をドロップしてください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processImportJson(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/30 text-red-500">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-bold text-slate-200">MCUデータベース・カスタマイザー</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              MCUの作品名や公開スケジュールを編集・追加するための開発パネルです。
              例えば、映画『アベンジャーズ：ドゥームズデイ』の日程を変更（後倒しなど）すると、タイムラインや統計情報、アベンジャーズの相関キャラクター関係がリアルタイムで自動更新されます。
              新たにお気に入りの作品情報が公式に発表された場合にも、ここから自由に追加できます。
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handlePrepareAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-550 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                新しい作品を追加する
              </button>
              <button
                type="button"
                onClick={handlePresetSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold transition-all border border-amber-500/30 cursor-pointer shadow-md"
                title="Google APIキー不要、オフライン動作可能なローカル公式最新データを一括ロードします"
              >
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                公式プリセットから同期 (高速・API不要)
              </button>
              <button
                type="button"
                onClick={handleFetchOfficialMcu}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                title="Gemini AIを使って、最新のディズニー/マーベル公式サイト等のスケジュール更新情報をWebからディープ検索して同期します"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isSyncing ? '公式スケジュールを収集中...' : '最新情報をAI検索同期 (要APIキー)'}
              </button>
              <button
                type="button"
                onClick={() => setShowJsonExport(!showJsonExport)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-755 hover:text-white text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                データのエクスポート/バックアップ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('データベースを最初のデフォルト状態にリセットします。\n※これまでこのパネルで追加・編集したすべてのカスタム作品データおよび公開日等の変更が取り消されます。鑑賞履歴や感想は消えません。')) {
                    onResetDb();
                    setIsEditing(false);
                    setSelectedId('');
                    alert('データベースをリセットしました。');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-900 cursor-pointer ml-auto"
                title="デフォルトデータベースに戻す"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                初期デフォルトに戻す
              </button>
            </div>

            {syncError && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-red-400 font-sans">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Backup/Import Panel */}
        {showJsonExport && (
          <div className="mt-5 p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 animate-fade-in text-left">
            {/* Tab navigation */}
            <div className="flex border-b border-slate-850 pb-2.5">
              <button
                type="button"
                onClick={() => setBackupTab('export')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer relative ${
                  backupTab === 'export'
                    ? 'text-amber-400 bg-slate-900 border border-slate-850'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                エクスポート (保存・バックアップ)
              </button>
              <button
                type="button"
                onClick={() => setBackupTab('import')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer relative ${
                  backupTab === 'import'
                    ? 'text-amber-400 bg-slate-900 border border-slate-850'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                インポート (復元・読み込み)
              </button>
            </div>

            {/* Export Tab View */}
            {backupTab === 'export' ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                    <Check className="w-4 h-4 text-emerald-500 animate-pulse" />
                    エクスポート対象のデータ選択
                  </span>
                  
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setActiveExportType('all')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeExportType === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      すべて (推奨)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveExportType('db')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeExportType === 'db' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      作品DBのみ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveExportType('reviews')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeExportType === 'reviews' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      マイ感想・履歴のみ
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  ※お好みのデータを選択してバックアップファイルに保存するか、クリップボードの内容をテキストとして控えることができます。
                </p>

                <textarea
                  readOnly
                  value={JSON.stringify(getExportData(), null, 2)}
                  rows={6}
                  className="w-full bg-slate-900 text-[11px] font-mono text-emerald-400 border border-slate-850 rounded-xl p-3 outline-none"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  title="クリックして全選択"
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 font-sans">
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-xl">
                    💡 **ヒント：** バックアップしたファイルを大切に保管してください。
                    キャッシュクリアでデータが消えても、隣の「インポート」タブからいつでも元の状態に復元可能です。
                  </p>
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        exportCopied ? 'bg-emerald-600 text-white' : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750'
                      }`}
                    >
                      {exportCopied ? 'コピー完了！' : 'クリップボードにコピー'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadBackupFile}
                      className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold transition-all border border-amber-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      ファイルでダウンロード
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-500 bg-amber-950/20 text-amber-400'
                      : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 font-sans">
                    <Upload className="w-8 h-8 text-slate-500 mb-1" />
                    <p className="text-xs font-bold text-slate-300">
                      ここにバックアップした JSON ファイルをドラッグ&ドロップ
                    </p>
                    <p className="text-[10px] text-slate-500">
                      または、ここをクリックしてパソコンからファイルを選択 (.json)
                    </p>
                  </div>
                </div>

                {/* Paste fallback */}
                <div className="space-y-1.5 font-sans">
                  <label className="text-[11px] font-bold text-slate-400 block">
                    または、コピーしたバックアップJSONテキストを直接貼り付け：
                  </label>
                  <textarea
                    placeholder="ここにエクスポートしたJSONデータを貼り付けてください..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 text-[11px] font-mono text-slate-300 border border-slate-850 rounded-xl p-3 outline-none focus:border-slate-700"
                  />
                </div>

                {importError && (
                  <div className="p-3 bg-red-950/30 border border-red-900/30 rounded-xl text-xs text-red-400 leading-relaxed flex items-start gap-1.5 font-sans">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{importError}</span>
                  </div>
                )}

                {importSuccessMessage && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-950/50 rounded-xl text-xs text-emerald-400 leading-relaxed flex items-start gap-1.5 font-sans">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{importSuccessMessage}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => processImportJson(importJsonText)}
                    disabled={!importJsonText.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-650 to-amber-600 hover:from-red-550 hover:to-amber-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>貼り付けたデータをインポートする</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {false && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/30 text-red-500">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-bold text-slate-200">MCUデータベース・カスタマイザー</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              MCUの作品名や公開スケジュールを編集・追加するための開発パネルです。
              例えば、映画『アベンジャーズ：ドゥームズデイ』の日程を変更（後倒しなど）すると、タイムラインや統計情報、アベンジャーズの相関キャラクター関係がリアルタイムで自動更新されます。
              新たにお気に入りの作品情報が公式に発表された場合にも、ここから自由に追加できます。
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={handlePrepareAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                新しい作品を追加する
              </button>
              <button
                type="button"
                onClick={handlePresetSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold transition-all border border-amber-500/30 cursor-pointer shadow-md"
                title="Google APIキー不要、オフライン動作可能なローカル公式最新データを一括ロードします"
              >
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                公式プリセットから同期 (高速・API不要)
              </button>
              <button
                type="button"
                onClick={handleFetchOfficialMcu}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                title="Gemini AIを使って、最新のディズニー/マーベル公式サイト等のスケジュール更新情報をWebからディープ検索して同期します"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isSyncing ? '公式スケジュールを収集中...' : '最新情報をAI検索同期 (要APIキー)'}
              </button>
              <button
                onClick={() => setShowJsonExport(!showJsonExport)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                データのエクスポート/バックアップ
              </button>
              <button
                onClick={() => {
                  if (window.confirm('データベースを最初のデフォルト状態にリセットします。\n※これまでこのパネルで追加・編集したすべてのカスタム作品データおよび公開日等の変更が取り消されます。鑑賞履歴や感想は消えません。')) {
                    onResetDb();
                    setIsEditing(false);
                    setSelectedId('');
                    alert('データベースをリセットしました。');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-900 cursor-pointer ml-auto"
                title="デフォルトデータベースに戻す"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                初期デフォルトに戻す
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

        {/* JSON Export Overlay Output */}
        {showJsonExport && (
          <div className="mt-5 p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                お使いのカスタムデータ（JSON形式・クリップボードにコピーできます）
              </span>
              <button
                onClick={handleExportJson}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  exportCopied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {exportCopied ? 'コピー完了！' : 'クリップボードにコピー'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              ※今後MCU作品が何件も更新された際、このJSONを保存しておけば、ブラウザのキャッシュ（localStorage）が不意に消えても元に戻せます。また、プログラムの <code>/src/mcuData.ts</code> や <code>/src/mcuExtraData.ts</code> にマージしてアプリへコミットすることで、更新作業が完了します。
            </p>
            <textarea
              readOnly
              value={JSON.stringify({ mcuItems: items, mcuExtraDataMap: extraMap }, null, 2)}
              rows={8}
              className="w-full bg-slate-900 text-[11px] font-mono text-emerald-400 border border-slate-850 rounded-lg p-3 outline-none"
            />
          </div>
        )}
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Works selector list (4 cols) */}
        <div className="col-span-1 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 max-h-[650px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              作品リスト ({items.length}件)
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-slate-850 text-slate-400">
              タップして編集
            </span>
          </div>

          <div className="space-y-1">
            {items
              .slice()
              .sort((a, b) => b.phase - a.phase || new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
              .map(work => {
                const extra = extraMap[work.id] || { heroIcon: '🎬', accentColor: '#475569' };
                const isSelected = work.id === selectedId;

                return (
                  <button
                    key={work.id}
                    onClick={() => handleSelectWork(work.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 border ${
                      isSelected 
                        ? 'bg-slate-800 border-red-500/80 shadow-md translate-x-1' 
                        : 'bg-transparent border-transparent hover:bg-slate-850/60'
                    }`}
                  >
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border"
                      style={{ 
                        backgroundColor: `${extra.accentColor}15`, 
                        borderColor: `${extra.accentColor}40`
                      }}
                    >
                      {extra.heroIcon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                          PHASE {work.phase}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {work.releaseDate.split('-')[0]}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-300 truncate mt-0.5">
                        {work.titleJa}
                      </h5>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Work editing details form (8 cols) */}
        <div className="col-span-1 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[500px]">
          {!isEditing ? (
            <div className="h-[460px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Database className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-sm font-bold text-slate-300">編集する作品を選択してください</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  左のリストから既存ワークをクリックして情報変更するか、または「新しい作品を追加する」ボタンを押して新規登録を開始してください。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span className="bg-red-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                    {isAddingNew ? 'CREATE' : 'UPDATE'}
                  </span>
                  <span>{isAddingNew ? '新規作品の登録フォーム' : `「${formTitleJa}」情報の編集`}</span>
                </h4>
                {!isAddingNew && (
                  <button
                    onClick={() => handleDelete(formId)}
                    className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-400 hover:underline px-2 py-1 rounded bg-red-950/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 作品の削除
                  </button>
                )}
              </div>

              {/* AI Auto-Collect Assist Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI作品検索コレクター（自動情報収集・補完）</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  新たに登録したいMCU映画、ドラマ、アニメ番組などのキーワードを入力して「AIで情報を収集する」をクリックしてください。Web上の最新情報（邦題、英題、公開日、ストーリー時系列、作品概要、関連キャラなど）を探して、下のフォームを自動入力します。
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="例: ブレイド MCU映画, アイアンハート ドラマ, スパイダーマン4..."
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-red-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleSearchMcuWorkWithAi}
                    disabled={isSearchingAi}
                    className="px-4 py-2 bg-gradient-to-r from-red-650 to-amber-600 hover:from-red-550 hover:to-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-md"
                  >
                    {isSearchingAi ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isSearchingAi ? '情報収集中...' : 'AIで情報を収集する'}
                  </button>
                </div>
                {aiSearchError && (
                  <p className="text-[10px] text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2 rounded-lg">
                    ⚠️ {aiSearchError}
                  </p>
                )}
                {aiSearchSuccess && (
                  <p className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg">
                    ✓ データの収集に成功しました！以下の入力情報を確認して調整の上、最下部の「変更を保存」を押してください。
                  </p>
                )}
              </div>

              {/* Form Field Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID Input */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    作品ID <span className="text-red-500">*</span>
                    <span className="text-[10px] text-slate-500 font-normal ml-1">（英数字・アンダースコア。例: marvel_zombies）</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isAddingNew}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. captain_america_bnw"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 focus:border-slate-700 disabled:opacity-40 text-slate-200 text-sm rounded-xl p-2.5 outline-none transition-colors"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    作品カテゴリ
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none transition-colors cursor-pointer"
                  >
                    <option value="movie">映画（劇場公開）</option>
                    <option value="drama">ドラマシリーズ（配信）</option>
                    <option value="special">スペシャル（ワンショット / アニメ等）</option>
                  </select>
                </div>

                {/* Title JP */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    タイトル (日本語) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleJa}
                    onChange={(e) => setFormTitleJa(e.target.value)}
                    placeholder="e.g. アベンジャーズ：ドゥームズデイ"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Title EN */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    タイトル (英語 / 原題)
                  </label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Avengers: Doomsday"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Release date YYYY-MM-DD */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    公開予定日 / 配信開始日 (米国基準)
                    <span className="text-[10px] text-sky-450 ml-1">（未来の日付を設定すると「公開予定」ステータスになります）</span>
                  </label>
                  <input
                    type="date"
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700 font-mono"
                  />
                </div>

                {/* Phase Select */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    MCU フェーズ
                  </label>
                  <select
                    value={formPhase}
                    onChange={(e) => setFormPhase(Number(e.target.value))}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none transition-colors cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(ph => (
                      <option key={ph} value={ph}>フェーズ {ph}</option>
                    ))}
                  </select>
                </div>



                {/* Chrono Order */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 font-mono">
                    劇中時系列カウント (インデックス番号)
                  </label>
                  <input
                    type="number"
                    value={formChronoOrder}
                    onChange={(e) => setFormChronoOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700 font-mono"
                  />
                </div>

                {/* Chrono Setting label */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    劇中時間設定（目安情報）
                  </label>
                  <input
                    type="text"
                    value={formChronoSetting}
                    onChange={(e) => setFormChronoSetting(e.target.value)}
                    placeholder="e.g. 2026年（マルチバース衝突の最高潮、ドゥームの宣戦布告）"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Duration or Episodes */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    上映時間、または話数
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 2時間35分 / 全9話"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Director */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    監督、またはクリエイター
                  </label>
                  <input
                    type="text"
                    value={formDirector}
                    onChange={(e) => setFormDirector(e.target.value)}
                    placeholder="e.g. アンソニー＆ジョー・ルッソ"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Importance level */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    作品のストーリー重要度 (3段階)
                  </label>
                  <select
                    value={formImportance}
                    onChange={(e) => setFormImportance(Number(e.target.value) as any)}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none transition-colors cursor-pointer font-bold"
                  >
                    <option value={3}>★★★ 必須級 (メインストーリーに直結)</option>
                    <option value={2}>★★ 推奨 (主要キャラクターの深掘り / 背景知識)</option>
                    <option value={1}>★ 補足 (スピンオフ / 特定キャラクターファン向け)</option>
                  </select>
                </div>

                {/* Hero Icon Emoji */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    作品を象徴する絵文字 (カードアイコン)
                  </label>
                  <input
                    type="text"
                    value={formHeroIcon}
                    onChange={(e) => setFormHeroIcon(e.target.value)}
                    placeholder="e.g. 🎭 / 🦅 / 🎬"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>

                {/* Accent Color Hex */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    イメージアクセント色 (カラーコード)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-12 h-[38px] bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl outline-none cursor-pointer p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      placeholder="#ef4444"
                      className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700 font-mono"
                    />
                  </div>
                </div>

                {/* Official URL */}
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    公式サイト URL
                  </label>
                  <input
                    type="text"
                    value={formOfficialUrl}
                    onChange={(e) => setFormOfficialUrl(e.target.value)}
                    placeholder="e.g. https://marvel.disney.co.jp/movie/..."
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                {/* Explanations search query hook */}
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    詳細ネット解説用 検索キーワード
                  </label>
                  <input
                    type="text"
                    value={formExplanationUrlQuery}
                    onChange={(e) => setFormExplanationUrlQuery(e.target.value)}
                    placeholder="e.g. アベンジャーズ ドゥームズデイ ネタバレ 考察"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              {/* Story Importance explanation */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  ストーリー重要度の理由・背景
                </label>
                <textarea
                  value={formImportanceReason}
                  onChange={(e) => setFormImportanceReason(e.target.value)}
                  placeholder="e.g. ルッソ兄弟が監督に復帰。ロバート・ダウニー・Jrが全く違う「ドクター・ドゥーム」役として衝撃復帰する今作。マルチバース世界の命運が完全に決定づけられます。"
                  rows={2}
                  className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 outline-none focus:border-slate-700 transition-colors"
                />
              </div>

              {/* Synopsis / Outline */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  あらすじ・解説
                </label>
                <textarea
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  placeholder="作品の概要や期待されるプロットを記載してください。ネタバレ感想とは異なりますので、基本のあらすじなどを入力します。"
                  rows={4}
                  className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 outline-none focus:border-slate-700 transition-colors"
                />
              </div>

              {/* Characters multi-select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">
                  関連登場キャラクターの選択
                  <span className="text-[10px] text-slate-500 font-bold ml-1">（作品詳細の相関図や重要登場人物として連携されます）</span>
                </label>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 max-h-[180px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(charactersDb).map(char => {
                    const isChecked = formCharacterIds.includes(char.id);
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleCharacterToggle(char.id)}
                        className={`p-1.5 rounded-lg border text-left text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-slate-800/80 border-red-500 text-slate-100' 
                            : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-300 hover:border-slate-800'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[8px] font-extrabold ${
                          isChecked ? 'bg-red-600 border-red-500 text-white' : 'border-slate-800'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                        <span className="shrink-0">{char.emoji}</span>
                        <span className="truncate">{char.heroNameJa || char.nameJa}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  * 必須フィールド。
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsAddingNew(false);
                      setSelectedId('');
                    }}
                    className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isAddingNew ? 'この作品を登録する' : '変更内容を保存する'}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Live Sync Confirmation Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-amber-500/15 p-2 rounded-lg text-amber-500 border border-amber-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">公式MCUデータとの同期・上書き確認</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    公式最新スケジュール情報（新規・更新分）と、現在のデータベースを視覚的に比較しました。
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                <span className="text-[11px] text-slate-400 font-bold font-mono">
                  同期候補: {fetchedItems.length} 作品 / 選択中: {selectedSyncIds.length} 作品
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSyncIds(fetchedItems.map(x => x.id))}
                    className="text-[10px] text-sky-400 hover:underline font-bold px-1.5 py-0.5 transition-all text-left bg-transparent"
                  >
                    すべて選択
                  </button>
                  <span className="text-slate-600 text-xs">|</span>
                  <button
                    onClick={() => setSelectedSyncIds([])}
                    className="text-[10px] text-slate-400 hover:underline font-bold px-1.5 py-0.5 transition-all text-left bg-transparent"
                  >
                    すべて解除
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {fetchedItems.map((fetched) => {
                  const existing = items.find(x => x.id === fetched.id);
                  const isChecked = selectedSyncIds.includes(fetched.id);

                  // 差分・ステータス検出
                  let status: 'new' | 'update' | 'no_change' = 'no_change';
                  const diffs: string[] = [];

                  if (!existing) {
                    status = 'new';
                  } else {
                    if (existing.releaseDate !== fetched.releaseDate) {
                      diffs.push(`公開日: "${existing.releaseDate}" ➔ "${fetched.releaseDate}"`);
                    }
                    if (existing.titleJa !== fetched.titleJa) {
                      diffs.push(`タイトル(日): "${existing.titleJa}" ➔ "${fetched.titleJa}"`);
                    }
                    if (existing.durationOrEpisodes !== fetched.durationOrEpisodes) {
                      diffs.push(`規模/上映時間: "${existing.durationOrEpisodes}" ➔ "${fetched.durationOrEpisodes}"`);
                    }
                    if (fetched.directorOrCreator && existing.directorOrCreator !== fetched.directorOrCreator) {
                      diffs.push(`監督: "${existing.directorOrCreator}" ➔ "${fetched.directorOrCreator}"`);
                    }
                    
                    if (diffs.length > 0) {
                      status = 'update';
                    }
                  }

                  return (
                    <div 
                      key={fetched.id}
                      onClick={() => handleToggleSyncId(fetched.id)}
                      className={`p-3.5 border rounded-xl transition-all cursor-pointer select-none space-y-2 ${
                        isChecked 
                          ? 'bg-slate-850 border-amber-500/40' 
                          : 'bg-slate-900 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* checkbox */}
                        <div 
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold ${
                            isChecked ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>

                        {/* Title and Badge */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base shrink-0">{fetched.heroIcon || '🎬'}</span>
                            <h4 className="text-xs font-bold text-slate-200 truncate flex-1 md:max-w-md">
                              {fetched.titleJa} <span className="text-[10px] text-slate-500 font-normal font-mono">({fetched.titleEn})</span>
                            </h4>
                            
                            {status === 'new' && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold font-mono">
                                新規登録 (NEW)
                              </span>
                            )}
                            {status === 'update' && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold font-mono">
                                情報上書き (UPDATE)
                              </span>
                            )}
                            {status === 'no_change' && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-750 text-slate-500 text-[9px] font-bold font-mono">
                                差分なし (LATEST)
                              </span>
                            )}
                          </div>

                          <p className="text-[10px] text-slate-400 leading-relaxed mt-1.5 italic font-sans truncate">
                            {fetched.synopsis || 'あらすじ説明は未発表、または省略されています。'}
                          </p>

                          {/* Diff changes view */}
                          {status === 'update' && diffs.length > 0 && (
                            <div className="mt-2 text-[10px] font-mono text-amber-450 bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg space-y-0.5">
                              <span className="font-bold text-slate-300 block mb-0.5">※以下の情報が自動修正・上書きされます:</span>
                              {diffs.map((diff, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-amber-400">
                                  <span>•</span>
                                  <span>{diff}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {status === 'new' && (
                            <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg">
                              <span className="font-bold text-slate-300 block mb-1">新規追加される項目:</span>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-slate-400">
                                <div>公開日: <span className="text-emerald-400">{fetched.releaseDate}</span></div>
                                <div>フェーズ: <span className="text-emerald-400 font-bold">Phase {fetched.phase}</span></div>
                                <div>監督: <span className="text-emerald-400">{fetched.directorOrCreator}</span></div>
                                <div>規模/話数: <span className="text-emerald-400">{fetched.durationOrEpisodes}</span></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0 rounded-b-2xl">
              <span className="text-[10px] text-slate-400 font-medium">
                チェックが入った作品が適用され、タイムラインや統計へ即座に反映されます。
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  disabled={selectedSyncIds.length === 0}
                  onClick={handleApplySync}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  選択した {selectedSyncIds.length} 件の変更を適用
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
