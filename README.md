# bolt-diy-test-todo-app

## 起動方法

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/bolt-diy-test-todo-app.git
cd bolt-diy-test-todo-app
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. .env ファイルの作成
1. `.env.example` の内容をコピーして新しい `.env` ファイルを作成
2. Supabase の資格情報をプレースホルダー値に置き換えてください
3. クライアントサイドコードに実際の資格情報を公開しないでください

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 環境変数
`.env.example` ファイルを作成し、以下のプレースホルダーを設定してください:
```
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 注意点
- いつも環境変数で敏感なデータを使用してください
- 実際の Supabase 資格情報をバージョン管理にコミットしないでください
- 開発サーバーは変更を検知して自動的に再起動します
