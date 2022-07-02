<?php
// データベースアクセスするI/F
// 【ソース共有：DB構造に関する部分(SQL文)は、セキュリティのため非公開とし、固定値を返すなどしている】

// PHPエラーを表示する設定
// 開発時用。本番運用時は消す。
ini_set("display_errors", On);
error_reporting(E_ALL);

// DB接続情報の読込
// include 'dbinfo.php';

header('Content-Type: text/javascript; charset=utf-8');

if (!isset($_REQUEST['cmd']) ||
    $_REQUEST['cmd'] === "") {
  die("操作コマンドが指定されていません。");
}


// $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
// if ( $con == FALSE ) {
//   die("DB接続に失敗しました。");
// }

// 操作コマンドごとの処理
// 操作コマンド : 処理内容
//  gr : (GameUpdate)対局結果登録

if ($_REQUEST['cmd'] == "gr") {
  // URLパラメータの取得
  $userNo = (int)filter_input(INPUT_GET, 'userNo');   // $_REQUEST['userNo'];
  $level = (int)filter_input(INPUT_GET, 'level');     // $_REQUEST['level'];
  $size = (int)filter_input(INPUT_GET, 'size');
  $handi = 0;   // 置石実装したら変える
  $score = (float)filter_input(INPUT_GET, 'score');   // $_REQUEST['score'];
  $appears = (int)filter_input(INPUT_GET, 'appears');       // $_REQUEST['appears'];
  $sgf = filter_input(INPUT_GET, 'sgf'); // mysqli_real_escape_string($con, filter_input(INPUT_GET, 'sgf'));  // $_REQUEST['sgf']
  $undo = (int)filter_input(INPUT_GET, 'undo');
  $point = (int)filter_input(INPUT_GET, 'point');
  
  $result = 0;
  $reason = "";
  
  // 結果をJSONPで返す
  $output = array(
    "result"     => 1, // $result,
    "reason"     => $reason     // TODO: reasonは本稼動時は格納しない(セキュリティ対策)
  );
  echo sprintf("%s(%s)", "gm.db.registGameResultCallback", json_encode($output));  // JS側のコールバック関数名は固定

}
//  lr : (LevelReference)レベル情報取得
else if ($_REQUEST['cmd'] == "lr") {
  // URLパラメータの取得
  $mode = (int)filter_input(INPUT_GET, 'md');
  $levelStr = filter_input(INPUT_GET, 'ls'); // mysqli_real_escape_string($con, filter_input(INPUT_GET, 'ls'));

  // 【ソース共有：levelStr = levelとする】
  $level = (int)$levelStr;
  // 【ソース共有：テーブルをこのソース内に固定で持つ】
  $tbl = [
    [0,"入門","RandomPlayer()"],
    [1,"初級","PrimitivePlayer()"],
    [2,"中級","GnugoPlayer(\"1.2\")"],
    [3,"上級","GnugoPlayer(\"1.6\")"],
    [4,"特級","ChimeraPlayer([new GnugoPlayer(\"2.0\"), new GnugoPlayer(\"1.6\")])"],
    [5,"超特級","GnugoPlayer(\"2.0\")"],
    [6,"超々特級","ChimeraPlayer([new GnugoPlayer(\"3.0\"), new GnugoPlayer(\"2.0\")])"],
    [7,"弩級","GnugoPlayer(\"3.0\")"],
    [8,"超弩級","GnugoPlayer(\"3.2\")"],
    [9,"超々弩級","GnugoPlayer(\"3.6\")"],
    [10,"神級","GnugoPlayer(\"3.8\")"],
    [11,"超神級","GnugoPlayer(\"3.8\",\"5\")"],
    [12,"超々神級","GnugoPlayer(\"3.8\",\"10\")"]
  ];
  
  // 結果をJSONPで返す
  $output = array(
    "level"             => $level, // (int)$row["level"],
    "levelName"         => $tbl[$level][1], // $row["levelName"],
    "playerConstructor" => $tbl[$level][2], // $row["playerConstructor"],
    "worldImage"        => "woodboard.jpg", // $row["worldImage"],
    "worldCoverImage"   => "woodboard.jpg", // $row["worldCoverImage"],
    "thumbnailImage"    => "", // $row["thumbnailImage"],
    "prizeImage"        => "", // $row["prizeImage"],
    "avatarImage"       => "image/1_ne.png", // $row["avatarImage"],
    "characterName"     => $tbl[$level][1], // $row["characterName"],
    "bgm"               => "loop_4.mp3", // $row["bgm"]
  );
  echo sprintf("%s(%s)", "gm.db.getLevelInfoCallback", json_encode($output));  // JS側のコールバック関数名は固定

}

