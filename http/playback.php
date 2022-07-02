<?
  include 'common.php';
  etnInit();

  // URLパラメータ"sgf"が指定されていれば、そのSGFを使用
  if (isset($_GET["sgf"])) {
    $filteredSgfStr = filter_input(INPUT_GET, 'sgf');
    if (strpos($filteredSgfStr, "(;GM[1]FF[4]") === 0) {
      // 生SGFが指定された場合は、独自変換せず使用
      $useSgf = '"' . $filteredSgfStr . '"';
    }
    else {
      $useSgf = '"' . decodeSGF($filteredSgfStr) . '"';
    }
  }
  // URLパラメータ"sgf"が指定されていなければ、localStorageの"recentSgf"を使用
  else {
    $useSgf = 'JSON.parse(localStorage.getItem("recentSgf"))';
  }
?>
<!DOCTYPE html>
<html>
<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-GOOGLE_ANALYTICS_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-GOOGLE_ANALYTICS_ID');
</script>
<meta charset="UTF-8" />
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>検討 | Go-Up!</title>
<link href="./backboardanim.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="wgo/wgo.min.js"></script>
<script type="text/javascript" src="wgo/wgo.player.min.js"></script>
<link type="text/css" href="wgo/wgo.player.css" rel="stylesheet" />
<script>
function setSgf() {
  var sgf = <? echo $useSgf; ?>;

  document.getElementById("sgf").value = sgf;

  var elem = document.getElementById("wGoPlayer");

  // 画面に収まるよう、短辺基準で大きさ調整する
  // WGoはheightは勝手に拡大しちゃうので、widthを短辺に合わせる。
  var width  = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  elem.style.width = (Math.min(width, height) * 0.9) + "px";


  // wGoの有効化
  var player = new WGo.BasicPlayer(elem, {
    // sgfの指定
    sgf: sgf,
    // レイアウトの指定
    layout: WGo.BasicPlayer.layouts.minimal,

  });


}


</script>
<?
  // adwords
  include 'adwords_global.php';
?>
<? include 'menu_head.php'; ?>
</head>
<body>
<main id='main'>
<div id="wGoPlayer"></div>
SGF<br>
<textarea id="sgf" style="width: 90%;"></textarea><br>
<a href="javascript:history.back();">戻る</a><br>
<script type="text/javascript">
  setSgf();
</script>
</main>
<? include 'menu_body.php'; ?>
</body>
</html>
