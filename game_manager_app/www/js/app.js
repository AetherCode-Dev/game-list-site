//KotlinのデータをJs(ES6)で変換したもの（CodeConverterAI使用：二度と使わない）
class Player {
  constructor(name, currentHP = 100, maxHP = 100, gold = 0, level = 1, currentStress = 50) {
    this.name = name;
    this.currentHP = currentHP;
    this.maxHP = maxHP;
    this.gold = gold;
    this.level = level;
    this.currentStress = currentStress;
  }

  receiveDamage(damage) {
    this.currentHP -= damage;
    if (this.currentHP < 0) {
      this.currentHP = 0;
    }
  }

  gainGold(amount) {
    this.gold += amount;
  }

  getHPStatus() {
    return `${this.currentHP} / ${this.maxHP}`;
  }

  fullHeal() {
    this.currentHP = this.maxHP;
  }

  upgradeMaxHP(amount) {
    this.maxHP += amount; // 上限を増やす
    this.currentHP += amount; // 現在HPも同じ量だけ増やす（全回復効果）
  }
  spendGold(cost) {
    if (this.gold >= cost) {
        this.gold -= cost;
        return true; // 購入成功
    }
    return false; // ゴールド不足
  }
// ★★★ この部分を追加 ★★★
    healHP(amount) {
        // 現在のHPに回復量を加算する
        this.currentHP += amount; 

        // HPが上限を超えないように制限をかける
        if (this.currentHP > this.maxHP) {
            this.currentHP = this.maxHP;
        }
    }
}

class Quest {
  constructor(title, isCompleted = false, rewardGold = 50, difficulty = 1, stressGain = 10) {
    this.title = title;
    this.isCompleted = isCompleted;
    this.rewardGold = rewardGold;
    this.difficulty = difficulty;
    this.stressGain = stressGain;
  }
}

// 1. ポップアップを表示し、ユーザーに入力を求める
let characterName = window.prompt("主人公の名前を入力してください。") || "アトス";
// ※ユーザーがキャンセルまたは何も入力しなかった場合、"プレイヤー"がデフォルトになります。

// 2. myCharacter の定義を修正し、この変数を使うようにする
// 【既存の定義（例）】const myCharacter = new Player("Porto", 100, 100, 0); 
// 【修正後】
const myCharacter = new Player(characterName, 100, 100, 0); 
//                   ↑ ポップアップで入力された名前を使用

// 3. HTMLの表示エリアに名前を書き出す
const nameDisplay = document.getElementById("hero-name"); 
// ↑ HTMLで付けたIDと一致させる

if (nameDisplay) {
    // 取得した名前（characterName）をHTMLに挿入
    nameDisplay.innerText = characterName;
}

// クエスト管理用の配列（データモデル）
const questData = [];

// クエストをデータモデルに追加する関数 (Kotlinの addQuest() の代用)
myCharacter.addQuest = function(title) {
    // IDと難易度は仮で設定します
    const newQuest = new Quest(title, false, 50, 1, 10);
    questData.push(newQuest);
};

// クエストのリストを返す関数 (Kotlinの getQuests() の代用)
myCharacter.getQuests = function() {
    return questData;
};

// クエストを完了させる関数 (Kotlinの completeQuest() の代用)
myCharacter.completeQuest = function(questTitle) {
    const questIndex = questData.findIndex(q => q.title === questTitle && !q.isCompleted);
    
    if (questIndex !== -1) {
        const completedQuest = questData[questIndex];
        completedQuest.isCompleted = true; // 完了状態にする
        myCharacter.gainGold(completedQuest.rewardGold); // 報酬を得る
        updateGoldDisplay();     // Goldの更新
        myCharacter.receiveDamage(completedQuest.stressGain); // ストレスダメージを受ける（見せかけ）
        // initializeDisplay(); // initializeDisplayを再度呼ぶか、HP更新関数を別途作成
        
        // ※シンプルに、HPとGoldの両方をここで更新します。
        initializeDisplay(); // initializeDisplayを呼ぶとHPもGoldも更新されます
        return true;
    }
    return false;
};

class MyLogicPlugin {
  receiveDamage(call) {
    const damage = call.damage ?? 0;

    myCharacter.receiveDamage(damage);

    const ret = {
      currentHP: myCharacter.currentHP,
      maxHP: myCharacter.maxHP,
    };

    if (typeof call.resolve === "function") {
      call.resolve(ret);
    }

    return ret;
  }

  getHPStatus(call) {
    const ret = {
      currentHP: myCharacter.currentHP,
      maxHP: myCharacter.maxHP,
    };

    if (typeof call.resolve === "function") {
      call.resolve(ret);
    }

    return ret;
  }
}