//  uc : (UserCreate)ユーザー情報登録(仮発行)
else if ($_REQUEST['cmd'] == "uc") {
  $newUserNo = 1;
  $result = 0;
  $reason = "";
  
  // 結果をJSONPで返す
  $output = array(
    "result"    => 1,  // $result, 
    "userNo"    => $newUserNo,
    "userName"  => "TestUser", // $tmpUserName,
    "lt"        => "TOKEN",  // $token,    
    "reason"    => $reason     // TODO: reasonは本稼動時は格納しない(セキュリティ対策)
  );
  echo sprintf("%s(%s)", "gm.db.createTmpUserCallback", json_encode($output));  // JS側のコールバック関数名は固定
}
//  ur : (UserReference)ユーザー情報参照(仮：キー：userNo)
else if ($_REQUEST['cmd'] == "ur") {
  $where = "";
  
  // URLパラメータの取得 & WHERE句構築
  if (isset($_GET['userNo'])) {
    $where = sprintf("userNo = %d", (int)filter_input(INPUT_GET, 'userNo'));
  }

  $result = 0;
  $reason = "";
    
  // 結果をJSONPで返す
  $output = array(
    "result"       => $result,
    "userNo"       => 1, // (int)$userNo,    
    "userId"       => "USERID",  // $userId,    
    "userName"     => "USERNAME", // $userName,    
    "registDate"   => "",  // $registDate,    
    "playCount"    => 2, // (int)$playCount,    
    "winCount"     => 1, // (int)$winCount,    
    "loseCount"    => 1, // (int)$loseCount,    
    "evenCount"    => 0, // (int)$evenCount,    
    "maxLevel"     => 3, // (int)$maxLevel,    
    "lastPlayDate" => "", // $lastPlayDate,    
    "totalPoint"   => 100, // (int)$totalPoint,    
    "ownPoint"     => 100, // (int)$ownPoint,    
    "reason"       => $reason     // TODO: reasonは本稼動時は格納しない(セキュリティ対策)
  );
  echo sprintf("%s(%s)", "gm.db.getUserInfoCallback", json_encode($output));  // JS側のコールバック関数名は固定


}
//  ie : (userIdExist)ユーザーID存在確認
else if ($_REQUEST['cmd'] == "ie") {
  // URLパラメータの取得
  $userId = filter_input(INPUT_GET, 'userId'); // mysqli_real_escape_string($con, filter_input(INPUT_GET, 'userId'));
 
  // 結果をJSONPで返す
  $output = array(
    "exist"             => 1 // (int)$row["count"]
  );
  echo sprintf("%s(%s)", "userIdExistCallback", json_encode($output));  // JS側のコールバック関数名は固定

}
//  cu : (userConfigUpdate)ユーザー設定情報更新
else if ($_REQUEST['cmd'] == "cu") {
  $result = 0;
  $reason = "";

  // URLパラメータの取得
  $userNo = (int)filter_input(INPUT_GET, 'userNo');
  $key = (int)filter_input(INPUT_GET, 'key');
  $value = filter_input(INPUT_GET, 'value'); // mysqli_real_escape_string($con, filter_input(INPUT_GET, 'value'));

  // 結果をJSONPで返す
  $output = array(
    "result"    => 1, // $result,
    "reason"    => $reason     // TODO: reasonは本稼動時は格納しない(セキュリティ対策)
  );
  echo sprintf("%s(%s)", "svrUtl.setUserConfigCallback", json_encode($output));  // JS側のコールバック関数名は固定
}


// 持続的でないリンクはスクリプトの実行終了時に自動的に閉じられるので、
// 通常は mysql_close() を使用する必要はありません。
?>