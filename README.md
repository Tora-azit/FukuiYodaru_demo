# 配車管理システム プロトタイプ

物流会社向けの配車管理システムUIプロトタイプです。
バックエンドを持たないフロントエンド完結型のデモアプリケーションとして構築されています。

## 機能概要

### 1. Multi-Day Dispatch Board（複数日配車ボード）

- **横軸**: 日付列（5日間表示）
- **縦軸**: 各日の便（ルート）
- **ドラッグ＆ドロップ**: 未配車→便、便→便、便→未配車の移動
- **積載率表示**: リアルタイム計算、過積載時は赤色警告

### 2. 配達日報プレビュー

- 伝統的な日本の帳票スタイル（明朝体）
- A4横向き印刷対応
- ドライバーごとのグループ化と小計表示
- 承認・確認・担当の印鑑欄

### 3. 配送指示書プレビュー

- ドライバー携帯用（A4縦向き）
- 配送先リスト（時間・得意先・品名・数量・重量）
- 特記事項のハイライト表示
- 現場カルテ/地図エリア
- 出発・帰着時刻、確認印欄

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| ドラッグ＆ドロップ | @hello-pangea/dnd |
| アイコン | Lucide React |

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

開発サーバー起動後、ブラウザで http://localhost:3000 を開いてください。

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx                    # メインページ
│   ├── report/
│   │   ├── daily/page.tsx          # 配達日報
│   │   └── instruction/[routeId]/  # 配送指示書
│   ├── globals.css                 # グローバルCSS
│   └── layout.tsx
├── components/
│   ├── dispatch/                   # 配車ボード関連
│   │   ├── DispatchBoard.tsx       # メインボード
│   │   ├── DayColumn.tsx           # 日付列
│   │   ├── RouteContainer.tsx      # 便コンテナ
│   │   ├── OrderCard.tsx           # 注文カード
│   │   ├── UnassignedPanel.tsx     # 未配車パネル
│   │   └── Header.tsx              # ヘッダー
│   └── ui/                         # shadcn/ui
└── data/
    └── mockData.ts                 # モックデータ
```

## デザインコンセプト

**Modern Industrial（信頼感・堅実・高密度）**

- Primary: Deep Navy Blue (`slate-900`)
- Background: Muted Gray (`slate-50`)
- Accent: Conservative Blue (`blue-600`)
- 高密度UI: `text-xs`, `text-sm` を基本に使用
- 明確な境界線: `border-gray-300`

## 使い方

1. **配車操作**: 左パネルの未配車一覧から、右側の便にカードをドラッグ＆ドロップ
2. **配達日報**: ヘッダーの「配達日報プレビュー」ボタンをクリック
3. **配送指示書**: 各便ヘッダーの紙アイコンをクリック

## ライセンス

プライベートプロジェクト
