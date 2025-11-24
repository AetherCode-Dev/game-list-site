import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@JsExport
val myCharacter = Player(name = "勇者", gold = 100)

// data class ではなく、通常の class に変更
@JsExport
class Player(
    val name: String,
    var currentHP: Int = 100,       // 現在HP
    var maxHP: Int = 100,           // 最大HP
    var gold: Int = 0,              // 所持金
    var level: Int = 1,              
    var currentStress: Int = 50     // ストレス
) {
    // ★★★ Playerの処理（関数）をクラスの中に移動 ★★★
    @JsExport
    fun receiveDamage(damage: Int) {
        this.currentHP -= damage // this. はこのクラスの変数を指す
        
        if (this.currentHP < 0) {
            this.currentHP = 0
        }
    }
    
    @JsExport
    fun gainGold(amount: Int) {
        this.gold += amount
    }
    
    // 現在のHPを文字列で返す関数 (JavaScriptに結果を渡しやすい)
    @JsExport
    fun getHPStatus(): String {
        return "$currentHP / $maxHP"
    }
}
// Questのデータクラスを定義したもの
@JsExport   //不要でもよい
data class Quest(
    val title: String,            // クエスト名
    var isCompleted: Boolean = false, // 完了したかどうか
    val rewardGold: Int = 50,      // 報酬のゴールド
    val difficulty: Int = 1,        // 難易度（経験値や報酬に影響）
    val stressGain: Int = 10        // 完了時に得るストレス値
)

// プレイヤーデータをシングルトン（アプリ全体で一つ）として初期化
val myCharacter = Player(name = "Porto", gold = 100) 

// 実際のプラグイン窓口となるクラス
@CapacitorPlugin(name = "MyLogic")
class MyLogicPlugin : Plugin() {

    // JavaScriptから 'receiveDamage' で呼び出される関数
    @PluginMethod
    fun receiveDamage(call: PluginCall) {
        // 1. JSから渡された引数（ダメージ量）を取得
        val damage = call.getInt("damage") ?: 0 

        // 2. Kotlinロジックを実行
        myCharacter.receiveDamage(damage)

        // 3. 処理後のデータをJSに返す（HPの更新）
        val ret = JSObject()
        ret.put("currentHP", myCharacter.currentHP)
        ret.put("maxHP", myCharacter.maxHP)
        
        call.resolve(ret)
    }

    // JSから 'getHPStatus' で呼び出される関数
    @PluginMethod
    fun getHPStatus(call: PluginCall) {
        val ret = JSObject()
        ret.put("currentHP", myCharacter.currentHP)
        ret.put("maxHP", myCharacter.maxHP)
        call.resolve(ret)
    }
}

// 処理の定義：クエストを完了させ、報酬を付与する関数
@JsExport
fun completeQuest(player: Player, quest: Quest): Boolean {
    // 1. クエストがすでに完了しているか確認（二重報酬の防止）
    if (quest.isCompleted) {
        println("${quest.title} はすでに完了しています。")
        return false // 処理を中断
    }
    
    // 2. 報酬をプレイヤーに付与する
    player.gold += quest.rewardGold
    
    // 3. クエストの状態を「完了済み」に変更する
    quest.isCompleted = true
    
    println("${quest.title} を完了しました！報酬として ${quest.rewardGold} Gを獲得。")
    return true // 処理が成功したことを返す
}
fun main() {
    
}
