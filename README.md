# MCU鑑賞ガイド ＆ 時系列トラッカー (Marvel Cinematic Universe Watch Guide)

マーベル・シネマティック・ユニバース（MCU）の映画・ドラマ・特別編を、**「公開順（Release Order）」** または **「劇中時系列（Chronological Order）」** でスムーズに鑑賞整理し、感想や重要度をチェックしながら進捗管理できるWebアプリケーションです。

---

## 🌟 主な機能と特徴

1. **Phase 1〜Phase 6 完全網羅 (全66作品以上)**
   - 2008年『アイアンマン』から最新作『アベンジャーズ：ドゥームズデイ』『アベンジャーズ：シークレット・ウォーズ』『キャプテン・アメリカ：ブレイブ・ニュー・ワールド』『サンダーボルツ*』『ファンタスティック・フォー：ファースト・ステップス』まで最新データをカバー。

2. **2通りのソート切り替え**
   - **公開順（Release Order）**: 劇場公開・配信リリースされた順番で鑑賞したい方向け。
   - **劇中時系列（Chronological Order）**: 『キャプテン・アメリカ/ザ・ファースト・アベンジャー』や『キャプテン・マーベル』など、物語の中の年代順で観たい方向け。

3. **高度なフィルタリング＆キャラクター相関**
   - 映画 / ドラマの種別絞り込み
   - Phase 1〜6 絞り込み
   - 重要度 (必須★★★ / 推奨★★ / 補足★) 絞り込み
   - 鑑賞済み / 未鑑賞 / お気に入り（♥） 絞り込み
   - キャラクター（アイアンマン、キャプテン・アメリカ、スパイダーマン、ロキ、デッドプール等）での出演作品ピックアップ

4. **マイ感想・レビューメモ＆★1〜5評価**
   - 作品ごとの鑑賞チェック、星評価、鑑賞日の記録、メモ入力機能。
   - 感想記入済み作品だけを集めて一括閲覧できる「マイ感想・メモ」タブを搭載。

5. **データの永続化 ＆ エクスポート / インポート**
   - お使いのブラウザ（LocalStorage）に記録を完全保存。
   - バックアップ用JSONファイルとして保存・読み込み可能（端末間の移行も簡単）。

6. **Gemini AI ＆ Google Search Grounding 同期機能**
   - サーバーサイドの Gemini 2.5 Flash API と Google 検索グラウンディングを利用して、Web上の最新MCUスケジュール・あらすじを自動収集・同期できます。
   - オフライン環境でも使える「公式プリセット同期」にも対応。

---

## 🚀 開発環境の起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (Express + Vite)
npm run dev

# 型チェックとビルド
npm run lint
npm run build
```

---

## 📂 ディレクトリ構成

- `/src/App.tsx`: メインダッシュボードコンポーネント
- `/src/mcuData.ts`: MCU全66作品のマスターデータ
- `/src/mcuExtraData.ts`: 登場キャラクター＆テーマのマスターデータ
- `/src/types.ts`: TypeScriptの型定義
- `/src/components/`:
  - `McuCard.tsx`: 各作品のカードコンポーネント
  - `DetailModal.tsx`: あらすじ・感想・キャラクター相関モーダル
  - `StatsSection.tsx`: 進捗状況・フェーズ別統計グラフ
  - `DatabaseAdmin.tsx`: MCUデータベース編集・同期・インポート/エクスポート
  - `HelpPage.tsx`: アプリの使い方＆ヘルプガイド
- `/server.ts`: Express サーバー ＆ Gemini API 検索エンドポイント

---

## 🛡️ ライセンス

Marvel, MCU, and all related characters and titles are trademarks of Marvel Entertainment, LLC and Walt Disney Company. This project is a non-commercial fan tool.
