<?
ini_set("display_errors", On);
error_reporting(E_ALL);
?>
<?
  include 'common.php';
  etnInit();

  // ドレスアップモード
  $dressup = (isset($mode) && $mode == 1);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<style type="text/css">
<!--
canvas {
-webkit-backface-visibility: hidden;
}

/* トーストウィンドウ用共通設定 */
.toast {
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);

  font-size: 9pt;
  font-family: Verdana, "游ゴシック", YuGothic, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, sans-serif;
  color:white;

  /* 画面中央に配置: http://coliss.com/articles/build-websites/operation/css/centering-percentage-widthheight-elements-by-css-tricks.html */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);

  display: none;
}

#help {
  background-color: rgba(27, 184, 188, 1.0);
  width: 80%;
  height: 90%;
}

#point {
  background-color: rgba(27, 184, 188, 0.9);
  width: 60%;
  height: 50%;
}

#goodies {
  background-color: rgba(20, 200, 160, 0.9);
  width: 50%;
/*  height: 30%; */
  font-size: 11pt;

  top: 40%;

          animation: popup 0.8s ease;
  -webkit-animation: popup 0.8s ease;
     -moz-animation: popup 0.8s ease;
      -ms-animation: popup 0.8s ease;
}

@keyframes popup {
    0% { background-color: rgba(20, 200, 160, 0.0); top: 70%; }
  100% { background-color: rgba(20, 200, 160, 0.9); top: 40%; }
}
@-webkit-keyframes popup {
    0% { background-color: rgba(20, 200, 160, 0.0); top: 70%; }
  100% { background-color: rgba(20, 200, 160, 0.9); top: 40%; }
}
@-moz-keyframes popup {
    0% { background-color: rgba(20, 200, 160, 0.0); top: 70%; }
  100% { background-color: rgba(20, 200, 160, 0.9); top: 40%; }
}
@-ms-keyframes popup {
    0% { background-color: rgba(20, 200, 160, 0.0); top: 70%; }
  100% { background-color: rgba(20, 200, 160, 0.9); top: 40%; }
}


#option {
  position:fixed;
  background:    -moz-linear-gradient(       top left, rgba(200, 150, 220, 0.9), rgba(160, 100, 180, 0.9));
  background: -webkit-linear-gradient(       top left, rgba(200, 150, 220, 0.9), rgba(160, 100, 180, 0.9));
  background:         linear-gradient(to bottom right, rgba(200, 150, 220, 0.9), rgba(160, 100, 180, 0.9));
  font-size:small;
  transition: all 100ms 0s ease;
  top: 100%;
  visibility: hidden;
  padding: 1em;
  font-family: Verdana, "游ゴシック", YuGothic, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, sans-serif;
}

#option.portrait {
  border-radius: 1em 1em 0 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0px);
  right: auto;
  bottom: auto;
}

#option.landscape {
  border-radius: 1em 0 0 1em;
  left: 100%;
  top: 50%;
  transform: translate(0px, -50%);
  bottom: auto;
  right: auto;
}

input[type="number"] {
  border: 1px solid #999;
  border-radius: 0.3em;
  text-align: right;
}

input[type="radio"].toggleRadio {
  display: none;
}

label.toggleRadio {
  display: inline-block;
  background: gray;
  color: black;
  text-align: center;
  padding: 0.2em 1em;
  cursor: pointer;
  border: 1px solid #999;
  transition: .2s;
}

label:first-of-type.toggleRadio {
  border-radius: 0.5em 0 0 0.5em;
}
label:last-of-type.toggleRadio {
  border-radius: 0 0.5em 0.5em 0;
}

input[type="radio"]:checked.toggleRadio + label.toggleRadio  {
  background: #d11;
  color: white;
}

.optionButton  {
  border-radius: 0.25em;
  width: 8em;
  height: 3em;
  border: none;
  color: white;
  vertical-align:middle;
  -webkit-appearance: none;
  padding: 0;
  margin: 0.5em;
}

.incdecButton  {
  border-radius: 0.3em;
  width: 1.2em;
  height: 1.2em;
  border: 1px solid gray;
  color: black;
  vertical-align:middle;
  -webkit-appearance: none;
  font-size: small;
  padding: 0;
}
.incdecButton:disabled {
  background: lightgray !important;
}

#giveUpConfirm {
  position:fixed;
  width:100%;
  height:100%;
  top: 0;
  left: 0;
  background-color:rgba(0,0,0,0.5);
  visibility: hidden;
}

#giveUpConfirmDlg {
  position: absolute;
  border-radius: 1em; 
  padding: 1em;
  font-size:large;
  font-weight: bold;
  top: 50%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  background-color: orange;
  font-family: Verdana, "游ゴシック", YuGothic, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, sans-serif;
}

