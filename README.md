# クラフトファニチャー コーポレートサイト

株式会社クラフトファニチャーのコーポレートサイトです。

## ローカル環境での確認方法

### 1. 簡易サーバーの起動

#### Python 3を使用する場合（推奨）
```bash
# プロジェクトディレクトリに移動
cd C:\Users\shioz\iCloudDrive\portfolio\craft-furniture

# Python 3のHTTPサーバーを起動
python -m http.server 8000

# ブラウザで以下にアクセス
http://localhost:8000
```

#### Python 2を使用する場合
```bash
cd C:\Users\shioz\iCloudDrive\portfolio\craft-furniture
python -m SimpleHTTPServer 8000
```

#### Node.jsのhttp-serverを使用する場合
```bash
# http-serverをグローバルインストール（初回のみ）
npm install -g http-server

# プロジェクトディレクトリに移動
cd C:\Users\shioz\iCloudDrive\portfolio\craft-furniture

# サーバー起動
http-server -p 8000

# ブラウザで以下にアクセス
http://localhost:8000
```

#### Live Serverを使用する場合（VS Code）
1. VS Code拡張機能「Live Server」をインストール
2. プロジェクトフォルダをVS Codeで開く
3. index.htmlを右クリック → "Open with Live Server"

### 2. ページ一覧

作成されたページは以下の通りです：

- **トップページ**: `http://localhost:8000/`
- **施工事例一覧**: `http://localhost:8000/works/`
- **施工事例詳細**: `http://localhost:8000/works/work-1.html`
- **見積もりシミュレーター**: `http://localhost:8000/simulator/`
- **職人紹介**: `http://localhost:8000/craftsmen/`
- **会社概要**: `http://localhost:8000/about/`
- **お問い合わせ**: `http://localhost:8000/contact/`
- **よくある質問**: `http://localhost:8000/faq/`

### 3. 動作確認のポイント

#### 基本機能
- [ ] レスポンシブデザイン（スマホ・タブレット・PC）
- [ ] ナビゲーションメニューの開閉
- [ ] 各ページへのリンク
- [ ] フッターリンクの動作

#### トップページ
- [ ] ヒーロースライダーの自動再生・手動操作
- [ ] 各セクションへのスクロール
- [ ] CTAボタンのリンク

#### 施工事例
- [ ] フィルター機能（カテゴリ・木材・価格帯）
- [ ] 検索機能
- [ ] ページネーション
- [ ] 詳細ページでの画像ギャラリー

#### 見積もりシミュレーター
- [ ] 家具タイプ選択によるサイズ制限変更
- [ ] リアルタイム価格計算
- [ ] 見積もり保存・お問い合わせ連携

#### お問い合わせフォーム
- [ ] フォームバリデーション
- [ ] 問い合わせ種別による項目の表示切替
- [ ] シミュレーターからの遷移時の自動入力

#### FAQ
- [ ] カテゴリフィルター
- [ ] 検索機能
- [ ] アコーディオンの開閉

### 4. 想定される問題と対処法

#### 画像が表示されない
- プレースホルダー画像のパスを確認
- 実際の画像ファイルが必要な場合は適宜追加

#### フォント読み込みエラー
- Google Fontsの読み込みでインターネット接続が必要
- オフラインでテストする場合はフォールバックフォントで表示

#### JavaScript機能が動作しない
- ブラウザの開発者ツールでコンソールエラーを確認
- HTTPSが必要な機能（位置情報等）は制限される場合があります

### 5. ブラウザ対応

#### 推奨ブラウザ
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### 確認項目
- CSS Grid/Flexboxの表示
- ES6 JavaScript機能
- モダンCSS機能（CSS Variables等）

### 6. 開発時の注意事項

#### ファイル構造
```
craft-furniture/
├── index.html              # トップページ
├── assets/                 # 共通リソース
│   ├── css/               # スタイルシート
│   ├── js/                # JavaScript
│   └── images/            # 画像（プレースホルダー）
├── works/                 # 施工事例
├── simulator/             # 見積もりシミュレーター
├── craftsmen/             # 職人紹介
├── about/                 # 会社概要
├── contact/               # お問い合わせ
├── faq/                   # よくある質問
└── README.md              # このファイル
```

#### 実装済み機能
- レスポンシブデザイン
- 動的フィルタリング・検索
- フォームバリデーション
- ローカルストレージ活用
- アクセシビリティ対応
- SEO最適化（構造化データ）

### 7. 本番環境への移行

#### 必要な作業
1. 実際の画像ファイルの配置
2. Google Fontsの最適化
3. 画像の最適化（WebP変換等）
4. Contact Form 7等の実装（WordPress化時）
5. Google AnalyticsやGoogle Tag Managerの設置

#### パフォーマンス最適化
- 画像の遅延読み込み実装済み
- CSS・JavaScriptの分割構成
- CDN利用の準備完了

## トラブルシューティング

問題が発生した場合は、以下をご確認ください：

1. **サーバーが正常に起動しているか**
2. **ブラウザのキャッシュをクリア**
3. **開発者ツールでエラーを確認**
4. **ファイルパスが正しいか**

---

## 連絡先

技術的な質問やカスタマイズのご相談は、開発者までお気軽にお問い合わせください。