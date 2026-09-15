# Mine

ふたりでつくる、旅と思い出の地図。

Mineは、カップルで訪れた場所と写真を日本地図から振り返る、プライベートな旅行アルバムです。現在はPhase 1（プロジェクト基盤）まで実装済みです。

## Current state

- Next.js App RouterとTypeScript strict mode
- Tailwind CSS 4とMineのデザイントークン
- Zodによるサーバー環境変数の検証基盤
- VitestとPlaywrightのテスト基盤
- ESLint、Prettier、TypeScript、本番ビルドを検査するCI
- `GET /api/health` ヘルスエンドポイント

データベース、認証、旅行機能は後続Phaseで追加します。全体計画は[`docs/architecture-plan.md`](docs/architecture-plan.md)を参照してください。

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
cp .env.example .env.local
pnpm dev
```

Windows PowerShellでは、環境変数ファイルを次のように作成できます。

```powershell
Copy-Item .env.example .env.local
```

ブラウザで`http://localhost:3000`を開きます。ヘルスチェックは`http://localhost:3000/api/health`です。

Phase 1では外部サービスを使わないため、`.env.local`がなくても開発サーバーと本番ビルドは動作します。

## Commands

```bash
pnpm dev          # 開発サーバー
pnpm build        # 本番ビルド
pnpm start        # 本番サーバー
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm test         # Vitest
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
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `MINE_ALLOWED_EMAILS`
- `MINE_ALBUM_SLUG`
- `BLOB_READ_WRITE_TOKEN`

## Architecture

ルートファイルはページ構成に集中させ、機能固有コードは`src/features`、全体共有UIは`src/components`、インフラ接続は`src/lib`へ配置します。ディレクトリは実際に必要になったPhaseで作成します。

## Roadmap

次はPhase 2として、PostgreSQL、Prisma、47都道府県のseed、repository境界を実装します。
