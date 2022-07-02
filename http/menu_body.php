<?php
// 共通メニューを実現するコードの、<body>内に記載するコード
// </body>の直前にincludeする
// ※元ページのコンテンツ部分は、<main id='main'></main>で囲むこと
?>
<?php
// 参考ページ
// https://www.nishi2002.com/14962.html
// http://webnonotes.com/css/header_footer/
?>
<header id='header'>
<div style="display:flex;align-items:center;">
<div style='padding:0.1em 0.3em'><span style='font-size:x-small;line-height:1'>初心者向け囲碁対局サイト</span><br>Go-Up!</div>
</div>
<div style="display:flex;align-items:center;">
  <div style='font-size:x-large;' onclick="javascript:headerMenu_clicked(0);"><i class="fas fa-user-circle"></i></div>
  <div style='padding:0.2em' onclick="javascript:headerMenu_clicked(0);"><span style='font-size:small'><?= isset($userName) ? $userName : "ご新規" ?>さん</span><!-- <br><span style='font-size:x-small'>111515 pt.</span>--></div>
  <!-- <div style='font-size:x-large;padding:0.3em'><i class="fas fa-bars"></i></div> -->
</div>
</header>
<header id='menu_user' style="z-index: 9997">
  <div class="menuspace">
  </div>
  <div class="menuspace">
  </div>
  <div class="menuspace">
  </div>
  <div class="submenubutton">
    <i class="far fa-address-card"></i><br>
    ユーザー<br>情報
    <a <?= getInternalLinkAttr("userinfo.php") ?>></a>
  </div>
  <div class="submenubutton">
    <i class="fas fa-history"></i><br>
    対局<br>履歴
    <a <?= getInternalLinkAttr("record.php") ?>></a>
  </div>
</header>
<footer id='menu'>
  <div class="menubutton">
    <i class="fas fa-home"></i><br>
    Home
    <a <?= getInternalLinkAttr("index.php") ?>></a>
  </div>
  <div class="menubutton">
    <i class="fas fa-tablets"></i><br>
    ガチャ
    <a <?= getInternalLinkAttr("advice.php") ?>></a>
  </div>
  <div class="menubutton">
    <i class="fas fa-chess-board"></i><br>
    プレイ!
    <a <?= getInternalLinkAttr("level.php") ?>></a>
  </div class="menubutton">
  <div class="menubutton" onclick="javascript:menu_clicked(0);">
    <i class="fas fa-gifts"></i><br>
    ご褒美
  </div>
  <div class="menubutton" onclick="javascript:menu_clicked(1);">
    <i class="fas fa-book"></i><br>
    info
  </div>
</footer>
<footer id='menu_awards' style="z-index: 9997">
  <div class="menuspace">
  </div>
  <div class="submenubutton">
    <i class="far fa-flag"></i><br>
    達成状況
    <a <?= getInternalLinkAttr("achievement.php") ?>></a>
  </div>
  <div class="submenubutton">
    <i class="fas fa-trophy"></i><br>
    称号
    <a <?= getInternalLinkAttr("titlelist.php") ?>></a>
  </div>
  <div class="submenubutton">
    <i class="fas fa-crown"></i><br>
    ランキング
    <a <?= getInternalLinkAttr("pointrank.php") ?>></a>
  </div>
  <div class="submenubutton">
    <i class="fas fa-film"></i><br>
    回想
    <a <?= getInternalLinkAttr("memories.php") ?>></a>
  </div>
</footer>
<footer id='menu_info' style="z-index: 9997">
<? if ($kids) { ?>
  <div class="menuspace">
  </div>
  <div class="menuspace">
  </div>
  <div class="menuspace">
  </div>
<? } ?>
<? if (!$kids) { ?>
  <div class="submenubutton">
  <i class="fas fa-book-open"></i><br>
    ルール等
    <a <?= getInternalLinkAttr("tutorial.html") ?>></a>
  </div>
<? } ?>
  <div class="submenubutton">
    <i class="fas fa-question-circle"></i><br>
    FAQ
    <a <?= getInternalLinkAttr("faq.php") ?>></a>
  </div>
  <div class="submenubutton">
    <i class="fas fa-th-list"></i><br>
    クレジット
    <a <?= getInternalLinkAttr("credit.php") ?>></a>
  </div>
<? if (!$kids) { ?>
  <div class="submenubutton">
    <i class="far fa-edit"></i><br>
    フォーラム
    <a href="" target="_blank" rel="noopener"></a>
  </div>
  <div class="submenubutton">
    <i class="fab fa-twitter-square"></i><br>
    更新情報等
    <a href="https://twitter.com/" target="_blank" rel="noopener"></a>
  </div>
<? } ?>
</footer>
<script>
<?php
// タップ時の遅延軽減
?>
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
<?php
// ヘッダの高さに合わせて、メインの開始位置を変える
// 参考: https://ryotah.hatenablog.com/entry/2017/06/17/123301
?>
var headerElm = document.getElementById('header');
var footerElm = document.getElementById('menu');
var mainElm = document.getElementById('main');
var headerChildMenuElms = [
  document.getElementById("menu_user"),
]
function setMainPadding() {
  mainElm.style.paddingTop    = headerElm.offsetHeight + 'px';
  mainElm.style.paddingBottom = footerElm.offsetHeight + 'px';
  for (var e = 0; e < headerChildMenuElms.length; e++) {
    var childMenuElm = headerChildMenuElms[e];
    childMenuElm.style.top = (headerElm.offsetHeight - childMenuElm.offsetHeight) + 'px';
  }
}
setMainPadding();
window.onresize = function () {
  setMainPadding();
};
<?php
// ヘッダサブメニューの開閉
?>
function headerMenu_clicked(childMenuNo){
  for (var e = 0; e < headerChildMenuElms.length; e++) {
    var childMenuElm = headerChildMenuElms[e];
    var top = childMenuElm.style.top;
    if (e == childMenuNo) {
      if (top == '' || parseInt(top) <= 0) {
        childMenuElm.style.top = headerElm.offsetHeight + 'px';
      }
      else {
        childMenuElm.style.top = (headerElm.offsetHeight - childMenuElm.offsetHeight) + 'px';
      }
      childMenuElm.style.zIndex = 9998;
    }
    else {
      childMenuElm.style.top = (headerElm.offsetHeight - childMenuElm.offsetHeight) + 'px';
      childMenuElm.style.zIndex = 9997;
    }
  }
}
<?php
// フッタサブメニューの開閉
?>
var menuElm = document.getElementById('menu');
var childMenuElms = [
  document.getElementById("menu_awards"),
  document.getElementById("menu_info"),
]
function menu_clicked(childMenuNo){
  for (var e = 0; e < childMenuElms.length; e++) {
    var childMenuElm = childMenuElms[e];
    var bottom = childMenuElm.style.bottom;
    if (e == childMenuNo) {
      if (bottom == '' || bottom == 0 || bottom == '0px') {
        childMenuElm.style.bottom = menuElm.offsetHeight + 'px';
      }
      else {
        childMenuElm.style.bottom = 0;
      }
      childMenuElm.style.zIndex = 9998;
    }
    else {
      childMenuElm.style.bottom = 0;
      childMenuElm.style.zIndex = 9997;
    }
  }
}
</script>
