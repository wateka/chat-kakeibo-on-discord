# Discord 家計簿

このプロジェクトは、Discord bot を利用して出費を管理できる家計簿ツールです。

[Cloudflare Workers](https://www.cloudflare.com/ja-jp/developer-platform/workers/) + [D1](https://www.cloudflare.com/ja-jp/developer-platform/d1/) を使用して動作します。
フレームワークには [Hono](https://hono.dev/) を採用しています。

## 使い方

Discord のアプリケーションコマンドを使って出費管理ができます。

### 出費記録を登録

```txt
/expense-add item:お菓子 price:300 category:food-snack date:2024-10-01
```

`date` は任意項目です。
カテゴリは [`src/config/categories.ts`](./src/config/categories.ts) で定義されており、自由に変更可能です。

### 出費記録を確認

```txt
/expense-list
```

実行すると、以下のようなリストが表示されます。

絵文字は出費のカテゴリを表しており、その設定も [`src/config/categories.ts`](./src/config/categories.ts) で行えます。
リストの左端に表示される ID (`[]`の中の数字) は、[記録を削除する際](#記録を削除する)に使用します。

```txt
[   1] 10/ 1 火 🍿お菓子　　　　　　　　　 ¥  300
[   2] 10/ 1 火 🎸ギターの機材　　　　　　 ¥ 4980
[   3] 10/ 1 火 🍱お弁当　　　　　　　　　 ¥  500
```

### 出費の統計を確認

```txt
/expense-stat
```

実行すると、以下のようにカテゴリごとの統計が表示されます。

```txt
食費　　　　　　　　　　  ¥   800
　　　🍱昼ご飯　　　　　 (¥   500)
　　　🍿軽食　　　　　　 (¥   300)
趣味費　　　　　　　　　  ¥  4980
　　　🎸機材系　　　　　 (¥  4980)

合計　　　　　　　　　　  ¥  5780
```

### 記録を削除する

[出費記録一覧](#出費記録を確認) から確認できる ID を指定して、記録を削除します。

```txt
/expense-delete id:3
```

記録を修正したい場合は、一度削除してから、新たに記録を作成し直してください。

## デプロイ方法

1. `wrangler.toml.example` を参考に `wrangler.toml` を作成します
    - Cloudflare D1 のデータベースを作成し、その情報を記述してください
2. `.dev.vars` ファイルを作成し、Discord の環境変数を書き込みます

    ```txt
    DISCORD_TOKEN = <TOKEN>
    DISCORD_APPLICATION_ID = <APPLICATION_ID>
    DISCORD_PUBLIC_KEY = <PUBLIC_KEY>
    ```

    - Discord Developers Portal でアプリケーションを作成し、その情報を記述してください
3. `bun run command-register` で、Discord アプリケーションコマンドを登録します
4. `bun run migration-apply` で、DBのマイグレーションを行います
5. `bun run deploy` で、wrangler を使って Cloudflare Workers にアプリケーションをデプロイします

## 開発について

### 技術スタック

- Discord API
- Cloudflare Workers (実行環境)
- Cloudflare D1 (データベース)
- Hono (フレームワーク)
- Prisma (ORM)

### パッケージマネージャとスクリプト

パッケージマネージャには `bun` を使用しています。`bun install` で必要なライブラリをインストールできます。

- `bun run deploy`: Cloudflare Workers を使ってデプロイします
- `bun run command-list`: Discord アプリケーションコマンドの一覧を表示します
- `bun run command-register`: Discord アプリケーションコマンドを登録します
- `bun run command-unregister`: Discord アプリケーションコマンドを削除します
- `npx prisma generate`: Prisma のクライアントコードを生成します
- `bun run migration-create <message-kebab-case>`: マイグレーションファイルを作成します
- `bun run migration-generate <path-to-migration-file>`: Prisma のスキーマ変更を指定したファイルに書き出します
- `bun run migration-apply:local`: マイグレーションをローカルの D1 に反映します
- `bun run migration-apply:remote`: マイグレーションをリモートの D1 に反映します

## To-do

- [ ] `/expense-list`、`/expense-stat` コマンドに期間指定オプションを追加
- [ ] 予算管理機能

## 主に参考にした記事

- [Cloudflare Workers + HonoでDiscord botを作る際のポイント | Marginalia](https://blog.lacolaco.net/posts/discord-bot-cfworkers-hono/)
- [Discord Developer Portal — Documentation — Hosting on Cloudflare Workers](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers)
