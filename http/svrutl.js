/*
 * サーバ側とやりとりするutility
 * （対局画面以外で使用する）
 */
var svrUtl = new SvrUtl();

function SvrUtl() {
  // サーバーURL (※environment.jsで定義されている)
  this.SERVER_URL = ETN_DB_IF_URL;

  // 設定情報登録
  this.setUserConfig = function(userNo, key, value) {
    // リクエストクエリ
    var request = this.SERVER_URL;
    request += "?cmd=cu";    // コマンド(ユーザー設定更新)
    request += "&userNo=" + userNo;    // ユーザー番号
    request += "&key=" + key;          // キー
    request += "&value=" + value;       // 値

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // 設定情報登録後の処理
  this.setUserConfigCallback = function(json) {
    if (json.result != 1) {
      // 登録失敗
      console.log("DbIf failed!\n" + json.reason);
    }
    else {
      // リロードする（現在、ユーザー情報画面のレート表示設定で使うことしか考慮していない）
      location.reload();
    }
  };

}


