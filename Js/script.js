// 【重要】ここに設定するパスワード（合言葉）を決めてください。
const CORRECT_PASSWORD = "uPck7BCdqrjx"; // ★★★★★ ここを変更 ★★★★★

// ユーザーにパスワードの入力を求める
const user_input = prompt("このサイトはポートフォリオとして非公開設定です。閲覧用のパスワードを入力してください。");

// 入力がキャンセルされた、またはパスワードが間違っていた場合
if (user_input === null || user_input !== CORRECT_PASSWORD) {
    // パスワードが間違っている、またはキャンセルされた場合は、ページの内容をすべて非表示にする
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
}
