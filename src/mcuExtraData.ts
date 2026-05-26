export interface CharacterInfo {
  id: string;
  nameJa: string;
  heroNameJa?: string;
  emoji: string;
}

export interface ExtraItemData {
  heroIcon: string;      // 絵文字やシンボル
  heroIconName: string;  // Lucideアイコン名（フォールバック用）
  accentColor: string;   // テザーカラー (Tailwind border/text等で使用)
  characterIds: string[]; // 登場キャラクターのID
}

export const charactersDb: Record<string, CharacterInfo> = {
  tony_stark: { id: 'tony_stark', nameJa: 'トニー・スターク', heroNameJa: 'アイアンマン', emoji: '🤖' },
  steve_rogers: { id: 'steve_rogers', nameJa: 'スティーブ・ロジャース', heroNameJa: 'キャプテン・アメリカ', emoji: '🛡️' },
  thor: { id: 'thor', nameJa: 'ソー', heroNameJa: '雷神ソー', emoji: '⚡' },
  bruce_banner: { id: 'bruce_banner', nameJa: 'ブルース・バナー', heroNameJa: 'ハルク', emoji: '🟢' },
  natasha_romanoff: { id: 'natasha_romanoff', nameJa: 'ナターシャ・ロマノフ', heroNameJa: 'ブラック・ウィドウ', emoji: '🕷️' },
  clint_barton: { id: 'clint_barton', nameJa: 'クリント・バートン', heroNameJa: 'ホークアイ', emoji: '🏹' },
  nick_fury: { id: 'nick_fury', nameJa: 'ニック・フューリー', heroNameJa: 'S.H.I.E.L.D.長官', emoji: '👁️' },
  loki: { id: 'loki', nameJa: 'ロキ', heroNameJa: '悪戯の神ロキ', emoji: '👑' },
  phil_colson: { id: 'phil_colson', nameJa: 'フィル・コールソン', heroNameJa: 'S.H.I.E.L.D.エージェント', emoji: '👔' },
  jane_foster: { id: 'jane_foster', nameJa: 'ジェーン・フォスター', heroNameJa: 'マイティ・ジェーン', emoji: '🔨' },
  wanda_maximoff: { id: 'wanda_maximoff', nameJa: 'ワンダ・マキシモフ', heroNameJa: 'スカーレット・ウィッチ', emoji: '🔮' },
  vision: { id: 'vision', nameJa: 'ヴィジョン', heroNameJa: 'ヴィジョン', emoji: '💎' },
  sam_wilson: { id: 'sam_wilson', nameJa: 'サム・ウィルソン', heroNameJa: 'ファルコン / キャプテン・アメリカ', emoji: '🦅' },
  bucky_barnes: { id: 'bucky_barnes', nameJa: 'バッキー・バーンズ', heroNameJa: 'ウィンター・ソルジャー', emoji: '🦾' },
  james_rhodes: { id: 'james_rhodes', nameJa: 'ジェームズ・ローズ', heroNameJa: 'ウォーマシン', emoji: '⚙️' },
  peter_parker: { id: 'peter_parker', nameJa: 'ピーター・パーカー', heroNameJa: 'スパイダーマン', emoji: '🕸️' },
  stephen_strange: { id: 'stephen_strange', nameJa: 'スティーヴン・ストレンジ', heroNameJa: 'ドクター・ストレンジ', emoji: '🔮' },
  wong: { id: 'wong', nameJa: 'ウォン', heroNameJa: '至高の魔術師ウォン', emoji: '📖' },
  t_challa: { id: 't_challa', nameJa: 'ティ・チャラ', heroNameJa: 'ブラックパンサー', emoji: '🐾' },
  shuri: { id: 'shuri', nameJa: 'シュリ', heroNameJa: '新ブラックパンサー', emoji: '🐯' },
  okoye: { id: 'okoye', nameJa: 'オコエ', heroNameJa: 'ドーラ・ミラージュ隊長', emoji: '🔱' },
  peter_quill: { id: 'peter_quill', nameJa: 'ピーター・クイル', heroNameJa: 'スター・ロード', emoji: '🎧' },
  gamora: { id: 'gamora', nameJa: 'ガモーラ', heroNameJa: 'ガモーラ', emoji: '⚔️' },
  rocket: { id: 'rocket', nameJa: 'ロケット', heroNameJa: 'ロケット・ラクーン', emoji: '🦝' },
  groot: { id: 'groot', nameJa: 'グルート', heroNameJa: 'グルート', emoji: '🌱' },
  dra_x: { id: 'dra_x', nameJa: 'ドラックス', heroNameJa: '破壊王ドラックス', emoji: '🔪' },
  nebula: { id: 'nebula', nameJa: 'ネビュラ', heroNameJa: 'ネビュラ', emoji: '🤖' },
  mantis: { id: 'mantis', nameJa: 'マンティス', heroNameJa: 'マンティス', emoji: '👽' },
  scott_lang: { id: 'scott_lang', nameJa: 'スコット・ラング', heroNameJa: 'アントマン', emoji: '🐜' },
  hope_van_dyne: { id: 'hope_van_dyne', nameJa: 'ホープ・ヴァン・ダイン', heroNameJa: 'ワスプ', emoji: '🐝' },
  carol_danvers: { id: 'carol_danvers', nameJa: 'キャロル・ダンヴァース', heroNameJa: 'キャプテン・マーベル', emoji: '💫' },
  kamala_khan: { id: 'kamala_khan', nameJa: 'カマラ・カーン', heroNameJa: 'ミズ・マーベル', emoji: '⚡' },
  shang_chi: { id: 'shang_chi', nameJa: 'シャン・チー', heroNameJa: 'シャン・チー', emoji: '⭕' },
  kate_bishop: { id: 'kate_bishop', nameJa: 'ケイト・ビショップ', heroNameJa: '二代目ホークアイ', emoji: '🎯' },
  marc_spector: { id: 'marc_spector', nameJa: 'マーク・スペクター', heroNameJa: 'ムーンナイト', emoji: '🌙' },
  jennifer_walters: { id: 'jennifer_walters', nameJa: 'ジェニファー・ウォルターズ', heroNameJa: 'シー・ハルク', emoji: '⚖️' },
  matt_murdock: { id: 'matt_murdock', nameJa: 'マット・マードック', heroNameJa: 'デアデビル', emoji: '😈' },
  deadpool: { id: 'deadpool', nameJa: 'ウェイド・ウィルソン', heroNameJa: 'デッドプール', emoji: '⚔️' },
  wolverine: { id: 'wolverine', nameJa: 'ローガン', heroNameJa: 'ウルヴァリン', emoji: '🐺' },
  agatha_harkness: { id: 'agatha_harkness', nameJa: 'アガサ・ハークネス', heroNameJa: '魔女アガサ', emoji: '🧹' },
  thaddeus_ross: { id: 'thaddeus_ross', nameJa: 'サディアス・ロス', heroNameJa: 'レッドハルク', emoji: '🔴' },
  riri_williams: { id: 'riri_williams', nameJa: 'リリ・ウィリアムズ', heroNameJa: 'アイアンハート', emoji: '⚙️' },
  kingpin: { id: 'kingpin', nameJa: 'ウィルソン・フィスク', heroNameJa: 'キングピン', emoji: '🕶️' },
  reed_richards: { id: 'reed_richards', nameJa: 'リード・リチャーズ', heroNameJa: 'ミスター・ファンタスティック', emoji: '4️⃣' },
  doctor_doom: { id: 'doctor_doom', nameJa: 'ビクター・ドゥーム', heroNameJa: 'ドクター・ドゥーム', emoji: '🎭' }
};

