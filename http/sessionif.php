<?php
// セッション変数の値を返すだけのIF (JavaScriptで参照するため)

// PHPエラーを表示する設定
// 開発時用。本番運用時は消す。
ini_set("display_errors", On);
error_reporting(E_ALL);
?>
<?
// $ssloptionsの定義を取り込むためにcommon.phpをinclude
// ※他のページと異なり、etnInit()は実行しない。
include 'common.php';

// // DB接続情報の読込
// include 'dbinfo.php';

if (!isset($_REQUEST['cmd']) ||
    $_REQUEST['cmd'] === "") {
  die("操作コマンドが指定されていません。");
}

// セッション変数の取得
if ($_REQUEST['cmd'] == "get") {

  $result = 0;
  $userNo = 0;
  $userName = "ご新規さん";
  
  session_start();
    
  // 結果を返す
  // JSONP形式で返す
  // http://www.brandons.jp/blog/jquery-jsonp-php/
  $output = array(
    "result"   => 1, // $result,
    "userNo"   => 1, // $userNo,
    "userName" => "TestUser" //$userName,
  );
  header('Content-Type: text/javascript; charset=utf-8');
  echo sprintf("gm.ses.getUserCallback(%s)", json_encode($output));
}
// セッション変数へのセット
else if ($_REQUEST['cmd'] == "set") {

  $result = 0;
  // URLパラメータの取得
  $userNo = (int)filter_input(INPUT_GET, 'userNo');
  $userName = urldecode(filter_input(INPUT_GET, 'userName'));

  session_start();
  
  $_SESSION["userNo"] = $userNo;
  $_SESSION["userName"] = $userName;
  $result = 1; 
  
  // 結果を返す
  // JSONP形式で返す
  // http://www.brandons.jp/blog/jquery-jsonp-php/
  $output = array(
    "result"   => $result,
  );
  header('Content-Type: text/javascript; charset=utf-8');
  echo sprintf("gm.ses.setUserCallback(%s)", json_encode($output));
}

?>