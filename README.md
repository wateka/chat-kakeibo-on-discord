# Discord 家計簿

家計簿をつけられる Discord bot です。

[Cloudflare Workers](https://www.cloudflare.com/ja-jp/developer-platform/workers/) + [D1](https://www.cloudflare.com/ja-jp/developer-platform/d1/) で動きます。
フレームワークに[Hono](https://hono.dev/) を使用しています。

## 使い方

Discord のアプリケーションコマンドを使って、出費管理ができます。

### 出費記録を登録

```txt
/expense-add item:お菓子 price:300 category:food-snack date:2024-10-01
```

date は optional です。
カテゴリは、[`src/config/categories.ts`](./src/config/categories.ts)で定義されており、自由に変更できます。

### 出費記録を見る

```txt
/expense-list
```

以下のように取得できます。

絵文字は出費のカテゴリを表します。絵文字の設定も[`src/config/categories.ts`](./src/config/categories.ts)で行えます。
一番左の列(`[]`の中の数字`)は、[記録の削除時](#記録を削除する)に指定する ID です。

```txt
[   1] 10/ 1 火 🍿お菓子　　　　　　　　　 ¥  300
[   2] 10/ 1 火 🎸ギターの機材　　　　　　 ¥ 4980
[   3] 10/ 1 火 🍱お弁当　　　　　　　　　 ¥  500
```

### 出費の統計情報を見る

```txt
/expense-stat
```

以下のように取得できます。

```txt
食費　　　　　　　　　　  ¥   800
　　　🍱昼ご飯　　　　　 (¥   500)
　　　🍿軽食　　　　　　 (¥   300)
趣味費　　　　　　　　　  ¥  4980
　　　🎸機材系　　　　　 (¥  4980)

合計　　　　　　　　　　  ¥  5780
```

### 記録を削除する

[出費記録一覧](#出費記録を見る)から確認できる ID を指定して、記録を削除します。

```txt
/expense-delete id:3
```

記録を修正したいときは、一度削除してから、もう一度新しく記録し直します。

## デプロイの方法

1. `wrangler.toml.example`を参考に、`wrangler.toml`を作成します
    - Cloudflare D1 のデータベースを作成し、その情報を記述してください
2. `.dev.vars`ファイルを作成し、Discordの環境変数を書き込みます

    ```txt
    DISCORD_TOKEN = <TOKEN>
    DISCORD_APPLICATION_ID = <APPLICATION_ID>
    DISCORD_PUBLIC_KEY = <PUBLIC_KEY>
    ```

    - Discord Developers Portal で アプリケーションを作成し、その情報を記述してください
3. `bun run command-register` で、Discord アプリケーションコマンドを登録します
4. `bun run migration-apply` で、DBのマイグレーションを行います
5. `bun run deploy` で、wranglerを使ってCloudflare Workersにアプリケーションをデプロイします

## 開発について

### 技術スタック

- Discord API
- Cloudflare Workers (実行環境)
- Cloudflare D1 (データベース)
- Hono (フレームワーク)
- Prisma (ORM)

### パッケージマネージャとスクリプト

パッケージマネージャには`bun`を使っています。
`bun install`で必要なライブラリをインストールできます。

- `bun run deploy`: Cloudflare workers を使ってデプロイします
- `bun run command-list`: Discord アプリケーションコマンドをの一覧を表示します
- `bun run command-register`: Discord アプリケーションコマンドを登録します
- `bun run command-register`: Discord アプリケーションコマンドを削除します
- `npx prisma generate`: Prisma のクライアントコードを生成
- `bun run migration-create <message-kebab-case>`: migrationファイルを作成
- `bun run migration-generate <path-to-migration-file>`: Prisma のスキーマの変更を、指定したファイルに書き出し
- `bun run migration-apply:local`: マイグレーションの内容をローカルのD1に反映
- `bun run migration-apply:remote`: マイグレーションの内容をリモートのD1に反映

## To-do

- [ ] `/expense-list`、`/expense-stat`コマンドに期間指定オプションの追加
- [ ] 予算管理機能

## 主に参考にした記事

- [Cloudflare Workers + HonoでDiscord botを作る際のポイント | Marginalia](https://blog.lacolaco.net/posts/discord-bot-cfworkers-hono/)
- [Discord Developer Portal — Documentation — Hosting on Cloudflare Workers](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers)