export const mcuExtraDataMap: Record<string, ExtraItemData> = {
  // --- PHASE 1 ---
  iron_man: {
    heroIcon: '🤖',
    heroIconName: 'Cpu',
    accentColor: '#E62429',
    characterIds: ['tony_stark', 'james_rhodes', 'phil_colson', 'nick_fury']
  },
  incredible_hulk: {
    heroIcon: '🟢',
    heroIconName: 'Flame',
    accentColor: '#4c9141',
    characterIds: ['bruce_banner', 'tony_stark']
  },
  iron_man_2: {
    heroIcon: '🦾',
    heroIconName: 'Cpu',
    accentColor: '#E62429',
    characterIds: ['tony_stark', 'james_rhodes', 'natasha_romanoff', 'nick_fury', 'phil_colson']
  },
  thor: {
    heroIcon: '⚡',
    heroIconName: 'Zap',
    accentColor: '#2b90d9',
    characterIds: ['thor', 'loki', 'jane_foster', 'clint_barton', 'phil_colson', 'nick_fury']
  },
  captain_america_tfa: {
    heroIcon: '🛡️',
    heroIconName: 'Shield',
    accentColor: '#1f4e79',
    characterIds: ['steve_rogers', 'bucky_barnes', 'nick_fury']
  },
  avengers: {
    heroIcon: '💥',
    heroIconName: 'Grid',
    accentColor: '#E62429',
    characterIds: ['tony_stark', 'steve_rogers', 'thor', 'bruce_banner', 'natasha_romanoff', 'clint_barton', 'loki', 'nick_fury', 'phil_colson']
  },

  // --- PHASE 2 ---
  iron_man_3: {
    heroIcon: '⚙️',
    heroIconName: 'Cpu',
    accentColor: '#E62429',
    characterIds: ['tony_stark', 'james_rhodes']
  },
  thor_dark_world: {
    heroIcon: '🔨',
    heroIconName: 'Zap',
    accentColor: '#2b90d9',
    characterIds: ['thor', 'loki', 'jane_foster']
  },
  captain_america_ws: {
    heroIcon: '🏍️',
    heroIconName: 'Shield',
    accentColor: '#1f4e79',
    characterIds: ['steve_rogers', 'bucky_barnes', 'natasha_romanoff', 'sam_wilson', 'nick_fury']
  },
  guardians_of_the_galaxy: {
    heroIcon: '🦝',
    heroIconName: 'Music',
    accentColor: '#ea580c',
    characterIds: ['peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula']
  },
  guardians_of_the_galaxy_vol2: {
    heroIcon: '🎧',
    heroIconName: 'Music',
    accentColor: '#ea580c',
    characterIds: ['peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula', 'mantis']
  },
  avengers_aou: {
    heroIcon: '💎',
    heroIconName: 'Grid',
    accentColor: '#E62429',
    characterIds: ['tony_stark', 'steve_rogers', 'thor', 'bruce_banner', 'natasha_romanoff', 'clint_barton', 'wanda_maximoff', 'vision', 'sam_wilson', 'james_rhodes', 'nick_fury']
  },
  ant_man: {
    heroIcon: '🐜',
    heroIconName: 'Activity',
    accentColor: '#a855f7',
    characterIds: ['scott_lang', 'hope_van_dyne', 'sam_wilson']
  },

  // --- PHASE 3 ---
  captain_america_cw: {
    heroIcon: '⭐',
    heroIconName: 'Shield',
    accentColor: '#1f4e79',
    characterIds: ['steve_rogers', 'tony_stark', 'natasha_romanoff', 'sam_wilson', 'bucky_barnes', 'james_rhodes', 'clint_barton', 'wanda_maximoff', 'vision', 'peter_parker', 't_challa', 'scott_lang']
  },
  black_widow: {
    heroIcon: '🕷️',
    heroIconName: 'Target',
    accentColor: '#ef4444',
    characterIds: ['natasha_romanoff', 'clint_barton']
  },
  black_panther: {
    heroIcon: '🐾',
    heroIconName: 'Heart',
    accentColor: '#8b5cf6',
    characterIds: ['t_challa', 'shuri', 'okoye', 'bucky_barnes']
  },
  spider_man_hc: {
    heroIcon: '🕸️',
    heroIconName: 'Compass',
    accentColor: '#ef4444',
    characterIds: ['peter_parker', 'tony_stark']
  },
  doctor_strange: {
    heroIcon: '👁️',
    heroIconName: 'Sparkles',
    accentColor: '#9013FE',
    characterIds: ['stephen_strange', 'wong', 'thor']
  },
  thor_ragnarok: {
    heroIcon: '🪐',
    heroIconName: 'Zap',
    accentColor: '#2b90d9',
    characterIds: ['thor', 'loki', 'bruce_banner', 'stephen_strange']
  },
  ant_man_and_the_wasp: {
    heroIcon: '🐝',
    heroIconName: 'Activity',
    accentColor: '#a855f7',
    characterIds: ['scott_lang', 'hope_van_dyne']
  },
  avengers_iw: {
    heroIcon: '👑',
    heroIconName: 'Grid',
    accentColor: '#E62429',
    characterIds: [
      'tony_stark', 'steve_rogers', 'thor', 'bruce_banner', 'natasha_romanoff', 'loki', 'wanda_maximoff', 'vision',
      'sam_wilson', 'bucky_barnes', 'james_rhodes', 'peter_parker', 'stephen_strange', 'wong', 't_challa', 'shuri',
      'okoye', 'peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula', 'mantis'
    ]
  },
  captain_marvel: {
    heroIcon: '💫',
    heroIconName: 'Sun',
    accentColor: '#f59e0b',
    characterIds: ['carol_danvers', 'nick_fury']
  },
  avengers_eg: {
    heroIcon: '🌍',
    heroIconName: 'Grid',
    accentColor: '#e11d48',
    characterIds: [
      'tony_stark', 'steve_rogers', 'thor', 'bruce_banner', 'natasha_romanoff', 'clint_barton', 'loki', 'wanda_maximoff',
      'sam_wilson', 'bucky_barnes', 'james_rhodes', 'peter_parker', 'stephen_strange', 'wong', 't_challa', 'shuri',
      'okoye', 'peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula', 'mantis', 'scott_lang', 'hope_van_dyne',
      'carol_danvers'
    ]
  },
  spider_man_ffh: {
    heroIcon: '🕶️',
    heroIconName: 'Compass',
    accentColor: '#ef4444',
    characterIds: ['peter_parker', 'nick_fury']
  },

  // --- PHASE 4 ---
  wandavision: {
    heroIcon: '📺',
    heroIconName: 'Tv',
    accentColor: '#ef4444',
    characterIds: ['wanda_maximoff', 'vision']
  },
  falcon_winter_soldier: {
    heroIcon: '🦅',
    heroIconName: 'Tv',
    accentColor: '#3b82f6',
    characterIds: ['sam_wilson', 'bucky_barnes', 'james_rhodes']
  },
  loki_s1: {
    heroIcon: '⏳',
    heroIconName: 'Tv',
    accentColor: '#10b981',
    characterIds: ['loki']
  },
  shang_chi: {
    heroIcon: '⭕',
    heroIconName: 'Layers',
    accentColor: '#dc2626',
    characterIds: ['shang_chi', 'wong', 'bruce_banner', 'carol_danvers']
  },
  eternals: {
    heroIcon: '🌌',
    heroIconName: 'Compass',
    accentColor: '#d97706',
    characterIds: []
  },
  hawkeye: {
    heroIcon: '🎯',
    heroIconName: 'Tv',
    accentColor: '#6d28d9',
    characterIds: ['clint_barton', 'kate_bishop']
  },
  spider_man_nwh: {
    heroIcon: '🧬',
    heroIconName: 'Compass',
    accentColor: '#ef4444',
    characterIds: ['peter_parker', 'stephen_strange', 'wong', 'matt_murdock']
  },
  moon_knight: {
    heroIcon: '🌙',
    heroIconName: 'Tv',
    accentColor: '#6b7280',
    characterIds: ['marc_spector']
  },
  doctor_strange_mom: {
    heroIcon: '🌀',
    heroIconName: 'Sparkles',
    accentColor: '#8b5cf6',
    characterIds: ['stephen_strange', 'wanda_maximoff', 'wong']
  },
  ms_marvel: {
    heroIcon: '⚡',
    heroIconName: 'Tv',
    accentColor: '#ec4899',
    characterIds: ['kamala_khan', 'carol_danvers']
  },
  thor_love_and_thunder: {
    heroIcon: '🐐',
    heroIconName: 'Zap',
    accentColor: '#06b6d4',
    characterIds: ['thor', 'jane_foster', 'peter_quill', 'nebula', 'mantis', 'dra_x', 'rocket', 'groot']
  },
  she_hulk: {
    heroIcon: '⚖️',
    heroIconName: 'Tv',
    accentColor: '#22c55e',
    characterIds: ['jennifer_walters', 'bruce_banner', 'wong', 'matt_murdock']
  },
  black_panther_wf: {
    heroIcon: '🔱',
    heroIconName: 'Shield',
    accentColor: '#4f46e5',
    characterIds: ['shuri', 'okoye']
  },

  // --- PHASE 5 ---
  ant_man_q: {
    heroIcon: '🌀',
    heroIconName: 'Activity',
    accentColor: '#a855f7',
    characterIds: ['scott_lang', 'hope_van_dyne']
  },
  guardians_of_the_galaxy_vol3: {
    heroIcon: '🎸',
    heroIconName: 'Music',
    accentColor: '#ea580c',
    characterIds: ['peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula', 'mantis']
  },
  secret_invasion: {
    heroIcon: '🦎',
    heroIconName: 'Tv',
    accentColor: '#10b981',
    characterIds: ['nick_fury', 'james_rhodes']
  },
  loki_s2: {
    heroIcon: '🎛️',
    heroIconName: 'Tv',
    accentColor: '#10b981',
    characterIds: ['loki']
  },
  the_marvels: {
    heroIcon: '🌌',
    heroIconName: 'Film',
    accentColor: '#f59e0b',
    characterIds: ['carol_danvers', 'kamala_khan', 'nick_fury']
  },
  deadpool_and_wolverine: {
    heroIcon: '⚔️',
    heroIconName: 'Film',
    accentColor: '#be123c',
    characterIds: ['deadpool', 'wolverine', 'wong']
  },
  agatha_all_along: {
    heroIcon: '🧹',
    heroIconName: 'Tv',
    accentColor: '#5b21b6',
    characterIds: ['agatha_harkness']
  },
  what_if_s3: {
    heroIcon: '👾',
    heroIconName: 'Tv',
    accentColor: '#a855f7',
    characterIds: ['stephen_strange', 'thor', 'bucky_barnes']
  },
  captain_america_bnw: {
    heroIcon: '🦅',
    heroIconName: 'Shield',
    accentColor: '#1d4ed8',
    characterIds: ['sam_wilson', 'thaddeus_ross']
  },
  daredevil_born_again: {
    heroIcon: '👹',
    heroIconName: 'Tv',
    accentColor: '#991b1b',
    characterIds: ['matt_murdock', 'kingpin']
  },
  thunderbolts: {
    heroIcon: '⚡',
    heroIconName: 'Film',
    accentColor: '#475569',
    characterIds: ['bucky_barnes', 'thaddeus_ross']
  },
  fantastic_four_fs: {
    heroIcon: '🚀',
    heroIconName: 'Film',
    accentColor: '#2563eb',
    characterIds: ['reed_richards']
  },
  ironheart: {
    heroIcon: '🦾',
    heroIconName: 'Tv',
    accentColor: '#dc2626',
    characterIds: ['riri_williams']
  },
  avengers_doomsday: {
    heroIcon: '🎭',
    heroIconName: 'Film',
    accentColor: '#0f766e',
    characterIds: ['doctor_doom', 'sam_wilson', 'stephen_strange', 'thor', 'bruce_banner', 'reed_richards']
  },
  avengers_secret_wars: {
    heroIcon: '☄️',
    heroIconName: 'Film',
    accentColor: '#701a75',
    characterIds: ['doctor_doom', 'peter_parker', 'wolverine', 'deadpool', 'thor', 'stephen_strange']
  }
};
