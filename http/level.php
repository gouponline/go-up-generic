<?
  include 'common.php';
  etnInit();

  // // DB接続情報の読込
  // include 'dbinfo.php';

  $userNo = 0;
  $userName = "ご新規";


  // // DB接続
  // $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  // if ( $con == FALSE ) {
  //   die("DB接続に失敗しました。");
  // }
  

  // 路数・レベルの一覧(元々はDBから取得する)
  $sizes = [7, 9, 13, 19];
  $levels = [0, 1, 2, 3]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $rows = [];
  for ($s = 0; $s < count($sizes); $s++) {
    for ($l = 0; $l < count($levels); $l++) {
      array_push($rows, [$sizes[$s], $levels[$l], 'Lv' . $levels[$l]]);
    }
  }

  // Android 2.x系はchecked+間接セレクタ(隣接していない場合)が効かないので
  // CSSじゃなくjsでタブ切替する (4.0.3以下とかもダメって話があるが)
  $tabjs = false;
  if(empty($user_agent)) {
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
  }
  if(stristr($user_agent, 'Android')) {
    if (preg_match('/(Linux;|Linux; U;) Android (?P<ver>\d.\d)/', $user_agent, $matches)) {
      $version = explode(".", $matches['ver']);
      $major_ver = $version[0];
      $minor_ver = $version[1];
      if ($major_ver <= 2) {
        $tabjs = true;
      }
    }
  }

  // タブメニューの生成
  // タブメニュー参考: http://totora0155.hatenablog.jp/entry/css-only-tab-ui
  $s = "<div class='wrapper'>\n";  // 生成html
  $DEFAULT_SIZE = 13;  // 初期選択タブ
  $size = 0;
  $sizeKind = 0;
  $levelKind = 0;
  for ($r = 0; $r < count($rows); $r++) {
    $row = $rows[$r];

    // サイズの境界の処理
    if ($row[0] != $size) {
      // サイズ種類数を加算
      $sizeKind++;
      // レベル種類数をクリア
      $levelKind = 0;
      // 前タブのフッター部分タグ生成
      if ($size != 0) {
        $s .= "</table></div></div>";
      }
      // タブのヘッダー部分タグの生成
      $s .= "<div class='section-'>" .
            "<input class='section-radio' id='tab" . $row[0] . "' name='tab' type='radio' " .
              ($row[0] == $DEFAULT_SIZE ? "checked" : "") .
              ">" .
            "<label class='section-name section-" . $row[0] . "' for='tab" . $row[0] . "'" . ($tabjs ? " onclick='changeTab(" . $row[0] . ")'" : "") . ">" . $row[0] . "</label>" .
            "<div class='section-content' id='section-content-" . $row[0] . "'>\n";

      // レベル選択テーブルのヘッダータグ生成
     $s .= "<table border>" .
           "<thead><tr><th>レベル</th><th>対局</th></tr></thead>" .
           "<tbody>\n";
    }
    // $sizeの更新
    $size = $row[0];

    // レベル選択テーブルの内容生成
    $s .= "<tr>" .
          "<td>" . $row[2] . "</td>" .
          '<td><a class="button-blue-thin" ' . getInternalLinkAttr("game.php", "ws=" . $size . "&ls=" . $row[1] . ($mode != 0 ? '&md=' . $mode : '')) . '>対局</a></td>' .   // 対局リンク
          "</tr>\n";
    // レベル種類数を加算
    $levelKind++;
  }
  // 最終タブのフッター部分タグ生成（ループ内と同じフッターを生成する）
  if ($size != 0) {
    $s .= "</tbody></table></div></div>";
  }
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="content-language" content="ja">
<meta name="robots" content="noindex,nofollow">
<title>サイズ・レベル選択 | Go-Up!</title>
<link href="./backboardanim.css" rel="stylesheet" type="text/css">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.1,maximum-scale=4.0,user-scalable=yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<style type="text/css">
<!--
/* タブメニュー用CSS */
.wrapper {
  height: <? echo 3 + 1 + (1 + $levelKind + 0.5) * 1.8 + 1 + 1; // タブ + 上マージン + (テーブルヘッダ + 内容 + 最後の罫線) + 下マージン ?>em;
  position: relative;
}
.section- {
  position: absolute;
}
.section-radio {
  display: none;
}
.section-name {
  padding: 0.5em 1em;
  position: relative;
  top: 1px;
  z-index: 10;
  background: #84a2d4;
  color: #fff;
  border: 1px solid #535353;
  display: inline-block;
  text-align: center;
  -webkit-transition: 0.1s ease-in;
  -moz-transition: 0.1s ease-in;
  -ms-transition: 0.1s ease-in;
  transition: 0.1s ease-in;
  cursor: pointer;
}
.section-name:hover {
  background: #71bacd;
}
/* TODO: サイズごとのタブ位置を動的に等間隔配置する */
<?
  $sizeTabPos = 0;
  $sizeTabSize = 45;
?>
.section-7 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $sizeTabSize; ?>
.section-9 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $sizeTabSize; ?>
.section-11 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $size11 ? $sizeTabSize : 0; ?>
.section-13 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $sizeTabSize; ?>
.section-15 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $size15 ? $sizeTabSize : 0; ?>
.section-17 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
<? $sizeTabPos += $size17 ? $sizeTabSize : 0; ?>
.section-19 {
  margin-left: <? echo $sizeTabPos; ?>px;
}
.section-content {
  display: none;
  width: 100%;
  min-width: 350px;
  padding: 1em 1px;
  background: #fefefe;
  border: 1px solid #535353;
}

.section-radio:checked + .section-name {
  color: #2b2b2b;
  background: #fefefe;
  border-color: #535353 #535353 transparent;
  cursor: default;
}
.section-radio:checked ~ .section-content {
  display: block;
}
-->
</style>
<?
if ($tabjs) {
?>
<script>
function changeTab(size) {
  var sectionContents = document.getElementsByClassName("section-content");
  for (var i = 0; i < sectionContents.length; i++) {
    sectionContents[i].style.display = "none";
  }
  var selectedContent = document.getElementById("section-content-" + size);
  selectedContent.style.display = "block";
}
</script>
<?
}
?>
<? include 'basictablecss.php'; ?>
<? include 'menu_head.php'; ?>
</head>
<body>
<main id='main'>
<h3 style="margin:0.3em 0em;">サイズ・レベル選択</h3>
碁盤の大きさ(路数)をタブで選び、各レベルの「対局」ボタンを押してください。<br>
<div>
<? echo $s; ?>
</div>
<a href="javascript:history.back();">戻る</a><br>
<br>
</main>
<? include 'menu_body.php'; ?>
</body>
</html>
