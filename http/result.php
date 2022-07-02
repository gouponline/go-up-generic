<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<link href="./backboardanim.css" rel="stylesheet" type="text/css">
<?
  include 'common.php';
  etnInit();

  // // DB接続情報の読込
  // include 'dbinfo.php';

  $userNo = 0;
  $userName = "ご新規";


  // CPUレベルの指定
  if (isset($_POST["cpuLevel"])) {
    $level =  (int)filter_input(INPUT_POST, 'cpuLevel');
  }
  else {
    $level = 0;
  }

  // 勝者の指定
  if (isset($_POST["winner"])) {
    $winner =  (int)filter_input(INPUT_POST, 'winner');
  }
  else {
    $winner = 0;
  }

  // 盤面サイズの指定
  if (isset($_POST["size"])) {
    $size =  (int)filter_input(INPUT_POST, 'size');
  }
  else {
    $size = 0;
  }

  // // DB接続
  // $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  // if ( $con == FALSE ) {
  //   die("DB接続に失敗しました。");
  // }
?>
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>対局結果 | Go-Up!</title>
<script src="https://platform.twitter.com/widgets.js"></script>
<script>
function setResult() {
  // 対局結果の表示
  var result = JSON.parse(localStorage.getItem("recentResult"));
  var gameState = JSON.parse(localStorage.getItem("recentGameState"));
  var level = <? echo $level; ?>;

  var SIDE_A = 1;
  var SIDE_B = 2;

  document.getElementById("winlose").innerHTML = ((result.winner == SIDE_A) ? "あなたの勝ちです！！" : "あなたの負けです...");  // TODO: とりあえず引き分け未考慮
  document.getElementById("winlose").innerHTML += ((result.winner == SIDE_A && level == 3) ? "<br>次は「特級」に挑戦してみてください！" : "");

  // 棋譜ツイートボタン
<? if (!$kids) { ?>
  var sgf = JSON.parse(localStorage.getItem("recentSgf"));
  var tweetText = "レベル" + level + "に" + ((result.winner == SIDE_A) ? "勝ち" : "負け") + "ました！";
  // Twitterボタン
  document.getElementById("sgfTweet1").innerHTML =    // TwitterではURL末尾の特定記号([];)など)がURLに含まれなくなるので、末尾に"_"付けて無理やりURL認識させる
    "<a href='https://twitter.com/share?url=https://XXXXXXX/" +
    "&text=" + encodeURI(tweetText) + "%20https://XXXXXXX/playback.php?sgf=" + encodeURI(sgf + "_") + "' " +
    "class='tiny-button' target='_blank' style='background:#337fcc;'><i class='fab fa-twitter'></i> 結果Tweet</a>";
  // つぶや棋譜２
  document.getElementById("sgfTweet2").innerHTML =
    "<a href='https://gokifu.net/kifutweet2.php?sgf=" + encodeURI(sgf) + "&text=" + encodeURI(tweetText) + "' " +
    "class='tiny-button' target='_blank' style='background:blue;line-height:0.4em;'><i class='fab fa-twitter'></i> 盤面Tweet<br><span style='font-size:0.5em'>(つぶや棋譜２)</span></a>";
<? } ?>
}

</script>
<style>
/* 角丸吹出(http://web-dou.com/tool/css_gen_fdiv.php で生成) */
.fbox {
    position: relative;
    display:inline-block;
    padding:2% ;
    text-align:left;
    background-color:#eeeeff;
    margin: 0% 0% <? echo isset($prizeImage) ? "20px 0%" : "0% 20px"; ?>;
    border-radius: 5% ;

    width: <? echo isset($prizeImage) ? "95%" : "65%"; ?>;
}
.fbox:after, .fbox:before {
    content: "";
    position: absolute;
    height: 0;
    width: 0;
}

.fbox:after {
    top: 5px;
    left: -20px;
    border: 10px solid transparent;
    border-right: 15px solid #eeeeff;
}
.fbox:before {
    top: 5px;
    left: -20px;
    border: 10px solid transparent;
    border-right: 10px solid #eeeeff;
}

