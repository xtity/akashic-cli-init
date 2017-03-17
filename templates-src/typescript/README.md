# typescript-game-sample

**typescript-game-sample**はTypeScriptでAkashicのゲームを作る際のサンプルプロジェクトです。

## ビルド方法

ビルドにはNode.jsが必要です。


初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `typescript-game-sample` を新しく生成するごとに必要です。

```sh
npm install
```

`typescript-game-sample` は `npm run build` によりgulpを使ってビルドできます。

`src` ディレクトリ以下のTypeScriptファイルがコンパイルされ、`game/script` ディレクトリ以下にJavaScriptファイルが生成されます。

`npm run build` は自動的に `akashic-cli scan asset script` を実行するので、`game/game.json` の更新が行われます。

```sh
npm run build
```

## テスト方法

1. [TSLint](https://github.com/palantir/tslint "TSLint")を使ったLint
2. [Jasmine](http://jasmine.github.io "Jasmine")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

テストコードのサンプルとして `spec/testSpec.js` を用意していますので参考にしてテストコードを記述して下さい。

## 実行方法

以下のどちらかを実行後、ブラウザで `http://localhost:3000/game/` にアクセスすることでゲームを実行できます。

* `npm install -g @akashic/akashic-sandbox` 後、 `game` ディレクトリで `akashic-sandbox`

* `npm start`

# TypeScriptライブラリ利用時の注意

ゲームにTypeScriptライブラリを利用する場合、このディレクトリで `npm install --save package_name` を実行した後、game/以下で `akashic-cli install package_name` する必要があります。
