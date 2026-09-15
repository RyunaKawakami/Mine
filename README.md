# Mine

ふたりでつくる、旅と思い出の地図。

Mineは、カップルで訪れた場所と写真を日本地図から振り返る、プライベートな旅行アルバムです。現在は、外部サービスなし・完全無料で主要機能を体験できるブラウザローカル版です。

## Current state

- Next.js App RouterとTypeScript strict mode
- Tailwind CSS 4とMineのデザイントークン
- Zodによるサーバー環境変数の検証基盤
- VitestとPlaywrightのテスト基盤
- ESLint、Prettier、TypeScript、本番ビルドを検査するCI
- `GET /api/health` ヘルスエンドポイント
- デモログインとレスポンシブナビゲーション
- 旅行の追加・表示・編集・削除
- 47都道府県の操作可能な地図と都道府県別ページ
- スポットの追加・編集・削除
- 端末内の写真追加、キャプション編集、ギャラリー
- 思い出タイムラインとプロフィール統計
- ローディング、空表示、エラー、Not Found表示
- Prisma/Auth.jsの本番向け基盤（接続は任意・現在は未使用）

## Requirements

- Node.js 24以上
- pnpm 10.34.5

## Cost policy

Mineは、MVPの開発・運用ともに0円を必須条件とします。

- 有料プラン、従量課金、課金トライアル、独自ドメインは利用しません。
- Vercel Hobby、Neon Free、Vercel BlobのHobby無料枠のみを利用します。
- 無料枠を超えた場合は機能停止を許容し、自動的な有料継続は行いません。
- 外部サービスが請求情報やBillingの有効化を求めた場合、その設定を中止します。
- 外部サービスを接続する直前に、公式の料金と無料枠を再確認します。

pnpmがまだ有効でない環境ではCorepackを利用できます。

```bash
corepack prepare pnpm@10.34.5 --activate
corepack enable pnpm
```

管理者権限の都合でshimを作れない場合は、以下のコマンド中の`pnpm`を`corepack pnpm`に置き換えてください。

## Getting started

```bash
pnpm install
pnpm dev
```

Windows PowerShellでは、環境変数ファイルを次のように作成できます。

```powershell
Copy-Item .env.example .env.local
```

ブラウザで`http://localhost:3000`を開き、「デモをはじめる」を押してください。`.env.local`、データベース、Googleアカウントは不要です。ヘルスチェックは`http://localhost:3000/api/health`です。

デモの旅行・スポット・写真はブラウザの`localStorage`だけに保存され、外部へ送信されません。プロフィール画面から初期サンプルへ戻せます。ブラウザの保存容量を考慮し、写真は1枚1.5MB以下・1旅行12枚までです。

## Optional production infrastructure (deferred)

以下は将来、本番用ログインと複数端末同期が必要になった場合だけ使う任意設定です。現在のデモには不要です。

## Free database setup

1. [Neon](https://neon.com/)でカード登録不要のFreeプランを選び、PostgreSQLプロジェクトを1つ作成します。
2. pooled接続URLを`DATABASE_URL`、direct接続URLを`DIRECT_URL`として`.env.local`へ設定します。
3. 初期migrationとseedを適用します。

```bash
pnpm db:deploy
pnpm db:seed
```

seedはupsert方式なので、安全に再実行できます。

## Free Google OAuth setup (deferred)

1. Google Cloud Consoleでプロジェクトと「ウェブアプリケーション」OAuthクライアントを作成します。
2. 承認済みJavaScript生成元に`http://localhost:3000`を追加します。
3. 承認済みリダイレクトURIに`http://localhost:3000/api/auth/callback/google`を追加します。
4. Client IDとClient Secretを`AUTH_GOOGLE_ID`、`AUTH_GOOGLE_SECRET`へ設定します。
5. ランダムな`AUTH_SECRET`と、利用する2つのメールアドレスを設定します。

```dotenv
AUTH_SECRET=32バイト以上のランダムな値
MINE_ALLOWED_EMAILS=user-a@example.com,user-b@example.com
MINE_ALBUM_SLUG=mine
```

課金対象APIは有効化しません。Google側でBillingの有効化を求められた場合は、その設定を中止してください。

## Commands

```bash
pnpm dev          # 開発サーバー
pnpm build        # 本番ビルド
pnpm start        # 本番サーバー
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm test         # Vitest
pnpm test:integration # TEST_DATABASE_URLを使うDB統合テスト
pnpm test:e2e     # Playwright（事前にブラウザー導入が必要）
pnpm format       # Prettierで整形
pnpm check        # lint・型・unit test・formatを一括検査
```

Playwrightのブラウザーは必要になった時点で導入します。

```bash
pnpm exec playwright install chromium
```

## Environment variables

変数一覧と例は[`.env.example`](.env.example)にあります。秘密情報を含む`.env.local`などはGitへコミットしないでください。

Phase 2以降で使用する主な変数:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `MINE_ALLOWED_EMAILS`
- `MINE_ALBUM_SLUG`
- `BLOB_READ_WRITE_TOKEN`

## Architecture

ルートファイルはページ構成に集中させ、機能固有コードは`src/features`、全体共有UIは`src/components`、インフラ接続は`src/lib`へ配置します。ディレクトリは実際に必要になったPhaseで作成します。

## Demo limitations

- デモログインは本人確認を行わず、画面遷移を確認するためのものです。
- データは現在のブラウザだけに保存され、別端末とは同期されません。
- ブラウザデータを削除すると登録内容も消えます。
- 地図はライセンス不要の都道府県タイル表現です。正式な地理SVGは後回しです。
- 本番公開前にAuth.js、PostgreSQL、非公開画像ストレージを再接続し、セキュリティテストを行います。

## Roadmap

Phase 4〜14の主要UXをデモ実装済みです。今後は実運用を決めた時点で、本番認証・永続DB・非公開ストレージへの置き換えを行います。
