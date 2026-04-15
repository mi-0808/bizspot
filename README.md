# BizSpot

BizSpot は、外出先で「今どこで作業するか」「今どんな人とつながるか」をすばやく決めるための、位置情報ベースのビジネス向けモバイル体験を作るプロジェクトです。

単なる店舗検索アプリではなく、`場所` と `人` の両方を現在地から見つけられることを目指しています。  
「作業できる場所を探したい」と「近くの人とつながりたい」を同じプロダクトの中で扱っているのが、このプロジェクトの特徴です。

## このプロジェクトで作ろうとしているもの

BizSpot は大きく 2 つの体験で構成されています。

### 1. Location

外出中のビジネスパーソンが、今いる場所の近くで作業しやすいスポットをすぐ見つけるための体験です。

- 地図から近くの候補を探せる
- 用途、価格帯、営業時間、Wi-Fi、電源などで絞り込める
- お気に入り、閲覧履歴、スポット評価を保存できる
- Google Places の情報と、ユーザー評価を組み合わせて「作業しやすさ」を見つけやすくする

### 2. Match

位置情報を起点に、近くにいるビジネスパーソンや今出ている募集を見つけるための体験です。

- 近くにいる人を距離順で見られる
- 「今から少し話したい」「壁打ちしたい」といった募集を一覧できる
- 将来的には、偶発的なビジネスマッチングやその場の相談を生みやすくすることを狙っている

## ひとことで言うと

BizSpot は、

`今いる場所を起点に、作業場所と出会いの両方を最短で探せるプロダクト`

を目指しているプロジェクトです。

## 現在できること

現時点では、以下のような基礎機能が実装されています。

- ランチャー画面から `Location` と `Match` の 2 つの体験に分岐
- 現在地を使った近隣スポット検索
- 地図表示と一覧表示の切り替え
- 条件検索による作業スポットの絞り込み
- スポット詳細、評価表示、スポットへのスコア投稿
- Google ログイン
- お気に入り、履歴の保存
- 現在地ベースで近い人や募集を見せる Match UI

一方で、`Match` はまだプロトタイプ色が強く、今後育てていく前提の領域です。README ではその点も伝わるようにしています。

## 想定ユーザー

- カフェ、コワーキング、図書館、貸し会議室などをすぐ探したい人
- 移動中に「どこで仕事するか」を短時間で決めたい人
- 近くにいる起業家、営業、マーケター、経営者などと気軽につながりたい人
- ちょっとした壁打ち、相談、雑談の相手を位置ベースで見つけたい人

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Auth.js (NextAuth v5 beta) + Google Sign-In
- Supabase
- Google Maps / Google Places API
- SWR

## セットアップ

### 1. 依存関係をインストール

```bash
npm install
```

### 2. 環境変数を設定

`.env.example` をもとに `.env.local` を作成します。

```bash
cp .env.example .env.local
```

最低限、以下の設定が必要です。

- `GOOGLE_PLACES_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `NEXTAUTH_URL`

### 3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと確認できます。

## ディレクトリの見どころ

- `app/`
  App Router のページと API ルート
- `components/bisspa/`
  Location 体験のメイン UI
- `components/location/`
  Match 体験のメイン UI
- `components/launcher/`
  入口となるランチャー UI
- `app/api/places/`
  Google Places を使ったスポット取得
- `app/api/favorites/`, `app/api/history/`, `app/api/spaces/*/scores`
  保存系 API
- `lib/google-places/`
  Google Places 連携
- `lib/supabase/`
  Supabase クライアント

## この README で伝えたいこと

このプロジェクトは「Next.js の練習用テンプレート」ではありません。  
BizSpot は、移動中のビジネス行動をもっと軽くするために、

- 今すぐ作業できる場所を探す
- 今つながれる相手を見つける

という 2 つの行動を、現在地からひと続きで扱えるようにすることを目指しています。

まだ発展途中ですが、何を作ろうとしているのかは明確です。  
`場所を探すプロダクト` と `人とつながるプロダクト` の間を埋めることが、BizSpot の中心テーマです。
