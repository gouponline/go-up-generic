<?php
// 割り込みで入る機能紹介ポップアップを実現するコードの、<body>内に記載するコード
// 使用するページでのみ、</body>の直前にincludeする
// ポップアップを表示する場合、$popup = true とする
?>
<div id='interrupt' onclick='setInterruptInfo(false);'>
  <div id='popup' onclick='if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;'>
<? // 【TODO】popupの中身を外部から変更できるようにする ?>
<div style="text-align:center;">
<a <?= getInternalLinkAttr("userinfo.php") ?>><strong><?= $userName ?></strong>さん</a>、<br>
Go-Up!へようこそ！<br>
<br>
◎いろんなレベル・サイズで<br>
　<a <?= getInternalLinkAttr("achievement.php") ?>><strong>可愛いイラスト</strong>を開放！</a><br>
◎ヒミツの条件を満たして<br>
　<a <?= getInternalLinkAttr("titlelist.php") ?>><strong>名誉ある称号</strong>を獲得！</a><br>
◎<a <?= getInternalLinkAttr("advice.php") ?>><strong>アドバイスガチャ</strong></a>を引いて<br>
　ヒントとイラストをGet！<br>
　初回ボーナスで10連!!<br>
<br>
<div id='popup_close' onclick='setInterruptInfo(false);'>OK</div>
</div>
  </div>
</div>
<script>
<? // 一定時間後にダイアログの展開 ?>
<? // result.phpで、新規ユーザー仮登録した場合のメッセージ表示 ?>
<? // 【TODO】表示条件を別ページで使えるように汎用化する。そのためにはresultのもsessionStorageじゃだめだ ?>
var newUserRegist = JSON.parse(sessionStorage.getItem("newUserRegist"));
if (newUserRegist) {
  setTimeout(function(){setInterruptInfo(true)}, 1500);
  sessionStorage.removeItem("newUserRegist");
}
</script>
