const CORRECT_PASSWORD = "your_secret_password"; // ★設定したパスワード

function checkPassword() {
    // 1. すでに認証済みかチェック
    if (sessionStorage.getItem('authenticated') === 'true') {
        return; // 認証済みなら何もしない
    }

    // 2. 認証が必要な場合の処理
    const user_input = prompt("このサイトはポートフォリオとして非公開設定です。閲覧用のパスワードを入力してください。");

    if (user_input === null || user_input !== CORRECT_PASSWORD) {
        // パスワードが間違っている場合の処理 (現在のコードと同じ)
        document.documentElement.innerHTML = `
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: sans-serif;
                background-color: #333;
                color: white;
                text-align: center;
            }
    </style>
        <div>
            <h1>Access Denied (アクセス拒否)</h1>
            <p>パスワードが正しくありません。制作者の指示がない限り閲覧できません。</p>
        </div>
        `;
        return false;
    }

    // 3. 認証に成功した場合
    sessionStorage.setItem('authenticated', 'true'); // セッションに認証成功を記録
    return true;
}

// 関数の実行を指示
checkPassword();