-->
</style>
<title>対局 | Go-Up!</title>
<!-- script src= "http://rawgithub.com/phi1618/tmlib.js/0.5.0/build/tmlib.js"></script -->
<script src="lib/tmlib.js?<?= date("ymdHi", filemtime("lib/tmlib.js")) ?>"></script>
<script src="environment.js?<?= date("ymdHi", filemtime("environment.js")) ?>"></script>
<script src="etn_help.js?<?= date("ymdHi", filemtime("etn_help.js")) ?>"></script>
<script src="etn_cmn.js?<?= date("ymdHi", filemtime("etn_cmn.js")) ?>"></script>
<script src="etn_rules.js?<?= date("ymdHi", filemtime("etn_rules.js")) ?>"></script>
<script src="etn_view.js?<?= date("ymdHi", filemtime("etn_view.js")) ?>"></script>
<script src="etn_effects.js?<?= date("ymdHi", filemtime("etn_effects.js")) ?>"></script>
<script src="ownMatters.js?<?= date("ymdHi", filemtime("ownMatters.js")) ?>"></script>
<script>
resultVer = "<?= date("ymdHi", filemtime("result.php")) ?>";
</script>
<? include 'common_head.php'; ?>
</head>
<body style="margin: 0; padding: 0; overflow: hidden;">
<div id="loading">loading...</div>
<div id="trouble"><br>
ゲームが開始されない、動作がおかしい場合はFAQを参照ください。<br>
以前は動作していた場合は、ブラウザのキャッシュ削除やスーパーリロード([Ctrl]+[F5])もお試しください。
</div>
<canvas id="world" width="0px" height="0px"></canvas>
<div id="help" class="toast" onclick="document.getElementById('help').style.display='none';"></div>
<div id="point" class="toast" onclick="document.getElementById('point').style.display='none';"></div>
<div id="goodies" class="toast" onclick="document.getElementById('goodies').style.display='none';"></div>

<div id="option">
<b>打つ操作：</b><br>
<span style="white-space: nowrap;">
<input type="radio" class="toggleRadio" name="opmode" id="1point"><label for="1point" class="toggleRadio">1回タッチ</label><input type="radio" class="toggleRadio" name="opmode" id="2point"><label for="2point" class="toggleRadio">2回タッチ</label>
</span>
<br>
<b>相手が打つ時間：</b><br>
<span style="white-space: nowrap;">
<input type="radio" class="toggleRadio" name="cpuwait" id="nowait"><label class="toggleRadio" for="nowait">最速</label><input type="radio" class="toggleRadio" name="cpuwait" id="timewait"><label class="toggleRadio" for="timewait">待ちあり</label>
<input type="button" id="time_dec" class="incdecButton" value="-" style="background: #ccf;">
<input type="number" id="meantime" min="0.0" max="10.0" step="0.1" value="1.0" require style="width:3em;">
<input type="button" id="time_inc" class="incdecButton" value="+" style="background: #fcc;">
秒
<!-- ±<input type="number" id="difftime" min="0.0" max="10.0" step="0.1" value="0.5" require style="width:3em;">秒 -->
</span>
<br>
<b>打つエフェクト：</b><br>
<span style="white-space: nowrap;">
<input type="radio" class="toggleRadio" name="playeffect" id="effect_on"><label for="effect_on" class="toggleRadio">On </label><input type="radio" class="toggleRadio" name="playeffect" id="effect_off"><label for="effect_off" class="toggleRadio">Off</label>
</span>
<br>
<div id="dressupOpaqueSettings" style="display:<?= $dressup ? "block" : "none" ?>;">
<b>背景の濃さ：</b><br>
<span style="white-space: nowrap;">
<input type="number" id="backopaque_n" min="0" max="100" step="5" value="50" require style="width:3em;">%
<input type="range"  id="backopaque_r" min="0" max="100" step="5" value="50" style="vertical-align:middle;"><br>
</span>
<b>石の濃さ：</b><br>
<span style="white-space: nowrap;">
<input type="number" id="objopaque_n" min="0" max="100" step="5" value="100" require style="width:3em;">%
<input type="range"  id="objopaque_r" min="0" max="100" step="5" value="100" style="vertical-align:middle;"><br>
</span>
</div>
<br>
<div style="text-align:center;">
<span style="white-space: nowrap;">
<input type="button" id="optionOk" class="optionButton" style="background: #00A;" value="OK">
<input type="button" id="optionNg" class="optionButton" style="background: orange;" value="キャンセル">
<input type="button" id="optionDelete" class="optionButton" style="display: none;" value="消">
</span>
</div>
</div>
<div id="giveUpConfirm">
<div id="giveUpConfirmDlg">
投了しますか？<br>
<font color="red">（この対局を負けとして、終了します）</font><br>
<br>
<div align="center">
<span style="display:inline-block;">
<input type="button" id="giveUpOk" class="optionButton" style="background: red;" value="はい">
<input type="button" id="giveUpNg" class="optionButton" style="background: blue;" value="いいえ">
</span>
</div>
</div>
</div>
<script>
  // 画面要素をJS変数に代入しておく
  var $ = function(id) { return document.getElementById(id); }
  // オプション
  var divOption = $("option");
  var rb1point = $("1point");
  var rb2point = $("2point");
  var rbNoWait = $("nowait");
  var rbTimeWait = $("timewait");
  var numMeanTime = $("meantime");
  var btnMeanTimeInc = $("time_inc");
  var btnMeanTimeDec = $("time_dec");
  // var numDiffTime = $("difftime");
  var rbEffectOn = $("effect_on");
  var rbEffectOff = $("effect_off");
  var numBackOpaque = $("backopaque_n");
  var rngBackOpaque = $("backopaque_r");
  var numObjOpaque  = $("objopaque_n");
  var rngObjOpaque  = $("objopaque_r");
  var btnOptionOk  = $("optionOk");
  var btnOptionNg  = $("optionNg");
  var btnOptionDelete = $("optionDelete");
  // 投了確認
  var divGiveUpConfirm = $("giveUpConfirm");
  var btnGiveUpOk = $("giveUpOk");
  var btnGiveUpNg = $("giveUpNg");

</script>
</body>
</html>
