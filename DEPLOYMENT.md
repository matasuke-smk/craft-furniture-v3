# クラフトファニチャー ウェブサイト - デプロイメントガイド

## プロジェクト概要

クラフトファニチャーのコーポレートサイト（リニューアル版）  
**完成日**: 2024年1月  
**公開予定**: 2025年3月末（4月の住宅展示場イベント前）

## ファイル構成

### 📁 完成したページ一覧

#### 🏠 メインページ
- ✅ `index.html` - トップページ（ヒーロースライダー、Instagram連携）
- ✅ `about/index.html` - 会社概要
- ✅ `contact/index.html` - お問い合わせ

#### 🛠️ サービスページ
- ✅ `works/index.html` - 施工事例一覧（フィルター機能付き）
- ✅ `works/work-1.html` - 施工事例詳細（サンプル）
- ✅ `craftsmen/index.html` - 職人紹介（3名、1名顔出しNG対応）
- ✅ `process/index.html` - 製作工程
- ✅ `simulator/index.html` - 見積もりシミュレーター（板厚対応）
- ✅ `wood-guide/index.html` - 木材図鑑
- ✅ `voice/index.html` - お客様の声
- ✅ `flow/index.html` - 納品までの流れ
- ✅ `delivery/index.html` - 納品エリア（配送料金表）
- ✅ `showroom/index.html` - ショールーム案内（予約システム）
- ✅ `faq/index.html` - よくある質問

#### 📰 情報ページ
- ✅ `news/index.html` - お知らせ一覧（フィルター機能付き）
- ✅ `news/exhibition-2024.html` - お知らせ詳細（展示会サンプル）
- ✅ `privacy/index.html` - プライバシーポリシー

### 📁 アセットファイル

#### 🎨 CSS ファイル
- `assets/css/reset.css` - リセットCSS
- `assets/css/variables.css` - CSS変数定義
- `assets/css/typography.css` - タイポグラフィ
- `assets/css/common.css` - 共通スタイル
- `assets/css/header.css` - ヘッダー
- `assets/css/footer.css` - フッター
- `assets/css/critical.css` - **新規** クリティカルパス最適化
- `assets/css/[page-name].css` - 各ページ専用CSS

#### ⚡ JavaScript ファイル
- `assets/js/common.js` - 共通機能
- `assets/js/performance.js` - **新規** パフォーマンス最適化
- `assets/js/[page-name].js` - 各ページ専用JS

#### 🖼️ 画像ディレクトリ（要準備）
```
assets/images/
├── hero/               # ヒーロー画像（5枚）
├── works/              # 施工事例写真（30枚以上）
├── craftsmen/          # 職人写真（2名 + 手元写真）
├── process/            # 製作工程写真
├── wood/               # 木材サンプル写真
├── showroom/           # ショールーム写真（5枚）
├── news/               # ニュース用画像
├── delivery/           # 配送・設置写真
└── common/             # ロゴ、アイコン等
```

## デプロイ前チェックリスト

### 🔍 コンテンツ確認

#### 必須画像ファイル
- [ ] ヒーロースライダー用画像（5枚、各1920×1080px以上）
- [ ] 施工事例写真（30枚以上、高解像度）
- [ ] 職人写真（田中職人、山田職人の顔写真 + K.S職人の手元写真）
- [ ] ショールーム写真（5枚）
- [ ] 木材サンプル写真（オーク、ウォールナット、チェリー、メープル）
- [ ] 製作工程写真（各工程3-4枚）
- [ ] 会社ロゴ（PNG、SVG両方）

#### テキストコンテンツ
- [ ] 会社概要の最終確認
- [ ] 職人プロフィールのメッセージ（各300文字）
- [ ] 施工事例のお客様コメント
- [ ] 木材説明文の専門用語チェック

### 🛠️ 技術チェック

#### パフォーマンス
- [ ] 画像の最適化（WebP形式推奨）
- [ ] CSSの最小化
- [ ] JavaScriptの最適化
- [ ] フォントの最適化

#### 機能テスト
- [ ] フォーム送信テスト（お問い合わせ、ショールーム予約）
- [ ] 見積もりシミュレーター動作確認
- [ ] フィルター機能動作確認（施工事例、お知らせ）
- [ ] レスポンシブデザイン確認（スマホ、タブレット）
- [ ] ブラウザ互換性確認（Chrome、Safari、Firefox、Edge）

#### SEO・メタデータ
- [ ] 各ページのtitle、descriptionの設定
- [ ] Open Graph画像の設定
- [ ] 構造化データの確認
- [ ] robots.txtの配置
- [ ] サイトマップXMLの生成

### 📱 モバイル対応確認
- [ ] タッチ操作の確認
- [ ] 表示速度の確認（3G環境想定）
- [ ] Instagram連携の動作確認
- [ ] 電話番号リンクの動作確認

## サーバー設定

### 推奨サーバー仕様
- **サーバー**: エックスサーバー ビジネスプラン（推奨）
- **PHP**: 8.0以上（将来のWordPress化対応）
- **SSL**: 必須（Let's Encrypt推奨）
- **ドメイン**: craft-furniture.jp

### .htaccessの設定例
```apache
# Enable Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    
    # Images
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options nosniff
    Header set X-Frame-Options DENY
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.craft-furniture\.jp [NC]
RewriteRule ^(.*)$ https://craft-furniture.jp/$1 [L,R=301]
```

## パフォーマンス最適化

### 実装済み最適化
- ✅ クリティカルCSS（above the fold）
- ✅ 遅延読み込み（画像、非クリティカルCSS/JS）
- ✅ リソースプリロード
- ✅ フォント最適化
- ✅ エラートラッキング

### 推奨追加最適化
- CDN導入（CloudFlare推奨）
- Service Workerの有効化
- 画像の次世代フォーマット対応（AVIF）

## Google Analytics・Search Console設定

### Google Analytics 4 (GA4)
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Search Console
- サイトマップの登録: `https://craft-furniture.jp/sitemap.xml`
- 所有権の確認
- ローカルビジネス情報の設定

## 定期メンテナンス

### 月次作業
- [ ] 施工事例の追加（2-3件）
- [ ] お知らせの更新
- [ ] お客様の声の追加
- [ ] Instagram連携の確認

### 四半期作業
- [ ] パフォーマンスの確認・改善
- [ ] セキュリティアップデート
- [ ] リンクチェック実行
- [ ] アクセス解析レポート作成

### 年次作業
- [ ] SSL証明書の更新確認
- [ ] 法的要件の確認（プライバシーポリシー等）
- [ ] デザインの見直し検討

## 緊急時対応

### 障害発生時
1. 問題の特定と影響範囲の確認
2. バックアップからの復旧
3. 関係者への報告
4. 原因調査と再発防止策の実施

### 連絡先
- **技術担当**: [エンジニアの連絡先]
- **サーバー管理**: エックスサーバーサポート
- **ドメイン管理**: [ドメイン管理会社]

## 追加開発・機能拡張

### Phase 2 (WordPress化)
- CMS導入による更新性向上
- 管理画面の日本語化
- 施工事例の簡単追加機能
- お知らせの予約投稿機能

### Phase 3 (機能追加)
- オンライン商談予約システム
- 3D家具プレビュー機能
- 会員システム
- メルマガ配信システム

---

**最終更新**: 2024年1月  
**作成者**: [担当エンジニア名]  
**承認者**: 木村拓哉（営業部長）