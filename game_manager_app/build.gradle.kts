plugins {
    // KotlinをWeb（JavaScript）としてビルドするためのプラグイン
    kotlin("js") version "1.9.22" 
    
    // アプリケーション（実行可能ファイル）としてビルドするためのプラグイン
    application
}

// アプリケーション全体の設定
group = "com.yourname.gameapp" // あなたのアプリのID（Capacitorで設定したものと同様）
version = "1.0-SNAPSHOT"

// リポジトリ（外部ライブラリをどこからダウンロードするか）の設定
repositories {
    mavenCentral()
}

// 依存関係（プロジェクトが必要とするライブラリ）の設定
dependencies {
    // Kotlinの標準ライブラリ
    implementation(kotlin("stdlib-js")) 
}

// Kotlin/JS固有の設定
kotlin {
    js(IR) { // IR: 最新のKotlin/JSコンパイラバックエンドを使用
        browser {
            // Webブラウザで実行可能にするための設定
        }
        binaries.executable() // 実行可能なJavaScriptファイルを生成
    }
}

// Webサーバーを使わずに、出力されたJavaScriptファイルをHTMLから直接読み込めるようにする設定
tasks.named<org.gradle.api.tasks.Delete>("clean") {
    delete(rootProject.buildDir)
}

// 実行可能ファイルが生成される場所のショートカット (wwwフォルダから参照しやすくするため)
val jsOutputFolder = project.layout.buildDirectory.dir("distributions")