function completeQuest(player, quest) {
  if (quest.isCompleted) {
    console.log(`${quest.title} はすでに完了しています。`);
    return false;
  }

  player.gold += quest.rewardGold;
  quest.isCompleted = true;

  console.log(`${quest.title} を完了しました！報酬として ${quest.rewardGold} Gを獲得。`);
  return true;
}

// 1. HTMLの要素を取得する
const hpDisplay = document.getElementById('current-hp');
const damageButton = document.getElementById('damage-button');

// 2. プレイヤーの初期データ
let currentHP = 100;

// 3. ボタンが押されたときの処理を定義する
damageButton.addEventListener('click', () => {
    const damageAmount = 10; // HTMLからダメージ量を渡す

// 1. Kotlinのロジックを直接実行（@JsExportされた myCharacter を呼び出す）
    myCharacter.receiveDamage(damageAmount); 

    // 2. Kotlin（の代用JS）から最新のステータスを取得
    //    myCharacter.getHPStatus() が "60 / 100" のような文字列を返します
    const currentStatus = myCharacter.getHPStatus(); 

    
    
    // 3. 画面を更新（HTML要素のtextContentを直接更新）
    //    これで、画面には "現在のHP: 60 / 100" のように表示されます。
    hpDisplay.textContent = `${currentStatus}`; 

    console.log(`HP更新完了: ${currentStatus}`);
});

const addQuestButton = document.getElementById('add-quest-button');
const questInput = document.getElementById('quest-input');

addQuestButton.addEventListener('click', () => {
    const questTitle = questInput.value.trim();

    if (questTitle) {
        // ★★★ Kotlinロジック（の代用JS）の呼び出し ★★★
        // クエストをデータモデルに追加する関数を呼び出す（※後で実装）
        myCharacter.addQuest(questTitle); 
        
        // 入力欄をクリア
        questInput.value = '';
        
        // リストを更新・再描画
        renderQuestList();
    }
});

function renderQuestList() {
    const questListElement = document.getElementById('quest-list');
    
    // 現在表示されているリストを一旦クリア
    questListElement.innerHTML = '';
    
    // ★★★ Kotlinロジック（の代用JS）の呼び出し ★★★
    const quests = myCharacter.getQuests().filter(q => !q.isCompleted); // 未完了のみ表示
    
    quests.forEach(quest => {
        // 新しいリスト項目を作成
        const listItem = document.createElement('li');
        
// 完了ボタンを作成
        const completeButton = document.createElement('button');
        completeButton.textContent = '完了';
        
        // 完了ボタンが押されたら、ロジックを実行し、リストを再描画する
        completeButton.addEventListener('click', () => {
            const success = myCharacter.completeQuest(quest.title);
            if (success) {
                renderQuestList(); // リストを更新
                // HP, ゴールド表示も更新する関数を呼び出す（※後で実装）
            }
        });
        
        listItem.textContent = `${quest.title} (報酬: ${quest.rewardGold}G)`;
        listItem.appendChild(completeButton);
        questListElement.appendChild(listItem);
    });
}

const sleepButton = document.getElementById('go-to-sleep-button');

sleepButton.addEventListener('click', () => {
    // 1. ロジックを実行: HPを最大値に戻す
    myCharacter.fullHeal(); 
    
    // 2. 画面表示を更新
    // 既存の HP と Gold の両方を更新する関数を呼び出す
    initializeDisplay(); 
    
    console.log("回復しました。HPが全快しました。");

    // ★おまけ: 全回復したことをユーザーに知らせるアラート
    alert("お疲れ様でした！HPが全回復しました。"); 
});

const buyPotion1Button = document.getElementById('buy-potion');
const potionCost1 = 50; // 回復薬の価格
buyPotion1Button.addEventListener('click', () => {
  const purchaseSuccess1 = myCharacter.spendGold(potionCost1);
  if (purchaseSuccess1) {
    // 2. 購入成功！HPを回復
        const healAmount = 50; // 回復量
        myCharacter.healHP(healAmount);
        initializeDisplay();
        document.getElementById('shop-gold-display').textContent = myCharacter.gold + ' G';
        alert(`回復薬を購入しました！HPが ${healAmount} 回復しました。`);
    } else {
        alert("ゴールドが足りません！");
    }
});


const buyPotion2Button = document.getElementById('buy-maxhp-potion');
const potionCost2 = 200; // 強壮薬の価格

