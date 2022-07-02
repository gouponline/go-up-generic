<?php
// 割り込みで入る機能紹介ポップアップを実現するコードの、<head>内に記載するコード
// 使用するページでのみ、</head>の直前にincludeする
?>
<style>
#interrupt {
  z-index:99998;
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  display:none;
}
#popup {
  z-index:99999;
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:0%;
  height:0%;
  background:rgba(255,245,230,.96);
  border: double 5px #FD0;
  border-radius:1em;
  padding:1em;
  box-shadow:1em 1em 1em 0 rgba(0,0,0,.5);
  transition: all 100ms 0s ease;
}
#popup_close {
  display: inline-block;
  text-align: center;
  background-color: #FEC;
  border: 1px solid;
  border-radius:5px;
  border-color: #870;
  color: #870;
  padding: .1em 3em;
}
</style>
<script>
function setInterruptInfo(disp) {
  var target = document.getElementById('interrupt');
  var dialog = document.getElementById('popup');
  if (disp) {
    target.style.display = 'block';
    setTimeout(function(){ <? // 表示させてから一旦待たないと表示されず、その後にアニメーションもしないっぽい ?>
                  popup.style.width  = '70%';
                  popup.style.height = '85%';
               }, 0);
  }
  else {
    popup.style.width  = '0%';
    popup.style.height = '0%';
    setTimeout(function(){ <? // アニメーション完了後、非表示する ?>
                  target.style.display = 'none';
               }, 100);
  }
}
</script>
