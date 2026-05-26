import { 
  BookOpen, CheckSquare, MessageSquare, Database, Sparkles, Key, Info, HelpCircle, Flame, Star, AlertCircle, ArrowUpRight 
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto py-4">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-red-650/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 rounded-full bg-amber-500/5 blur-3xl"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-650/10 border border-red-650/30 text-red-400 text-xs font-bold leading-none">
            <BookOpen className="w-3.5 h-3.5" />
            USER GUIDE
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            MCUタイムライン・トラッカー ＆ データベース管理者ガイド
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            このアプリケーションに搭載されている、タイムライン鑑賞記録からデータベース作成、AI自動・手動同期機能までのすべてを解説します。
          </p>
        </div>
      </div>

      {/* Guide Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Tracker Features */}
        <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-650/15 p-2 rounded-xl text-red-500 border border-red-650/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200">1. 進捗管理 ＆ タイムライン</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-450 leading-relaxed list-disc list-inside pl-1">
            <li>
              <strong className="text-slate-300">鑑賞ボタン (<span className="text-red-500">✓ 鑑賞済</span>)</strong>: クリックすることでステータスを切り変えられます。上のプログレスバーや統計チャートにリアルタイムで反映されます。
            </li>
            <li>
              <strong className="text-slate-300">後で見る (<span className="text-indigo-400">♥</span>)</strong>: 「お気に入り・要ウォッチ」としてブックマークし、上部の各種フィルターで絞り込めます。
            </li>
            <li>
              <strong className="text-slate-300">リスト / タイムライン表示</strong>: 縦１列のスッキリした格子（グリッド）ビューに加え、時系列（Chrono）や公開順（Release）に沿って綺麗に繋がるタイムライン遷移ビューを選べます。
            </li>
          </ul>
        </div>

        {/* Thoughts Hub */}
        <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-800 p-2 rounded-xl text-slate-300 border border-slate-750">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200">2. マイ感想 ＆ メモ</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-450 leading-relaxed list-disc list-inside pl-1">
            <li>
              <strong className="text-slate-300">詳細モーダルでのレビュー</strong>: 作品カードをクリックしてダイアログを開き、感想メモ、評価スコア、そして「いつ観たか」をすぐに書き込めます。
            </li>
            <li>
              <strong className="text-slate-300">感想一覧タブ</strong>: 感想やメモ、またはスコアリング済みの作品を、「マイ感想・メモ一覧」タブで一度に一覧表示。フィルター検索も可能です。
            </li>
            <li>
              <strong className="text-slate-300">相関ネットワーク</strong>: モーダル上のキャラクター（ヒーロー・出演者）をクリックすると、そのキャラクターが「他にどのフェーズや映画に出現したか」が自動ハイライトされます！
            </li>
          </ul>
        </div>

        {/* DB Customizer */}
        <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-500/15 p-2 rounded-xl text-amber-500 border border-amber-500/25">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200">3. データベースカスタマイズ・自由登録</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-450 leading-relaxed list-disc list-inside pl-1">
            <li>
              <strong className="text-slate-300">新しい作品の作成</strong>: 「映画」「ドラマ」「スペシャル」から選択し、邦題、英題、公開予定日、ストーリー時系列（chronoOrder）の順序、さらに登場キャラクター、テーマカラー、アプリアイコン（絵文字）まで自由自在に設計して登録できます。
            </li>
            <li>
              <strong className="text-slate-300">JSON入出力機能</strong>: 自分なりに整理・追加したオリジナルのMCUロードマップをJSON形式でダウンロード保存し、別の端末や環境へインポートしていつでも復元できます。
            </li>
            <li>
              <strong className="text-slate-300">いつでもリセット</strong>: 左下の「初期デフォルトに戻す」をクリックで、アプリ初期収録データにいつでも戻せます。
            </li>
          </ul>
        </div>

        {/* Sync Mechanism */}
        <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-sky-500/15 p-2 rounded-xl text-sky-400 border border-sky-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200">4. 公式スケジュールの同期</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-450 leading-relaxed list-disc list-inside pl-1">
            <li>
              <strong className="text-slate-300 font-bold">A. 公式プリセットから同期（推奨・高速・API不要）</strong>:
              オフライン動作可能な事前定義の2025年〜2027年以降の最新MCU予定（アベンジャーズ：Doomsday、シークレット・ウォーズ、スパイダーマン4等） を、差分を確認しながら一瞬でロードして適用します。
            </li>
            <li>
              <strong className="text-slate-300 font-bold">B. AI検索連動同期（要APIキー）</strong>:
              Gemini AIが現在のリアルタイムなGoogle検索を通じて最新の公式発表や公開日変更スケジュールのアップデート、あらすじを入手し、ご自身のDBと差分を検証してスマートに同期します。
            </li>
          </ul>
        </div>

      </div>

      {/* Troubleshooting & Gemini Config API */}
      <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/40 space-y-5">
        <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          APIキーの設定とトラブルシューティング
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-400">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Gemini AI検索同期を有効化する手順：
            </h4>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                画面右上（または環境メニュー）の <strong className="text-slate-200">「Settings ➔ Secrets」</strong> パネルを開きます。
              </li>
              <li>
                変数名 <code className="px-1 py-0.5 rounded bg-slate-950 font-mono text-emerald-400 text-[10px]">GEMINI_API_KEY</code> に取得したGoogleのGemini APIキーの値を設定して保存します。
              </li>
              <li>
                保存後、データベース管理画面より「最新情報をAI検索同期」ボタンをクリックするだけで動作します。
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              ローカルストレージとデータ：
            </h4>
            <p className="text-slate-450">
              このアプリに入力したデータ、鑑賞状況判定、レビュー感想、マイカスタムデータベースは、お使いのブラウザの <strong className="text-slate-300">Local Storage</strong> に完全プライベートな形で永続保存されます。
              外部サーバーへ勝手に送信されることはありませんのでご安心ください。ブラウザのキャッシュを完全消去するとリセットされますので、作成したオリジナルDBは適宜ダウンロード保存（JSON）することを推奨いたします。
            </p>
          </div>
        </div>
      </div>

      {/* Contact Footer */}
      <div className="text-center py-4 border-t border-slate-850">
        <p className="text-[10px] text-slate-550 font-mono flex items-center justify-center gap-1.5 leading-none">
          <span>Marvel Cinematic Universe Fans Tracker Customizer &copy; 2026</span>
          <span>•</span>
          <span className="flex items-center text-slate-400">
            Happy Watching!
            <Flame className="w-3 h-3 text-red-600 ml-1" />
          </span>
        </p>
      </div>

    </div>
  );
}
