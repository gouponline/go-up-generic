<?php
// 共通メニューを実現するコードの、<head>内に記載するコード
// </head>の直前にincludeする
// タッチイベントの遅延を回避するfastclick.jsの使用もこれに組み込む
?>
<script type='application/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js'></script>
<script src="https://kit.fontawesome.com/XXXXXXXXXX.js" crossorigin="anonymous"></script>
<style>
<?php
// モードごとのテーマカラー設定
if ($kids) {
  // キッズモード：緑系
  $modeColor         = '#009955';
  $modeColorDark     = '#009050';
  $modeColorAlt      = '#007733';
  $modeColorAltDark  = '#007030';
}
else if (isset($mode) && $mode == 1) {
  // ドレスアップモード：赤紫系
  $modeColor         = '#990055';
  $modeColorDark     = '#900050';
  $modeColorAlt      = '#770033';
  $modeColorAltDark  = '#700030';
}
else {
  // ステップアップモード or 無指定：青系
  $modeColor         = '#005599';
  $modeColorDark     = '#005090';
  $modeColorAlt      = '#003377';
  $modeColorAltDark  = '#003070';
}
?>
header {
  width: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 9999;
  padding: 0 auto;
  padding:0.1em 0 0.1em 0;
  display:flex;
  justify-content: space-between;
  align-items:center;
  color:#FFFFFF;
  transition: all 100ms 0s ease;
}
header#header {
  background-color:<?= $modeColor ?>;
}
footer {
  width: 100%;
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 9999;
  padding: 0 auto;
  display:flex;
  justify-content: space-between;
  transition: all 100ms 0s ease;
  white-space: nowrap;
}
header div.menuspace,
header div.submenubutton,
footer div.menuspace,
footer div.menubutton,
footer div.submenubutton {
  width: 20%;
  text-align: center;
}
header div.submenubutton,
footer div.menubutton,
footer div.submenubutton {
  color:#FFFFFF;
  border: solid 1px;
  padding: 1em 0 0.5em 0;
  font-size:small;
  position:relative;
}
header div.submenubutton a,
footer div.menubutton a,
footer div.submenubutton a {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}
footer div.menubutton {
  background-color: <?= $modeColorAlt ?>;
  background-image: -webkit-linear-gradient(45deg, <?= $modeColorAltDark ?> 25%, <?= $modeColorAltDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorAltDark ?> 75%, <?= $modeColorAltDark ?> 75%),
  -webkit-linear-gradient(-45deg, <?= $modeColorAltDark ?> 25%, <?= $modeColorAltDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorAltDark ?> 75%, <?= $modeColorAltDark ?> 75%);
  background-image: linear-gradient(45deg, <?= $modeColorAltDark ?> 25%, <?= $modeColorAltDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorAltDark ?> 75%, <?= $modeColorAltDark ?> 75%),
  linear-gradient(-45deg, <?= $modeColorAltDark ?> 25%, <?= $modeColorAltDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorAltDark ?> 75%, <?= $modeColorAltDark ?> 75%);
  -webkit-background-size: 1em 1em;
  background-size: 1em 1em;
}
header div.submenubutton,
footer div.submenubutton {
background-color: <?= $modeColor ?>;
background-image: -webkit-linear-gradient(45deg, <?= $modeColorDark ?> 25%, <?= $modeColorDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorDark ?> 75%, <?= $modeColorDark ?> 75%),
-webkit-linear-gradient(-45deg, <?= $modeColorDark ?> 25%, <?= $modeColorDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorDark ?> 75%, <?= $modeColorDark ?> 75%);
background-image: linear-gradient(45deg, <?= $modeColorDark ?> 25%, <?= $modeColorDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorDark ?> 75%, <?= $modeColorDark ?> 75%),
linear-gradient(-45deg, <?= $modeColorDark ?> 25%, <?= $modeColorDark ?> 25%, transparent 25%, transparent 75%, <?= $modeColorDark ?> 75%, <?= $modeColorDark ?> 75%);
-webkit-background-size: 1em 1em;
background-size: 1em 1em;
}
header div.menuspace,
footer div.menuspace {
}
header i,
footer i {
  font-size:large;
}

main {
    padding:2em 0 2em 0;
}
</style>
<? include 'common_head.php'; ?>