/* 三角矢印アニメ付きボタン(http://www.nxworld.net/tips/css-button-arrow-hover-effect.html) */
/* 共通 */
.lvButton {
  position: relative;
  display: inline-block;
  padding: .5em 0em;
  border: 1px solid;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius:5px;
  white-space: nowrap;
}
/* 次レベル */
.next {
  width: 36%;
  background-color: #ff6666;
  border-color: #aa3333;
}
.next::after {
  position: absolute;
  top: 50%;
  right: 0em;
  content: '';
  margin-top: -10px;
  border: 14px solid transparent;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-left-color: #fff;
}
.next:hover {
  background-color: #ff4444;
}
.next:active {
  background-color: #ff2222;
}
.next:hover::after {
  animation: nextArrow .6s;
}
.next:active::after {
  animation: nextArrow .4s;
}
@keyframes nextArrow {
  50% {
    right: -1.2em;
  }
  100% {
    right: 0em;
  }
}
/* 前レベル */
.prev {
  width: 25%;
  background-color: #aaaaff;
  border-color: #5555aa;
}
.prev::before {
  position: absolute;
  top: 50%;
  left: -0.6em;
  content: '';
  margin-top: -10px;
  border: 14px solid transparent;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-right-color: #fff;
}
.prev:hover {
  background-color: #8888ff;
}
.prev:active {
  background-color: #6666ff;
}
.prev:hover::before {
  animation: prevArrow .8s;
}
.prev:active::before {
  animation: prevArrow .6s;
}
@keyframes prevArrow {
  50% {
    left: -1.0em;
  }
  100% {
    left: -0.6em;
  }
}
/* 同レベル */
.same {
  width: 31%;
  background-color: #88cc88;
  border-color: #118811;
}
.same:hover {
  background-color: #44cc44;
}
.same:active {
  background-color: #22bb22;
}
/* レベル選択メニュー */
.menu {
  padding: .3em 0em;
  width: 90%;
  background-color: #ff8800;
  border-color: #aa4400;
}
.menu:hover {
  background-color: #ff6600;
}
.menu:active {
  background-color: #ff4400;
}
/* 無効化 */
/* セレクタのspecificityが同じの場合、後の定義が優先されるため、成立する */
/* http://techblog.karupas.org/entry/20120406/1333677000 とそのブコメ */
.disable {
  background-color: #cccccc;
  border-color: #aaaaaa;
}
.disable:hover {
  background-color: #cccccc;
}
.disable:active {
  background-color: #cccccc;
}
.disable:hover::after {
  animation: none;
}
.disable:active::after {
  animation: none;
}
.disable:hover::before {
  animation: none;
}
.disable:active::before {
  animation: none;
}
/* 非表示 */
.invisible {
  visibility: hidden;
}
/* 棋譜再生・結果ツイートボタン */
a.tiny-button {
  color:white;
  text-align:center;
  display:inline-block;
  text-decoration:none;
  padding: 0.3em .5em !important;
  border-radius:0.3em;
  vertical-align: middle;
  font-size: 0.9em;
}

</style>
<? include 'menu_head.php'; ?>
<? include 'popup_head.php'; ?>
</head>
<body>
<main id='main'>
<h3 style="margin:0.3em 0em;">対局結果</h3>
<div id="winlose" style="font-size: large">
</div>
<a <?= getInternalLinkAttr("playback.php") ?> class="tiny-button" style="background:#D2691E;">棋譜再生</a>
<span id="sgfTweet1"></span>
<span id="sgfTweet2"></span><br>
<br>
<!-- レベルメニュー -->
<div align="center" style="margin-top: 2px;">
<a class="lvButton menu" <?= getInternalLinkAttr("level.php", $mode !=0 ? "md=" . $mode : "") ?>>路数/レベル選択メニューへ</a>
</div>
<p>
<br>
<script type="text/javascript">
  setResult();
</script>
</main>
<? include 'menu_body.php'; ?>
<? include 'popup_body.php'; ?>
</body>
</html>