buyPotion2Button.addEventListener('click', () => {
    // 1. ゴールドを消費できるか確認
    const purchaseSuccess2 = myCharacter.spendGold(potionCost2);
    
    if (purchaseSuccess2) {
        // 2. 購入成功！HP上限をアップグレード
        const upgradeAmount = 20;
        myCharacter.upgradeMaxHP(upgradeAmount); 
        
        // 3. 画面表示を更新
        initializeDisplay(); // HPとGoldを最新に更新
        
        // ショップ画面のGold表示も更新
        document.getElementById('shop-gold-display').textContent = myCharacter.gold + ' G';

        alert(`強壮薬を購入しました！HP上限が ${upgradeAmount} アップしました！`);
    } else {
        alert("ゴールドが足りません！クエストをクリアして稼ぎましょう。");
    }
});

// ゴールド表示をHTMLに反映させる関数
function updateGoldDisplay() {
    // HTMLのGold表示要素を取得
    const goldDisplayElement = document.getElementById('current-gold');
    
    if (goldDisplayElement) {
        // myCharacterオブジェクトのgoldプロパティに直接アクセス
        goldDisplayElement.textContent = myCharacter.gold + ' G';
    }
}

const menuScreen = document.getElementById('status-menu');
const statusScreen = document.getElementById('status-screen');
const shopScreen = document.getElementById('shop-screen');

document.getElementById('nav-menu').addEventListener('click', () => {
    statusScreen.style.display = 'none';
    shopScreen.style.display = 'none';
    menuScreen.style.display = 'block'; // Menu画面を表示

    // Menu画面に戻ったときに表示を最新にする処理があれば、ここに追加
    initializeDisplay(); 
});

document.getElementById('nav-status').addEventListener('click', () => {
    statusScreen.style.display = 'block';
    shopScreen.style.display = 'none';
    menuScreen.style.display = 'none';
    // ショップ画面から戻ったとき、HPやGoldの表示を最新にする
    initializeDisplay(); 
});

document.getElementById('nav-shop').addEventListener('click', () => {
    statusScreen.style.display = 'none';
    shopScreen.style.display = 'block';
    menuScreen.style.display = 'none';
    // ★ショップ画面でもGold表示を更新★
    document.getElementById('shop-gold-display').textContent = myCharacter.gold + ' G';
});

// ページ読み込み時にリストを初期化
window.onload = function() {
    // 既存の initializeDisplay 関数を呼び出す
    initializeDisplay(); 
    renderQuestList(); // クエストリストも初期化
    updateGoldDisplay(); //Goldの初期化
}

// IDはそのままで要素を取得
const statusButton = document.getElementById('nav-menu');
const questButton = document.getElementById('nav-status');
const shopButton = document.getElementById('nav-shop');

// 全てのタブを配列に格納 (classList操作用)
const allTabs = [statusButton, questButton, shopButton];

// ★タブクリック時の処理関数★
function handleTabClick(clickedButton) {
    // 1. 全てのタブから 'active-tab' クラスを削除
    allTabs.forEach(button => {
        button.classList.remove('active-tab');
    });

    // 2. クリックされたボタンにのみ 'active-tab' クラスを追加
    clickedButton.classList.add('active-tab');

    // ★重要: ここにコンテンツの表示を切り替える既存のロジックを続けてください★
    // 例: displayScreen(clickedButton.id);
}

// 各ボタンにイベントリスナーを設定
statusButton.addEventListener('click', () => handleTabClick(statusButton));
questButton.addEventListener('click', () => handleTabClick(questButton));
shopButton.addEventListener('click', () => handleTabClick(shopButton));

// ★アプリ起動時にデフォルト（ステータス）をアクティブにする★
document.addEventListener('DOMContentLoaded', () => {
    // ページロード時、最初のタブ（nav-menu: ステータス）をアクティブにする
    handleTabClick(statusButton); 
});

console.log("JavaScriptの準備ができました。");

// 【app.js の末尾に追加】
// アプリ起動時にHP表示を初期化する関数
function initializeDisplay() {
    // myCharacter.getHPStatus() から '100 / 100' のような文字列を取得
    const initialStatus = myCharacter.getHPStatus(); 
    
    // HTMLのHP表示要素を取得
    const hpDisplayElement = document.getElementById('current-hp');
    
    // ★HTMLの表示形式に合わせて数値を設定★
    if (hpDisplayElement) {
        // 例: '100 / 100' をそのままセットします
        hpDisplayElement.textContent = initialStatus; 
    }

    updateGoldDisplay();
}

// ページ全体（window）の読み込みが完了したら、上記関数を実行する
window.onload = initializeDisplay;
